import express from 'express';
import * as collectionService from '../services/collectionService';

// Create a router instance
const router = express.Router();

// Define route handler types to avoid TypeScript errors
type RequestHandler = (req: express.Request, res: express.Response, next?: express.NextFunction) => void;

// Get all collections
const getAllCollections: RequestHandler = (req, res) => {
  try {
    collectionService.getCollections()
      .then(collections => {
        res.json(collections);
      })
      .catch(error => {
        console.error('Error fetching collections:', error);
        res.status(500).json({ error: 'Failed to fetch collections' });
      });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
};

// Get a specific collection by ID
const getCollectionById: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid collection ID' });
    }
    
    collectionService.getCollectionById(id)
      .then(collection => {
        if (!collection) {
          return res.status(404).json({ error: 'Collection not found' });
        }
        res.json(collection);
      })
      .catch(error => {
        console.error('Error fetching collection:', error);
        res.status(500).json({ error: 'Failed to fetch collection' });
      });
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
};

// Create a new collection
const createCollection: RequestHandler = (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Collection name is required' });
    }
    
    collectionService.createCollection({ name, description })
      .then(collectionId => {
        res.status(201).json({ id: collectionId });
      })
      .catch(error => {
        console.error('Error creating collection:', error);
        res.status(500).json({ error: 'Failed to create collection' });
      });
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
};

// Update a collection
const updateCollection: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid collection ID' });
    }
    
    const { name, description } = req.body;
    
    collectionService.updateCollection(id, { name, description })
      .then(success => {
        if (!success) {
          return res.status(404).json({ error: 'Collection not found or no changes made' });
        }
        res.json({ success: true });
      })
      .catch(error => {
        console.error('Error updating collection:', error);
        res.status(500).json({ error: 'Failed to update collection' });
      });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Failed to update collection' });
  }
};

// Delete a collection
const deleteCollection: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid collection ID' });
    }
    
    collectionService.deleteCollection(id)
      .then(success => {
        if (!success) {
          return res.status(404).json({ error: 'Collection not found' });
        }
        res.json({ success: true });
      })
      .catch(error => {
        console.error('Error deleting collection:', error);
        res.status(500).json({ error: 'Failed to delete collection' });
      });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Failed to delete collection' });
  }
};

// Register routes
router.get('/', getAllCollections);
router.get('/:id', getCollectionById);
router.post('/', createCollection);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);

export default router;
