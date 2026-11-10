
import test from 'node:test';
import assert from 'node:assert/strict';
import db from '../src/database/db.js';

import {
  addApplication,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} from '../src/repositories/applicationRepository.js';

test('Application database operations', () => {
  const id = addApplication({
    company_name: 'Microsoft',
    job_title: 'Software Engineer Intern',
    status: 'Saved'
  });

  try {
    // Check that application was saved
    const saved = getApplicationById(id);
    assert.equal(saved.company_name, 'Microsoft');
    assert.equal(saved.status, 'Saved');

    // Update application status
    assert.equal(
      updateApplicationStatus(id, 'Applied'),
      true
    );

    const updated = getApplicationById(id);
    assert.equal(updated.status, 'Applied');
  } finally {
    // Remove the test record
    deleteApplication(id);
  }
});
