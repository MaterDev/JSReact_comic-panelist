/**
 * PanelCanvas Component
 * 
 * This component renders the main drawing area for comic panels, including:
 * - The canvas with checkerboard background
 * - Individual panels that can be selected, moved, and resized
 * - Guide lines for alignment
 */
import React from 'react';
import { Panel as PanelComponent } from '../../Panel';
import { GuideLines } from '../../GuideLines';
import { Panel } from '../../../../shared/types/panelTypes';
import { CONTAINER_WIDTH, CONTAINER_HEIGHT } from '../../../../shared/utils/panelUtils';

interface PanelCanvasProps {
  panels: Panel[];
  selectedPanelId: string | null;
  showGuides: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  onPanelSelect: (id: string) => void;
  onStartResize: (id: string, corner: string, e: React.MouseEvent) => void;
  onStartDrag: (id: string, e: React.MouseEvent) => void;
  onViewPanelScript?: (id: string) => void;
  generatedScript: any | null;
}

/**
 * Renders the main canvas area with panels and guides
 */
export const PanelCanvas: React.FC<PanelCanvasProps> = ({
  panels,
  selectedPanelId,
  showGuides,
  containerRef,
  onPanelSelect,
  onStartResize,
  onStartDrag,
  onViewPanelScript,
  generatedScript
}) => {
  return (
    <div 
      id="panel-canvas-container"
      data-testid="panel-canvas-container"
      className="relative bg-gray-200 overflow-hidden"
      style={{ 
        width: CONTAINER_WIDTH, 
        height: CONTAINER_HEIGHT,
        backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
      }}
      ref={containerRef}
    >
      {/* Render guide lines if enabled */}
      {showGuides && <GuideLines showGuides={showGuides} />}
      
      {/* Render each panel */}
      {panels.map((panel) => (
        <PanelComponent
          key={panel.id}
          panel={panel}
          isSelected={selectedPanelId === panel.id}
          showControls={true}
          onSelect={() => onPanelSelect(panel.id)}
          onStartResize={(e, id, direction) => onStartResize(id, direction, e)}
          onStartDrag={(e, id) => onStartDrag(id, e)}
          onSplitHorizontally={() => {}} // Not used in this context
          onSplitVertically={() => {}} // Not used in this context
          onDelete={() => {}} // Not used in this context
          canDelete={false} // Not used in this context
          hasScript={!!generatedScript}
          onViewScript={onViewPanelScript && generatedScript ? (id) => onViewPanelScript(id) : undefined}
        />
      ))}
    </div>
  );
};

export default PanelCanvas;
