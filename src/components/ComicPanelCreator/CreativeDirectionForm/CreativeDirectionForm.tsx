import React, { useState } from 'react';

export interface CreativeDirection {
  genre: string;
  emotion: string;
  inspiration: string;
  inspirationText: string;
  exclusions: string;
}

interface CreativeDirectionFormProps {
  creativeDirection: CreativeDirection;
  onCreativeDirectionChange: (direction: CreativeDirection) => void;
}

export const CreativeDirectionForm: React.FC<CreativeDirectionFormProps> = ({
  creativeDirection,
  onCreativeDirectionChange
}) => {
  const [showCreativeInputs, setShowCreativeInputs] = useState(false);
  
  const handleInputChange = (field: keyof CreativeDirection, value: string) => {
    onCreativeDirectionChange({
      ...creativeDirection,
      [field]: value
    });
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowCreativeInputs(!showCreativeInputs)}
        className="flex items-center justify-between w-full px-4 py-2 bg-gray-200 dark:bg-dark-600 rounded-md text-sm font-medium"
        aria-expanded={showCreativeInputs}
        aria-controls="creative-inputs-panel"
        data-testid="creative-direction-toggle"
      >
        <span>Creative Direction {showCreativeInputs ? '(Hide)' : '(Show)'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${showCreativeInputs ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      <div 
        id="creative-inputs-panel"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${showCreativeInputs ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
        data-testid="creative-direction-panel"
      >
        <div className="mt-3 space-y-3 p-3 bg-gray-100 dark:bg-dark-700 rounded-md">
          <div>
            <label htmlFor="genre" className="block text-xs font-medium mb-1 dark:text-gray-300">Genre</label>
            <input
              id="genre"
              type="text"
              placeholder="e.g., Sci-fi, Fantasy, Noir"
              value={creativeDirection.genre}
              onChange={(e) => handleInputChange('genre', e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-gray-100"
              data-testid="genre-input"
            />
          </div>
          
          <div>
            <label htmlFor="emotion" className="block text-xs font-medium mb-1 dark:text-gray-300">Emotional Tone</label>
            <input
              id="emotion"
              type="text"
              placeholder="e.g., Suspenseful, Humorous, Melancholic"
              value={creativeDirection.emotion}
              onChange={(e) => handleInputChange('emotion', e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-gray-100"
              data-testid="emotion-input"
            />
          </div>
          
          <div>
            <label htmlFor="inspiration" className="block text-xs font-medium mb-1 dark:text-gray-300">Inspiration</label>
            <input
              id="inspiration"
              type="text"
              placeholder="e.g., Film noir, Miyazaki, Cyberpunk"
              value={creativeDirection.inspiration}
              onChange={(e) => handleInputChange('inspiration', e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-gray-100"
              data-testid="inspiration-input"
            />
          </div>
          
          <div>
            <label htmlFor="inspirationText" className="block text-xs font-medium mb-1 dark:text-gray-300">Inspiration Text</label>
            <textarea
              id="inspirationText"
              placeholder="Enter a longer description or excerpt"
              value={creativeDirection.inspirationText}
              onChange={(e) => handleInputChange('inspirationText', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-gray-100"
              data-testid="inspiration-text-input"
            />
          </div>
          
          <div>
            <label htmlFor="exclusions" className="block text-xs font-medium mb-1 dark:text-gray-300">Exclusions</label>
            <input
              id="exclusions"
              type="text"
              placeholder="e.g., Violence, Romance, Politics"
              value={creativeDirection.exclusions}
              onChange={(e) => handleInputChange('exclusions', e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-dark-600 dark:border-dark-500 dark:text-gray-100"
              data-testid="exclusions-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeDirectionForm;
