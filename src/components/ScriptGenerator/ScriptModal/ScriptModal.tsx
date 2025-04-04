/**
 * ScriptModal Component
 * 
 * Displays a modal with the complete comic script including all panels, scenes, characters,
 * dialogue, and visual directions. Modal can be closed by clicking outside or the close button.
 * 
 * This component provides a detailed view of the entire script in a modal dialog format.
 */
import React from 'react';
import { ComicPage } from '../../../../shared/types/scriptTypes';
import './ScriptModal.css';

/**
 * Props for the ScriptModal component
 */
interface ScriptModalProps {
  /** The complete comic script data to display */
  script: ComicPage;
  /** Function to call when the modal is closed */
  onClose: () => void;
}

/**
 * Modal component for displaying the complete comic script
 */
export const ScriptModal: React.FC<ScriptModalProps> = ({ script, onClose }) => {
  return (
    <div 
      id="script-modal-overlay"
      data-testid="script-modal-overlay"
      className="script-modal-overlay" 
      onClick={onClose}
    >
      <div 
        id="script-modal-container"
        data-testid="script-modal-container"
        className="script-modal" 
        onClick={e => e.stopPropagation()}
      >
        {/* Close button for the modal */}
        <button 
          id="script-modal-close-button"
          data-testid="script-modal-close-button"
          className="close-button" 
          onClick={onClose}
          aria-label="Close script modal"
        >×</button>
        <div 
          id="script-modal-content"
          data-testid="script-modal-content"
          className="script-content"
        >
          {/* Script title */}
          <h2 
            id="script-modal-title"
            data-testid="script-modal-title"
          >{script.title}</h2>
          
          {/* Synopsis section */}
          <div 
            id="script-modal-synopsis"
            data-testid="script-modal-synopsis"
            className="synopsis"
          >
            <h3>Synopsis</h3>
            <p>{script.synopsis}</p>
          </div>
          
          {/* Panels section */}
          <div 
            id="script-modal-panels"
            data-testid="script-modal-panels"
            className="panels"
          >
            {script.panels.map((panel, index) => (
              <div 
                key={panel.id} 
                id={`script-modal-panel-${panel.id}`}
                data-testid={`script-modal-panel-${panel.id}`}
                className="panel-script"
              >
                <h4 
                  id={`script-modal-panel-${panel.id}-heading`}
                  data-testid={`script-modal-panel-${panel.id}-heading`}
                >Panel {index + 1}</h4>
                
                {/* Scene details */}
                <div 
                  id={`script-modal-panel-${panel.id}-scene`}
                  data-testid={`script-modal-panel-${panel.id}-scene`}
                  className="scene"
                >
                  <h5>Scene</h5>
                  <p><strong>Setting:</strong> {panel.scene.setting}</p>
                  <p><strong>Time:</strong> {panel.scene.time}</p>
                  <p><strong>Weather:</strong> {panel.scene.weather}</p>
                  <p><strong>Description:</strong> {panel.scene.description}</p>
                </div>

                {/* Characters details */}
                <div 
                  id={`script-modal-panel-${panel.id}-characters`}
                  data-testid={`script-modal-panel-${panel.id}-characters`}
                  className="characters"
                >
                  <h5>Characters</h5>
                  {panel.characters.map((char, charIndex) => (
                    <div 
                      key={charIndex} 
                      id={`script-modal-panel-${panel.id}-character-${charIndex}`}
                      data-testid={`script-modal-panel-${panel.id}-character-${charIndex}`}
                      className="character"
                    >
                      <p>
                        <strong>{char.name}</strong>
                        {char.age && ` (${char.age})`}
                        {char.appearance && ` - ${char.appearance}`}
                      </p>
                      <p>Emotion: {char.emotion}</p>
                    </div>
                  ))}
                </div>

                {/* Dialogue details */}
                <div 
                  id={`script-modal-panel-${panel.id}-dialogue`}
                  data-testid={`script-modal-panel-${panel.id}-dialogue`}
                  className="dialogue"
                >
                  <h5>Dialogue</h5>
                  {panel.dialogue.map((d, dialogueIndex) => (
                    <div 
                      key={dialogueIndex} 
                      id={`script-modal-panel-${panel.id}-dialogue-${dialogueIndex}`}
                      data-testid={`script-modal-panel-${panel.id}-dialogue-${dialogueIndex}`}
                      className="dialogue-entry"
                    >
                      <p>
                        <strong>{d.type}</strong>
                        {d.speaker && ` - ${d.speaker}`}
                        {d.position && ` (${d.position})`}
                      </p>
                      <p className="dialogue-text">{d.text}</p>
                    </div>
                  ))}
                </div>

                {/* Visual direction details */}
                <div 
                  id={`script-modal-panel-${panel.id}-visual-direction`}
                  data-testid={`script-modal-panel-${panel.id}-visual-direction`}
                  className="visual-direction"
                >
                  <h5>Visual Direction</h5>
                  <p><strong>Shot Type:</strong> {panel.visualDirection.shotType}</p>
                  <p><strong>Angle:</strong> {panel.visualDirection.angle}</p>
                  <p><strong>Focus:</strong> {panel.visualDirection.focus}</p>
                  <p><strong>Lighting:</strong> {panel.visualDirection.lighting}</p>
                  {panel.visualDirection.detail && (
                    <p><strong>Detail:</strong> {panel.visualDirection.detail}</p>
                  )}
                  {panel.visualDirection.symbolism && (
                    <p><strong>Symbolism:</strong> {panel.visualDirection.symbolism}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
