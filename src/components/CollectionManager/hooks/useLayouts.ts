/**
 * Layouts Hook
 * 
 * This hook manages the state and operations for layouts within a collection.
 * It encapsulates layout loading, selection, creation, and deletion.
 * 
 * @module hooks/useLayouts
 */
import React, { useState, useEffect } from 'react';
import { Layout } from '../../../../shared/types/layoutTypes';
import { 
  createLayoutSelectHandler,
  createLayoutLoadHandler,
  createLayoutDeleteHandler,
  createNewPageHandler,
  createFetchLayoutsHandler
} from '../utils/eventHandlers';

/**
 * Hook for managing layouts state and operations
 * 
 * @param {number|null} selectedCollection - The ID of the selected collection
 * @param {Function} onLoadLayout - Callback for loading a layout
 * @param {Function} setActionMessage - State setter for action messages
 * @returns {Object} Layouts state and operations
 */
export const useLayouts = (
  selectedCollection: number | null,
  onLoadLayout?: (layoutData: Layout) => void,
  setActionMessage?: React.Dispatch<React.SetStateAction<{ text: string, type: 'success' | 'error' } | null>>
) => {
  // State for layouts
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<number | null>(null);
  const [layoutsLoading, setLayoutsLoading] = useState(false);
  const [layoutsError, setLayoutsError] = useState<string | null>(null);

  // Create handlers using utility functions
  const fetchLayouts = createFetchLayoutsHandler(
    setLayouts,
    setLayoutsLoading,
    setLayoutsError,
    setSelectedLayout
  );

  const handleLayoutSelect = createLayoutSelectHandler(setSelectedLayout);
  
  const handleLoadLayout = createLayoutLoadHandler(onLoadLayout);
  
  const handleCreateNewPage = createNewPageHandler(
    setLayoutsLoading,
    fetchLayouts,
    setActionMessage || (() => {})
  );
  
  const handleDeleteLayout = createLayoutDeleteHandler(
    setLayoutsLoading,
    fetchLayouts,
    setSelectedLayout,
    selectedCollection,
    setActionMessage || (() => {})
  );

  // Fetch layouts when selected collection changes
  useEffect(() => {
    if (selectedCollection) {
      fetchLayouts(selectedCollection);
    } else {
      setLayouts([]);
      setSelectedLayout(null);
    }
  }, [selectedCollection]);

  /**
   * Creates a new page in the current collection
   */
  const createNewPage = async () => {
    if (!selectedCollection) return;
    return handleCreateNewPage(selectedCollection, layouts);
  };

  /**
   * Deletes a layout by ID
   * 
   * @param {number} layoutId - The ID of the layout to delete
   */
  const deleteLayout = (layoutId: number) => {
    handleDeleteLayout(layoutId);
  };

  return {
    // State
    layouts,
    selectedLayout,
    layoutsLoading,
    layoutsError,
    
    // Operations
    handleLayoutSelect,
    handleLoadLayout,
    createNewPage,
    deleteLayout,
    fetchLayouts
  };
};
