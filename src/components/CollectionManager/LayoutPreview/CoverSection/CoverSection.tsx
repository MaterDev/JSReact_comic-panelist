/**
 * CoverSection Component
 * 
 * This component displays the cover page of a comic layout collection.
 * 
 * @module CoverSection
 */
import React from 'react';
import LayoutThumbnail from '../LayoutThumbnail';

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
 * Props for the CoverSection component
 */
interface CoverSectionProps {
  coverLayout: Layout;
  selectedLayoutId?: number | null;
  onLayoutSelect: (layoutId: number) => void;
  onLoadLayout: (layoutId: number) => void;
  type: 'front' | 'back';
}

/**
 * CoverSection component displays a cover page of a comic layout collection
 * 
 * @param {CoverSectionProps} props - The component props
 * @returns {JSX.Element} The rendered CoverSection component
 */
const CoverSection: React.FC<CoverSectionProps> = ({
  coverLayout,
  selectedLayoutId,
  onLayoutSelect,
  onLoadLayout,
  type
}) => {
  // Determine if this is the front or back cover and set appropriate labels and IDs
  const isFrontCover = type === 'front';
  const labelText = isFrontCover ? 'Cover page' : 'Back cover';
  const idPrefix = isFrontCover ? 'front' : 'back';

  return (
    <div 
      id={`cover-section-${idPrefix}-container`} 
      data-testid={`cover-section-${idPrefix}-container`}
      className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
    >
      {/* Cover label */}
      <div 
        id={`cover-section-${idPrefix}-label`}
        data-testid={`cover-section-${idPrefix}-label`}
        className="text-xs text-gray-600 dark:text-gray-400 mb-1"
      >
        {labelText}
      </div>
      
      {/* Cover thumbnail container */}
      <div 
        id={`cover-section-${idPrefix}-thumbnail-wrapper`}
        data-testid={`cover-section-${idPrefix}-thumbnail-wrapper`}
        className="flex justify-center"
      >
        <div 
          id={`cover-section-${idPrefix}-thumbnail-container`}
          data-testid={`cover-section-${idPrefix}-thumbnail-container`}
          className="w-1/3"
        >
          <LayoutThumbnail
            layout={coverLayout}
            isSelected={selectedLayoutId === coverLayout.id}
            onSelect={onLayoutSelect}
            onLoad={onLoadLayout}
          />
        </div>
      </div>
    </div>
  );
};

export default CoverSection;
