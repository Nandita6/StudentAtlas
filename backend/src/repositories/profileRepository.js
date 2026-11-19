
import db from "../database/db.js";

// Get the profile belonging to the logged-in student.
export function getProfile(userId) {
  const statement = db.prepare(`
    SELECT * FROM profiles
    WHERE user_id = ?
  `);

  return statement.get(userId);
}

// Save or update the logged-in student's profile.
export function saveProfile(profile, userId) {
  const {
    fullName,
    university,
    degree,
    graduationDate,
    skills,
    interests,
    dateOfBirth
  } = profile;

  // Check whether this student already has a profile.
  const existingProfile = getProfile(userId);

  if (existingProfile) {
    // Update only this student's existing profile.
    const statement = db.prepare(`
      UPDATE profiles
      SET full_name = ?,
          university = ?,
          degree = ?,
          graduation_date = ?,
          skills = ?,
          interests = ?,
          date_of_birth = ?
      WHERE user_id = ?
    `);

    statement.run(
      fullName,
      university,
      degree,
      graduationDate,
      skills,
      interests,
      dateOfBirth,
      userId
    );
  } else {
    // Create a separate profile for a new student.
    const statement = db.prepare(`
      INSERT INTO profiles (
        full_name,
        university,
        degree,
        graduation_date,
        skills,
        interests,
        date_of_birth,
        user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    statement.run(
      fullName,
      university,
      degree,
      graduationDate,
      skills,
      interests,
      dateOfBirth,
      userId
    );
  }

  // Return only this student's saved profile.
  return getProfile(userId);
}
