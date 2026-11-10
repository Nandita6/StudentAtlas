import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Find the database folder
const databaseFolder = path.dirname(
  fileURLToPath(import.meta.url)
);

// Create a folder for persistent data
const dataFolder = path.join(databaseFolder, 'data');
mkdirSync(dataFolder, { recursive: true });

// Open and create the SQLite database file
const db = new DatabaseSync(
  path.join(dataFolder, 'studentatlas.db')
);

// Enable foreign key relationships
db.exec('PRAGMA foreign_keys = ON');

// Read the SQL schema
const schema = readFileSync(
  path.join(databaseFolder, 'schema.sql'),
  'utf8'
);

// Create tables if they do not exist
db.exec(schema);

export default db;
