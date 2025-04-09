/**
 * PanelScriptModal Component
 * 
 * Displays a modal with detailed script information for a single comic panel, including:
 * - Scene details (setting, time, weather, description)
 * - Character information (names, ages, appearances, emotions)
 * - Dialogue entries with speaker information and text
 * 
 * This component is used when users want to view or interact with the script
 * for a specific panel in detail.
 */
import React from 'react';
import { Panel as ScriptPanel, Character, Dialogue } from '../../../../shared/types/scriptTypes';
import '../ScriptModal/ScriptModal.css'; // Reusing the same CSS as ScriptModal

/**
 * Props for the PanelScriptModal component
 */
interface PanelScriptModalProps {
  /** The panel data containing script information */
  panel: ScriptPanel;
  /** Function to call when the modal is closed */
  onClose: () => void;
}

export const PanelScriptModal: React.FC<PanelScriptModalProps> = ({ panel, onClose }) => {
  return (
    <div
      id="panel-script-modal-overlay"
      data-testid="panel-script-modal-overlay"
      className="script-modal-overlay"
      onClick={onClose}
    >
      <div
        id="panel-script-modal-container"
        data-testid="panel-script-modal-container"
        className="script-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button for the modal */}
        <button
          id="panel-script-modal-close-button"
          data-testid="panel-script-modal-close-button"
          className="close-button"
          onClick={onClose}
          aria-label="Close panel script"
        >×</button>
        <div
          id="panel-script-modal-content"
          data-testid="panel-script-modal-content"
          className="script-content"
        >
          {/* Panel title */}
          <h3
            id="panel-script-modal-title"
            data-testid="panel-script-modal-title"
          >Panel {panel.id}</h3>

          {/* Scene details */}
          <div
            id="panel-script-modal-scene"
            data-testid="panel-script-modal-scene"
            className="scene"
          >
            <h4
              id="panel-script-modal-scene-heading"
              data-testid="panel-script-modal-scene-heading"
            >Scene</h4>
            <p><strong>Setting:</strong> {panel.scene.setting}</p>
            <p><strong>Time:</strong> {panel.scene.time}</p>
            <p><strong>Weather:</strong> {panel.scene.weather}</p>
            <p><strong>Description:</strong> {panel.scene.description}</p>
          </div>

          {/* Characters details */}
          <div
            id="panel-script-modal-characters"
            data-testid="panel-script-modal-characters"
            className="characters"
          >
            <h4
              id="panel-script-modal-characters-heading"
              data-testid="panel-script-modal-characters-heading"
            >Characters</h4>
            {panel.characters.map((char: Character, charIndex: number) => (
              <div
                key={charIndex}
                id={`panel-script-modal-character-${charIndex}`}
                data-testid={`panel-script-modal-character-${charIndex}`}
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
            id="panel-script-modal-dialogue"
            data-testid="panel-script-modal-dialogue"
            className="dialogue"
          >
            <h4
              id="panel-script-modal-dialogue-heading"
              data-testid="panel-script-modal-dialogue-heading"
            >Dialogue</h4>
            {panel.dialogue.map((d: Dialogue, dialogueIndex: number) => (
              <div
                key={dialogueIndex}
                id={`panel-script-modal-dialogue-entry-${dialogueIndex}`}
                data-testid={`panel-script-modal-dialogue-entry-${dialogueIndex}`}
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
          <div className="visual-direction">
            <h4>Visual Direction</h4>
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
      </div>
    </div>
  );
};
