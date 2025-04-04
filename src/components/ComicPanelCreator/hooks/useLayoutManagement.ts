/**
 * Layout Management Hook
 * 
 * This hook manages layout saving and loading functionality:
 * - Layout loading from collections
 * - Layout saving to collections
 * - Tracking unsaved changes
 * - Layout metadata management
 */
import { useState, useCallback } from 'react';
import { API_URL } from '../../../constants';
import { Panel } from '../../../../shared/types/panelTypes';
import { CreativeDirection } from './useCreativeDirection';
import { Collection as SharedCollection } from '../../../../shared/types/layoutTypes';

// Define a Layout type that matches our API response and application needs
export interface Layout {
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
  creative_direction?: CreativeDirection;
  created_at: Date;
  updated_at: Date;
}

// Use the shared Collection type
export type Collection = SharedCollection;

interface UseLayoutManagementProps {
  panels: Panel[];
  setPanels: (panels: Panel[]) => void;
  gutterSize: number;
  setGutterSize: (size: number) => void;
  resetPanels: () => void;
  generatedScript: any | null;
  generatePreviewImage: () => Promise<string>;
  setCreativeDirectionFromObject: (direction: CreativeDirection) => void;
  getCreativeDirectionObject: () => CreativeDirection;
  resetCreativeDirection: () => void;
  clearScript?: () => void;
}

interface UseLayoutManagementReturn {
  loadedLayout: Layout | null;
  setLoadedLayout: (layout: Layout | null) => void;
  layoutName: string;
  layoutDescription: string;
  setLayoutName: (name: string) => void;
  setLayoutDescription: (description: string) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  isSavingLayout: boolean;
  currentCollection: Collection | null;
  setCurrentCollection: (collection: Collection | null) => void;
  refreshKey: number;
  handleLoadLayout: (layout: any) => void;
  saveCurrentLayout: () => Promise<void>;
  closeCurrentLayout: () => void;
  closeCollection: () => void;
}

/**
 * Hook for managing layout saving and loading
 */
export const useLayoutManagement = ({
  panels,
  setPanels,
  gutterSize,
  setGutterSize,
  resetPanels,
  generatedScript,
  generatePreviewImage,
  setCreativeDirectionFromObject,
  getCreativeDirectionObject,
  resetCreativeDirection,
  clearScript
}: UseLayoutManagementProps): UseLayoutManagementReturn => {
  // Layout state
  const [loadedLayout, setLoadedLayout] = useState<Layout | null>(null);
  const [layoutName, setLayoutName] = useState('');
  const [layoutDescription, setLayoutDescription] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSavingLayout, setIsSavingLayout] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Handles loading a layout from the CollectionManager
   */
  const handleLoadLayout = useCallback((layout: any) => {
    console.log("Loading layout:", layout);
    if (layout && layout.panel_data) {
      // Convert incoming numeric ID to string and ensure description exists
      const loadedLayout: Layout = {
        ...layout,
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

      setLoadedLayout(loadedLayout);
      setPanels(loadedLayout.panel_data.panels.map(p => ({ ...p, panelNumber: p.panelNumber })));
      setGutterSize(loadedLayout.panel_data.gutterSize);
      setLayoutName(loadedLayout.name);
      setLayoutDescription(loadedLayout.description || '');

      // Set creative direction state if available
      if (loadedLayout.creative_direction) {
        setCreativeDirectionFromObject(loadedLayout.creative_direction);
      }
      
      // Set generated script if available
      if (loadedLayout.script_data) {
        // If there's a clearScript function, we should call it first
        if (clearScript) {
          clearScript();
        }
      }

      setHasUnsavedChanges(false); // Reset unsaved changes flag
      setRefreshKey(prev => prev + 1); // Force CollectionManager refresh if needed

    } else {
      console.error("Attempted to load invalid layout data:", layout);
    }
  }, [setPanels, setGutterSize, setCreativeDirectionFromObject, clearScript]);

  /**
   * Saves the current layout back to the database
   */
  const saveCurrentLayout = useCallback(async () => {
    if (!loadedLayout) return;

    try {
      setIsSavingLayout(true);

      // Create a copy of the loaded layout with updated panel data
      const layoutPanels = panels.map(panel => ({
        ...panel,
        // Ensure panelNumber is always defined
        panelNumber: panel.panelNumber !== undefined ? panel.panelNumber : 0
      }));

      const updatedLayout = {
        ...loadedLayout,
        panel_data: {
          panels: layoutPanels,
          gutterSize: gutterSize
        },
        script_data: generatedScript,
        creative_direction: getCreativeDirectionObject()
      };

      // Generate a thumbnail for the updated layout
      const thumbnailBase64 = await generatePreviewImage();

      // Send the update to the server
      const response = await fetch(`${API_URL}/layouts/${loadedLayout.id}`, {
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
            const response = await fetch(`${API_URL}/collections/${loadedLayout.collection_id}`);
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
  }, [
    loadedLayout, 
    panels, 
    gutterSize, 
    generatedScript, 
    getCreativeDirectionObject, 
    generatePreviewImage
  ]);

  /**
   * Closes the current layout
   */
  const closeCurrentLayout = useCallback(() => {
    // Check if there are unsaved changes
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close this layout?')) {
        // Reset layout
        setLoadedLayout(null);
        setLayoutName('');
        setLayoutDescription('');

        // Reset panels to default
        resetPanels();

        // Reset script
        if (clearScript) {
          clearScript();
        }

        // Reset creative direction
        resetCreativeDirection();

        // Reset unsaved changes flag
        setHasUnsavedChanges(false);
      }
    } else {
      // Reset layout
      setLoadedLayout(null);
      setLayoutName('');
      setLayoutDescription('');

      // Reset panels to default
      resetPanels();

      // Reset script
      if (clearScript) {
        clearScript();
      }

      // Reset creative direction
      resetCreativeDirection();
    }
  }, [hasUnsavedChanges, resetPanels, clearScript, resetCreativeDirection]);

  /**
   * Closes the collection and resets to a one-off default page
   */
  const closeCollection = useCallback(() => {
    // Reset collection
    setCurrentCollection(null);

    // Reset layout
    setLoadedLayout(null);
    setLayoutName('');
    setLayoutDescription('');

    // Reset panels to default
    resetPanels();

    // Reset script
    if (clearScript) {
      clearScript();
    }

    // Reset creative direction
    resetCreativeDirection();

    // Reset unsaved changes flag
    setHasUnsavedChanges(false);
  }, [resetPanels, clearScript, resetCreativeDirection]);

  return {
    loadedLayout,
    setLoadedLayout,
    layoutName,
    layoutDescription,
    setLayoutName,
    setLayoutDescription,
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
  };
};
