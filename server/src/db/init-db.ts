import { pool } from './index';
import fs from 'fs';
import path from 'path';

async function checkTablesExist() {
  const client = await pool.connect();
  try {
    // Check if the collections table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'collections'
      );
    `);
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking if tables exist:', error);
    return false;
  } finally {
    client.release();
  }
}

async function initializeDatabase() {
  // First check if tables already exist
  const tablesExist = await checkTablesExist();
  
  if (tablesExist) {
    console.log('Database tables already exist, skipping initialization');
    return;
  }
  
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

export { initializeDatabase, checkTablesExist };
