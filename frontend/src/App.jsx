import { useState } from 'react';
import Dashboard from './components/Dashboard';
import AddApplication from './components/AddApplication';

function App() {
  const [applications, setApplications] = useState([]);

  function addApplication(newApplication) {
    setApplications([...applications, newApplication]);

    console.log('Saved applications:', [...applications, newApplication]);
  }

  return (
    <>
      <Dashboard />

      <AddApplication onAddApplication={addApplication} />
    </>
  );
}

export default App;