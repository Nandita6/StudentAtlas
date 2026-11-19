import db from "../database/db.js";

// Save a new application for the logged-in student.
export function addApplication(application, userId) {
  const statement = db.prepare(`
    INSERT INTO applications (
      company_name,
      job_title,
      status,
      application_date,
      deadline,
      follow_up_date,
      job_url,
      notes,
      user_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = statement.run(
    application.company_name,
    application.job_title,
    application.status ?? "Saved",
    application.application_date ?? null,
    application.deadline ?? null,
    application.follow_up_date ?? null,
    application.job_url ?? null,
    application.notes ?? null,
    userId
  );

  return Number(result.lastInsertRowid);
}

// Only retrieve applications belonging to this student.
export function getAllApplications(userId) {
  const statement = db.prepare(`
    SELECT * FROM applications
    WHERE user_id = ?
    ORDER BY id DESC
  `);

  return statement.all(userId);
}

// Only retrieve an application if this student owns it.
export function getApplicationById(id, userId) {
  const statement = db.prepare(`
    SELECT * FROM applications
    WHERE id = ? AND user_id = ?
  `);

  return statement.get(id, userId);
}

// Only update an application belonging to this student.
export function updateApplicationStatus(id, status, userId) {
  const statement = db.prepare(`
    UPDATE applications
    SET status = ?
    WHERE id = ? AND user_id = ?
  `);

  const result = statement.run(status, id, userId);

  return result.changes > 0;
}

// Only delete an application belonging to this student.
export function deleteApplication(id, userId) {
  const statement = db.prepare(`
    DELETE FROM applications
    WHERE id = ? AND user_id = ?
  `);

  const result = statement.run(id, userId);

  return result.changes > 0;
}
