import { pool } from './index';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log('Initializing database schema...');
    
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema SQL
    await client.query(schemaSql);
    
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('Database initialization failed:', err);
      process.exit(1);
    });
}

export { initializeDatabase };
