import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import scriptRouter from './routes/script';
import collectionsRouter from './routes/collections';
import layoutsRouter from './routes/layouts';
import { initializeDatabase } from './db/init-db';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 3001;

// Increase timeout for long-running requests
app.use((req, res, next) => {
  res.setTimeout(120000, () => {
    console.log('Request has timed out.');
    res.status(408).send('Request has timed out');
  });
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// Create thumbnail storage directory
const thumbnailStoragePath = process.env.THUMBNAIL_STORAGE_PATH || './storage/thumbnails';
const absoluteThumbnailPath = path.resolve(thumbnailStoragePath);
if (!fs.existsSync(absoluteThumbnailPath)) {
  fs.mkdirSync(absoluteThumbnailPath, { recursive: true });
  console.log(`Created thumbnail storage directory: ${absoluteThumbnailPath}`);
}

// Serve static files from the thumbnail directory
app.use('/thumbnails', express.static(absoluteThumbnailPath));

// Routes
app.use('/api/script', scriptRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/layouts', layoutsRouter);

// Initialize the database
console.log('Checking database status...');
initializeDatabase()
  .then(() => {
    console.log('Database check completed');
    
    // Start the server after database initialization
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log('Note: The database schema uses CREATE TABLE IF NOT EXISTS');
      console.log('Your existing data will be preserved when restarting the server');
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
