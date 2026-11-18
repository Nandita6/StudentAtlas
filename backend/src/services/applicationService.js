import {
  addApplication,
  getAllApplications as getAllApplicationsFromRepository,
  getApplicationById,
  updateApplicationStatus as updateStatusInRepository,
} from "../repositories/applicationRepository.js";


const validStatuses = [
  "Saved",
  "Applied",
  "Under Review",
  "Interview",
  "Assessment",
  "Offer",
  "Rejected",
];


// Check that a date is a real calendar date in YYYY-MM-DD format.
function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(value + "T00:00:00Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateApplication(application) {
  const errors = [];

  if (!application || typeof application !== "object" || Array.isArray(application)) {
    return { valid: false, errors: ["Application data is required."] };
  }

  if (typeof application.company !== "string" || !application.company.trim()) {
    errors.push("Company name is required.");
  }
  if (typeof application.position !== "string" || !application.position.trim()) {
    errors.push("Position is required.");
  }
  if (!application.applicationDate) {
    errors.push("Application date is required.");
  } else if (!isValidDate(application.applicationDate)) {
    errors.push("Application date is invalid.");
  }
  if (!application.status) {
    errors.push("Application status is required.");
  } else if (!validStatuses.includes(application.status)) {
    errors.push("Application status is invalid.");
  }

  if (application.deadline != null && application.deadline !== "" && !isValidDate(application.deadline)) {
    errors.push("Deadline is invalid.");
  }
  if (application.followUpDate != null && application.followUpDate !== "" && !isValidDate(application.followUpDate)) {
    errors.push("Follow-up date is invalid.");
  }
  if (application.notes != null && typeof application.notes !== "string") {
    errors.push("Notes must be text.");
  }
  if (application.jobUrl != null && typeof application.jobUrl !== "string") {
    errors.push("Job URL must be text.");
  }

  return { valid: errors.length === 0, errors };
}


export function createApplication(applicationData) {
  const validation = validateApplication(applicationData);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  return {
    ...applicationData,
  };
}



export function validateApplicationStatus(status) {
  if (!status) {
    throw new Error("Application status is required.");
  }

  if (!validStatuses.includes(status)) {
    throw new Error("Application status is invalid.");
  }

  return status;
}



export function updateApplicationStatus(application, newStatus) {
  if (!application) {
    throw new Error("Application is required.");
  }

  validateApplicationStatus(newStatus);

  return {
    ...application,
    status: newStatus,
  };
}


export function getAllApplications() {
  return getAllApplicationsFromRepository();
}

// Treat blank and missing optional fields as the same value.
function cleanText(value) {
  return (value ?? "").trim();
}

// Only reject a record when all its stored fields match.
function isDuplicate(saved, incoming) {
  return cleanText(saved.company_name).toLowerCase() === cleanText(incoming.company_name).toLowerCase()
    && cleanText(saved.job_title).toLowerCase() === cleanText(incoming.job_title).toLowerCase()
    && cleanText(saved.status) === cleanText(incoming.status)
    && cleanText(saved.application_date) === cleanText(incoming.application_date)
    && cleanText(saved.deadline) === cleanText(incoming.deadline)
    && cleanText(saved.follow_up_date) === cleanText(incoming.follow_up_date)
    && cleanText(saved.job_url) === cleanText(incoming.job_url)
    && cleanText(saved.notes) === cleanText(incoming.notes);
}

export function saveApplication(applicationData) {
  const application = createApplication(applicationData);

  const databaseApplication = {
    company_name: application.company.trim(),
    job_title: application.position.trim(),
    status: application.status,
    application_date: application.applicationDate,
    deadline: application.deadline || null,
    follow_up_date: application.followUpDate || null,
    job_url: cleanText(application.jobUrl) || null,
    notes: cleanText(application.notes) || null,
  };

  const duplicate = getAllApplicationsFromRepository().some((saved) =>
    isDuplicate(saved, databaseApplication)
  );

  if (duplicate) {
    const error = new Error("This application already exists. Duplicate applications are not allowed.");
    error.code = "DUPLICATE_APPLICATION";
    throw error;
  }

  const id = addApplication(databaseApplication);
  return getApplicationById(id);
}

export function changeApplicationStatus(id, newStatus) {
  
  validateApplicationStatus(newStatus);

  const application = getApplicationById(id);

  if (!application) {
    throw new Error("Application not found.");
  }

  const updated = updateStatusInRepository(id, newStatus);

  if (!updated) {
    throw new Error("Application status could not be updated.");
  }

  return getApplicationById(id);
}