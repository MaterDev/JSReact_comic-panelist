/**
 * API Utility Functions
 * 
 * Utilities for handling API requests with timeout functionality.
 * Provides enhanced fetch capabilities for the script generation service.
 */

import { SCRIPT_SERVICE_FETCH_TIMEOUT } from '../../../constants';

/**
 * Enhanced fetch function with timeout capability
 * 
 * @param url - The URL to fetch from
 * @param options - Standard fetch options
 * @returns Promise resolving to the fetch Response
 * @throws Error if the request times out or fails
 */
export const fetchWithTimeout = async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), SCRIPT_SERVICE_FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. The AI is taking longer than expected to generate your script. Please try again.');
    }
    throw error;
  }
};
