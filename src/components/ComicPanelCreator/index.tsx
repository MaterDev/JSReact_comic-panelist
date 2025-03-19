import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ScriptModal } from './ScriptModal';
import { ComicPage, PanelLayout } from './scriptTypes';
import { generateScript, validateComicPage } from './scriptService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Panel as PanelComponent } from './Panel';
import { Controls, ExportFormat } from './Controls';
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
    { id: 'panel-1', x: 0, y: 0, width: 100, height: 100, number: 1 }
  ]);
  const [gutterSize, setGutterSize] = useState(10);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [resizingInfo, setResizingInfo] = useState<ResizingInfo | null>(null);
  const [draggingInfo, setDraggingInfo] = useState<DraggingInfo | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [generatedScript, setGeneratedScript] = useState<ComicPage | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextPanelId = useRef(2);

  // Helper function to update panel numbers
  const updatePanelNumbers = useCallback((updatedPanels: Panel[]): Panel[] => {
    // Sort panels by position (top to bottom, left to right)
    const sortedPanels = [...updatedPanels].sort((a, b) => {
      const aPixels = percentToPixels(a);
      const bPixels = percentToPixels(b);
      // First sort by y (top to bottom)
      if (Math.abs(aPixels.y - bPixels.y) > 20) { // Use a threshold to group panels in roughly the same row
        return aPixels.y - bPixels.y;
      }
      // If y is similar, sort by x (left to right)
      return aPixels.x - bPixels.x;
    });

    // Assign numbers sequentially
    return sortedPanels.map((panel, index) => ({
      ...panel,
      number: index + 1
    }));
  }, []);

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

    setPanels(prev => {
      const updatedPanels = [
        ...prev.filter(p => p.id !== panelId),
        topPanel,
        bottomPanel
      ];
      return updatePanelNumbers(updatedPanels);
    });
    setSelectedPanelId(null);
  }, [panels, gutterSize, updatePanelNumbers]);

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

    setPanels(prev => {
      const updatedPanels = [
        ...prev.filter(p => p.id !== panelId),
        leftPanel,
        rightPanel
      ];
      return updatePanelNumbers(updatedPanels);
    });
    setSelectedPanelId(null);
  }, [panels, gutterSize, updatePanelNumbers]);

  const deletePanel = useCallback((panelId: string): void => {
    if (panels.length <= 1) return;
    setPanels(prev => {
      const filteredPanels = prev.filter(p => p.id !== panelId);
      return updatePanelNumbers(filteredPanels);
    });
    if (selectedPanelId === panelId) {
      setSelectedPanelId(null);
    }
  }, [panels.length, selectedPanelId, updatePanelNumbers]);

  const resetPanels = useCallback((): void => {
    setPanels([
      {
        id: 'panel-1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        number: 1
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

  const generatePanelScript = useCallback(async (): Promise<void> => {
    try {
      setIsGeneratingScript(true);
      
      // Convert current panels to layout format
      const layout: PanelLayout = {
        panels: panels.map(panel => ({
          id: panel.id,
          x: panel.x,
          y: panel.y,
          width: panel.width,
          height: panel.height
        }))
      };

      // Generate script using AI with optional API key
      const script = await generateScript(layout, apiKey || undefined);

      // Validate the response
      if (!validateComicPage(script)) {
        throw new Error('Generated script does not match expected format');
      }

      setGeneratedScript(script);
    } catch (error) {
      console.error('Error generating script:', error);
      // TODO: Add proper error handling UI
    } finally {
      setIsGeneratingScript(false);
    }
  }, [panels, apiKey]);

  const exportComic = useCallback(async (format: ExportFormat): Promise<void> => {
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
      // Set explicit dimensions and reset any potential margins/borders
      tempContainer.style.margin = '0';
      tempContainer.style.padding = '0';
      tempContainer.style.border = 'none';
      document.body.appendChild(tempContainer);

      // Clone the comic container
      const clone = containerRef.current.cloneNode(true) as HTMLElement;
      clone.style.backgroundColor = 'white';
      clone.style.overflow = 'visible';
      clone.style.position = 'relative';
      clone.style.width = `${CONTAINER_WIDTH}px`;
      clone.style.height = `${CONTAINER_HEIGHT}px`;
      // Reset all margins, borders, and padding that might affect positioning
      clone.style.margin = '0';
      clone.style.padding = '0';
      clone.style.border = 'none';
      tempContainer.appendChild(clone);
      
      // Hide panel numbers in the clone for export
      const panelNumbers = clone.querySelectorAll('.panel-number');
      panelNumbers.forEach((element) => {
        (element as HTMLElement).style.display = 'none';
      });

      // Use html2canvas to capture the comic container
      const canvas = await html2canvas(clone, {
        backgroundColor: 'white',
        scale: 2, // Higher resolution
        width: CONTAINER_WIDTH, // Exact width, no padding
        height: CONTAINER_HEIGHT, // Exact height, no padding
        logging: false,
        removeContainer: true,
        // Ensure we capture from the exact edge
        x: 0,
        y: 0,
        // Ensure the full content is captured
        windowWidth: CONTAINER_WIDTH,
        windowHeight: CONTAINER_HEIGHT
      });

      // Get image data from canvas
      const imgData = canvas.toDataURL('image/png');
      
      if (format === 'pdf') {
        // Create PDF with correct aspect ratio
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (CONTAINER_HEIGHT * imgWidth) / CONTAINER_WIDTH;
        const pdf = new jsPDF({
          orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
          unit: 'mm',
        });

        // Add the canvas image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Save the PDF
        pdf.save('comic-panels.pdf');
      } else if (format === 'png') {
        // For PNG export, create a download link
        const link = document.createElement('a');
        link.download = 'comic-panels.png';
        link.href = imgData;
        link.click();
      }

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
    <div className="p-4 flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Control Panel */}
        <div className="md:w-1/3 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Comic Panel Creator</h1>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Script Controls</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={generatePanelScript}
                disabled={isGeneratingScript}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 w-full"
              >
                {isGeneratingScript ? 'Generating...' : 'Generate Script'}
              </button>
              {generatedScript && (
                <button
                  onClick={() => setShowScriptModal(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                >
                  View Script
                </button>
              )}
              <form className="relative w-full" onSubmit={(e) => e.preventDefault()}>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Anthropic API Key (optional)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  name="apiKey"
                  autoComplete="current-password"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1"
                  type="button"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </form>
            </div>
          </div>

          <Controls
            gutterSize={gutterSize}
            onGutterSizeChange={setGutterSize}
            showControls={showControls}
            onShowControlsChange={setShowControls}
            onResetPanels={resetPanels}
            onExport={exportComic}
            exportFormat={exportFormat}
            onExportFormatChange={setExportFormat}
            selectedPanel={selectedPanel}
          />
        </div>

        {/* Right side - Comic Page */}
        <div className="md:w-2/3 flex justify-center items-start">
          <div
            ref={containerRef}
            className="relative border border-gray-300 bg-gray-100 shadow-md"
            style={{
              width: CONTAINER_WIDTH,
              height: CONTAINER_HEIGHT,
              overflow: 'visible',
              position: 'relative'
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

      {showScriptModal && generatedScript && (
        <ScriptModal
          script={generatedScript}
          onClose={() => setShowScriptModal(false)}
        />
      )}
    </div>
  );
};

export default ComicPanelCreator;
