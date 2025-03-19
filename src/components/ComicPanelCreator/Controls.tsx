import React, { useState } from 'react';
import { Panel } from './types';
import InstructionsModal from './InstructionsModal';

export type ExportFormat = 'pdf' | 'png';

interface ControlsProps {
  gutterSize: number;
  onGutterSizeChange: (size: number) => void;
  showControls: boolean;
  onShowControlsChange: (show: boolean) => void;
  showGuides: boolean;
  onShowGuidesChange: (show: boolean) => void;
  onResetPanels: () => void;
  onExport: (format: ExportFormat) => void;
  exportFormat: ExportFormat;
  onExportFormatChange: (format: ExportFormat) => void;
  selectedPanel: Panel | undefined;
}

export const Controls: React.FC<ControlsProps> = ({
  gutterSize,
  onGutterSizeChange,
  showControls,
  onShowControlsChange,
  showGuides,
  onShowGuidesChange,
  onResetPanels,
  onExport,
  exportFormat,
  onExportFormatChange,
  selectedPanel,
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Gutter Size (px):
          <input
            type="range"
            min="0"
            max="30"
            value={gutterSize}
            onChange={(e) => onGutterSizeChange(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-sm ml-2">{gutterSize}px</span>
        </label>
      </div>

      <div className="p-4 bg-gray-100 dark:bg-dark-700 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium">Global Controls:</p>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={showControls}
                onChange={(e) => onShowControlsChange(e.target.checked)}
              />
              Show Controls
            </label>
            <label className="flex items-center gap-1 text-sm ml-4">
              <input
                type="checkbox"
                checked={showGuides}
                onChange={(e) => onShowGuidesChange(e.target.checked)}
              />
              Show Print Guides
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={onResetPanels}
            className="bg-gray-500 hover:bg-gray-600 dark:bg-dark-600 dark:hover:bg-dark-500 text-white px-3 py-1 rounded text-sm"
          >
            Reset All Panels
          </button>
          


          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4 text-sm">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exportFormat"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={() => onExportFormatChange('pdf')}
                  className="mr-1"
                />
                PDF
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="exportFormat"
                  value="png"
                  checked={exportFormat === 'png'}
                  onChange={() => onExportFormatChange('png')}
                  className="mr-1"
                />
                PNG
              </label>
            </div>
            <button
              onClick={() => onExport(exportFormat)}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white px-3 py-1 rounded text-sm"
            >
              Export as {exportFormat.toUpperCase()}
            </button>
          </div>
        </div>

        {selectedPanel && (
          <div className="text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-dark-600 p-2 rounded">
            <p>Selected: {selectedPanel.id}</p>
            <p>Position: {selectedPanel.x.toFixed(1)}%, {selectedPanel.y.toFixed(1)}%</p>
            <p>Size: {selectedPanel.width.toFixed(1)}% × {selectedPanel.height.toFixed(1)}%</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-100 dark:bg-dark-700 rounded-lg">
        <button
          onClick={() => setShowInstructions(true)}
          className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          View Instructions
        </button>
        {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
      </div>
    </div>
  );
};
