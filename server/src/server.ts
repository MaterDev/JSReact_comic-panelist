import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scriptRouter from './routes/script';

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
app.use(express.json());

// Routes
app.use('/api', scriptRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
