
function Dashboard() {
  return (
    <div>
      <h1>StudentAtlas</h1>

      {/* Navigation Menu */}
      <nav>
        <a href="#dashboard">Dashboard</a> |{" "}
        <a href="#applications">Applications</a> |{" "}
        <a href="#resources">Resources</a> |{" "}
        <a href="#documents">Documents</a> |{" "}
        <a href="#career">Career Hub</a>
      </nav>

      {/* Welcome Message */}
      <h2>Welcome back!</h2>
      <p>Keep track of your job search with StudentAtlas.</p>
    </div>
  );
}

export default Dashboard;
