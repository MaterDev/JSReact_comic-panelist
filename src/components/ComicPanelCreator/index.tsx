import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ScriptModal } from './ScriptModal';
import { PanelScriptModal } from './PanelScriptModal';
import { PreviewModal } from './PreviewModal';
import { InstructionsModal } from './InstructionsModal';
import { ComicPage, PanelLayout, Panel as ScriptPanel } from './scriptTypes';
import { generateScript, validateComicPage } from './scriptService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Panel as PanelComponent } from './Panel';
import { Controls, ExportFormat } from './Controls';
import { GuideLines } from './GuideLines';
import { Panel, ResizingInfo, DraggingInfo, ResizeDirection } from './types';
import { 
  CONTAINER_WIDTH, 
  CONTAINER_HEIGHT, 
  TRIM_INSET_PERCENT,
  TRIM_WIDTH_PERCENT,
  TRIM_HEIGHT_PERCENT,
  percentToPixels, 
  pixelsToPercent, 
  generatePanelId, 
  findPanelById 
} from './utils';

// Import the CollectionManager component
import CollectionManager from '../CollectionManager';

const ComicPanelCreator: React.FC = () => {
  const [panels, setPanels] = useState<Panel[]>([
    { 
      id: 'panel-1', 
      x: TRIM_INSET_PERCENT, 
      y: (100 - TRIM_HEIGHT_PERCENT) / 2, 
      width: TRIM_WIDTH_PERCENT, 
      height: TRIM_HEIGHT_PERCENT, 
      number: 1 
    }
  ]);
  const [gutterSize, setGutterSize] = useState(10);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [resizingInfo, setResizingInfo] = useState<ResizingInfo | null>(null);
  const [draggingInfo, setDraggingInfo] = useState<DraggingInfo | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [generatedScript, setGeneratedScript] = useState<ComicPage | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [selectedScriptPanel, setSelectedScriptPanel] = useState<ScriptPanel | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Creative direction states
  const [genre, setGenre] = useState('');
  const [emotion, setEmotion] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [inspirationText, setInspirationText] = useState('');
  const [exclusions, setExclusions] = useState('');
  const [showCreativeInputs, setShowCreativeInputs] = useState(false);

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
        x: TRIM_INSET_PERCENT,
        y: (100 - TRIM_HEIGHT_PERCENT) / 2,
        width: TRIM_WIDTH_PERCENT,
        height: TRIM_HEIGHT_PERCENT,
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

  const generatePreviewImage = useCallback(async (): Promise<string> => {
    // Check if container reference exists
    if (!containerRef.current) {
      throw new Error('Comic container reference is not available');
    }
    
    // Create a temporary container with white background for capturing
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.backgroundColor = 'white';
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
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.border = 'none';
    tempContainer.appendChild(clone);
    
    // Make sure panel numbers are visible in the clone and set to black
    const panelNumbers = clone.querySelectorAll('.panel-number');
    panelNumbers.forEach((element) => {
      (element as HTMLElement).style.display = 'block';
      (element as HTMLElement).style.fontSize = '24px';
      (element as HTMLElement).style.fontWeight = 'bold';
      (element as HTMLElement).style.color = '#000000';
    });
    
    // Make panel outlines black
    const panels = clone.querySelectorAll('.panel');
    panels.forEach((element) => {
      (element as HTMLElement).style.border = '2px solid #000000';
    });
    
    // Hide panel controls in the preview
    const panelControls = clone.querySelectorAll('.panel-controls');
    panelControls.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Hide resize handles in the preview
    const resizeHandles = clone.querySelectorAll('.resize-handle');
    resizeHandles.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Hide guidelines in the screenshot
    const guideLines = clone.querySelectorAll('[data-guide-element="true"]');
    guideLines.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Use html2canvas to capture the comic container
    const canvas = await html2canvas(clone, {
      backgroundColor: 'white',
      scale: 2, // Higher resolution
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
      logging: false,
      removeContainer: true,
      x: 0,
      y: 0,
      windowWidth: CONTAINER_WIDTH,
      windowHeight: CONTAINER_HEIGHT
    });
    
    // Get image data as base64 string
    const layoutImageBase64 = canvas.toDataURL('image/png');
    
    // Clean up the temporary container
    document.body.removeChild(tempContainer);
    
    return layoutImageBase64;
  }, [containerRef]);

  const handlePreviewClick = useCallback(async () => {
    try {
      const previewImageData = await generatePreviewImage();
      setPreviewImage(previewImageData);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  }, [generatePreviewImage]);

  const generatePanelScript = useCallback(async (): Promise<void> => {
    try {
      setIsGeneratingScript(true);
      
      // Generate the preview image
      const layoutImageBase64 = await generatePreviewImage();
      
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

      // Create creative direction object with non-empty values
      const creativeDirection = {
        ...(genre && { genre }),
        ...(emotion && { emotion }),
        ...(inspiration && { inspiration }),
        ...(inspirationText && { inspirationText }),
        ...(exclusions && { exclusions })
      };
      
      // Generate script using AI with optional API key, layout image, and creative direction
      const script = await generateScript(
        layout, 
        apiKey || undefined, 
        layoutImageBase64,
        Object.keys(creativeDirection).length > 0 ? creativeDirection : undefined
      );

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
  }, [panels, apiKey, genre, emotion, inspiration, inspirationText, exclusions, generatePreviewImage]);

  const exportComic = useCallback(async (format: ExportFormat): Promise<void> => {
    if (!containerRef.current) return;

    // Temporarily hide controls but keep guidelines
    setShowControls(false);
    // We'll keep the guidelines but modify their color in the clone

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
      
      // Hide panel numbers and guidelines in the clone for export
      const panelNumbers = clone.querySelectorAll('.panel-number');
      panelNumbers.forEach((element) => {
        (element as HTMLElement).style.display = 'none';
      });
      
      // Convert guidelines to non-photo blue for the export
      const guideLines = clone.querySelectorAll('[data-guide-element="true"]');
      guideLines.forEach((element) => {
        (element as HTMLElement).style.border = '1px dashed #A4DDED'; // Non-photo blue color
        (element as HTMLElement).style.opacity = '1';
      });
      
      // Hide guideline labels in the export
      const guideLabels = clone.querySelectorAll('[data-guide-element="true"] div');
      guideLabels.forEach((element) => {
        (element as HTMLElement).style.display = 'none';
      });
      
      // Add black borders to all panels
      const panelElements = clone.querySelectorAll('.panel');
      panelElements.forEach((element) => {
        (element as HTMLElement).style.border = '1px solid #000000';
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

  // Function to handle viewing script for a specific panel
  const handleViewPanelScript = useCallback((panelId: string) => {
    if (!generatedScript) return;
    
    // Find the panel number from the canvas panel id
    const canvasPanel = panels.find(p => p.id === panelId);
    if (!canvasPanel || canvasPanel.number === undefined) return;
    
    // Find the corresponding script panel by matching position
    const scriptPanel = generatedScript.panels.find(p => p.id === canvasPanel.number);
    if (scriptPanel) {
      setSelectedScriptPanel(scriptPanel);
    }
  }, [generatedScript, panels]);

  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="flex flex-col h-screen text-gray-900 dark:text-gray-100">
      <div className="p-4 border-b border-gray-200 dark:border-dark-600 flex items-center">
        <h1 className="text-2xl font-bold">Comic Panel Creator</h1>
        <button
          onClick={() => setShowInstructions(true)}
          className="ml-4 px-3 py-1 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded flex items-center justify-center text-sm"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Instructions
        </button>
        {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Column 1 - Control Panel - Fixed to left side */}
        <div className="flex flex-col gap-4 w-72 p-3 overflow-y-auto border-r border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800">
          <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600 shadow-sm">
            <h2 className="text-base font-semibold mb-2">Script Controls</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <button
                  onClick={generatePanelScript}
                  disabled={isGeneratingScript}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-dark-500 text-sm"
                >
                  {isGeneratingScript ? 'Generating...' : 'Generate Script'}
                </button>
                <button
                  onClick={handlePreviewClick}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded flex items-center justify-center text-sm"
                  title="Preview the panel layout image that will be sent to the AI"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Preview
                </button>
              </div>
              {generatedScript && (
                <button
                  onClick={() => setShowScriptModal(true)}
                  className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 w-full text-sm"
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
                  className="w-full px-3 py-2 border rounded-md text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-gray-100 dark:placeholder-gray-400"
                  name="apiKey"
                  autoComplete="current-password"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 dark:text-gray-300"
                  type="button"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </form>
              
              <div className="mt-4">
                <button
                  onClick={() => setShowCreativeInputs(!showCreativeInputs)}
                  className="flex items-center justify-between w-full px-4 py-2 bg-gray-200 dark:bg-dark-600 rounded-md text-sm font-medium"
                  aria-expanded={showCreativeInputs}
                  aria-controls="creative-inputs-panel"
                >
                  <span>Creative Direction {showCreativeInputs ? '(Hide)' : '(Show)'}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showCreativeInputs ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <div 
                  id="creative-inputs-panel"
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${showCreativeInputs ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="mt-3 space-y-3 p-3 bg-gray-100 dark:bg-dark-700 rounded-md">
                    <div>
                      <label htmlFor="genre" className="block text-xs font-medium mb-1 dark:text-gray-300">Genre</label>
                      <input
                        id="genre"
                        type="text"
                        placeholder="e.g., Sci-fi, Fantasy, Noir"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="emotion" className="block text-xs font-medium mb-1 dark:text-gray-300">Emotional Tone</label>
                      <input
                        id="emotion"
                        type="text"
                        placeholder="e.g., Suspenseful, Humorous, Melancholic"
                        value={emotion}
                        onChange={(e) => setEmotion(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="inspiration" className="block text-xs font-medium mb-1 dark:text-gray-300">Inspiration</label>
                      <input
                        id="inspiration"
                        type="text"
                        placeholder="e.g., Film noir, Miyazaki, Cyberpunk"
                        value={inspiration}
                        onChange={(e) => setInspiration(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="inspirationText" className="block text-xs font-medium mb-1 dark:text-gray-300">Inspiration Text</label>
                      <textarea
                        id="inspirationText"
                        placeholder="Enter a longer description or excerpt"
                        value={inspirationText}
                        onChange={(e) => setInspirationText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="exclusions" className="block text-xs font-medium mb-1 dark:text-gray-300">Exclusions</label>
                      <input
                        id="exclusions"
                        type="text"
                        placeholder="e.g., Violence, Romance, Politics"
                        value={exclusions}
                        onChange={(e) => setExclusions(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Controls
            gutterSize={gutterSize}
            onGutterSizeChange={setGutterSize}
            showControls={showControls}
            onShowControlsChange={setShowControls}
            showGuides={showGuides}
            onShowGuidesChange={setShowGuides}
            onResetPanels={resetPanels}
            onExport={exportComic}
            exportFormat={exportFormat}
            onExportFormatChange={setExportFormat}
            selectedPanel={selectedPanel}
          />
        </div>

        {/* Column 2 - Comic Page - Center with most space */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-auto p-4">
          <div
            ref={containerRef}
            className="relative border border-gray-300 bg-white shadow-md"
            style={{
              width: CONTAINER_WIDTH,
              height: CONTAINER_HEIGHT,
              overflow: 'visible',
              position: 'relative',
              maxWidth: '100%'
            }}
            onClick={() => setSelectedPanelId(null)}
          >
            <GuideLines showGuides={showGuides} />
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
                hasScript={!!generatedScript}
                onViewScript={handleViewPanelScript}
              />
            ))}
          </div>
        </div>
        
        {/* Column 3 - Collection Management - Fixed to right side */}
        <div className="flex flex-col gap-4 w-96 p-3 overflow-y-auto border-l border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800">
          <CollectionManager />
        </div>
      </div>

      {showScriptModal && generatedScript && (
        <ScriptModal
          script={generatedScript}
          onClose={() => setShowScriptModal(false)}
        />
      )}
      
      {selectedScriptPanel && (
        <PanelScriptModal
          panel={selectedScriptPanel}
          onClose={() => setSelectedScriptPanel(null)}
        />
      )}
      
      {showPreviewModal && previewImage && (
        <PreviewModal
          imageUrl={previewImage}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
};

export default ComicPanelCreator;
