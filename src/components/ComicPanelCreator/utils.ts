import { Panel } from './types';

// Bleed size (full container): 5.25" × 7.75"
export const CONTAINER_WIDTH = 600;
export const ASPECT_RATIO = 5.25/7.75;
export const CONTAINER_HEIGHT = CONTAINER_WIDTH / ASPECT_RATIO;

// Trim size: 5" × 7.5" (0.125" less on each side)
export const TRIM_RATIO = 5/7.5;
// Calculate trim dimensions as percentages of container
export const TRIM_INSET_PERCENT = (0.125 / 5.25) * 100; // 0.125" as percentage of width
export const TRIM_WIDTH_PERCENT = 100 - (TRIM_INSET_PERCENT * 2);
export const TRIM_HEIGHT_PERCENT = (7.5 / 7.75) * 100;

// Margin measurements as percentages of container
export const INNER_MARGIN_PERCENT = (0.75 / 5.25) * 100; // 0.75" inner margin
export const OUTER_MARGIN_PERCENT = (0.5 / 5.25) * 100; // 0.5" outer margin
export const TOP_MARGIN_PERCENT = (0.5 / 7.75) * 100; // 0.5" top margin
export const BOTTOM_MARGIN_PERCENT = (0.5 / 7.75) * 100; // 0.5" bottom margin

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
