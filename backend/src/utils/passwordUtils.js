import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

// Allow us to use scrypt with async and await.
const scryptAsync = promisify(scrypt);

// Turn a password into a secure hash before saving it.
export async function hashPassword(password) {
  // Generate a random salt for each password.
  const salt = randomBytes(16).toString("hex");

  // Hash the password using the random salt.
  const hash = await scryptAsync(password, salt, 64);

  // Store the salt and hash together.
  return `${salt}:${hash.toString("hex")}`;
}

// Check whether a login password matches the saved hash.
export async function verifyPassword(password, savedPassword) {
  // Separate the saved salt and hash.
  const [salt, savedHash] = savedPassword.split(":");

  // Reject invalid saved password data.
  if (!salt || !savedHash || !/^[0-9a-f]{128}$/i.test(savedHash)) {
    return false;
  }

  // Hash the entered password using the original salt.
  const enteredHash = await scryptAsync(password, salt, 64);
  const originalHash = Buffer.from(savedHash, "hex");

  // Compare both hashes safely.
  return timingSafeEqual(enteredHash, originalHash);
}