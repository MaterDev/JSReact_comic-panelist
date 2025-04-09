/**
 * ScriptDisplay Component
 * 
 * Displays the generated comic script with all panels, scenes, characters, dialogue, and visual directions.
 * Handles different states including loading, error, and empty states.
 * 
 * This component is the main display area for the complete comic script after generation.
 */
import React from 'react';
import { ComicPage } from '../../../../shared/types/scriptTypes';
import './ScriptDisplay.css';

/**
 * Props for the ScriptDisplay component
 */
interface ScriptDisplayProps {
  /** The complete comic script data to display, null if not yet generated */
  script: ComicPage | null;
  /** Whether the script is currently being generated */
  isLoading: boolean;
  /** Error message if script generation failed, null otherwise */
  error: string | null;
}

/**
 * Script display component for rendering the complete comic script or status messages
 */
export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script, isLoading, error }) => {
  
  // Loading state
  if (isLoading) {
    return (
      <div 
        id="script-display-loading"
        data-testid="script-display-loading"
        className="script-display loading"
      >
        <p>Generating your comic script...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        id="script-display-error"
        data-testid="script-display-error"
        className="script-display error"
      >
        <p>{error}</p>
      </div>
    );
  }

  // Empty state - no script generated
  if (!script) {
    return (
      <div 
        id="script-display-empty"
        data-testid="script-display-empty"
        className="script-display empty"
      >
        <p>Your generated script will appear here</p>
      </div>
    );
  }

  return (
    <div 
      id="script-display-content"
      data-testid="script-display-content"
      className="script-display"
    >
      {/* Script title */}
      <h2 
        id="script-display-title"
        data-testid="script-display-title"
      >{script.title}</h2>
      
      {/* Script synopsis */}
      <div 
        id="script-display-synopsis"
        data-testid="script-display-synopsis"
        className="synopsis"
      >
        <h3>Synopsis</h3>
        <p>{script.synopsis}</p>
      </div>
      
      {/* Script panels */}
      <div 
        id="script-display-panels"
        data-testid="script-display-panels"
        className="panels"
      >
        <h3>Panels</h3>
        {script.panels.map((panel, index) => (
          <div 
            key={panel.id} 
            id={`script-display-panel-${panel.id}`}
            data-testid={`script-display-panel-${panel.id}`}
            className="panel"
          >
            <h4>Panel {index + 1}</h4>
            
            {/* Scene details */}
            <div 
              id={`script-display-panel-${panel.id}-scene`}
              data-testid={`script-display-panel-${panel.id}-scene`}
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
              id={`script-display-panel-${panel.id}-characters`}
              data-testid={`script-display-panel-${panel.id}-characters`}
              className="characters"
            >
              <h5>Characters</h5>
              {panel.characters.map((char, charIndex) => (
                <div 
                  key={charIndex} 
                  id={`script-display-panel-${panel.id}-character-${charIndex}`}
                  data-testid={`script-display-panel-${panel.id}-character-${charIndex}`}
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
              id={`script-display-panel-${panel.id}-dialogue`}
              data-testid={`script-display-panel-${panel.id}-dialogue`}
              className="dialogue"
            >
              <h5>Dialogue</h5>
              {panel.dialogue.map((d, dialogueIndex) => (
                <div 
                  key={dialogueIndex} 
                  id={`script-display-panel-${panel.id}-dialogue-${dialogueIndex}`}
                  data-testid={`script-display-panel-${panel.id}-dialogue-${dialogueIndex}`}
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
              id={`script-display-panel-${panel.id}-visual-direction`}
              data-testid={`script-display-panel-${panel.id}-visual-direction`}
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
  );
};
