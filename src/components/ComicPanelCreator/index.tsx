import React, { useState, useRef, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Panel as PanelComponent } from './Panel';
import { Controls } from './Controls';
import { Panel, ResizingInfo, DraggingInfo, ResizeDirection } from './types';
import { 
  CONTAINER_WIDTH, 
  CONTAINER_HEIGHT, 
  percentToPixels, 
  pixelsToPercent, 
  generatePanelId, 
  findPanelById 
} from './utils';

const ComicPanelCreator: React.FC = () => {
  const [panels, setPanels] = useState<Panel[]>([
    { id: 'panel-1', x: 0, y: 0, width: 100, height: 100 }
  ]);
  const [gutterSize, setGutterSize] = useState(10);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [resizingInfo, setResizingInfo] = useState<ResizingInfo | null>(null);
  const [draggingInfo, setDraggingInfo] = useState<DraggingInfo | null>(null);
  const [showControls, setShowControls] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextPanelId = useRef(2);

  const splitPanelHorizontally = useCallback((panelId: string): void => {
    const panel = findPanelById(panels, panelId);
    if (!panel) return;

    const pixelDims = percentToPixels(panel);
    const halfHeight = pixelDims.height / 2;
    const gapHeight = gutterSize / 2;

    const topPanel = {
      ...panel,
      id: generatePanelId(nextPanelId.current++),
      height: pixelsToPercent(0, 0, 0, halfHeight - gapHeight).height
    };

    const bottomPanel = {
      ...panel,
      id: generatePanelId(nextPanelId.current++),
      y: pixelsToPercent(0, pixelDims.y + halfHeight + gapHeight, 0, 0).y,
      height: pixelsToPercent(0, 0, 0, halfHeight - gapHeight).height
    };

    setPanels(prev => [
      ...prev.filter(p => p.id !== panelId),
      topPanel,
      bottomPanel
    ]);
    setSelectedPanelId(null);
  }, [panels, gutterSize]);

  const splitPanelVertically = useCallback((panelId: string): void => {
    const panel = findPanelById(panels, panelId);
    if (!panel) return;

    const pixelDims = percentToPixels(panel);
    const halfWidth = pixelDims.width / 2;
    const gapWidth = gutterSize / 2;

    const leftPanel = {
      ...panel,
      id: generatePanelId(nextPanelId.current++),
      width: pixelsToPercent(0, 0, halfWidth - gapWidth, 0).width
    };

    const rightPanel = {
      ...panel,
      id: generatePanelId(nextPanelId.current++),
      x: pixelsToPercent(pixelDims.x + halfWidth + gapWidth, 0, 0, 0).x,
      width: pixelsToPercent(0, 0, halfWidth - gapWidth, 0).width
    };

    setPanels(prev => [
      ...prev.filter(p => p.id !== panelId),
      leftPanel,
      rightPanel
    ]);
    setSelectedPanelId(null);
  }, [panels, gutterSize]);

  const deletePanel = useCallback((panelId: string): void => {
    if (panels.length <= 1) return;
    setPanels(prev => prev.filter(p => p.id !== panelId));
    if (selectedPanelId === panelId) {
      setSelectedPanelId(null);
    }
  }, [panels.length, selectedPanelId]);

  const resetPanels = useCallback((): void => {
    setPanels([
      {
        id: 'panel-1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      }
    ]);
    nextPanelId.current = 2;
    setSelectedPanelId(null);
  }, []);

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
  }, [panels]);

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
    setSelectedPanelId(panelId);
  }, [panels]);

  const handleResize = useCallback((e: MouseEvent): void => {
    if (!resizingInfo || !containerRef.current) return;

    const { panelId, direction, startX, startY, originalPanels } = resizingInfo;
    const panel = originalPanels.find(p => p.id === panelId);
    if (!panel) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - containerRect.left;
    const currentY = e.clientY - containerRect.top;

    const pixelDims = percentToPixels(panel);
    let newX = pixelDims.x;
    let newY = pixelDims.y;
    let newWidth = pixelDims.width;
    let newHeight = pixelDims.height;

    if (direction.includes('n')) {
      const deltaY = currentY - startY;
      newY = Math.max(0, Math.min(pixelDims.y + pixelDims.height - 20, pixelDims.y + deltaY));
      newHeight = pixelDims.y + pixelDims.height - newY;
    }
    if (direction.includes('s')) {
      const deltaY = currentY - startY;
      newHeight = Math.max(20, Math.min(CONTAINER_HEIGHT - pixelDims.y, pixelDims.height + deltaY));
    }
    if (direction.includes('w')) {
      const deltaX = currentX - startX;
      newX = Math.max(0, Math.min(pixelDims.x + pixelDims.width - 20, pixelDims.x + deltaX));
      newWidth = pixelDims.x + pixelDims.width - newX;
    }
    if (direction.includes('e')) {
      const deltaX = currentX - startX;
      newWidth = Math.max(20, Math.min(CONTAINER_WIDTH - pixelDims.x, pixelDims.width + deltaX));
    }

    const newPercentDims = pixelsToPercent(newX, newY, newWidth, newHeight);
    setPanels(prev => prev.map(p =>
      p.id === panelId
        ? {
            ...p,
            x: newPercentDims.x,
            y: newPercentDims.y,
            width: newPercentDims.width,
            height: newPercentDims.height
          }
        : p
    ));
  }, [resizingInfo]);

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
    setPanels(prev => prev.map(p =>
      p.id === panelId
        ? { ...p, x: newPercentPos.x, y: newPercentPos.y }
        : p
    ));
  }, [draggingInfo, panels]);

  const exportToPDF = useCallback(async (): Promise<void> => {
    if (!containerRef.current) return;

    // Temporarily hide controls
    setShowControls(false);

    try {
      // Wait for the UI to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create a temporary container with white background
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.backgroundColor = 'white';
      document.body.appendChild(tempContainer);

      // Clone the comic container
      const clone = containerRef.current.cloneNode(true) as HTMLElement;
      clone.style.backgroundColor = 'white';
      tempContainer.appendChild(clone);

      // Use html2canvas to capture the comic container
      const canvas = await html2canvas(clone, {
        backgroundColor: 'white',
        scale: 2, // Higher resolution
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT,
        logging: false,
        removeContainer: true
      });

      // Create PDF with correct aspect ratio
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (CONTAINER_HEIGHT * imgWidth) / CONTAINER_WIDTH;
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
      });

      // Add the canvas image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save('comic-panels.pdf');

      // Clean up
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      // Restore controls
      setShowControls(true);
    }
  }, [containerRef]);

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

  const selectedPanel = panels.find((p: Panel) => p.id === selectedPanelId);

  return (
    <div className="p-4 flex flex-col gap-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Independent Comic Panel Creator (5:7 Ratio)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controls
          gutterSize={gutterSize}
          onGutterSizeChange={setGutterSize}
          showControls={showControls}
          onShowControlsChange={setShowControls}
          onResetPanels={resetPanels}
          onExportPDF={exportToPDF}
          selectedPanel={selectedPanel}
        />

        <div
          ref={containerRef}
          className="relative border border-gray-300 bg-gray-100 overflow-hidden"
          style={{
            width: CONTAINER_WIDTH,
            height: CONTAINER_HEIGHT,
          }}
          onClick={() => setSelectedPanelId(null)}
        >
          {panels.map(panel => (
            <PanelComponent
              key={panel.id}
              panel={panel}
              isSelected={panel.id === selectedPanelId}
              showControls={showControls}
              onSelect={setSelectedPanelId}
              onStartDrag={startDrag}
              onStartResize={startResize}
              onSplitHorizontally={splitPanelHorizontally}
              onSplitVertically={splitPanelVertically}
              onDelete={deletePanel}
              canDelete={panels.length > 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComicPanelCreator;
