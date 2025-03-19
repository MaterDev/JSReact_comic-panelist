import React from 'react';
import ComicPanelCreator from './components/ComicPanelCreator';
import DarkModeToggle from './components/DarkModeToggle';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-800 transition-colors duration-200">
      <div className="absolute top-4 right-4 z-10">
        <DarkModeToggle />
      </div>
      <ComicPanelCreator />
    </div>
  );
};

export default App;
