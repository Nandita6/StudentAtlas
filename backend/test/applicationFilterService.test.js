
import test from "node:test";
import assert from "node:assert/strict";

import {
  filterApplicationsByStatus,
  getUpcomingDeadlines,
  getDueFollowUps
} from "../src/services/applicationFilterService.js";

const applications = [
  {
    id: 1,
    company: "Google",
    status: "Applied",
    deadline: "2026-11-10",
    followUpDate: "2026-11-07"
  },
  {
    id: 2,
    company: "Microsoft",
    status: "Interview",
    deadline: "2026-11-20",
    followUpDate: "2026-11-15"
  },
  {
    id: 3,
    company: "Amazon",
    status: "Applied",
    deadline: "2026-11-12",
    followUpDate: "2026-11-08"
  }
];

test("filters applications by status", () => {
  const result = filterApplicationsByStatus(applications, "Applied");

  assert.equal(result.length, 2);
  assert.equal(result[0].company, "Google");
  assert.equal(result[1].company, "Amazon");
});

test("finds upcoming deadlines", () => {
  const result = getUpcomingDeadlines(
    applications,
    new Date(2026, 10, 8)
  );

  assert.equal(result.length, 2);
});

test("finds due follow-ups", () => {
  const result = getDueFollowUps(
    applications,
    new Date(2026, 10, 8)
  );

  assert.equal(result.length, 2);
});
