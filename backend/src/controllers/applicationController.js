import {
  saveApplication,
  changeApplicationStatus,
  getAllApplications,
} from "../services/applicationService.js";

// Get applications belonging to the logged-in student.
export function getAllApplicationsHandler(request, response) {
  try {
    const applications = getAllApplications(request.userId);

    response.status(200).json(applications);
  } catch (error) {
    response.status(500).json({
      error: error.message,
    });
  }
}

// Save a new application for the logged-in student.
export function createApplicationHandler(request, response) {
  try {
    const savedApplication = saveApplication(
      request.body,
      request.userId
    );

    response.status(201).json(savedApplication);
  } catch (error) {
    if (error.code === "DUPLICATE_APPLICATION") {
      return response.status(409).json({
        error: error.message,
      });
    }

    response.status(400).json({
      error: error.message,
    });
  }
}

// Update an application only if the student owns it.
export function updateApplicationStatusHandler(request, response) {
  try {
    const id = Number(request.params.id);
    const { status } = request.body;

    const updatedApplication = changeApplicationStatus(
      id,
      status,
      request.userId
    );

    response.status(200).json(updatedApplication);
  } catch (error) {
    if (error.message === "Application not found.") {
      return response.status(404).json({
        error: error.message,
      });
    }

    response.status(400).json({
      error: error.message,
    });
  }
}
