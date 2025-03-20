import { pool } from '../db';

interface Collection {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

interface CreateCollectionParams {
  name: string;
  description?: string;
}

// Helper function to create a full-page panel
function createFullPagePanel() {
  return {
    panels: [{
      id: 'panel-1',
      x: 10,
      y: 10,
      width: 80,
      height: 80,
      number: 1
    }]
  };
}

/**
 * Create a new collection with automatic front and back covers
 */
export async function createCollection(params: CreateCollectionParams): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create the collection
    const collectionResult = await client.query(
      'INSERT INTO collections(name, description) VALUES($1, $2) RETURNING id',
      [params.name, params.description]
    );
    const collectionId = collectionResult.rows[0].id;
    
    // Create front cover (always display_order = 1)
    await client.query(
      'INSERT INTO layouts(collection_id, name, display_order, page_type, is_full_page, panel_data) VALUES($1, $2, $3, $4, $5, $6)',
      [collectionId, 'Front Cover', 1, 'front_cover', true, JSON.stringify(createFullPagePanel())]
    );
    
    // Create back cover (display_order = 2 initially, will be adjusted as pages are added)
    await client.query(
      'INSERT INTO layouts(collection_id, name, display_order, page_type, is_full_page, panel_data) VALUES($1, $2, $3, $4, $5, $6)',
      [collectionId, 'Back Cover', 2, 'back_cover', true, JSON.stringify(createFullPagePanel())]
    );
    
    await client.query('COMMIT');
    return collectionId;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Get all collections
 */
export async function getCollections(): Promise<Collection[]> {
  const result = await pool.query('SELECT * FROM collections ORDER BY updated_at DESC');
  return result.rows;
}

/**
 * Get a collection by ID
 */
export async function getCollectionById(id: number): Promise<Collection | null> {
  const result = await pool.query('SELECT * FROM collections WHERE id = $1', [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Update a collection
 */
export async function updateCollection(id: number, params: Partial<CreateCollectionParams>): Promise<boolean> {
  const { name, description } = params;
  
  // Build the SET clause dynamically based on provided parameters
  const setClauses = [];
  const values = [];
  let paramIndex = 1;
  
  if (name !== undefined) {
    setClauses.push(`name = $${paramIndex++}`);
    values.push(name);
  }
  
  if (description !== undefined) {
    setClauses.push(`description = $${paramIndex++}`);
    values.push(description);
  }
  
  if (setClauses.length === 0) {
    return false; // Nothing to update
  }
  
  values.push(id);
  
  const result = await pool.query(
    `UPDATE collections SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`,
    values
  );
  
  return result.rowCount !== null && result.rowCount > 0;
}

/**
 * Delete a collection
 */
export async function deleteCollection(id: number): Promise<boolean> {
  // Layouts will be automatically deleted due to CASCADE constraint
  const result = await pool.query('DELETE FROM collections WHERE id = $1', [id]);
  return result.rowCount !== null && result.rowCount > 0;
}
