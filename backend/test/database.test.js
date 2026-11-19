import test from 'node:test';
import assert from 'node:assert/strict';

import { createUser } from '../src/repositories/userRepository.js';

import {
  addApplication,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} from '../src/repositories/applicationRepository.js';

const testUserId = createUser(
  'Database Test User',
  `database-test-${Date.now()}@example.com`,
  'test-password-hash'
);

test('Application database operations', () => {
  const id = addApplication(
    {
      company_name: 'Microsoft',
      job_title: 'Software Engineer Intern',
      status: 'Saved'
    },
    testUserId
  );

  try {
    // Check that application was saved
    const saved = getApplicationById(id, testUserId);
    assert.equal(saved.company_name, 'Microsoft');
    assert.equal(saved.status, 'Saved');

    // Update application status
    assert.equal(
      updateApplicationStatus(id, 'Applied', testUserId),
      true
    );

    const updated = getApplicationById(id, testUserId);
    assert.equal(updated.status, 'Applied');
  } finally {
    // Remove the test record
    deleteApplication(id, testUserId);
  }
});