import React from 'react';
import { ScriptModal, PanelScriptModal, ComicPage, Panel as ScriptPanel } from '../../ScriptGenerator';
import { AIPreviewModal } from '../../AIPreviewModal';
import { ExportPreviewModal } from '../../ExportPreviewModal';
import { InstructionsModal } from '../../InstructionsModal';

interface ModalManagerProps {
  showScriptModal: boolean;
  showPanelScriptModal: boolean;
  showPreviewModal: boolean;
  showExportPreviewModal: boolean;
  showInstructionsModal: boolean;
  generatedScript: ComicPage | null;
  selectedScriptPanel: ScriptPanel | null;
  previewImage: string | null;
  exportPreviewImage: string | null;
  onCloseScriptModal: () => void;
  onClosePanelScriptModal: () => void;
  onClosePreviewModal: () => void;
  onCloseExportPreviewModal: () => void;
  onCloseInstructionsModal: () => void;
}

export const ModalManager: React.FC<ModalManagerProps> = ({
  showScriptModal,
  showPanelScriptModal,
  showPreviewModal,
  showExportPreviewModal,
  showInstructionsModal,
  generatedScript,
  selectedScriptPanel,
  previewImage,
  exportPreviewImage,
  onCloseScriptModal,
  onClosePanelScriptModal,
  onClosePreviewModal,
  onCloseExportPreviewModal,
  onCloseInstructionsModal
}) => {
  return (
    <>
      {showScriptModal && generatedScript && (
        <ScriptModal
          script={generatedScript}
          onClose={onCloseScriptModal}
        />
      )}
      
      {showPanelScriptModal && selectedScriptPanel && (
        <PanelScriptModal
          panel={selectedScriptPanel}
          onClose={onClosePanelScriptModal}
        />
      )}
      
      {showPreviewModal && previewImage && (
        <AIPreviewModal
          imageUrl={previewImage}
          onClose={onClosePreviewModal}
        />
      )}
      
      {showExportPreviewModal && exportPreviewImage && (
        <ExportPreviewModal
          imageUrl={exportPreviewImage}
          onClose={onCloseExportPreviewModal}
        />
      )}
      
      {showInstructionsModal && (
        <InstructionsModal
          onClose={onCloseInstructionsModal}
        />
      )}
    </>
  );
};

export default ModalManager;
