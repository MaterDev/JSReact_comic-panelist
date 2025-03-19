import React from 'react';
import { Panel as ScriptPanel } from './scriptTypes';
import './ScriptModal.css'; // Reusing the same CSS as ScriptModal

interface PanelScriptModalProps {
  panel: ScriptPanel;
  onClose: () => void;
}

export const PanelScriptModal: React.FC<PanelScriptModalProps> = ({ panel, onClose }) => {
  return (
    <div className="script-modal-overlay" onClick={onClose}>
      <div className="script-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="script-content">
          <h3>Panel {panel.id}</h3>
          
          <div className="scene">
            <h4>Scene</h4>
            <p><strong>Setting:</strong> {panel.scene.setting}</p>
            <p><strong>Time:</strong> {panel.scene.time}</p>
            <p><strong>Weather:</strong> {panel.scene.weather}</p>
            <p><strong>Description:</strong> {panel.scene.description}</p>
          </div>

          <div className="characters">
            <h4>Characters</h4>
            {panel.characters.map((char, charIndex) => (
              <div key={charIndex} className="character">
                <p>
                  <strong>{char.name}</strong>
                  {char.age && ` (${char.age})`}
                  {char.appearance && ` - ${char.appearance}`}
                </p>
                <p>Emotion: {char.emotion}</p>
              </div>
            ))}
          </div>

          <div className="dialogue">
            <h4>Dialogue</h4>
            {panel.dialogue.map((d, dialogueIndex) => (
              <div key={dialogueIndex} className="dialogue-entry">
                <p>
                  <strong>{d.type}</strong>
                  {d.speaker && ` - ${d.speaker}`}
                  {d.position && ` (${d.position})`}
                </p>
                <p className="dialogue-text">{d.text}</p>
              </div>
            ))}
          </div>

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
