import { useState, useCallback, useEffect, RefObject } from 'react';
import { Panel, ResizingInfo, DraggingInfo, ResizeDirection } from '../../../../shared/types/panelTypes';
import { 
  CONTAINER_WIDTH, 
  CONTAINER_HEIGHT, 
  percentToPixels, 
  pixelsToPercent, 
  findPanelById 
} from '../../../../shared/utils/panelUtils';

interface UsePanelInteractionProps {
  panels: Panel[];
  setPanels: React.Dispatch<React.SetStateAction<Panel[]>>;
  containerRef: RefObject<HTMLDivElement>;
  onPanelChange?: () => void;
}

export const usePanelInteraction = ({
  panels,
  setPanels,
  containerRef,
  onPanelChange
}: UsePanelInteractionProps) => {
  const [resizingInfo, setResizingInfo] = useState<ResizingInfo | null>(null);
  const [draggingInfo, setDraggingInfo] = useState<DraggingInfo | null>(null);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);

  const startResize = useCallback((e: React.MouseEvent, panelId: string, direction: ResizeDirection): void => {
    e.stopPropagation();
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    setResizingInfo({
      panelId,
      direction,
      startX: e.clientX - containerRect.left,
      startY: e.clientY - containerRect.top,
      originalPanels: [...panels]
    });
  }, [panels, containerRef]);

  const startDrag = useCallback((e: React.MouseEvent, panelId: string): void => {
    e.stopPropagation();
    if (e.target instanceof Element &&
        (e.target.classList.contains('handle') || e.target.closest('.panel-controls'))) return;

    const panel = findPanelById(panels, panelId);
    if (!panel || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const pixelDims = percentToPixels(panel);

    setDraggingInfo({
      panelId,
      startX: e.clientX - containerRect.left,
      startY: e.clientY - containerRect.top,
      originalX: pixelDims.x,
      originalY: pixelDims.y,
      originalPanels: [...panels]
    });
  }, [panels, containerRef]);

  const handleResize = useCallback((e: MouseEvent): void => {
    if (!resizingInfo || !containerRef.current) return;

    const { panelId, direction, startX, startY, originalPanels } = resizingInfo;
    const panel = findPanelById(originalPanels, panelId);
    if (!panel) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - containerRect.left;
    const currentY = e.clientY - containerRect.top;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    const pixelDims = percentToPixels(panel);
    let newX = pixelDims.x;
    let newY = pixelDims.y;
    let newWidth = pixelDims.width;
    let newHeight = pixelDims.height;

    // Handle different resize directions
    if (direction.includes('n')) {
      newY = Math.max(0, Math.min(pixelDims.y + pixelDims.height - 20, pixelDims.y + deltaY));
      newHeight = pixelDims.height - (newY - pixelDims.y);
    }
    if (direction.includes('s')) {
      newHeight = Math.max(20, Math.min(CONTAINER_HEIGHT - pixelDims.y, pixelDims.height + deltaY));
    }
    if (direction.includes('w')) {
      newX = Math.max(0, Math.min(pixelDims.x + pixelDims.width - 20, pixelDims.x + deltaX));
      newWidth = pixelDims.width - (newX - pixelDims.x);
    }
    if (direction.includes('e')) {
      newWidth = Math.max(20, Math.min(CONTAINER_WIDTH - pixelDims.x, pixelDims.width + deltaX));
    }

    const newPercentDims = pixelsToPercent(newX, newY, newWidth, newHeight);

    setPanels(prev => {
      if (onPanelChange) {
        onPanelChange();
      }
      
      return prev.map(p =>
        p.id === panelId
          ? {
              ...p,
              x: newPercentDims.x,
              y: newPercentDims.y,
              width: newPercentDims.width,
              height: newPercentDims.height
            }
          : p
      );
    });
  }, [resizingInfo, containerRef, setPanels, onPanelChange]);

  const handleDrag = useCallback((e: MouseEvent): void => {
    if (!draggingInfo || !containerRef.current) return;

    const { panelId, startX, startY, originalX, originalY } = draggingInfo;
    const panel = findPanelById(panels, panelId);
    if (!panel) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - containerRect.left;
    const currentY = e.clientY - containerRect.top;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    const pixelDims = percentToPixels(panel);
    const newX = Math.max(0, Math.min(CONTAINER_WIDTH - pixelDims.width, originalX + deltaX));
    const newY = Math.max(0, Math.min(CONTAINER_HEIGHT - pixelDims.height, originalY + deltaY));

    const newPercentPos = pixelsToPercent(newX, newY, 0, 0);
    setPanels(prev => {
      if (onPanelChange) {
        onPanelChange();
      }
      
      return prev.map(p =>
        p.id === panelId
          ? { ...p, x: newPercentPos.x, y: newPercentPos.y }
          : p
      );
    });
  }, [draggingInfo, panels, containerRef, setPanels, onPanelChange]);

  useEffect(() => {
    if (!resizingInfo && !draggingInfo) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (resizingInfo) {
        handleResize(e);
      }
      if (draggingInfo) {
        handleDrag(e);
      }
    };

    const handleMouseUp = () => {
      setResizingInfo(null);
      setDraggingInfo(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingInfo, draggingInfo, handleResize, handleDrag]);

  return {
    selectedPanelId,
    setSelectedPanelId,
    startResize,
    startDrag
  };
};

export default usePanelInteraction;
