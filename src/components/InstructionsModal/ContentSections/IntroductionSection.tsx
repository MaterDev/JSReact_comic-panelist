/**
 * IntroductionSection Component
 * 
 * Displays the welcome and introduction content for the instructions modal.
 * Includes key features of the application and basic navigation guidance.
 */
import React from 'react';

/**
 * Renders the introduction section for the instructions modal
 * 
 * @returns A React component with introduction and key features
 */
export const IntroductionSection: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Introduction */}
      <p 
        id="instructions-modal-intro-text"
        data-testid="instructions-modal-intro-text"
        className="text-gray-700 dark:text-gray-300"
      >
        Comic Panelist is a comprehensive tool for creating and managing comic book layouts and scripts.
        This guide will walk you through all the features available in the application.
      </p>

      {/* Key Features */}
      <div 
        id="instructions-modal-features-container"
        data-testid="instructions-modal-features-container"
        className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg"
      >
        <h4 
          id="instructions-modal-features-title"
          data-testid="instructions-modal-features-title"
          className="font-medium mb-2 text-blue-700 dark:text-blue-300"
        >Key Features:</h4>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Design panel layouts with intuitive controls</li>
          <li>Generate AI-powered scripts based on your layouts</li>
          <li>Organize layouts into collections (comic books)</li>
          <li>View layouts in a professional comic spread format</li>
          <li>Export your work in various formats</li>
        </ul>
      </div>
      
      {/* Navigation Tip */}
      <p 
        id="instructions-modal-navigation-tip"
        data-testid="instructions-modal-navigation-tip"
        className="text-sm text-gray-500 dark:text-gray-400 italic"
      >
        Navigate through this guide using the page controls at the bottom.
      </p>
    </div>
  );
};
