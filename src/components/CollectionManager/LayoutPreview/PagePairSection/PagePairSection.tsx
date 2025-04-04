/**
 * PagePairSection Component
 * 
 * This component displays a pair of pages side by side in the layout preview.
 * It can be used for both the first page pair and standard page pairs.
 * 
 * @module PagePairSection
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
 * Props for the PagePairSection component
 */
interface PagePairSectionProps {
  pagePair: Layout[];
  selectedLayoutId?: number | null;
  onLayoutSelect: (layoutId: number) => void;
  onLoadLayout: (layoutId: number) => void;
  onDeleteLayout?: (layoutId: number, e: React.MouseEvent) => void;
  isFirstPair?: boolean;
  pairIndex?: number;
}

/**
 * PagePairSection component displays a pair of pages side by side
 * 
 * @param {PagePairSectionProps} props - The component props
 * @returns {JSX.Element} The rendered PagePairSection component
 */
const PagePairSection: React.FC<PagePairSectionProps> = ({
  pagePair,
  selectedLayoutId,
  onLayoutSelect,
  onLoadLayout,
  onDeleteLayout,
  isFirstPair = false,
  pairIndex = 0
}) => {
  // Determine IDs based on whether this is the first pair or a standard pair
  const sectionId = isFirstPair 
    ? "page-pair-first-section" 
    : `page-pair-${pairIndex}-section`;
  
  const containerId = isFirstPair 
    ? "page-pair-first-container" 
    : `page-pair-${pairIndex}-container`;
  
  const leftId = isFirstPair 
    ? "page-pair-first-left" 
    : `page-pair-${pairIndex}-left`;
  
  const rightId = isFirstPair 
    ? "page-pair-first-right" 
    : `page-pair-${pairIndex}-right`;
  
  const rightEmptyId = isFirstPair 
    ? "page-pair-first-right-empty" 
    : `page-pair-${pairIndex}-right-empty`;

  return (
    <div 
      id={sectionId} 
      data-testid={sectionId}
      className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
    >
      {/* Container for the pair of pages */}
      <div 
        id={containerId}
        data-testid={containerId}
        className="flex justify-between gap-4"
      >
        {/* Left page */}
        <div 
          id={leftId}
          data-testid={leftId}
          className="w-1/3 mx-auto"
        >
          <LayoutThumbnail
            layout={pagePair[0]}
            isSelected={selectedLayoutId === pagePair[0].id}
            onSelect={onLayoutSelect}
            onLoad={onLoadLayout}
            onDelete={onDeleteLayout}
          />
        </div>
        
        {/* Right page or empty space if there's only one page */}
        {pagePair.length > 1 ? (
          <div 
            id={rightId}
            data-testid={rightId}
            className="w-1/3 mx-auto"
          >
            <LayoutThumbnail
              layout={pagePair[1]}
              isSelected={selectedLayoutId === pagePair[1].id}
              onSelect={onLayoutSelect}
              onLoad={onLoadLayout}
              onDelete={onDeleteLayout}
            />
          </div>
        ) : (
          <div 
            id={rightEmptyId}
            data-testid={rightEmptyId}
            className="w-1/3 mx-auto"
          ></div> /* Empty div to maintain layout when there's only one page */
        )}
      </div>
    </div>
  );
};

export default PagePairSection;
