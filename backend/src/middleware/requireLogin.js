
import { findUserById } from "../repositories/userRepository.js";

// Only allow logged-in users to access protected routes.
export function requireLogin(req, res, next) {
  // Check whether the user has an active login session.
  const userId = req.session?.userId;

  if (!userId) {
    return res.status(401).json({
      error: "Please log in to continue."
    });
  }

  // Make sure the account still exists.
  const user = findUserById(userId);

  if (!user) {
    return res.status(401).json({
      error: "Your login session is no longer valid."
    });
  }

  // Save the verified user's ID for the next route.
  req.userId = user.id;

  // Allow the request to continue.
  next();
}
