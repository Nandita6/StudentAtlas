
/**
 * Filters job applications by their current status.
 *
 * @param {Array} applications - List of saved applications
 * @param {string} status - Status selected by the user
 * @returns {Array} Matching applications
 */
export function filterApplicationsByStatus(applications, status) {
  if (!Array.isArray(applications)) {
    return [];
  }

  if (!status || status === "All") {
    return applications;
  }

  return applications.filter(
    (application) =>
      application.status?.toLowerCase() === status.toLowerCase()
  );
}

/**
 * Finds applications with upcoming deadlines.
 * Includes deadlines from today through the next 7 days.
 */
export function getUpcomingDeadlines(applications, today = new Date()) {
  if (!Array.isArray(applications)) {
    return [];
  }

  const start = new Date(today);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return applications.filter((application) => {
    if (!application.deadline) return false;

    const deadline = new Date(
      `${application.deadline}T00:00:00`
    );

    return deadline >= start && deadline <= end;
  });
}

/**
 * Finds applications with follow-ups due today or earlier.
 */
export function getDueFollowUps(applications, today = new Date()) {
  if (!Array.isArray(applications)) {
    return [];
  }

  const currentDate = new Date(today);
  currentDate.setHours(0, 0, 0, 0);

  return applications.filter((application) => {
    if (!application.followUpDate) return false;

    const followUpDate = new Date(`${application.followUpDate}T00:00:00`);

    return followUpDate <= currentDate;
  }
);
}