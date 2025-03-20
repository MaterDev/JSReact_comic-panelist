import { Pool } from 'pg';

async function migrateDatabase() {
  // Create a pool with explicit connection parameters
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'comic-panelist',
    password: 'postgres',
    port: 5432,
  });
  
  const client = await pool.connect();
  try {
    console.log('Starting database migration...');
    console.log('Connected to PostgreSQL database');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Directly drop the columns with IF EXISTS to handle cases where they might not exist
    console.log('Removing unused columns from layouts table...');
    
    await client.query('ALTER TABLE layouts DROP COLUMN IF EXISTS is_full_page;');
    console.log('Dropped column: is_full_page');
    
    await client.query('ALTER TABLE layouts DROP COLUMN IF EXISTS thumbnail_path;');
    console.log('Dropped column: thumbnail_path');
    
    await client.query('ALTER TABLE layouts DROP COLUMN IF EXISTS creative_direction;');
    console.log('Dropped column: creative_direction');
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('Database migration completed successfully');
    
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error during database migration:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  migrateDatabase()
    .then(() => {
      console.log('Database migration complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('Database migration failed:', err);
      process.exit(1);
    });
}

export { migrateDatabase };
