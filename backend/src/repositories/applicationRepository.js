
import db from '../database/db.js';

// Save a new job application
export function addApplication(application) {
  const statement = db.prepare(`
    INSERT INTO applications (
      company_name,
      job_title,
      status,
      application_date,
      deadline,
      follow_up_date,
      job_url,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = statement.run(
    application.company_name,
    application.job_title,
    application.status ?? 'Saved',
    application.application_date ?? null,
    application.deadline ?? null,
    application.follow_up_date ?? null,
    application.job_url ?? null,
    application.notes ?? null
  );

  return Number(result.lastInsertRowid);
}

// Retrieve all saved applications
export function getAllApplications() {
  const statement = db.prepare(
    'SELECT * FROM applications ORDER BY id DESC'
  );

  return statement.all();
}

// Retrieve one application by its ID
export function getApplicationById(id) {
  const statement = db.prepare(
    'SELECT * FROM applications WHERE id = ?'
  );

  return statement.get(id);
}

// Update an application's status
export function updateApplicationStatus(id, status) {
  const statement = db.prepare(
    'UPDATE applications SET status = ? WHERE id = ?'
  );

  const result = statement.run(status, id);

  return result.changes > 0;
}

// Delete an application
export function deleteApplication(id) {
  const statement = db.prepare(
    'DELETE FROM applications WHERE id = ?'
  );

  const result = statement.run(id);

  return result.changes > 0;
}
