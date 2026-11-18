import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import AddApplication from "./components/AddApplication";
import FilterApplicationsFollowUp from "./components/FilterApplicationsFollowUp";
import logo from "./assets/logo.png";
import "./App.css";

const pages = ["Dashboard", "Applications", "Follow-ups", "Search Resources", "Documents", "Career Hub", "My Profile"];

function App() {
  const [page, setPage] = useState("Dashboard");
  const [statusError, setStatusError] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to get the applications from the server.");
        }
        return res.json();
      })
      .then((data) => {
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
  }, []);

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
        throw new Error(savedApp?.error || "The server could not save the application.");
      }

      if (response.status !== 201 || !Number.isInteger(savedApp?.id) || savedApp.id < 1) {
        throw new Error("The server did not confirm the save. Refresh before trying again.");
      }

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
        },
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update status.");
      }

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.id === applicationId
            ? { ...application, status: newStatus }
            : application,
        ),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      setStatusError(err.message);
    }
  }

  function openPage(nextPage) {
    setPage(nextPage);
    window.scrollTo(0, 0);
  }

  return (
    <div className="site">
      <header className="top-bar">
        <button className="brand" onClick={() => openPage("Dashboard")}>
          <img src={logo} alt="" />
          <span>StudentAtlas</span>
        </button>
        <button className="profile-button" onClick={() => openPage("My Profile")}>My Profile</button>
      </header>

      <div className="site-layout">
        <aside className="sidebar">
          <nav aria-label="Main navigation">
            {pages.map((name) => (
              <button key={name} className={page === name ? "active" : ""}
                aria-current={page === name ? "page" : undefined}
                onClick={() => openPage(name)}>{name}</button>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          {loading && <p role="status">Loading applications...</p>}
          {error && <p className="error-message" role="alert">{error}</p>}
          {page === "Dashboard" && <Dashboard applications={applications} onOpenApplications={() => openPage("Applications")} />}

          {page === "Applications" && (
            <>
              <h1>Applications</h1>
              <p className="page-description">Add, search, and manage your job applications.</p>
              <div className="applications-layout">
                <AddApplication onAddApplication={addApplication} />
                <section className="tracker-panel">
                  {statusError && <p className="error-message" role="alert">{statusError}</p>}
                  <FilterApplicationsFollowUp applications={applications} onStatusChange={updateApplicationStatus} />
                </section>
              </div>
            </>
          )}

          {page === "Follow-ups" && (
            <>
              <h1>Follow-ups</h1>
              <p className="page-description">Keep track of your saved follow-up dates.</p>
              <section className="tracker-panel">
                <FilterApplicationsFollowUp key="followups" applications={applications} followUpsOnly={true} />
              </section>
            </>
          )}

          {page === "Search Resources" && <section className="placeholder-panel"><h1>Search Resources</h1><p>AI-assisted job search is planned for a future update.</p></section>}
          {page === "Documents" && <section className="placeholder-panel"><h1>Documents</h1><p>Resume and document management is planned.</p></section>}
          {page === "Career Hub" && <section className="placeholder-panel"><h1>Career Hub</h1><p>Career events and resources are planned.</p></section>}
          {page === "My Profile" && <section className="placeholder-panel"><h1>My Profile</h1><p>User accounts and profile editing will be added in the next step.</p></section>}
        </main>
      </div>
    </div>
  );
}

export default App;
