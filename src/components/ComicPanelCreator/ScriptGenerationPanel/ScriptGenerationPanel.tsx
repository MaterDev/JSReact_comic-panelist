import React, { useState } from 'react';

interface ScriptGenerationPanelProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  isGeneratingScript: boolean;
  onGenerateScript: () => void;
  hasGeneratedScript: boolean;
  onViewScript: () => void;
  onPreviewClick: () => void;
}

export const ScriptGenerationPanel: React.FC<ScriptGenerationPanelProps> = ({
  apiKey,
  onApiKeyChange,
  isGeneratingScript,
  onGenerateScript,
  hasGeneratedScript,
  onViewScript,
  onPreviewClick
}) => {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600 shadow-sm">
      <h2 className="text-base font-semibold mb-2">Script Controls</h2>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <button
            onClick={onGenerateScript}
            disabled={isGeneratingScript}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-dark-500 text-sm"
            data-testid="generate-script-button"
          >
            {isGeneratingScript ? 'Generating...' : 'Generate Script'}
          </button>
          <button
            onClick={onPreviewClick}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded flex items-center justify-center text-sm"
            title="Preview the panel layout image that will be sent to the AI"
            data-testid="ai-preview-button"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            AI Preview
          </button>
        </div>
        {hasGeneratedScript && (
          <button
            onClick={onViewScript}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 w-full text-sm"
            data-testid="view-script-button"
          >
            View Script
          </button>
        )}
        <div className="relative w-full">
          {/* Hidden username field for accessibility - improves password manager compatibility */}
          <input 
            type="text" 
            autoComplete="username" 
            name="username"
            aria-hidden="true"
            style={{ display: 'none' }}
          />
          <input
            type={showApiKey ? 'text' : 'password'}
            placeholder="Anthropic API Key (optional)"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-gray-100 dark:placeholder-gray-400"
            name="apiKey"
            autoComplete="current-password"
            data-testid="api-key-input"
          />
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 dark:text-gray-300"
            type="button"
            data-testid="toggle-api-key-visibility"
          >
            {showApiKey ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScriptGenerationPanel;
