/**
 * Export Options Hook
 * 
 * This hook manages export functionality in the comic creator:
 * - Export format selection
 * - Preview generation
 * - Export actions
 */
import { useState, useCallback, RefObject } from 'react';
import { exportComic as exportComicUtil } from '../utils/exportUtils';
import { ExportFormat } from '../Controls/Controls';

interface UseExportOptionsProps {
  containerRef: RefObject<HTMLDivElement>;
  onBeforeExport?: () => void;
  onAfterExport?: () => void;
}

interface UseExportOptionsReturn {
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  handleExportComic: (format?: ExportFormat) => Promise<void>;
  showControls: boolean;
  setShowControls: (show: boolean) => void;
}

/**
 * Hook for managing export options and functionality
 */
export const useExportOptions = ({
  containerRef,
  onBeforeExport,
  onAfterExport
}: UseExportOptionsProps): UseExportOptionsReturn => {
  // Export state
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [showControls, setShowControls] = useState(true);

  /**
   * Handles the export action based on the selected format
   */
  const handleExportComic = useCallback(async (format?: ExportFormat): Promise<void> => {
    const formatToUse = format || exportFormat;
    
    try {
      // Hide controls before export if needed
      if (onBeforeExport) {
        onBeforeExport();
      } else {
        setShowControls(false);
      }

      // Use the imported exportComic utility function
      await exportComicUtil({
        containerRef,
        format: formatToUse,
        onBeforeExport: () => {},
        onAfterExport: () => {}
      });
    } catch (error) {
      console.error('Error exporting comic:', error);
    } finally {
      // Show controls after export
      if (onAfterExport) {
        onAfterExport();
      } else {
        setShowControls(true);
      }
    }
  }, [containerRef, exportFormat, onBeforeExport, onAfterExport]);

  return {
    exportFormat,
    setExportFormat,
    handleExportComic,
    showControls,
    setShowControls
  };
};
