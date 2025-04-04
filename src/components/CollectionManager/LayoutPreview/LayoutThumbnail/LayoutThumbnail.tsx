/**
 * LayoutThumbnail Component
 * 
 * This component displays a single layout thumbnail with options to load or delete the layout.
 * 
 * @module LayoutThumbnail
 */
import React from 'react';
import PanelRepresentation from './PanelRepresentation';
import ButtonOverlay from './ButtonOverlay';

/**
 * Represents a single panel within a comic layout
 */
interface Panel {
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
interface Layout {
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
 * Props for the LayoutThumbnail component
 */
interface LayoutThumbnailProps {
  layout: Layout;
  width?: string;
  isSelected?: boolean;
  onSelect: (layoutId: number) => void;
  onLoad: (layoutId: number) => void;
  onDelete?: (layoutId: number, e: React.MouseEvent) => void;
}

/**
 * LayoutThumbnail component displays a single layout thumbnail with options to load or delete
 * 
 * @param {LayoutThumbnailProps} props - The component props
 * @returns {JSX.Element} The rendered LayoutThumbnail component
 */
const LayoutThumbnail: React.FC<LayoutThumbnailProps> = ({
  layout,
  width = '100%',
  isSelected = false,
  onSelect,
  onLoad,
  onDelete
}) => {
  return (
    <div
      id={`layout-thumbnail-${layout.id}`}
      data-testid={`layout-thumbnail-${layout.id}`}
      key={layout.id}
      className={`relative ${width} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      {/* Render the layout preview */}
      <div
        id={`layout-thumbnail-container-${layout.id}`}
        data-testid={`layout-thumbnail-container-${layout.id}`}
        className="bg-white border border-gray-300 aspect-[3/4] relative cursor-pointer group"
        onClick={() => onSelect(layout.id)}
      >
        {/** ! If thumbnail exists, use it **/}
        {layout.thumbnail_path ? (
          /**
           * ! TODO: Implement thumbnail creation 
        */
          <img
            id={`layout-thumbnail-image-${layout.id}`}
            data-testid={`layout-thumbnail-image-${layout.id}`}
            src={`http://localhost:3001/thumbnails/${layout.thumbnail_path}`}
            alt={layout.name}
            className="w-full h-full object-contain"
          />
        ) : (
          /* Otherwise render a simple representation of the panels */
          <PanelRepresentation layout={layout} />
        )}

        {/* Button overlay - appears on hover */}
        <ButtonOverlay
          layoutId={layout.id}
          layoutName={layout.name}
          pageType={layout.page_type}
          onLoad={onLoad}
          onDelete={onDelete}
        />
      </div>

      {/* Page label */}
      <div
        id={`layout-thumbnail-label-${layout.id}`}
        data-testid={`layout-thumbnail-label-${layout.id}`}
        className="text-center text-xs mt-1 text-gray-700 dark:text-gray-300 truncate"
      >
        {layout.name}
      </div>
    </div>
  );
};

export default LayoutThumbnail;
