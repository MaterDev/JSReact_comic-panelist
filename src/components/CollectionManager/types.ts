/**
 * Type definitions for the CollectionManager component and its subcomponents
 */

/**
 * Represents a single panel within a comic layout
 */
export interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  number: number;
}

/**
 * Represents a comic layout within a collection
 */
export interface Layout {
  id: number;
  collection_id: number;
  name: string;
  display_order: number;
  page_type: 'front_cover' | 'back_cover' | 'standard';
  panel_data: {
    panels: Panel[];
  };
  thumbnail_path?: string;
  script_data?: any;
  creative_direction?: any;
  created_at: Date;
  updated_at: Date;
}

/**
 * Represents a collection of comic layouts
 */
export interface Collection {
  id: number;
  name: string;
  description?: string;
}
