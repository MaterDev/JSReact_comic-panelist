import { Panel } from './types';

export const CONTAINER_WIDTH = 600;
export const ASPECT_RATIO = 5/7.5;
export const CONTAINER_HEIGHT = CONTAINER_WIDTH / ASPECT_RATIO;

export const percentToPixels = (panel: Panel) => ({
  x: (panel.x / 100) * CONTAINER_WIDTH,
  y: (panel.y / 100) * CONTAINER_HEIGHT,
  width: (panel.width / 100) * CONTAINER_WIDTH,
  height: (panel.height / 100) * CONTAINER_HEIGHT,
});

export const pixelsToPercent = (x: number, y: number, width: number, height: number) => ({
  x: (x / CONTAINER_WIDTH) * 100,
  y: (y / CONTAINER_HEIGHT) * 100,
  width: (width / CONTAINER_WIDTH) * 100,
  height: (height / CONTAINER_HEIGHT) * 100,
});

export const generatePanelId = (nextId: number) => `panel-${nextId}`;

export const findPanelById = (panels: Panel[], id: string) => 
  panels.find(panel => panel.id === id);
