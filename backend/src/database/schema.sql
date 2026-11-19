CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Saved',
    application_date TEXT,
    deadline TEXT,
    follow_up_date TEXT,
    job_url TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    university TEXT,
    degree TEXT,
    graduation_date TEXT,
    skills TEXT,
    interests TEXT,
    date_of_birth TEXT
);
-- Store registered StudentAtlas user accounts.
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);