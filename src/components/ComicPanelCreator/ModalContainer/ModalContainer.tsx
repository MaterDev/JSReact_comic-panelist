/**
 * ModalContainer Component
 * 
 * This component centralizes the management of all modals in the comic creator:
 * - Script modals (full script and panel-specific)
 * - Preview modals
 * - Export preview modals
 * - Instruction modals
 */
import React from 'react';
import { ComicPage, Panel as ScriptPanel } from '../../ScriptGenerator';

interface ModalContainerProps {
  // Script modals
  showScriptModal: boolean;
  generatedScript: ComicPage | null;
  onCloseScriptModal: () => void;
  
  // Panel script modals
  showPanelScriptModal: boolean;
  selectedScriptPanel: ScriptPanel | null;
  onClosePanelScriptModal: () => void;
  
  // Preview modals
  showPreviewModal: boolean;
  previewImage: string | null;
  onClosePreviewModal: () => void;
  
  // Export preview modals
  showExportPreviewModal: boolean;
  exportPreviewImage: string | null;
  onCloseExportPreviewModal: () => void;
  
  // Instructions modal
  showInstructionsModal: boolean;
  onCloseInstructionsModal: () => void;
}

/**
 * Renders and manages all modals for the comic creator
 */
export const ModalContainer: React.FC<ModalContainerProps> = ({
  // Script modals
  showScriptModal,
  generatedScript,
  onCloseScriptModal,
  
  // Panel script modals
  showPanelScriptModal,
  selectedScriptPanel,
  onClosePanelScriptModal,
  
  // Preview modals
  showPreviewModal,
  previewImage,
  onClosePreviewModal,
  
  // Export preview modals
  showExportPreviewModal,
  exportPreviewImage,
  onCloseExportPreviewModal,
  
  // Instructions modal
  showInstructionsModal,
  onCloseInstructionsModal
}) => {
  return (
    <>
      {/* Script Modal */}
      {showScriptModal && generatedScript && (
        <div 
          id="script-modal"
          data-testid="script-modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onCloseScriptModal}
        >
          <div 
            className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Generated Script</h2>
              <button 
                onClick={onCloseScriptModal}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            
            <div className="prose max-w-none">
              <h3>{generatedScript.title}</h3>
              {generatedScript.synopsis && (
                <div className="mb-4">
                  <h4>Description</h4>
                  <p>{generatedScript.synopsis}</p>
                </div>
              )}
              
              <h4>Panels</h4>
              {generatedScript.panels.map((panel) => (
                <div key={panel.id} className="mb-6 p-4 border rounded">
                  <h5 className="font-bold">Panel {panel.id}</h5>
                  <p>{panel.scene.description}</p>
                  {panel.dialogue && panel.dialogue.length > 0 && (
                    <div className="mt-2">
                      <h6 className="font-semibold">Dialogue:</h6>
                      <div>
                        {panel.dialogue.map((dialogue, index) => (
                          <div key={index} className="ml-2 italic">
                            {dialogue.speaker && <strong>{dialogue.speaker}: </strong>}
                            <span>{dialogue.text}</span>
                            {dialogue.type && <em> ({dialogue.type})</em>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {panel.dialogue && panel.dialogue.some(d => d.type === "caption") && (
                    <div className="mt-2">
                      <h6 className="font-semibold">Caption:</h6>
                      <div>
                        {panel.dialogue
                          .filter(d => d.type === "caption")
                          .map((caption, index) => (
                            <p key={index} className="italic">{caption.text}</p>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Panel Script Modal */}
      {showPanelScriptModal && selectedScriptPanel && (
        <div 
          id="panel-script-modal"
          data-testid="panel-script-modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClosePanelScriptModal}
        >
          <div 
            className="bg-white p-6 rounded-lg max-w-2xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Panel {selectedScriptPanel.id} Script</h2>
              <button 
                onClick={onClosePanelScriptModal}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            
            <div className="prose max-w-none">
              <h4>Description</h4>
              <p>{selectedScriptPanel.scene.description}</p>
              
              {selectedScriptPanel.dialogue && selectedScriptPanel.dialogue.length > 0 && (
                <div className="mt-4">
                  <h4>Dialogue</h4>
                  <div>
                    {selectedScriptPanel.dialogue.map((dialogue, index) => (
                      <div key={index} className="ml-2 italic">
                        {dialogue.speaker && <strong>{dialogue.speaker}: </strong>}
                        <span>{dialogue.text}</span>
                        {dialogue.type && <em> ({dialogue.type})</em>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedScriptPanel.dialogue && selectedScriptPanel.dialogue.some(d => d.type === "caption") && (
                <div className="mt-4">
                  <h4>Caption</h4>
                  <div>
                    {selectedScriptPanel.dialogue
                      .filter(d => d.type === "caption")
                      .map((caption, index) => (
                        <p key={index} className="italic">{caption.text}</p>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Preview Modal */}
      {showPreviewModal && previewImage && (
        <div 
          id="preview-modal"
          data-testid="preview-modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClosePreviewModal}
        >
          <div 
            className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Layout Preview</h2>
              <button 
                onClick={onClosePreviewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            
            <div className="flex justify-center">
              <img 
                src={previewImage} 
                alt="Layout Preview" 
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Export Preview Modal */}
      {showExportPreviewModal && (
        <div 
          id="export-preview-modal"
          data-testid="export-preview-modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onCloseExportPreviewModal}
        >
          <div 
            className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Export Preview</h2>
              <button 
                onClick={onCloseExportPreviewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            
            <div className="flex justify-center">
              {exportPreviewImage ? (
                <img 
                  src={exportPreviewImage} 
                  alt="Export Preview" 
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : (
                <div className="text-center p-8 bg-gray-100 rounded">
                  <p>No export preview available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Instructions Modal */}
      {showInstructionsModal && (
        <div 
          id="instructions-modal"
          data-testid="instructions-modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onCloseInstructionsModal}
        >
          <div 
            className="bg-white p-6 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">How to Use the Comic Panel Creator</h2>
              <button 
                onClick={onCloseInstructionsModal}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            
            <div className="prose max-w-none">
              <h3>Getting Started</h3>
              <p>
                The Comic Panel Creator allows you to design comic page layouts by adding, 
                resizing, and arranging panels. You can then generate AI-powered scripts 
                for your layouts.
              </p>
              
              <h3>Panel Operations</h3>
              <ul>
                <li><strong>Select a panel:</strong> Click on any panel to select it</li>
                <li><strong>Move a panel:</strong> Click and drag a selected panel</li>
                <li><strong>Resize a panel:</strong> Drag any corner of a selected panel</li>
                <li><strong>Split a panel:</strong> Select a panel and use the split buttons</li>
                <li><strong>Delete a panel:</strong> Select a panel and click the delete button</li>
              </ul>
              
              <h3>Generating Scripts</h3>
              <p>
                Once you've created your layout, you can generate an AI-powered script:
              </p>
              <ol>
                <li>Add creative direction (optional)</li>
                <li>Enter your API key (if required)</li>
                <li>Click "Generate Script"</li>
                <li>View the generated script for the entire page or individual panels</li>
              </ol>
              
              <h3>Saving and Loading</h3>
              <p>
                You can save your layouts to collections and load them later:
              </p>
              <ul>
                <li>Use the Collection Manager to create and manage collections</li>
                <li>Save layouts with their panel data, scripts, and creative direction</li>
                <li>Load existing layouts to continue working on them</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalContainer;
