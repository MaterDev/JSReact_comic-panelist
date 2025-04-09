/**
 * ScriptGenerationSection Component
 * 
 * Displays information about AI script generation within the instructions modal.
 * Includes script generation process and creative control explanations.
 */
import React from 'react';

/**
 * Renders the AI script generation section for the instructions modal
 * 
 * @returns A React component with script generation and creative controls explanations
 */
export const ScriptGenerationSection: React.FC = () => {
  return (
    <div
      id="instructions-modal-script-generation-section"
      data-testid="instructions-modal-script-generation-section"
      className="space-y-4"
    >
      {/* Script Generation Process */}
      <div
        id="instructions-modal-script-process"
        data-testid="instructions-modal-script-process"
      >
        <h4 
          id="instructions-modal-script-process-title"
          data-testid="instructions-modal-script-process-title"
          className="font-medium mb-2"
        >Script Generation Process</h4>
        <ol 
          id="instructions-modal-script-process-list"
          data-testid="instructions-modal-script-process-list"
          className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300"
        >
          <li>Create your panel layout first</li>
          <li>Click "Preview AI Image" to see exactly what will be sent to the AI</li>
          <li>Use the "Generate Script" button to create a script based on your layout</li>
          <li>Review and edit the generated script in the script panel</li>
          <li>Save your layout with the script to revisit later</li>
        </ol>
      </div>
      
      {/* Creative Direction Controls */}
      <div
        id="instructions-modal-creative-controls"
        data-testid="instructions-modal-creative-controls"
      >
        <h4 
          id="instructions-modal-creative-controls-title"
          data-testid="instructions-modal-creative-controls-title"
          className="font-medium mb-2"
        >Creative Direction Controls</h4>
        <ul 
          id="instructions-modal-creative-controls-list"
          data-testid="instructions-modal-creative-controls-list"
          className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300"
        >
          <li><span className="font-medium">Genre:</span> Specify genre preferences (e.g., Sci-fi, Fantasy, Noir)</li>
          <li><span className="font-medium">Tone:</span> Set emotional tone (e.g., Suspenseful, Humorous)</li>
          <li><span className="font-medium">Inspiration:</span> Provide sources of inspiration (e.g., Film noir, Cyberpunk)</li>
          <li><span className="font-medium">Detailed Guidance:</span> Add longer inspiration text for more specific direction</li>
          <li><span className="font-medium">Exclusions:</span> List content you want to avoid in the script</li>
        </ul>
      </div>
    </div>
  );
};
