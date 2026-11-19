import { Router } from "express";
import {
  findUserByEmail,
  findUserById,
  createUser
} from "../repositories/userRepository.js";
import { hashPassword, verifyPassword } from "../utils/passwordUtils.js";

const router = Router();

// Register a new StudentAtlas user.
router.post("/register", async (req, res) => {
  try {
    // Get the information entered by the user.
    const { fullName, email, password } = req.body;

    // Make sure all required fields are provided.
    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !fullName.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: "Please fill in all required fields."
      });
    }

    // Clean up the name and email.
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check that the email has a basic valid format.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        error: "Please enter a valid email address."
      });
    }

    // Require a password with at least 12 characters.
    if (password.length < 12) {
      return res.status(400).json({
        error: "Password must be at least 12 characters."
      });
    }

    // Check whether the email is already registered.
    const existingUser = findUserByEmail(cleanEmail);

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists."
      });
    }

    // Hash the password before storing it.
    const passwordHash = await hashPassword(password);

    // Create the user in the SQLite database.
    const userId = createUser(cleanName, cleanEmail, passwordHash);

    // Return the new account information without the password.
    return res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: Number(userId),
        fullName: cleanName,
        email: cleanEmail
      }
    });

  } catch (error) {
    // Handle a duplicate email if two registrations happen together.
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        error: "An account with this email already exists."
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      error: "Failed to create account."
    });
  }
});

// Log in an existing StudentAtlas user.
router.post("/login", async (req, res) => {
  try {
    // Get the email and password entered by the user.
    const { email, password } = req.body || {};

    // Make sure both fields contain text.
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: "Please enter your email and password."
      });
    }

    // Find the user using their email address.
    const cleanEmail = email.trim().toLowerCase();
    const user = findUserByEmail(cleanEmail);

    // Don't reveal whether an email address exists.
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    // Compare the entered password with the saved hash.
    const passwordMatches = await verifyPassword(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    // Create a fresh session after successful login.
req.session.regenerate((error) => {
  // Stop if the session could not be created.
  if (error) {
    return res.status(500).json({
      error: "Failed to start login session."
    });
  }

  // Remember which user is logged in.
  req.session.userId = user.id;

  // Save the session before responding.
  req.session.save((error) => {
    if (error) {
      return res.status(500).json({
        error: "Failed to save login session."
      });
    }

    // Return user information without the password.
    return res.json({
      message: "Logged in successfully!",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email
      }
    });
  });
});
  } catch (error) {
    // Show the error in the backend terminal.
    console.error("Login error:", error);

    // Tell the frontend that login failed.
    return res.status(500).json({
      error: "Failed to log in."
    });
  }
});
// Check which user is currently logged in.
router.get("/me", (req, res) => {
  // Check whether the session contains a user ID.
  if (!req.session.userId) {
    return res.status(401).json({
      error: "You are not logged in."
    });
  }

  // Find the logged-in user's information.
  const user = findUserById(req.session.userId);

  // Make sure the user still exists.
  if (!user) {
    return res.status(401).json({
      error: "User not found."
    });
  }

  // Return the user's information without their password.
  return res.json({
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email
    }
  });
});

// Log out the currently logged-in user.
router.post("/logout", (req, res) => {
  // Remove the user's session from the server.
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        error: "Failed to log out."
      });
    }

    // Remove the session cookie from the browser.
    res.clearCookie("connect.sid");

    return res.json({
      message: "Logged out successfully!"
    });
  });
});
// Export all the registration and login routes.
export default router;