import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

import app from "../src/app.js";
import {
  deleteApplication,
} from "../src/repositories/applicationRepository.js";

function startTestServer() {
  return new Promise((resolve) => {
    const server = http.createServer(app);

    server.listen(0, () => {
      const address = server.address();

      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`,
      });
    });
  });
}

async function loginTestUser(baseUrl) {
  const email = `route-test-${Date.now()}-${Math.random()}@example.com`;
  const password = "test-password-123";

  await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: "Route Test User",
      email,
      password,
    }),
  });

  const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const cookie = loginResponse.headers.get("set-cookie");

  return cookie;
}

test("POST /api/applications creates an application", async () => {
  const { server, baseUrl } = await startTestServer();

  let savedApplication;

  try {
    const cookie = await loginTestUser(baseUrl);

    const response = await fetch(`${baseUrl}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify({
        company: "Apple",
        position: "Software Engineer Intern",
        applicationDate: "2026-11-10",
        status: "Applied",
        notes: "Submitted online",
      }),
    });

    assert.equal(response.status, 201);

    savedApplication = await response.json();

    assert.equal(savedApplication.company_name, "Apple");
    assert.equal(savedApplication.job_title, "Software Engineer Intern");
    assert.equal(savedApplication.status, "Applied");
  } finally {
    server.close();
  }
});

test("POST /api/applications rejects invalid application", async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const cookie = await loginTestUser(baseUrl);

    const response = await fetch(`${baseUrl}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify({
        company: "",
        position: "",
        applicationDate: "",
        status: "",
      }),
    });

    assert.equal(response.status, 400);

    const body = await response.json();

    assert.match(body.error, /Company name is required/);
  } finally {
    server.close();
  }
});

test("PATCH /api/applications/:id/status updates application status", async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const cookie = await loginTestUser(baseUrl);

    const createResponse = await fetch(`${baseUrl}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      body: JSON.stringify({
        company: "Netflix",
        position: "Software Engineer Intern",
        applicationDate: "2026-11-10",
        status: "Applied",
      }),
    });

    const savedApplication = await createResponse.json();

    const updateResponse = await fetch(
      `${baseUrl}/api/applications/${savedApplication.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        body: JSON.stringify({
          status: "Interview",
        }),
      }
    );

    assert.equal(updateResponse.status, 200);

    const updatedApplication = await updateResponse.json();

    assert.equal(updatedApplication.status, "Interview");
    assert.equal(updatedApplication.id, savedApplication.id);
  } finally {
    server.close();
  }
});

test("PATCH /api/applications/:id/status returns 404 for missing application", async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const cookie = await loginTestUser(baseUrl);

    const response = await fetch(
      `${baseUrl}/api/applications/999999/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        body: JSON.stringify({
          status: "Interview",
        }),
      }
    );

    assert.equal(response.status, 404);

    const body = await response.json();

    assert.equal(body.error, "Application not found.");
  } finally {
    server.close();
  }
});