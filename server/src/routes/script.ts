import { Router } from 'express';
import { generateScript, CreativeDirection } from '../services/scriptService';
import { PanelLayout } from '@shared/types/comic';

const router = Router();

router.post('/generate-script', async (req, res) => {
  try {
    const { layout, apiKey, layoutImage, creativeDirection } = req.body as { 
      layout: PanelLayout; 
      apiKey?: string; 
      layoutImage?: string;
      creativeDirection?: CreativeDirection;
    };
    
    if (!layout || !Array.isArray(layout.panels)) {
      res.status(400).json({ error: 'Invalid panel layout provided' });
      return;
    }

    const script = await generateScript(layout, apiKey, layoutImage, creativeDirection);
    res.json(script);
  } catch (error) {
    console.error('Error generating script:', error);
    res.status(500).json({ error: 'Failed to generate script' });
  }
});

export default router;
