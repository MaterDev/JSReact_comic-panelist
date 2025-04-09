/**
 * Layout Event Handler Functions
 * 
 * This file contains utility functions for handling layout-related events.
 * 
 * @module eventHandlers
 */
import React from 'react';

/**
 * Creates a handler for layout deletion click events
 * 
 * @param {Function} setLayoutToDelete - State setter for the layout to delete
 * @param {Function} setShowDeleteConfirm - State setter for showing the delete confirmation
 * @returns {Function} A function that handles delete button clicks
 */
export const createDeleteClickHandler = (
  setLayoutToDelete: (id: number | null) => void,
  setShowDeleteConfirm: (show: boolean) => void
) => {
  return (layoutId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setLayoutToDelete(layoutId);
    setShowDeleteConfirm(true);
  };
};

/**
 * Creates a handler for confirming layout deletion
 * 
 * @param {Function} onDeleteLayout - Callback for deleting a layout
 * @param {Function} setShowDeleteConfirm - State setter for showing the delete confirmation
 * @param {Function} setLayoutToDelete - State setter for the layout to delete
 * @param {number | null} layoutToDelete - ID of the layout to delete
 * @returns {Function} A function that handles delete confirmation
 */
export const createConfirmDeleteHandler = (
  onDeleteLayout: ((layoutId: number) => Promise<void>) | undefined,
  setShowDeleteConfirm: (show: boolean) => void,
  setLayoutToDelete: (id: number | null) => void,
  layoutToDelete: number | null
) => {
  return async () => {
    if (layoutToDelete !== null && onDeleteLayout) {
      await onDeleteLayout(layoutToDelete);
      setShowDeleteConfirm(false);
      setLayoutToDelete(null);
    }
  };
};

/**
 * Creates a handler for canceling layout deletion
 * 
 * @param {Function} setShowDeleteConfirm - State setter for showing the delete confirmation
 * @param {Function} setLayoutToDelete - State setter for the layout to delete
 * @returns {Function} A function that handles delete cancellation
 */
export const createCancelDeleteHandler = (
  setShowDeleteConfirm: (show: boolean) => void,
  setLayoutToDelete: (id: number | null) => void
) => {
  return () => {
    setShowDeleteConfirm(false);
    setLayoutToDelete(null);
  };
};
