/**
 * PanelRepresentation Component
 * 
 * This component displays a visual representation of panels in a layout.
 * 
 * @module PanelRepresentation
 */
import React from 'react';
import { Panel, Layout } from '../../../types';

/**
 * Props for the PanelRepresentation component
 */
interface PanelRepresentationProps {
  layout: Layout;
}

/**
 * PanelRepresentation component displays a visual representation of panels in a layout
 * 
 * @param {PanelRepresentationProps} props - The component props
 * @returns {JSX.Element} The rendered panel representation
 */
const PanelRepresentation: React.FC<PanelRepresentationProps> = ({ layout }) => {
  return (
    <div 
      id={`panel-representation-container-${layout.id}`}
      data-testid={`panel-representation-container-${layout.id}`}
      className="w-full h-full relative"
    >
      {/* Render each panel as a rectangle with a number */}
      {layout.panel_data?.panels?.map((panel: Panel) => (
        <div
          id={`panel-representation-panel-${layout.id}-${panel.id}`}
          data-testid={`panel-representation-panel-${layout.id}-${panel.number}`}
          key={panel.id}
          style={{
            position: 'absolute',
            left: `${panel.x}%`,
            top: `${panel.y}%`,
            width: `${panel.width}%`,
            height: `${panel.height}%`,
            border: '1px solid black',
            backgroundColor: 'rgba(200, 200, 200, 0.2)',
          }}
        >
          {/* Panel number */}
          <span 
            id={`panel-representation-number-${layout.id}-${panel.id}`}
            data-testid={`panel-representation-number-${layout.id}-${panel.id}`}
            className="absolute top-1 left-1 text-xs font-bold text-black"
          >
            {panel.number}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PanelRepresentation;
