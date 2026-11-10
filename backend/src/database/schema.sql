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
