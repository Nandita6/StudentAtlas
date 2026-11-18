import './Dashboard.css';

function Dashboard({ applications = [], onOpenApplications }) {

  // Show the four most recent applications
  const recentApplications = applications.slice(0, 4);
  const stats = [
    { label: 'Applied', count: applications.filter(app => app.status === 'Applied').length },
    { label: 'Interviews', count: applications.filter(app => app.status === 'Interview').length },
    { label: 'Offers', count: applications.filter(app => app.status === 'Offer').length },
  ];

  // Find upcoming deadlines and follow-ups
  const today = new Date().toISOString().split('T')[0];

  const upcomingDates = applications
    .flatMap((app) => {
      const dates = [];

      if (app.deadline) {
        dates.push({
          task: `${app.company} deadline`,
          date: app.deadline,
        });
      }

      if (app.followUpDate) {
        dates.push({
          task: `${app.company} follow-up`,
          date: app.followUpDate,
        });
      }

      return dates;
    })
    .filter((item) => item.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <div className="dashboard">

      <h1>Dashboard</h1>
      <p className="page-description">Manage your career journey.</p>
      <div className="welcome">
        <div><h2>Welcome back!</h2><p>Keep track of your job search with StudentAtlas.</p></div>
        <button className="primary-button" onClick={onOpenApplications}>+ Add application</button>
      </div>
      <div className="stats">
        {stats.map(stat => (
          <div className="stat-card" key={stat.label}>
            <p>{stat.label}</p><strong>{stat.count}</strong>
          </div>
        ))}
      </div>

      <div className="tables">

        <div className="table-box">
          <h3>Recent Applications</h3>

          <table>
            <thead>
              <tr>
                <th>Application</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {recentApplications.length === 0 ? (
                <tr>
                  <td colSpan="3">No applications saved yet.</td>
                </tr>
              ) : (
                recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.position || app.role} - {app.company}</td>
                    <td><span className="status-badge" data-status={app.status}>{app.status}</span></td>
                    <td>{app.applicationDate || "Not set"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-box">
          <h3>Upcoming Deadlines</h3>

          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {upcomingDates.length === 0 ? (
                <tr>
                  <td colSpan="2">No upcoming dates saved.</td>
                </tr>
              ) : (
                upcomingDates.map((item, index) => (
                  <tr key={index}>
                    <td>{item.task}</td>
                    <td>{item.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
