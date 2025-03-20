import { pool } from '../db';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

interface Layout {
  id: number;
  collection_id: number;
  name: string;
  display_order: number;
  page_type: 'front_cover' | 'back_cover' | 'standard';
  is_full_page: boolean;
  panel_data: any;
  thumbnail_path?: string;
  script_data?: any;
  creative_direction?: any;
  created_at: Date;
  updated_at: Date;
}

interface CreateLayoutParams {
  collection_id: number;
  name: string;
  panel_data: any;
  page_type?: 'standard';
  is_full_page?: boolean;
  script_data?: any;
  creative_direction?: any;
}

interface UpdateLayoutParams {
  name?: string;
  panel_data?: any;
  is_full_page?: boolean;
  script_data?: any;
  creative_direction?: any;
}

/**
 * Save a thumbnail image to the file system
 */
export async function saveThumbnail(
  base64Image: string, 
  collectionId: number, 
  layoutId: number
): Promise<string> {
  // Extract the base64 data
  const matches = base64Image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image string');
  }
  
  const imageType = matches[1];
  const imageData = matches[2];
  const buffer = Buffer.from(imageData, 'base64');
  
  // Create a unique filename
  const hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
  const filename = `${collectionId}_${layoutId}_${hash}.${imageType === 'jpeg' ? 'jpg' : imageType}`;
  
  // Get the storage path
  const thumbnailStoragePath = process.env.THUMBNAIL_STORAGE_PATH || './storage/thumbnails';
  const absoluteThumbnailPath = path.resolve(thumbnailStoragePath);
  
  // Ensure the directory exists
  if (!fs.existsSync(absoluteThumbnailPath)) {
    fs.mkdirSync(absoluteThumbnailPath, { recursive: true });
  }
  
  // Write the file
  const filePath = path.join(absoluteThumbnailPath, filename);
  fs.writeFileSync(filePath, buffer);
  
  // Return the relative path to store in the database
  return path.join(thumbnailStoragePath, filename);
}

/**
 * Reset display order for all layouts in a collection
 * This ensures that pages are numbered sequentially without gaps
 */
export async function resetDisplayOrder(collectionId: number, client: any): Promise<void> {
  // Reorder the layouts to ensure sequential ordering
  await client.query(
    `UPDATE layouts 
     SET display_order = subquery.new_order 
     FROM (
       SELECT id, ROW_NUMBER() OVER (ORDER BY 
         CASE WHEN page_type = 'front_cover' THEN 1
              WHEN page_type = 'back_cover' THEN 999999
              ELSE display_order END
       ) as new_order
       FROM layouts
       WHERE collection_id = $1
     ) as subquery
     WHERE layouts.id = subquery.id`,
    [collectionId]
  );
}

/**
 * Add a new layout to a collection
 */
export async function createLayout(params: CreateLayoutParams, thumbnailBase64?: string): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Get the current max display_order
    const orderResult = await client.query(
      'SELECT MAX(display_order) as max_order FROM layouts WHERE collection_id = $1',
      [params.collection_id]
    );
    let maxOrder = orderResult.rows[0].max_order || 0;
    
    // Get the back cover
    const backCoverResult = await client.query(
      'SELECT id, display_order FROM layouts WHERE collection_id = $1 AND page_type = $2',
      [params.collection_id, 'back_cover']
    );
    
    // If there's a back cover, we need to insert before it
    if (backCoverResult.rows.length > 0) {
      const backCoverOrder = backCoverResult.rows[0].display_order;
      
      // Update the back cover's order
      await client.query(
        'UPDATE layouts SET display_order = $1 WHERE id = $2',
        [maxOrder + 2, backCoverResult.rows[0].id]
      );
      
      // New layout goes before the back cover
      maxOrder = backCoverOrder;
    } else {
      // No back cover found (shouldn't happen), so just increment
      maxOrder++;
    }
    
    // Insert the new layout
    const layoutResult = await client.query(
      `INSERT INTO layouts(
        collection_id, name, display_order, page_type, is_full_page, panel_data, script_data, creative_direction
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        params.collection_id,
        params.name,
        maxOrder,
        params.page_type || 'standard',
        params.is_full_page || false,
        JSON.stringify(params.panel_data),
        params.script_data ? JSON.stringify(params.script_data) : null,
        params.creative_direction ? JSON.stringify(params.creative_direction) : null
      ]
    );
    
    const layoutId = layoutResult.rows[0].id;
    
    // Save thumbnail if provided
    if (thumbnailBase64) {
      const thumbnailPath = await saveThumbnail(thumbnailBase64, params.collection_id, layoutId);
      
      // Update the layout with the thumbnail path
      await client.query(
        'UPDATE layouts SET thumbnail_path = $1 WHERE id = $2',
        [thumbnailPath, layoutId]
      );
    }
    
    // Reset display order for all layouts in the collection
    await resetDisplayOrder(params.collection_id, client);
    
    await client.query('COMMIT');
    return layoutId;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Get all layouts for a collection
 */
export async function getLayoutsByCollectionId(collectionId: number): Promise<Layout[]> {
  const result = await pool.query(
    'SELECT * FROM layouts WHERE collection_id = $1 ORDER BY display_order',
    [collectionId]
  );
  return result.rows;
}

/**
 * Get a layout by ID
 */
export async function getLayoutById(id: number): Promise<Layout | null> {
  const result = await pool.query('SELECT * FROM layouts WHERE id = $1', [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Update a layout
 */
export async function updateLayout(
  id: number, 
  params: UpdateLayoutParams, 
  thumbnailBase64?: string
): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Get the current layout to check if it's a cover
    const layoutResult = await client.query(
      'SELECT page_type, collection_id FROM layouts WHERE id = $1',
      [id]
    );
    
    if (layoutResult.rows.length === 0) {
      return false; // Layout not found
    }
    
    const layout = layoutResult.rows[0];
    
    // Build the SET clause dynamically based on provided parameters
    const setClauses = [];
    const values = [];
    let paramIndex = 1;
    
    if (params.name !== undefined) {
      setClauses.push(`name = $${paramIndex++}`);
      values.push(params.name);
    }
    
    if (params.panel_data !== undefined) {
      setClauses.push(`panel_data = $${paramIndex++}`);
      values.push(JSON.stringify(params.panel_data));
    }
    
    if (params.is_full_page !== undefined) {
      setClauses.push(`is_full_page = $${paramIndex++}`);
      values.push(params.is_full_page);
    }
    
    if (params.script_data !== undefined) {
      setClauses.push(`script_data = $${paramIndex++}`);
      values.push(JSON.stringify(params.script_data));
    }
    
    if (params.creative_direction !== undefined) {
      setClauses.push(`creative_direction = $${paramIndex++}`);
      values.push(JSON.stringify(params.creative_direction));
    }
    
    // Save thumbnail if provided
    if (thumbnailBase64) {
      const thumbnailPath = await saveThumbnail(thumbnailBase64, layout.collection_id, id);
      setClauses.push(`thumbnail_path = $${paramIndex++}`);
      values.push(thumbnailPath);
    }
    
    if (setClauses.length === 0) {
      return false; // Nothing to update
    }
    
    values.push(id);
    
    const updateResult = await client.query(
      `UPDATE layouts SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`,
      values
    );
    
    await client.query('COMMIT');
    return updateResult.rowCount !== null && updateResult.rowCount > 0;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Delete a layout
 */
export async function deleteLayout(id: number): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Get the layout to check if it's a cover
    const layoutResult = await client.query(
      'SELECT page_type, collection_id, thumbnail_path FROM layouts WHERE id = $1',
      [id]
    );
    
    if (layoutResult.rows.length === 0) {
      return false; // Layout not found
    }
    
    const layout = layoutResult.rows[0];
    
    // Don't allow deletion of covers
    if (layout.page_type === 'front_cover' || layout.page_type === 'back_cover') {
      throw new Error(`Cannot delete ${layout.page_type}. You can only update it.`);
    }
    
    // Delete the layout
    const deleteResult = await client.query('DELETE FROM layouts WHERE id = $1', [id]);
    
    if (deleteResult.rowCount === null || deleteResult.rowCount === 0) {
      return false;
    }
    
    // Delete the thumbnail file if it exists
    if (layout.thumbnail_path) {
      const absolutePath = path.resolve(layout.thumbnail_path);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }
    
    // Reset display order for all layouts in the collection
    await resetDisplayOrder(layout.collection_id, client);
    
    await client.query('COMMIT');
    return true;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Reorder layouts within a collection
 */
export async function reorderLayouts(
  collectionId: number, 
  layoutOrders: { id: number; order: number }[]
): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Get all layouts for this collection
    const layoutsResult = await client.query(
      'SELECT id, page_type FROM layouts WHERE collection_id = $1',
      [collectionId]
    );
    
    const layouts = layoutsResult.rows;
    const frontCover = layouts.find(l => l.page_type === 'front_cover');
    const backCover = layouts.find(l => l.page_type === 'back_cover');
    
    if (!frontCover || !backCover) {
      throw new Error('Collection is missing front or back cover');
    }
    
    // Validate the reordering
    const frontCoverOrder = layoutOrders.find(l => l.id === frontCover.id)?.order;
    const backCoverOrder = layoutOrders.find(l => l.id === backCover.id)?.order;
    
    if (frontCoverOrder !== 1) {
      throw new Error('Front cover must remain as the first page');
    }
    
    if (backCoverOrder !== layoutOrders.length) {
      throw new Error('Back cover must remain as the last page');
    }
    
    // Apply the reordering
    for (const layout of layoutOrders) {
      await client.query(
        'UPDATE layouts SET display_order = $1 WHERE id = $2 AND collection_id = $3',
        [layout.order, layout.id, collectionId]
      );
    }
    
    await client.query('COMMIT');
    return true;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
