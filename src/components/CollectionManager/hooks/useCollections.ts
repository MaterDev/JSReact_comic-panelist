/**
 * Collections Hook
 * 
 * This hook manages the state and operations for collections.
 * It encapsulates collection loading, selection, and deletion.
 * 
 * @module hooks/useCollections
 */
import { useState, useEffect } from 'react';
import { Collection } from '../types';
import { 
  createFetchCollectionsHandler,
  createCollectionSelectHandler,
  createCollectionDeleteHandler
} from '../utils/eventHandlers';

/**
 * Hook for managing collections state and operations
 * 
 * @param {number|null} initialCollectionId - The initial collection ID to select
 * @param {Function} onCollectionChange - Callback for collection changes
 * @param {Function} setActionMessage - State setter for action messages
 * @returns {Object} Collections state and operations
 */
export const useCollections = (
  initialCollectionId: number | null = null,
  onCollectionChange?: (collection: Collection | null) => void,
  setActionMessage?: (message: { text: string, type: 'success' | 'error' } | null) => void
) => {
  // State for collections
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<number | null>(initialCollectionId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCollectionDropdownOpen, setIsCollectionDropdownOpen] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Create handlers using utility functions
  const fetchCollections = createFetchCollectionsHandler(
    setCollections,
    setLoading,
    setError,
    setSelectedCollection
  );

  const handleCollectionSelectFromDropdown = createCollectionSelectHandler(
    setSelectedCollection,
    () => [], // This will be replaced by the fetchLayouts from useLayouts
    () => {}, // This will be replaced by the setLayoutsLoading from useLayouts
    () => {}, // This will be replaced by the setLayoutsError from useLayouts
    () => {}, // This will be replaced by the setSelectedLayout from useLayouts
    onCollectionChange
  );

  const handleDeleteCollection = createCollectionDeleteHandler(
    setActionLoading,
    fetchCollections,
    setSelectedCollection,
    setActionMessage || (() => {})
  );

  // Load collections on component mount
  useEffect(() => {
    fetchCollections();
  }, []);

  // Update selected collection when initialCollectionId changes
  useEffect(() => {
    if (initialCollectionId !== undefined && initialCollectionId !== null) {
      setSelectedCollection(initialCollectionId);
    }
  }, [initialCollectionId]);

  // Notify parent component when collections are loaded
  useEffect(() => {
    if (selectedCollection && onCollectionChange && collections.length > 0) {
      const selectedCollectionData = collections.find(c => c.id === selectedCollection) || null;
      onCollectionChange(selectedCollectionData);
    } else if (selectedCollection === null && onCollectionChange) {
      onCollectionChange(null);
    }
  }, [selectedCollection, collections, onCollectionChange]);

  /**
   * Handles collection selection from dropdown
   * 
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event
   */
  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const collectionId = value ? Number(value) : null;
    handleCollectionSelectFromDropdown(collectionId, collections);
  };

  /**
   * Deletes the currently selected collection
   */
  const deleteCollection = () => {
    if (selectedCollection && window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      handleDeleteCollection(selectedCollection);
    }
  };

  /**
   * Toggles the collection dropdown
   */
  const toggleCollectionDropdown = () => {
    setIsCollectionDropdownOpen(prev => !prev);
  };

  return {
    // State
    collections,
    selectedCollection,
    loading,
    error,
    searchTerm,
    isCollectionDropdownOpen,
    actionLoading,
    
    // State setters
    setSearchTerm,
    setIsCollectionDropdownOpen,
    
    // Operations
    handleCollectionChange,
    deleteCollection,
    toggleCollectionDropdown,
    fetchCollections
  };
};
