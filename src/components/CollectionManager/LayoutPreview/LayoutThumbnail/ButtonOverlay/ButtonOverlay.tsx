/**
 * ButtonOverlay Component
 * 
 * This component displays action buttons that appear on hover over a layout thumbnail.
 * 
 * @module ButtonOverlay
 */
import React from 'react';

/**
 * Props for the ButtonOverlay component
 */
interface ButtonOverlayProps {
  layoutId: number;
  layoutName: string;
  pageType: 'front_cover' | 'back_cover' | 'standard';
  onLoad: (layoutId: number) => void;
  onDelete?: (layoutId: number, e: React.MouseEvent) => void;
}

/**
 * ButtonOverlay component displays action buttons that appear on hover over a layout thumbnail
 * 
 * @param {ButtonOverlayProps} props - The component props
 * @returns {JSX.Element} The rendered ButtonOverlay component
 */
const ButtonOverlay: React.FC<ButtonOverlayProps> = ({
  layoutId,
  layoutName,
  pageType,
  onLoad,
  onDelete
}) => {
  return (
    <div 
      id={`button-overlay-container-${layoutId}`}
      data-testid={`button-overlay-container-${layoutId}`}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 opacity-0 group-hover:opacity-100 space-y-2"
    >
      {/* Load button */}
      <button 
        id={`button-overlay-load-button-${layoutId}`}
        data-testid={`button-overlay-load-button-${layoutId}`}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow-md"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent onClick
          onLoad(layoutId);
        }}
        aria-label={`Load layout ${layoutName}`}
      >
        Load
      </button>
      
      {/* Delete button */}
      {pageType === 'standard' && onDelete && (
        <button 
          id={`button-overlay-delete-button-${layoutId}`}
          data-testid={`button-overlay-delete-button-${layoutId}`}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow-md"
          onClick={(e) => onDelete(layoutId, e)}
          aria-label={`Delete layout ${layoutName}`}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ButtonOverlay;
