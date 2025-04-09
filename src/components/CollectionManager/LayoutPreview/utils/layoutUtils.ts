/**
 * Layout Utility Functions
 * 
 * This file contains utility functions for processing and organizing layout data.
 * 
 * @module layoutUtils
 */
import { Layout } from '../../types';

/**
 * Sorts layouts by their display order
 * 
 * @param {Layout[]} layouts - The layouts to sort
 * @returns {Layout[]} The sorted layouts
 */
export const sortLayoutsByDisplayOrder = (layouts: Layout[]): Layout[] => {
  return [...layouts].sort((a, b) => a.display_order - b.display_order);
};

/**
 * Categorizes layouts by page type
 * 
 * @param {Layout[]} layouts - The layouts to categorize
 * @returns {Object} An object containing front cover, back cover, and standard pages
 */
export const categorizeLayouts = (layouts: Layout[]) => {
  const sortedLayouts = sortLayoutsByDisplayOrder(layouts);
  
  return {
    frontCover: sortedLayouts.find(layout => layout.page_type === 'front_cover'),
    backCover: sortedLayouts.find(layout => layout.page_type === 'back_cover'),
    standardPages: sortedLayouts.filter(layout => layout.page_type === 'standard')
  };
};

/**
 * Groups standard pages into pairs for side-by-side display
 * 
 * @param {Layout[]} pages - The standard pages to group into pairs
 * @returns {Layout[][]} An array of page pairs
 */
export const groupPagesIntoPairs = (pages: Layout[]): Layout[][] => {
  const pairs: Layout[][] = [];
  
  for (let i = 0; i < pages.length; i += 2) {
    if (i + 1 < pages.length) {
      pairs.push([pages[i], pages[i + 1]]);
    } else {
      // If there's an odd number of pages, the last page is alone
      pairs.push([pages[i]]);
    }
  }
  
  return pairs;
};
