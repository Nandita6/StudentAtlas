import test from "node:test";
import assert from "node:assert/strict";

import {
  validateApplication,
  createApplication,
  validateApplicationStatus,
  updateApplicationStatus,
} from "../src/services/applicationService.js";


test("valid application passes validation", () => {
  const application = {
    company: "Google",
    position: "Software Engineer Intern",
    applicationDate: "2026-11-09",
    status: "Applied",
    notes: "Submitted online",
  };

  const result = validateApplication(application);

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});


test("missing company fails validation", () => {
  const application = {
    company: "",
    position: "Software Engineer Intern",
    applicationDate: "2026-11-09",
    status: "Applied",
  };

  const result = validateApplication(application);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("Company name is required."));
});


test("invalid status fails validation", () => {
  const application = {
    company: "Google",
    position: "Software Engineer Intern",
    applicationDate: "2026-11-09",
    status: "Waiting",
  };

  const result = validateApplication(application);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("Application status is invalid."));
});


test("createApplication returns valid application data", () => {
  const application = {
    company: "Google",
    position: "Software Engineer Intern",
    applicationDate: "2026-11-09",
    status: "Applied",
    notes: "",
  };

  const result = createApplication(application);

  assert.deepEqual(result, application);
});


test("createApplication throws error for invalid application", () => {
  const application = {
    company: "",
    position: "",
    applicationDate: "",
    status: "",
  };

  assert.throws(
    () => createApplication(application),
    /Company name is required/
  );
});


test("valid application status is accepted", () => {
  const result = validateApplicationStatus("Interview");

  assert.equal(result, "Interview");
});


test("invalid application status throws error", () => {
  assert.throws(
    () => validateApplicationStatus("Waiting"),
    /Application status is invalid/
  );
});


test("updateApplicationStatus changes the status", () => {
  const application = {
    id: 1,
    company: "Google",
    position: "Software Engineer Intern",
    applicationDate: "2026-11-09",
    status: "Applied",
  };

  const updatedApplication = updateApplicationStatus(
    application,
    "Under Review"
  );

  
  assert.equal(updatedApplication.status, "Under Review");
  assert.equal(updatedApplication.company, "Google");
});