export interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  number?: number; // Panel number for display
}

export interface ResizingInfo {
  panelId: string;
  direction: string;
  startX: number;
  startY: number;
  originalPanels: Panel[];
}

export interface DraggingInfo {
  panelId: string;
  startX: number;
  startY: number;
  originalX: number;
  originalY: number;
  originalPanels: Panel[];
}

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
