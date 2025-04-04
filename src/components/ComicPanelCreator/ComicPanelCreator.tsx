/**
 * ComicPanelCreator Component
 *
 * This is the main component for the comic panel layout and script generation tool.
 * It provides the primary user interface for:
 * - Designing comic page layouts by adding, resizing, splitting, and deleting panels.
 * - Visualizing the layout on a fixed-size canvas with a checkerboard background.
 * - Managing panel selections and interactions (dragging, resizing).
 * - Inputting creative direction and API keys for script generation.
 * - Generating AI-powered scripts for the defined panel layout.
 * - Viewing generated scripts per panel or for the entire page.
 * - Exporting the comic layout to various formats (JSON, PNG).
 * - Saving and loading panel layouts to/from collections.
 *
 * It orchestrates various sub-components and hooks to manage state and functionality,
 * including panel operations, script generation, modal dialogs, and layout persistence.
 */
import React, { useState, useRef, useCallback } from 'react';
import {
  ComicPage,
  PanelLayout,
  Panel as ScriptPanel,
  generateScript,
  validateComicPage
} from '../ScriptGenerator';
import { exportComic as exportComicUtil, generateAIPreviewImage as generateAIPreviewImageUtil } from '../ExportUtils';
import { Panel as PanelComponent } from '../Panel';
import { Controls, ExportFormat } from './Controls/Controls';
import { CreativeDirectionForm } from './CreativeDirectionForm';
import { ScriptGenerationPanel } from './ScriptGenerationPanel';
import { PanelOperationsToolbar } from './PanelOperationsToolbar';
import HeaderToolbar from './HeaderToolbar';
import { GuideLines } from '../GuideLines';
import { Panel } from '../../../shared/types/panelTypes';

// Define a local Layout type that matches the HeaderToolbar and LayoutManager components
interface Layout {
  id: number;
  name: string;
  collection_id: number;
  description?: string;
  display_order?: number;
  page_type?: 'front_cover' | 'back_cover' | 'standard';
  panel_data: {
    panels: Panel[];
    gutterSize: number;
  };
  thumbnail_path?: string;
  script_data?: any;
  creative_direction?: any;
  created_at: Date;
  updated_at: Date;
}

// Import new components
import { usePanelInteraction } from './hooks';
import { ModalManager } from './ModalManager';
import { LayoutManager } from './LayoutManager';
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
} from '../../../shared/utils/panelUtils';

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
      panelNumber: 1
    }
  ]);
  const [gutterSize, setGutterSize] = useState(10);
  // Use the panel interaction hook
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    selectedPanelId,
    setSelectedPanelId,
    startResize,
    startDrag
  } = usePanelInteraction({
    panels,
    setPanels,
    containerRef,
    onPanelChange: () => {
      if (loadedLayout) {
        setHasUnsavedChanges(true);
      }
    }
  });
  const [showControls, setShowControls] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [generatedScript, setGeneratedScript] = useState<ComicPage | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [selectedScriptPanel, setSelectedScriptPanel] = useState<ScriptPanel | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showExportPreviewModal, setShowExportPreviewModal] = useState(false);

  // Creative direction states
  const [genre, setGenre] = useState('');
  const [emotion, setEmotion] = useState('');
  const [inspiration, setInspiration] = useState('');

  // Layout loading state
  const [loadedLayout, setLoadedLayout] = useState<Layout | null>(null);
  // These state variables are used in the handleLoadLayout function
  // They're not directly used in the UI but are needed for state management
  const [_layoutName, setLayoutName] = useState('');
  const [_layoutDescription, setLayoutDescription] = useState('');
  const [inspirationText, setInspirationText] = useState('');
  const [exclusions, setExclusions] = useState('');
  // Creative direction state is now managed by the CreativeDirectionForm component

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
      panelNumber: index + 1
    }));
  }, []);

  /**
   * Splits the target panel horizontally into two equal halves.
   * @param panelId The ID of the panel to split.
   */
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
      if (loadedLayout) {
        setHasUnsavedChanges(true);
      }
      return updatePanelNumbers(updatedPanels);
    });
    setSelectedPanelId(null);
  }, [panels, gutterSize, updatePanelNumbers]);

  /**
   * Splits the target panel vertically into two equal halves.
   * @param panelId The ID of the panel to split.
   */
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

  /**
   * Deletes the target panel from the layout.
   * Ensures at least one panel always remains.
   * @param panelId The ID of the panel to delete.
   */
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

  /**
   * Resets the panel layout to a single default panel.
   * Also clears any existing generated script.
   */
  const resetPanels = useCallback((): void => {
    setPanels([
      {
        id: 'panel-1',
        x: TRIM_INSET_PERCENT,
        y: (100 - TRIM_HEIGHT_PERCENT) / 2,
        width: TRIM_WIDTH_PERCENT,
        height: TRIM_HEIGHT_PERCENT,
        panelNumber: 1
      }
    ]);
    nextPanelId.current = 2;
    setSelectedPanelId(null);
  }, []);

  /**
   * Generates a preview image of the current layout for AI context.
   * Displays the image in a modal.
   */
  const generateAIPreviewImage = useCallback(async (): Promise<string> => {
    // Use the imported generateAIPreviewImage function from ExportUtils
    const imgData = await generateAIPreviewImageUtil(containerRef);
    return imgData || '';
  }, [containerRef]);

  /**
   * Handles the preview click event.
   * Generates a preview image and displays it in a modal.
   */
  const handlePreviewClick = useCallback(async () => {
    try {
      const previewImageData = await generateAIPreviewImage();
      setPreviewImage(previewImageData);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  }, [generateAIPreviewImage]);

  /**
   * Handles the export preview click event.
   * Displays the export preview modal.
   */
  const handleExportPreviewClick = useCallback(() => {
    setShowExportPreviewModal(true);
  }, []);

  /**
   * Generates a script for the current panel layout.
   * Validates the layout and API key before proceeding.
   * Displays modals for loading state and results/errors.
   */
  const generatePanelScript = useCallback(async (): Promise<void> => {
    try {
      setIsGeneratingScript(true);

      // Generate the preview image
      const layoutImageBase64 = await generateAIPreviewImage();

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
  }, [panels, apiKey, genre, emotion, inspiration, inspirationText, exclusions, generateAIPreviewImage]);

  /**
   * Handles the export action based on the selected format.
   * @param format The desired export format ('json', 'png').
   */
  const handleExportComic = useCallback(async (format: ExportFormat): Promise<void> => {
    // Use the imported exportComic function with callbacks for UI state management
    await exportComicUtil({
      containerRef,
      format,
      onBeforeExport: () => setShowControls(false),
      onAfterExport: () => setShowControls(true)
    });
  }, [containerRef]);

  /**
   * Handles viewing the script for a specific panel.
   * Finds the corresponding script data based on the panel ID.
   * @param panelId The ID of the panel to view the script for.
   */
  const handleViewPanelScript = useCallback((panelId: string) => {
    if (!generatedScript) return;

    // Find the panel number from the canvas panel id
    const panel = panels.find(p => p.id === panelId);
    if (!panel || typeof panel.panelNumber === 'undefined') {
      console.warn(`Could not find panel or panel number for ID ${panelId}`);
      alert(`Could not find panel data for ID ${panelId}`);
      return;
    }

    // Find the corresponding script panel by matching position
    const scriptPanel = generatedScript?.panels.find(p => p.id === panel.panelNumber);
    if (scriptPanel) {
      setSelectedScriptPanel(scriptPanel);
    }
  }, [generatedScript, panels]);

  /**
   * Handles loading a layout from the CollectionManager.
   * Updates the panel layout and script data accordingly.
   * @param layout The loaded layout object.
   */
  const handleLoadLayout = useCallback((layout: any) => { // Use 'any' temporarily to bypass strict checks on incoming object
    console.log("Loading layout:", layout);
    if (layout && layout.panel_data) {
      // Convert incoming numeric ID to string and ensure description exists
      const loadedLayout: Layout = {
        ...layout,
        id: String(layout.id), // Convert potential number ID to string
        description: layout.description || '', // Provide default description
        panel_data: {
          ...layout.panel_data,
          // Ensure panels array exists and map panel numbers
          panels: (layout.panel_data.panels || []).map((p: any, index: number) => ({
            ...p,
            panelNumber: p.panelNumber || index + 1 // Assign panel number if missing
          })),
          gutterSize: layout.panel_data.gutterSize ?? 1, // Use nullish coalescing for gutterSize
        }
      };

      console.log("Processed loadedLayout:", loadedLayout);

      setLoadedLayout(loadedLayout); // Now conforms to Layout type
      setPanels(loadedLayout.panel_data.panels.map(p => ({ ...p, panelNumber: p.panelNumber })));
      setGutterSize(loadedLayout.panel_data.gutterSize);
      setLayoutName(loadedLayout.name);
      setLayoutDescription(loadedLayout.description || '');

      // Set creative direction state if available
      if (loadedLayout.creative_direction) {
        setGenre(loadedLayout.creative_direction.genre || '');
        setEmotion(loadedLayout.creative_direction.emotion || '');
        setInspiration(loadedLayout.creative_direction.inspiration || '');
        setInspirationText(loadedLayout.creative_direction.inspirationText || '');
        setExclusions(loadedLayout.creative_direction.exclusions || '');
      }
      // Set generated script if available
      if (loadedLayout.script_data) {
        setGeneratedScript(loadedLayout.script_data);
      }

      setHasUnsavedChanges(false); // Reset unsaved changes flag
      setSelectedPanelId(null); // Deselect any panel
      setRefreshKey(prev => prev + 1); // Force CollectionManager refresh if needed

    } else {
      console.error("Attempted to load invalid layout data:", layout);
    }
  }, [setPanels, setGutterSize, setLayoutName, setLayoutDescription, setGenre, setEmotion, setInspiration, setInspirationText, setExclusions, setGeneratedScript, setHasUnsavedChanges, setSelectedPanelId]);

  /**
   * Saves the current layout back to the database.
   * Updates the layout object with the current panel data and script.
   */
  const saveCurrentLayout = useCallback(async () => {
    if (!loadedLayout) return;

    try {
      setIsSavingLayout(true);

      // Create a copy of the loaded layout with updated panel data
      // Convert Panel[] to LayoutPanel[] by ensuring all panels have a panelNumber property
      const layoutPanels = panels.map(panel => ({
        ...panel,
        // Ensure panelNumber is always defined (use panel.panelNumber if defined, otherwise 0)
        panelNumber: panel.panelNumber !== undefined ? panel.panelNumber : 0
      }));

      const updatedLayout = {
        ...loadedLayout,
        panel_data: {
          panels: layoutPanels,
          gutterSize: gutterSize // Include gutterSize in panel_data
        },
        script_data: generatedScript,
        creative_direction: {
          genre,
          emotion,
          inspiration,
          inspirationText,
          exclusions
        }
      };

      // Generate a thumbnail for the updated layout
      const thumbnailBase64 = await generateAIPreviewImage();

      // Send the update to the server
      const response = await fetch(`http://localhost:3001/api/layouts/${loadedLayout.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: loadedLayout.name,
          collection_id: loadedLayout.collection_id,
          panel_data: updatedLayout.panel_data,
          script_data: updatedLayout.script_data,
          creative_direction: updatedLayout.creative_direction,
          thumbnailBase64
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update layout');
      }

      // Update the loaded layout with the new data
      setLoadedLayout(updatedLayout as Layout);

      // Reset unsaved changes flag
      setHasUnsavedChanges(false);

      // If the layout belongs to a collection, update the collection information
      if (loadedLayout.collection_id) {
        // Fetch the collection information
        const fetchCollection = async () => {
          try {
            const response = await fetch(`http://localhost:3001/api/collections/${loadedLayout.collection_id}`);
            if (response.ok) {
              const collection = await response.json();
              // Update the current collection state
              setCurrentCollection({
                id: collection.id,
                name: collection.name,
                description: collection.description
              });
            }
          } catch (error) {
            console.error('Error fetching collection:', error);
          }
        };
        fetchCollection();
      }

      // Trigger a refresh of the collection manager layouts
      setRefreshKey(prevKey => prevKey + 1);

      // Show success message
      alert(`Layout "${loadedLayout.name}" has been updated successfully.`);
    } catch (error) {
      console.error('Error saving layout:', error);
      alert(`Failed to save layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSavingLayout(false);
    }
  }, [loadedLayout, panels, generatedScript, genre, emotion, inspiration, inspirationText, exclusions, generateAIPreviewImage, gutterSize]);

  /**
   * Closes the current layout.
   * Resets the panel layout and script data.
   */
  const closeCurrentLayout = useCallback(() => {
    // Check if there are unsaved changes
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close this layout?')) {
        // Reset layout
        setLoadedLayout(null);

        // Reset panels to default
        resetPanels();

        // Reset script
        setGeneratedScript(null);

        // Reset creative direction
        setGenre('');
        setEmotion('');
        setInspiration('');
        setInspirationText('');
        setExclusions('');

        // Reset unsaved changes flag
        setHasUnsavedChanges(false);
      }
    } else {
      // Reset layout
      setLoadedLayout(null);

      // Reset panels to default
      resetPanels();

      // Reset script
      setGeneratedScript(null);

      // Reset creative direction
      setGenre('');
      setEmotion('');
      setInspiration('');
      setInspirationText('');
      setExclusions('');
    }
  }, [hasUnsavedChanges, resetPanels]);

  /**
   * Closes the collection and resets to a one-off default page.
   * Resets the panel layout and script data.
   */
  const closeCollection = useCallback(() => {
    // Reset collection
    setCurrentCollection(null);

    // Reset layout
    setLoadedLayout(null);

    // Reset panels to default
    resetPanels();

    // Reset script
    setGeneratedScript(null);

    // Reset creative direction
    setGenre('');
    setEmotion('');
    setInspiration('');
    setInspirationText('');
    setExclusions('');

    // Reset unsaved changes flag
    setHasUnsavedChanges(false);

    // Increment refresh key to force CollectionManager to rerender with no selection
    setRefreshKey(prevKey => prevKey + 1);
  }, [resetPanels]);

  const [showInstructions, setShowInstructions] = useState(false);
  const [isSavingLayout, setIsSavingLayout] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentCollection, setCurrentCollection] = useState<{ id: number; name: string; description?: string } | null>(null);

  return (
    <div className="flex flex-col h-screen text-gray-900 dark:text-gray-100">
      <HeaderToolbar
        currentCollection={currentCollection}
        loadedLayout={loadedLayout as any} // Type cast to avoid type conflicts
        hasUnsavedChanges={hasUnsavedChanges}
        isSavingLayout={isSavingLayout}
        showInstructions={showInstructions}
        onShowInstructions={setShowInstructions}
        onCloseCollection={closeCollection}
        onSaveLayout={saveCurrentLayout}
        onCloseLayout={closeCurrentLayout}
      />
      <div id="main-layout-container" className="flex flex-1 overflow-hidden">
        {/* Column 1 - Control Panel - Fixed to left side */}
        <div id="control-panel-column" className="flex flex-col gap-4 w-72 p-3 overflow-y-auto border-r border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800">
          <ScriptGenerationPanel
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            isGeneratingScript={isGeneratingScript}
            onGenerateScript={generatePanelScript}
            hasGeneratedScript={!!generatedScript}
            onViewScript={() => setShowScriptModal(true)}
            onPreviewClick={handlePreviewClick}
          />

          <CreativeDirectionForm
            creativeDirection={{
              genre,
              emotion,
              inspiration,
              inspirationText,
              exclusions
            }}
            onCreativeDirectionChange={(direction) => {
              setGenre(direction.genre);
              setEmotion(direction.emotion);
              setInspiration(direction.inspiration);
              setInspirationText(direction.inspirationText);
              setExclusions(direction.exclusions);
            }}
          />

          <PanelOperationsToolbar
            panels={panels} // FIX: Pass the panels array
            selectedPanelId={selectedPanelId}
            canDelete={panels.length > 1}
            hasScript={!!generatedScript}
            onSplitHorizontally={splitPanelHorizontally}
            onSplitVertically={splitPanelVertically}
            onDelete={deletePanel}
            onViewScript={handleViewPanelScript}
          />

          <Controls
            gutterSize={gutterSize}
            onGutterSizeChange={setGutterSize}
            showControls={showControls}
            onShowControlsChange={setShowControls}
            showGuides={showGuides}
            onShowGuidesChange={setShowGuides}
            onResetPanels={resetPanels}
            onExport={handleExportComic}
            onShowExportPreview={handleExportPreviewClick}
            exportFormat={exportFormat}
            onExportFormatChange={setExportFormat}
            panels={panels}
            selectedPanelId={selectedPanelId}
          />



        </div>

        {/* Column 2 - Comic Page - Center with most space */}
        <div id="comic-page-viewport" className="flex-1 flex justify-center overflow-auto p-4 bg-neutral-700 dark:bg-neutral-800">
          {/* Intermediate div for fixed size and checkerboard background */}
          <div
            id="fixed-checkerboard-container"
            className="relative checkerboard-bg"
            style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
          >
            {/* Actual white page container - ref attaches here */}
            <div
              ref={containerRef}
              id="comic-page-container"
              className="absolute inset-0 border border-gray-300 bg-white shadow-md comic-container"
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
        </div>

        {/* Column 3 - Collection Management - Fixed to right side */}
        <div id="collection-manager-column" className="flex flex-col gap-4 w-96 p-3 overflow-y-auto border-l border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800">
          <LayoutManager
            currentLayout={loadedLayout as any} // Type cast to avoid type conflicts
            currentCollection={currentCollection}
            panels={panels}
            generatedScript={generatedScript}
            creativeDirection={{
              genre,
              emotion,
              inspiration,
              inspirationText,
              exclusions
            }}
            hasUnsavedChanges={hasUnsavedChanges}
            isSavingLayout={isSavingLayout}
            onSaveLayout={saveCurrentLayout}
            onCloseLayout={closeCurrentLayout}
            onCloseCollection={closeCollection}
            generateThumbnail={generateAIPreviewImage}
          />

          <CollectionManager
            onLoadLayout={handleLoadLayout}
            onCollectionChange={setCurrentCollection}
            initialCollectionId={currentCollection?.id || null}
            key={refreshKey}
          />
        </div>
      </div>

      <ModalManager
        showScriptModal={showScriptModal}
        showPanelScriptModal={!!selectedScriptPanel}
        showPreviewModal={showPreviewModal}
        showExportPreviewModal={showExportPreviewModal}
        showInstructionsModal={showInstructions}
        generatedScript={generatedScript}
        selectedScriptPanel={selectedScriptPanel}
        previewImage={previewImage}
        exportPreviewImage={null}
        onCloseScriptModal={() => setShowScriptModal(false)}
        onClosePanelScriptModal={() => setSelectedScriptPanel(null)}
        onClosePreviewModal={() => setShowPreviewModal(false)}
        onCloseExportPreviewModal={() => setShowExportPreviewModal(false)}
        onCloseInstructionsModal={() => setShowInstructions(false)}
      />
    </div>
  );
};

export default ComicPanelCreator;
