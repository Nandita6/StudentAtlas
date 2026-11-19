import db from "../database/db.js";

// Find an existing user using their email address.
export function findUserByEmail(email) {
  const statement = db.prepare(
    "SELECT * FROM users WHERE email = ?"
  );

  return statement.get(email);
}

// Find an existing user using their unique ID.
export function findUserById(userId) {
  const statement = db.prepare(
    "SELECT id, full_name, email FROM users WHERE id = ?"
  );

  return statement.get(userId);
}

// Save a new registered user in the database.
export function createUser(fullName, email, passwordHash) {
  const statement = db.prepare(`
    INSERT INTO users (full_name, email, password_hash)
    VALUES (?, ?, ?)
  `);

  const result = statement.run(fullName, email, passwordHash);

  // Return the new user's ID.
  return result.lastInsertRowid;
}