/**
 * API Constants
 * 
 * This file contains centralized constants for API endpoints and related configurations.
 */

// Base API URL
export const API_BASE_URL = 'http://localhost:3001';

// API endpoints
export const API_URL = `${API_BASE_URL}/api`;

// Timeout settings (in milliseconds)

/**
 * Timeout for script generation API requests (110 seconds)
 * Set slightly less than server timeout to provide better error handling
 */
export const SCRIPT_SERVICE_FETCH_TIMEOUT = 110000;
