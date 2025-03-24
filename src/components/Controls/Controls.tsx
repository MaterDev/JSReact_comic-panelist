import React from 'react';
import { Panel } from '../../types/panelTypes';

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
  onShowExportPreview: () => void;
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
  onShowExportPreview,
  exportFormat,
  onExportFormatChange,
  selectedPanel,
}) => {
  return (
    <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600 shadow-sm space-y-3">      
      <h2 className="text-base font-semibold mb-2">Panel Controls</h2>
      <div>
        <label className="block text-xs font-medium mb-1">
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

      <div className="p-3 bg-gray-100 dark:bg-dark-700 rounded-lg">
        <div className="flex flex-col space-y-2 mb-2">
          <p className="text-xs font-medium">Global Controls:</p>
          <div className="flex flex-col space-y-1">
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={showControls}
                onChange={(e) => onShowControlsChange(e.target.checked)}
              />
              Show Controls
            </label>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={showGuides}
                onChange={(e) => onShowGuidesChange(e.target.checked)}
              />
              Show Print Guides
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-2">
          <button
            onClick={onResetPanels}
            className="bg-gray-500 hover:bg-gray-600 dark:bg-dark-600 dark:hover:bg-dark-500 text-white px-2 py-1 rounded text-xs"
          >
            Reset All Panels
          </button>
          


          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3 text-xs">
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
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => onShowExportPreview()}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center justify-center"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Preview {exportFormat.toUpperCase()} Export
              </button>
              <button
                onClick={() => onExport(exportFormat)}
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white px-2 py-1 rounded text-xs"
              >
                Export as {exportFormat.toUpperCase()}
              </button>
            </div>
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


    </div>
  );
};
