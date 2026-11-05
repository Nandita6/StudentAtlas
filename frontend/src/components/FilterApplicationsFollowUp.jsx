import React, { useState } from "react";
import "./FilterApplicationsFollowUp.css";

export default function FilterApplicationsFollowUp() {
  const [applications, setApplications] = useState([
    {
      id: 1,
      company: "Google",
      role: "Software Engineer Intern",
      status: "Interview/Assessment",
      followUpDate: "2026-11-10",
    },
    {
      id: 2,
      company: "Stripe",
      role: "Frontend Developer Intern",
      status: "Applied",
      followUpDate: "2026-11-05",
    },
    {
      id: 3,
      company: "Amazon",
      role: "SDE Intern",
      status: "Reviewing Application",
      followUpDate: "2026-11-15",
    },
    {
      id: 4,
      company: "Spotify",
      role: "Junior Web Dev",
      status: "Rejected",
      followUpDate: "2026-10-20",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(false);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || app.status === statusFilter;

    let matchesFollowUp = true;
    if (showOnlyUpcoming) {
      const today = new Date().toISOString().split("T")[0];
      matchesFollowUp = app.followUpDate >= today;
    }

    return matchesSearch && matchesStatus && matchesFollowUp;
  });

  return (
    <div className="filter-container">
      <h2>Application Filter and Follow-up Tracker</h2>
      <p style={{ color: "#666" }}>
        Here you can filter your applications and check any upcoming follow-up
        dates
      </p>

      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search by company or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-dropdown"
        >
          <option value="All">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Reviewing Application">Reviewing</option>
          <option value="Interview/Assessment">Interview or Assessment</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          onClick={() => setShowOnlyUpcoming(!showOnlyUpcoming)}
          className="upcoming-btn"
          style={{
            backgroundColor: showOnlyUpcoming ? "#007bff" : "#f0f0f0",
            color: showOnlyUpcoming ? "#fff" : "#333",
          }}
        >
          {showOnlyUpcoming
            ? "Showing Upcoming Follow-ups"
            : "Filter Upcoming Follow-ups"}
        </button>
      </div>

      <div className="app-list">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.id} className="app-card">
              <h3>{app.company}</h3>
              <p>Role: {app.role}</p>
              <div className="app-details">
                <span className="status-badge">Status: {app.status}</span>
                <span className="followup-date">
                  Followup is due: {app.followUpDate}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>
            No applications currently match your filters
          </p>
        )}
      </div>
    </div>
  );
}
