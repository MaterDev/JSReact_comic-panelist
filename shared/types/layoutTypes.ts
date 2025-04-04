/**
 * Represents a single panel within a saved layout.
 */
export interface LayoutPanel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  panelNumber: number; // Ensure this matches the Panel type
}

/**
 * Represents a saved layout configuration.
 */
export interface Layout {
  id: string;
  collection_id?: number; // Add collection_id (optional based on errors)
  name: string;
  description: string;
  display_order?: number; // Add display_order (optional based on errors)
  page_type?: 'front_cover' | 'back_cover' | 'standard'; // Add page_type (optional based on errors)
  created_at: string;
  updated_at: string;
  thumbnail_url?: string; // Optional thumbnail
  panel_data: {
    panels: LayoutPanel[];
    gutterSize: number;
  };
  script_data?: any; // Add script_data (optional, type any for now)
  creative_direction?: any; // Add creative_direction (optional, type any for now)
  user_id?: string; // Optional user ID if applicable
  shared_with?: string[]; // Optional list of users shared with
  tags?: string[]; // Optional tags for categorization
}
