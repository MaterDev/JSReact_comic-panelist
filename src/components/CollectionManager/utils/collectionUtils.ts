/**
 * Collection Utility Functions
 * 
 * This file contains utility functions for processing and organizing collection data.
 * 
 * @module collectionUtils
 */
import { Collection, Layout } from '../types';

/**
 * Filters collections based on a search term
 * 
 * @param {Collection[]} collections - The collections to filter
 * @param {string} searchTerm - The search term to filter by
 * @returns {Collection[]} The filtered collections
 */
export const filterCollectionsBySearchTerm = (collections: Collection[], searchTerm: string): Collection[] => {
  if (!searchTerm.trim()) {
    return collections;
  }
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return collections.filter(collection => 
    collection.name.toLowerCase().includes(lowerCaseSearchTerm) || 
    (collection.description && collection.description.toLowerCase().includes(lowerCaseSearchTerm))
  );
};

/**
 * Gets a collection by ID
 * 
 * @param {Collection[]} collections - The collections to search
 * @param {number | null} collectionId - The ID of the collection to find
 * @returns {Collection | null} The found collection or null
 */
export const getCollectionById = (collections: Collection[], collectionId: number | null): Collection | null => {
  if (!collectionId) return null;
  return collections.find(collection => collection.id === collectionId) || null;
};

/**
 * Gets a layout by ID
 * 
 * @param {Layout[]} layouts - The layouts to search
 * @param {number | null} layoutId - The ID of the layout to find
 * @returns {Layout | null} The found layout or null
 */
export const getLayoutById = (layouts: Layout[], layoutId: number | null): Layout | null => {
  if (!layoutId) return null;
  return layouts.find(layout => layout.id === layoutId) || null;
};

/**
 * Sorts collections by name
 * 
 * @param {Collection[]} collections - The collections to sort
 * @returns {Collection[]} The sorted collections
 */
export const sortCollectionsByName = (collections: Collection[]): Collection[] => {
  return [...collections].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Sorts layouts by display order
 * 
 * @param {Layout[]} layouts - The layouts to sort
 * @returns {Layout[]} The sorted layouts
 */
export const sortLayoutsByDisplayOrder = (layouts: Layout[]): Layout[] => {
  return [...layouts].sort((a, b) => a.display_order - b.display_order);
};
