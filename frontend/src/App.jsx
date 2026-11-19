
import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import AddApplication from "./components/AddApplication";
import FilterApplicationsFollowUp from "./components/FilterApplicationsFollowUp";
import MyProfile from "./components/MyProfile";
import Auth from "./components/Auth";
import logo from "./assets/logo.png";
import "./App.css";

const pages = [
  "Dashboard",
  "Applications",
  "Follow-ups",
  "Search Resources",
  "Documents",
  "Career Hub",
  "My Profile"
];

function App() {
  // Keep track of which page the user is viewing.
  const [page, setPage] = useState("Dashboard");

  // Store information about the logged-in user.
  const [currentUser, setCurrentUser] = useState(null);

  // Check whether the user is already logged in.
  const [checkingLogin, setCheckingLogin] = useState(true);

  // Keep track of whether the profile dropdown is open.
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Store applications and error messages.
  const [statusError, setStatusError] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for an existing login session when the website opens.
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await fetch(
          "http://localhost:3001/api/auth/me",
          {
            credentials: "include"
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error("Failed to check login:", error);
      } finally {
        setCheckingLogin(false);
      }
    }

    checkLogin();
  }, []);

  // Load applications after the user logs in.
  useEffect(() => {
    if (!currentUser) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch("/api/applications")
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            "Failed to get the applications from the server."
          );
        }

        return res.json();
      })
      .then((data) => {
        // Convert database field names to frontend field names.
        const formattedData = data.map((app) => ({
          id: app.id,
          company: app.company_name,
          role: app.job_title,
          position: app.job_title,
          status: app.status,
          applicationDate: app.application_date,
          deadline: app.deadline,
          followUpDate: app.follow_up_date,
          jobUrl: app.job_url,
          notes: app.notes,
        }));

        setApplications(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error while fetching applications:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [currentUser]);

  // Add a new job application.
  async function addApplication(newApplicationData) {
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newApplicationData),
      });

      const savedApp = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          savedApp?.error || "The server could not save the application."
        );
      }

      // Make sure the application was saved successfully.
      if (
        response.status !== 201 ||
        !Number.isInteger(savedApp?.id) ||
        savedApp.id < 1
      ) {
        throw new Error(
          "The server did not confirm the save. Refresh before trying again."
        );
      }

      // Format the saved application for the frontend.
      const formattedApp = {
        id: savedApp.id,
        company: savedApp.company_name,
        role: savedApp.job_title,
        position: savedApp.job_title,
        status: savedApp.status,
        applicationDate: savedApp.application_date,
        deadline: savedApp.deadline,
        followUpDate: savedApp.follow_up_date,
        jobUrl: savedApp.job_url,
        notes: savedApp.notes,
      };

      setApplications((prev) => [formattedApp, ...prev]);

    } catch (err) {
      console.error("Failed to add application:", err);
      throw err;
    }
  }

  // Update the status of an existing application.
  async function updateApplicationStatus(applicationId, newStatus) {
    setStatusError("");

    try {
      const response = await fetch(
        `/api/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();

        throw new Error(
          errData.error || "Failed to update status."
        );
      }

      // Update the application status on the screen.
      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.id === applicationId
            ? { ...application, status: newStatus }
            : application
        )
      );

    } catch (err) {
      console.error("Failed to update status:", err);
      setStatusError(err.message);
    }
  }

  // Open a page and scroll to the top.
  function openPage(nextPage) {
    setPage(nextPage);
    setProfileMenuOpen(false);
    window.scrollTo(0, 0);
  }

  // Log out the current user.
  async function handleLogout() {
    try {
      // Ask the backend to end the user's session.
      const response = await fetch(
        "http://localhost:3001/api/auth/logout",
        {
          method: "POST",
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to log out.");
      }

      // Clear user information after successful logout.
      setCurrentUser(null);
      setApplications([]);
      setPage("Dashboard");
      setProfileMenuOpen(false);

    } catch (error) {
      console.error("Logout error:", error);
      alert("Could not log out. Please try again.");
    }
  }

  // Show a loading message while checking the login session.
  if (checkingLogin) {
    return <p>Checking login...</p>;
  }

  // Show the login page if nobody is logged in.
  if (!currentUser) {
    return <Auth onLogin={setCurrentUser} />;
  }

  // Show the main StudentAtlas website after login.
  return (
    <div className="site">
      <header className="top-bar">
        <button
          className="brand"
          onClick={() => openPage("Dashboard")}
        >
          <img src={logo} alt="" />
          <span>StudentAtlas</span>
        </button>

        {/* Profile dropdown in the top-right corner. */}
        <div className="profile-menu">

          {/* Open or close the dropdown menu. */}
          <button
            className="profile-button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            aria-expanded={profileMenuOpen}
            aria-haspopup="true"
          >
            My Profile <span aria-hidden="true">▾</span>
          </button>

          {/* Show the dropdown when the button is clicked. */}
          {profileMenuOpen && (
            <div className="profile-dropdown">

              {/* Navigate to the user's profile page. */}
              <button
                onClick={() => openPage("My Profile")}
              >
                View Profile
              </button>

              {/* Log out of StudentAtlas. */}
              <button
                onClick={handleLogout}
              >
                Log Out
              </button>

            </div>
          )}
        </div>
      </header>

      <div className="site-layout">
        <aside className="sidebar">
          <nav aria-label="Main navigation">
            {pages.map((name) => (
              <button
                key={name}
                className={page === name ? "active" : ""}
                aria-current={page === name ? "page" : undefined}
                onClick={() => openPage(name)}
              >
                {name}
              </button>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          {loading && (
            <p role="status">Loading applications...</p>
          )}

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {page === "Dashboard" && (
            <Dashboard
              applications={applications}
              onOpenApplications={() => openPage("Applications")}
            />
          )}

          {page === "Applications" && (
            <>
              <h1>Applications</h1>

              <p className="page-description">
                Add, search, and manage your job applications.
              </p>

              <div className="applications-layout">
                <AddApplication
                  onAddApplication={addApplication}
                />

                <section className="tracker-panel">
                  {statusError && (
                    <p className="error-message" role="alert">
                      {statusError}
                    </p>
                  )}

                  <FilterApplicationsFollowUp
                    applications={applications}
                    onStatusChange={updateApplicationStatus}
                  />
                </section>
              </div>
            </>
          )}

          {page === "Follow-ups" && (
            <>
              <h1>Follow-ups</h1>

              <p className="page-description">
                Keep track of your saved follow-up dates.
              </p>

              <section className="tracker-panel">
                <FilterApplicationsFollowUp
                  key="followups"
                  applications={applications}
                  followUpsOnly={true}
                />
              </section>
            </>
          )}

          {page === "Search Resources" && (
            <section className="placeholder-panel">
              <h1>Search Resources</h1>
              <p>
                AI-assisted job search is planned for a future update.
              </p>
            </section>
          )}

          {page === "Documents" && (
            <section className="placeholder-panel">
              <h1>Documents</h1>
              <p>
                Resume and document management is planned.
              </p>
            </section>
          )}

          {page === "Career Hub" && (
            <section className="placeholder-panel">
              <h1>Career Hub</h1>
              <p>
                Career events and resources are planned.
              </p>
            </section>
          )}

          {page === "My Profile" && <MyProfile />}
        </main>
      </div>
    </div>
  );
}

export default App;
