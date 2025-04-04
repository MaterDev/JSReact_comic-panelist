/**
 * Modal State Hook
 * 
 * This hook centralizes modal visibility management:
 * - Script modals
 * - Preview modals
 * - Export modals
 * - Instructions modal
 */
import { useState, useCallback } from 'react';

interface UseModalStateProps {
  generatePreviewImage?: () => Promise<string>;
}

interface UseModalStateReturn {
  // Script modals
  showScriptModal: boolean;
  setShowScriptModal: (show: boolean) => void;
  
  // Preview modals
  showPreviewModal: boolean;
  setShowPreviewModal: (show: boolean) => void;
  previewImage: string | null;
  setPreviewImage: (image: string | null) => void;
  
  // Export modals
  showExportPreviewModal: boolean;
  setShowExportPreviewModal: (show: boolean) => void;
  
  // Instructions modal
  showInstructions: boolean;
  setShowInstructions: (show: boolean) => void;
  
  // Modal action handlers
  handleOpenScriptModal: () => void;
  handleCloseScriptModal: () => void;
  handleOpenPreviewModal: (image: string) => void;
  handleClosePreviewModal: () => void;
  handleOpenExportPreviewModal: () => void;
  handleCloseExportPreviewModal: () => void;
  handleOpenInstructionsModal: () => void;
  handleCloseInstructionsModal: () => void;
  handlePreviewClick: () => Promise<void>;
}

/**
 * Hook for managing modal visibility state
 */
export const useModalState = ({ 
  generatePreviewImage 
}: UseModalStateProps = {}): UseModalStateReturn => {
  // Script modal state
  const [showScriptModal, setShowScriptModal] = useState(false);
  
  // Preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Export modal state
  const [showExportPreviewModal, setShowExportPreviewModal] = useState(false);
  
  // Instructions modal state
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Script modal handlers
  const handleOpenScriptModal = useCallback(() => {
    setShowScriptModal(true);
  }, []);
  
  const handleCloseScriptModal = useCallback(() => {
    setShowScriptModal(false);
  }, []);
  
  // Preview modal handlers
  const handleOpenPreviewModal = useCallback((image: string) => {
    setPreviewImage(image);
    setShowPreviewModal(true);
  }, []);
  
  /**
   * Handles preview generation and displays it in a modal
   */
  const handlePreviewClick = useCallback(async () => {
    if (!generatePreviewImage) return;
    
    try {
      const previewImageData = await generatePreviewImage();
      setPreviewImage(previewImageData);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  }, [generatePreviewImage]);
  
  const handleClosePreviewModal = useCallback(() => {
    setShowPreviewModal(false);
  }, []);
  
  // Export modal handlers
  const handleOpenExportPreviewModal = useCallback(() => {
    setShowExportPreviewModal(true);
  }, []);
  
  const handleCloseExportPreviewModal = useCallback(() => {
    setShowExportPreviewModal(false);
  }, []);
  
  // Instructions modal handlers
  const handleOpenInstructionsModal = useCallback(() => {
    setShowInstructions(true);
  }, []);
  
  const handleCloseInstructionsModal = useCallback(() => {
    setShowInstructions(false);
  }, []);
  
  return {
    // Modal state
    showScriptModal,
    setShowScriptModal,
    showPreviewModal,
    setShowPreviewModal,
    previewImage,
    setPreviewImage,
    showExportPreviewModal,
    setShowExportPreviewModal,
    showInstructions,
    setShowInstructions,
    
    // Modal handlers
    handleOpenScriptModal,
    handleCloseScriptModal,
    handleOpenPreviewModal,
    handleClosePreviewModal,
    handleOpenExportPreviewModal,
    handleCloseExportPreviewModal,
    handleOpenInstructionsModal,
    handleCloseInstructionsModal,
    handlePreviewClick
  };
};
