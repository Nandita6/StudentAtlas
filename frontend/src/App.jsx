import { useState } from "react";
import Dashboard from "./components/Dashboard";
import AddApplication from "./components/AddApplication";
import FilterApplicationsFollowUp from "./components/FilterApplicationsFollowUp";
import ApplicationStatus from "./components/ApplicationStatus";
import "./App.css";

function App() {
  // testing sample apps
  const [applications, setApplications] = useState([
    {
      id: 1,
      company: "Microsoft",
      role: "Software Engineer Intern",
      status: "Interview / Assessment",
      followUpDate: "2026-11-10",
    },
    {
      id: 2,
      company: "Facebook",
      role: "Frontend Developer",
      status: "Applied",
      followUpDate: "2026-12-01",
    },
  ]);

  function addApplication(newApplication) {
    setApplications([...applications, newApplication]);

    console.log("Saved applications:", [...applications, newApplication]);
  }

  function updateApplicationStatus(applicationId, newStatus) {
  setApplications((previousApplications) =>
    previousApplications.map((application) =>
      application.id === applicationId
        ? { ...application, status: newStatus }
        : application
    )
  );
}

  return (
    <>
      <Dashboard />

      <AddApplication onAddApplication={addApplication} />
      <h2>Application Tracker</h2>

    {applications.map((application) => (
      <div key={application.id}>
        <h3>{application.company}</h3>
        <p>{application.role || application.position}</p>

        <ApplicationStatus
          application={application}
          onStatusChange={updateApplicationStatus}
        />
      </div>
    ))}

    <FilterApplicationsFollowUp applications={applications} />
  </>
);
}

export default App;
