import React from 'react';
import { Panel } from './types';

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

      <div className="p-4 bg-gray-100 rounded-lg">
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
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
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
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
            >
              Export as {exportFormat.toUpperCase()}
            </button>
          </div>
        </div>

        {selectedPanel && (
          <div className="text-xs text-gray-600 bg-white p-2 rounded">
            <p>Selected: {selectedPanel.id}</p>
            <p>Position: {selectedPanel.x.toFixed(1)}%, {selectedPanel.y.toFixed(1)}%</p>
            <p>Size: {selectedPanel.width.toFixed(1)}% × {selectedPanel.height.toFixed(1)}%</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-sm font-medium">Instructions:</p>
        <ul className="text-xs text-gray-600 mt-1 list-disc pl-4 space-y-1">
          <li>Click on a panel to select it</li>
          <li>Use the buttons inside each panel to split or delete</li>
          <li>Drag any panel to reposition it</li>
          <li>Resize panels with the corner and edge handles</li>
          <li>Toggle "Show Controls" to hide panel controls</li>
          <li>Controls are automatically hidden when exporting</li>
        </ul>
      </div>
    </div>
  );
};
