import React from 'react';
import { ComicPage } from '../../../shared/types/comic';
import './ScriptDisplay.css';

interface ScriptDisplayProps {
  script: ComicPage | null;
  isLoading: boolean;
  error: string | null;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="script-display loading">
        <p>Generating your comic script...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="script-display error">
        <p>{error}</p>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="script-display empty">
        <p>Your generated script will appear here</p>
      </div>
    );
  }

  return (
    <div className="script-display">
      <h2>{script.title}</h2>
      <div className="synopsis">
        <h3>Synopsis</h3>
        <p>{script.synopsis}</p>
      </div>
      
      <div className="panels">
        <h3>Panels</h3>
        {script.panels.map((panel, index) => (
          <div key={panel.id} className="panel">
            <h4>Panel {index + 1}</h4>
            
            <div className="scene">
              <h5>Scene</h5>
              <p><strong>Setting:</strong> {panel.scene.setting}</p>
              <p><strong>Time:</strong> {panel.scene.time}</p>
              <p><strong>Weather:</strong> {panel.scene.weather}</p>
              <p><strong>Description:</strong> {panel.scene.description}</p>
            </div>

            <div className="characters">
              <h5>Characters</h5>
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
              <h5>Dialogue</h5>
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
  );
};
