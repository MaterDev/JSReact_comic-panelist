import express from 'express';
import * as layoutService from '../services/layoutService';
import path from 'path';
import fs from 'fs';

// Create a router instance
const router = express.Router();

// Define route handler types to avoid TypeScript errors
type RequestHandler = (req: express.Request, res: express.Response, next?: express.NextFunction) => void;

// Get all layouts for a collection
const getLayoutsByCollection: RequestHandler = (req, res) => {
  try {
    const collectionId = parseInt(req.params.collectionId);
    if (isNaN(collectionId)) {
      return res.status(400).json({ error: 'Invalid collection ID' });
    }
    
    layoutService.getLayoutsByCollectionId(collectionId)
      .then(layouts => {
        res.json(layouts);
      })
      .catch(error => {
        console.error('Error fetching layouts:', error);
        res.status(500).json({ error: 'Failed to fetch layouts' });
      });
  } catch (error) {
    console.error('Error fetching layouts:', error);
    res.status(500).json({ error: 'Failed to fetch layouts' });
  }
};

// Get a specific layout by ID
const getLayoutById: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid layout ID' });
    }
    
    layoutService.getLayoutById(id)
      .then(layout => {
        if (!layout) {
          return res.status(404).json({ error: 'Layout not found' });
        }
        res.json(layout);
      })
      .catch(error => {
        console.error('Error fetching layout:', error);
        res.status(500).json({ error: 'Failed to fetch layout' });
      });
  } catch (error) {
    console.error('Error fetching layout:', error);
    res.status(500).json({ error: 'Failed to fetch layout' });
  }
};

// Get a layout thumbnail
const getLayoutThumbnail: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid layout ID' });
    }
    
    layoutService.getLayoutById(id)
      .then(layout => {
        if (!layout || !layout.thumbnail_path) {
          return res.status(404).json({ error: 'Thumbnail not found' });
        }
        
        const absolutePath = path.resolve(layout.thumbnail_path);
        if (!fs.existsSync(absolutePath)) {
          return res.status(404).json({ error: 'Thumbnail file not found' });
        }
        
        res.sendFile(absolutePath);
      })
      .catch(error => {
        console.error('Error fetching thumbnail:', error);
        res.status(500).json({ error: 'Failed to fetch thumbnail' });
      });
  } catch (error) {
    console.error('Error fetching thumbnail:', error);
    res.status(500).json({ error: 'Failed to fetch thumbnail' });
  }
};

// Create a new layout
const createLayout: RequestHandler = (req, res) => {
  try {
    const { 
      collection_id, 
      name, 
      panel_data, 
      page_type, 
      is_full_page, 
      script_data, 
      creative_direction,
      thumbnail_base64
    } = req.body;
    
    if (!collection_id || !name || !panel_data) {
      return res.status(400).json({ error: 'Collection ID, name, and panel data are required' });
    }
    
    layoutService.createLayout(
      { 
        collection_id, 
        name, 
        panel_data, 
        page_type, 
        is_full_page, 
        script_data, 
        creative_direction 
      }, 
      thumbnail_base64
    )
    .then(layoutId => {
      res.status(201).json({ id: layoutId });
    })
    .catch(error => {
      console.error('Error creating layout:', error);
      res.status(500).json({ error: 'Failed to create layout' });
    });
  } catch (error) {
    console.error('Error creating layout:', error);
    res.status(500).json({ error: 'Failed to create layout' });
  }
};

// Update a layout
const updateLayout: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid layout ID' });
    }
    
    const { 
      name, 
      panel_data, 
      is_full_page, 
      script_data, 
      creative_direction,
      thumbnail_base64
    } = req.body;
    
    layoutService.updateLayout(
      id, 
      { name, panel_data, is_full_page, script_data, creative_direction },
      thumbnail_base64
    )
    .then(success => {
      if (!success) {
        return res.status(404).json({ error: 'Layout not found or no changes made' });
      }
      res.json({ success: true });
    })
    .catch(error => {
      console.error('Error updating layout:', error);
      res.status(500).json({ error: 'Failed to update layout', message: error.message });
    });
  } catch (error: any) {
    console.error('Error updating layout:', error);
    res.status(500).json({ error: 'Failed to update layout', message: error.message });
  }
};

// Delete a layout
const deleteLayout: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid layout ID' });
    }
    
    layoutService.deleteLayout(id)
      .then(success => {
        if (!success) {
          return res.status(404).json({ error: 'Layout not found' });
        }
        res.json({ success: true });
      })
      .catch(error => {
        console.error('Error deleting layout:', error);
        res.status(500).json({ error: 'Failed to delete layout', message: error.message });
      });
  } catch (error: any) {
    console.error('Error deleting layout:', error);
    res.status(500).json({ error: 'Failed to delete layout', message: error.message });
  }
};

// Reorder layouts within a collection
const reorderLayouts: RequestHandler = (req, res) => {
  try {
    const { collection_id, layout_orders } = req.body;
    
    if (!collection_id || !layout_orders || !Array.isArray(layout_orders)) {
      return res.status(400).json({ error: 'Collection ID and layout orders array are required' });
    }
    
    layoutService.reorderLayouts(collection_id, layout_orders)
      .then(success => {
        if (!success) {
          return res.status(400).json({ error: 'Failed to reorder layouts' });
        }
        res.json({ success: true });
      })
      .catch(error => {
        console.error('Error reordering layouts:', error);
        res.status(500).json({ error: 'Failed to reorder layouts', message: error.message });
      });
  } catch (error: any) {
    console.error('Error reordering layouts:', error);
    res.status(500).json({ error: 'Failed to reorder layouts', message: error.message });
  }
};



// Register routes
router.get('/collection/:collectionId', getLayoutsByCollection);
router.get('/:id', getLayoutById);
router.get('/:id/thumbnail', getLayoutThumbnail);
router.post('/', createLayout);
router.put('/:id', updateLayout);
router.delete('/:id', deleteLayout);
router.post('/reorder', reorderLayouts);

export default router;
