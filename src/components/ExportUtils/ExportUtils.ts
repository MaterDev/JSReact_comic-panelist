import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExportFormat } from '../Controls';
import { 
  CONTAINER_WIDTH, 
  CONTAINER_HEIGHT 
} from '../../utils/panelUtils';

/**
 * Prepares a clone of the comic container for export
 * Applies styling for guidelines and panels according to print standards
 */
export const prepareContainerForExport = (
  containerElement: HTMLElement
): HTMLElement => {
  // Create a temporary container with white background
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.backgroundColor = 'white';
  tempContainer.style.margin = '0';
  tempContainer.style.padding = '0';
  tempContainer.style.border = 'none';
  document.body.appendChild(tempContainer);

  // Clone the comic container
  const clone = containerElement.cloneNode(true) as HTMLElement;
  clone.style.backgroundColor = 'white';
  clone.style.overflow = 'visible';
  clone.style.position = 'relative';
  clone.style.width = `${CONTAINER_WIDTH}px`;
  clone.style.height = `${CONTAINER_HEIGHT}px`;
  clone.style.margin = '0';
  clone.style.padding = '0';
  clone.style.border = 'none';
  tempContainer.appendChild(clone);
  
  // Hide panel numbers in the clone for export
  const panelNumbers = clone.querySelectorAll('.panel-number');
  panelNumbers.forEach((element) => {
    (element as HTMLElement).style.display = 'none';
  });
  
  // Convert guidelines to non-photo blue for the export
  const guideLines = clone.querySelectorAll('[data-guide-element="true"]');
  guideLines.forEach((element) => {
    (element as HTMLElement).style.border = '1px solid #A4DDED'; // Non-photo blue color
    (element as HTMLElement).style.opacity = '0.7'; // Higher transparency but still visible
  });
  
  // Hide guideline labels in the export
  const guideLabels = clone.querySelectorAll('[data-guide-element="true"] div');
  guideLabels.forEach((element) => {
    (element as HTMLElement).style.display = 'none';
  });
  
  // Add black borders to all panels and make backgrounds transparent
  const panelElements = clone.querySelectorAll('.panel');
  panelElements.forEach((element) => {
    (element as HTMLElement).style.border = '1px solid #000000';
    (element as HTMLElement).style.backgroundColor = 'transparent';
  });

  return tempContainer;
};

/**
 * Captures the prepared container as a canvas
 */
export const captureContainerAsCanvas = async (
  preparedContainer: HTMLElement
): Promise<HTMLCanvasElement> => {
  const clone = preparedContainer.firstChild as HTMLElement;
  
  // Use html2canvas to capture the comic container
  const canvas = await html2canvas(clone, {
    backgroundColor: 'white',
    scale: 2, // Higher resolution
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    logging: false,
    removeContainer: true,
    x: 0,
    y: 0,
    windowWidth: CONTAINER_WIDTH,
    windowHeight: CONTAINER_HEIGHT
  });

  return canvas;
};

/**
 * Exports the comic as either PNG or PDF
 */
export const exportComic = async ({
  containerRef,
  format,
  onBeforeExport,
  onAfterExport
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  format: ExportFormat;
  onBeforeExport?: () => void;
  onAfterExport?: () => void;
}): Promise<void> => {
  if (!containerRef.current) return;

  // Call the before export callback if provided
  if (onBeforeExport) {
    onBeforeExport();
  }

  try {
    // Wait for the UI to update
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create a temporary container with white background
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.margin = '0';
    tempContainer.style.padding = '0';
    tempContainer.style.border = 'none';
    document.body.appendChild(tempContainer);

    // Clone the comic container
    const clone = containerRef.current.cloneNode(true) as HTMLElement;
    clone.style.backgroundColor = 'white';
    clone.style.overflow = 'visible';
    clone.style.position = 'relative';
    clone.style.width = `${CONTAINER_WIDTH}px`;
    clone.style.height = `${CONTAINER_HEIGHT}px`;
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.border = 'none';
    tempContainer.appendChild(clone);
    
    // Hide panel numbers in the clone for export
    const panelNumbers = clone.querySelectorAll('.panel-number');
    panelNumbers.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Hide panel controls in the export
    const panelControls = clone.querySelectorAll('.panel-controls');
    panelControls.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Hide resize handles in the export
    const resizeHandles = clone.querySelectorAll('.resize-handle');
    resizeHandles.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Convert guidelines to non-photo blue for the export
    const guideLines = clone.querySelectorAll('[data-guide-element="true"]');
    guideLines.forEach((element) => {
      (element as HTMLElement).style.border = '1px solid #A4DDED'; // Non-photo blue color
      (element as HTMLElement).style.opacity = '0.7'; // Higher transparency but still visible
    });
    
    // Hide guideline labels in the export
    const guideLabels = clone.querySelectorAll('[data-guide-element="true"] div');
    guideLabels.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Add black borders to all panels and make backgrounds transparent
    const panelElements = clone.querySelectorAll('.panel');
    panelElements.forEach((element) => {
      (element as HTMLElement).style.border = '1px solid #000000';
      (element as HTMLElement).style.backgroundColor = 'transparent'; // Completely transparent in exports
    });

    // Capture the container as a canvas
    const canvas = await html2canvas(clone, {
      backgroundColor: 'white',
      scale: 2, // Higher resolution
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
      logging: false,
      removeContainer: true,
      x: 0,
      y: 0,
      windowWidth: CONTAINER_WIDTH,
      windowHeight: CONTAINER_HEIGHT
    });

    // Get image data from canvas
    const imgData = canvas.toDataURL('image/png');
    
    if (format === 'pdf') {
      // Create PDF with correct aspect ratio
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (CONTAINER_HEIGHT * imgWidth) / CONTAINER_WIDTH;
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
      });

      // Add the canvas image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save('comic-panels.pdf');
    } else if (format === 'png') {
      // For PNG export, create a download link
      const link = document.createElement('a');
      link.download = 'comic-panels.png';
      link.href = imgData;
      link.click();
    }

    // Clean up
    document.body.removeChild(tempContainer);
  } catch (error) {
    console.error('Error exporting comic:', error);
  } finally {
    // Call the after export callback if provided
    if (onAfterExport) {
      onAfterExport();
    }
  }
};

/**
 * Generates a preview image specifically for AI script generation
 * Shows panel numbers but hides controls and resize handles
 */
export const generateAIPreviewImage = async (
  containerRef: React.RefObject<HTMLDivElement>
): Promise<string | null> => {
  if (!containerRef.current) return null;

  try {
    // Create a temporary container with white background
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.margin = '0';
    tempContainer.style.padding = '0';
    tempContainer.style.border = 'none';
    document.body.appendChild(tempContainer);

    // Clone the comic container
    const clone = containerRef.current.cloneNode(true) as HTMLElement;
    clone.style.backgroundColor = 'white';
    clone.style.overflow = 'visible';
    clone.style.position = 'relative';
    clone.style.width = `${CONTAINER_WIDTH}px`;
    clone.style.height = `${CONTAINER_HEIGHT}px`;
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.border = 'none';
    tempContainer.appendChild(clone);
    
    // Keep panel numbers visible for AI preview
    // Make them large and prominent
    const panelNumbers = clone.querySelectorAll('.panel-number');
    panelNumbers.forEach((element) => {
      (element as HTMLElement).style.fontSize = '32px';
      (element as HTMLElement).style.fontWeight = 'bold';
      (element as HTMLElement).style.color = '#000000';
    });
    
    // Hide panel controls in the preview
    const panelControls = clone.querySelectorAll('.panel-controls');
    panelControls.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Hide resize handles in the preview
    const resizeHandles = clone.querySelectorAll('.resize-handle');
    resizeHandles.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Completely hide guidelines for AI preview
    const guideLines = clone.querySelectorAll('[data-guide-element="true"]');
    guideLines.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Hide guideline labels in the preview
    const guideLabels = clone.querySelectorAll('[data-guide-element="true"] div');
    guideLabels.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Add black borders to all panels and make backgrounds semi-transparent
    const panelElements = clone.querySelectorAll('.panel');
    panelElements.forEach((element) => {
      (element as HTMLElement).style.border = '1px solid #000000';
      (element as HTMLElement).style.backgroundColor = 'rgba(150, 150, 150, 0.2)';
    });

    // Capture the container as a canvas
    const canvas = await html2canvas(clone, {
      backgroundColor: 'white',
      scale: 2, // Higher resolution
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
      logging: false,
      removeContainer: true,
      x: 0,
      y: 0,
      windowWidth: CONTAINER_WIDTH,
      windowHeight: CONTAINER_HEIGHT
    });

    // Get image data from canvas
    const imgData = canvas.toDataURL('image/png');
    
    // Clean up
    document.body.removeChild(tempContainer);
    
    return imgData;
  } catch (error) {
    console.error('Error generating AI preview image:', error);
    return null;
  }
};

/**
 * Generates a preview image of the comic exactly as it would be exported
 * This is for the export preview, not the AI preview
 */
export const generatePreviewImage = async (
  containerRef: React.RefObject<HTMLDivElement>
): Promise<string | null> => {
  if (!containerRef.current) return null;

  try {
    // Create a temporary container with white background
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.margin = '0';
    tempContainer.style.padding = '0';
    tempContainer.style.border = 'none';
    document.body.appendChild(tempContainer);

    // Clone the comic container
    const clone = containerRef.current.cloneNode(true) as HTMLElement;
    clone.style.backgroundColor = 'white';
    clone.style.overflow = 'visible';
    clone.style.position = 'relative';
    clone.style.width = `${CONTAINER_WIDTH}px`;
    clone.style.height = `${CONTAINER_HEIGHT}px`;
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.border = 'none';
    tempContainer.appendChild(clone);
    
    // Hide panel numbers in the clone for export
    const panelNumbers = clone.querySelectorAll('.panel-number');
    panelNumbers.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Hide panel controls in the preview
    const panelControls = clone.querySelectorAll('.panel-controls');
    panelControls.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Hide resize handles in the preview
    const resizeHandles = clone.querySelectorAll('.resize-handle');
    resizeHandles.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Convert guidelines to non-photo blue for the export
    const guideLines = clone.querySelectorAll('[data-guide-element="true"]');
    guideLines.forEach((element) => {
      (element as HTMLElement).style.border = '1px solid #A4DDED'; // Non-photo blue color
      (element as HTMLElement).style.opacity = '0.7'; // Higher transparency but still visible
    });
    
    // Hide guideline labels in the export
    const guideLabels = clone.querySelectorAll('[data-guide-element="true"] div');
    guideLabels.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });
    
    // Add black borders to all panels and make backgrounds transparent
    const panelElements = clone.querySelectorAll('.panel');
    panelElements.forEach((element) => {
      (element as HTMLElement).style.border = '1px solid #000000';
      (element as HTMLElement).style.backgroundColor = 'transparent'; // Completely transparent in exports
    });

    // Capture the container as a canvas
    const canvas = await html2canvas(clone, {
      backgroundColor: 'white',
      scale: 2, // Higher resolution
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
      logging: false,
      removeContainer: true,
      x: 0,
      y: 0,
      windowWidth: CONTAINER_WIDTH,
      windowHeight: CONTAINER_HEIGHT
    });

    // Get image data from canvas
    const imgData = canvas.toDataURL('image/png');
    
    // Clean up
    document.body.removeChild(tempContainer);
    
    return imgData;
  } catch (error) {
    console.error('Error generating preview image:', error);
    return null;
  }
};
