import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config();

// Create the pool instance
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || '5432'),
});

// Test the connection
pool.query('SELECT NOW()', (err: Error | null, res: any) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('Connected to PostgreSQL database');
  }
});

// Ensure the thumbnail storage directory exists
const thumbnailStoragePath = process.env.THUMBNAIL_STORAGE_PATH || './storage/thumbnails';
const absoluteThumbnailPath = path.resolve(thumbnailStoragePath);

if (!fs.existsSync(absoluteThumbnailPath)) {
  fs.mkdirSync(absoluteThumbnailPath, { recursive: true });
  console.log(`Created thumbnail storage directory: ${absoluteThumbnailPath}`);
}

export { pool };
