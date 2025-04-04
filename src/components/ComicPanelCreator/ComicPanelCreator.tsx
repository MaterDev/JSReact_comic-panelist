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
import { generateAIPreviewImage as generateAIPreviewImageUtil } from './utils/exportUtils';
import { Panel as PanelComponent } from '../Panel';
import { Controls } from './Controls/Controls';
import { CreativeDirectionForm } from './CreativeDirectionForm';
import { ScriptGenerationPanel } from './ScriptGenerationPanel';
import { PanelOperationsToolbar } from './PanelOperationsToolbar';
import HeaderToolbar from './HeaderToolbar';
import { GuideLines } from '../GuideLines';

// Import custom hooks
import {
  usePanelInteraction,
  usePanelState,
  usePanelOperations,
  useCreativeDirection,
  useScriptGeneration,
  useExportOptions,
  useLayoutManagement,
  useModalState
} from './hooks';

// Import utilities
import {
  CONTAINER_WIDTH,
  CONTAINER_HEIGHT
} from '../../../shared/utils/panelUtils';

// Import the CollectionManager component
import CollectionManager from '../CollectionManager';
import ModalManager from './ModalManager';
import LayoutManager from './LayoutManager';

const ComicPanelCreator: React.FC = () => {
  // Use the panel state hook to manage panels and gutter size
  const {
    panels,
    setPanels,
    gutterSize,
    setGutterSize,
    nextPanelIdRef,
    updatePanelNumbers,
    resetPanels
  } = usePanelState({
    onPanelChange: () => {
      if (loadedLayout) {
        setHasUnsavedChanges(true);
      }
    }
  });
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
  
  // Use export options hook to manage export functionality
  const {
    exportFormat,
    setExportFormat,
    handleExportComic
  } = useExportOptions({
    containerRef,
    onBeforeExport: () => setShowControls(false),
    onAfterExport: () => setShowControls(true)
  });
  // API key state (kept separate from the hook for flexibility)
  const [apiKey, setApiKey] = useState('');
  
  /**
   * Generates a preview image of the current layout for AI context.
   */
  const generateAIPreviewImage = useCallback(async (): Promise<string> => {
    // Use the imported generateAIPreviewImage function from ExportUtils
    const imgData = await generateAIPreviewImageUtil(containerRef);
    return imgData || '';
  }, [containerRef]);

  // Use script generation hook to manage script generation state and API calls
  const {
    generatedScript,
    setGeneratedScript,
    isGeneratingScript,
    selectedScriptPanel,
    generatePanelScript,
    viewPanelScript,
    setSelectedScriptPanel
  } = useScriptGeneration({
    panels,
    generatePreviewImage: generateAIPreviewImage,
    apiKey,
    onScriptGenerated: () => {
      if (loadedLayout) {
        setHasUnsavedChanges(true);
      }
    }
  });
  
  // Use modal state hook to manage all modals
  const {
    showScriptModal,
    setShowScriptModal,
    showPreviewModal,
    setShowPreviewModal,
    previewImage,
    showExportPreviewModal,
    setShowExportPreviewModal,
    showInstructions,
    setShowInstructions,
    handlePreviewClick
  } = useModalState({
    generatePreviewImage: generateAIPreviewImage
  });
  
  // Script panel selection state is now managed by the useScriptGeneration hook

  // Creative direction states
  // Use the creative direction hook to manage creative inputs
  const {
    genre,
    setGenre,
    emotion,
    setEmotion,
    inspiration,
    setInspiration,
    inspirationText,
    setInspirationText,
    exclusions,
    setExclusions,
    resetCreativeDirection,
    // We don't use this directly as we're providing our own implementation
    getCreativeDirectionObject: _getCreativeDirectionObject
  } = useCreativeDirection();

  // Use layout management hook to handle saving and loading layouts
  const {
    loadedLayout,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isSavingLayout,
    currentCollection,
    setCurrentCollection,
    refreshKey,
    handleLoadLayout,
    saveCurrentLayout,
    closeCurrentLayout,
    closeCollection
  } = useLayoutManagement({
    panels,
    setPanels,
    gutterSize,
    setGutterSize,
    resetPanels,
    generatedScript,
    generatePreviewImage: async () => {
      // Implement preview image generation
      return "preview-image-placeholder";
    },
    setCreativeDirectionFromObject: (direction) => {
      if (!direction) return;
      setGenre(direction.genre || '');
      setEmotion(direction.emotion || '');
      setInspiration(direction.inspiration || '');
      setInspirationText(direction.inspirationText || '');
      setExclusions(direction.exclusions || '');
    },
    // Provide creative direction data to the layout management hook
    getCreativeDirectionObject: () => ({
      genre,
      emotion,
      inspiration,
      inspirationText,
      exclusions
    }),
    resetCreativeDirection,
    clearScript: () => setGeneratedScript(null)
  });

  // Panel selection and interaction state

  // Panel operations using the panel operations hook

  const {
    splitPanelHorizontally,
    splitPanelVertically,
    deletePanel
  } = usePanelOperations({
    panels,
    setPanels,
    gutterSize,
    nextPanelIdRef,
    updatePanelNumbers,
    setSelectedPanelId
  });

  // handlePreviewClick is now provided by the useModalState hook

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
  // generatePanelScript is now provided by the useScriptGeneration hook

  // handleExportComic is provided by the useExportOptions hook

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
  // handleLoadLayout is now provided by the useLayoutManagement hook

  // saveCurrentLayout is now provided by the useLayoutManagement hook

  // closeCurrentLayout is now provided by the useLayoutManagement hook

  // closeCollection is now provided by the useLayoutManagement hook

  // Use isSavingLayout for layout save operations
  // Layout state variables are now provided by the useLayoutManagement hook

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
            onGenerateScript={() => {
              // Create the creative direction object with current form values
              const creativeDirection = {
                genre,
                emotion,
                inspiration,
                inspirationText,
                exclusions
              };
              // Debug log to verify values before passing them
              console.log('Creative direction form values being sent:', creativeDirection);
              // Pass the creative direction to the script generation function
              generatePanelScript(creativeDirection);
            }}
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
                  onViewScript={viewPanelScript}
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
        containerRef={containerRef}
        exportFormat={exportFormat}
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
