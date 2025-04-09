import React from 'react';
import { ScriptModal, PanelScriptModal, ComicPage, Panel as ScriptPanel } from '../../ScriptGenerator';
import { AIPreviewModal } from '../../AIPreviewModal';
import { ExportPreviewModal } from '../../ExportPreviewModal';
import { InstructionsModal } from '../../InstructionsModal';
import { ExportFormat } from '../Controls/Controls';

interface ModalManagerProps {
  showScriptModal: boolean;
  showPanelScriptModal: boolean;
  showPreviewModal: boolean;
  showExportPreviewModal: boolean;
  showInstructionsModal: boolean;
  generatedScript: ComicPage | null;
  selectedScriptPanel: ScriptPanel | null;
  previewImage: string | null;
  containerRef: React.RefObject<HTMLDivElement> | null;
  exportFormat: ExportFormat;
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
  containerRef,
  exportFormat,
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
      
      {showExportPreviewModal && containerRef && (
        <ExportPreviewModal
          containerRef={containerRef}
          exportFormat={exportFormat}
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
