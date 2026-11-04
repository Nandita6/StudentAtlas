
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">

      {/* Website title */}
      <h1>StudentAtlas</h1>

      {/* Navigation bar */}
      <nav>
        <a href="#dashboard">Dashboard</a>
        <a href="#applications">Applications</a>
        <a href="#resources">Resources</a>
        <a href="#documents">Documents</a>
        <a href="#career">Career Hub</a>
      </nav>

      {/* Welcome message */}
      <div className="welcome" id="dashboard">
        <h2>Welcome back!</h2>
        <p>Keep track of your job search with StudentAtlas.</p>
      </div>

      {/* Main features */}
      <div className="features">

        <div className="card">
          <h3>Application Tracker</h3>
          <p>Track and manage your job applications</p>
        </div>

        <div className="card">
          <h3>Search Resources</h3>
          <p>Find and save jobs opportunities</p>
        </div>

        <div className="card">
          <h3>Document Hub</h3>
          <p>Organize resumes, cover letters, and documents</p>
        </div>

        <div className="card">
          <h3>Career Hub</h3>
          <p>Explore career events and resources</p>
        </div>

      </div>

      {/* Dashboard tables */}
      <div className="tables">

        {/* Recent applications */}
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
              <tr>
                <td>Software Engineering Intern - Acme</td>
                <td>Applied</td>
                <td>Oct 21</td>
              </tr>

              <tr>
                <td>Product Design Intern - Northstar</td>
                <td>Interview</td>
                <td>Oct 24</td>
              </tr>

              <tr>
                <td>Data Analyst Intern - Bright Labs</td>
                <td>Under Review</td>
                <td>Nov 02</td>
              </tr>

              <tr>
                <td>Campus Developer - StudentTech</td>
                <td>Applied</td>
                <td>Nov 08</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Upcoming deadlines */}
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
              <tr>
                <td>Acme application</td>
                <td>Oct 21</td>
              </tr>

              <tr>
                <td>Northstar interview</td>
                <td>Oct 24</td>
              </tr>

              <tr>
                <td>Bright Labs follow-up</td>
                <td>Nov 02</td>
              </tr>

              <tr>
                <td>StudentTech application</td>
                <td>Nov 08</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
