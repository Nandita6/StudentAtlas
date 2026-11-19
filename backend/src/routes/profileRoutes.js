
import { Router } from "express";
import {
  getProfile,
  saveProfile
} from "../repositories/profileRepository.js";

const router = Router();

// Get the profile of the logged-in student.
router.get("/", (req, res) => {
  try {
    // Use the account ID from the login session.
    const profile = getProfile(req.userId);

    // Return this student's profile or an empty object.
    res.json(profile || {});
  } catch (error) {
    console.error("Failed to load profile:", error);
    res.status(500).json({
      error: "Failed to load profile."
    });
  }
});

// Save or update the logged-in student's profile.
router.put("/", (req, res) => {
  try {
    const profile = req.body;

    // Make sure profile information was provided.
    if (
      !profile ||
      typeof profile !== "object" ||
      Array.isArray(profile)
    ) {
      return res.status(400).json({
        error: "Invalid profile information."
      });
    }

    // These are the fields students can edit.
    const fields = [
      "fullName",
      "university",
      "degree",
      "graduationDate",
      "skills",
      "interests",
      "dateOfBirth"
    ];

    // Check that all fields contain text.
    if (fields.some((field) => typeof profile[field] !== "string")) {
      return res.status(400).json({
        error: "Invalid profile fields."
      });
    }

    // Save the profile under the logged-in student's account.
    const savedProfile = saveProfile(profile, req.userId);

    // Return the saved profile.
    res.json(savedProfile);
  } catch (error) {
    console.error("Failed to save profile:", error);
    res.status(500).json({
      error: "Failed to save profile."
    });
  }
});

export default router;
