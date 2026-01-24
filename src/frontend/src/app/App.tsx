import { type JSX, useState, useCallback } from 'react';

import { AppShell, Header, GameMenu, type GameType } from '../components/layout';
import { BuildTheNumberGame } from '../games/build-the-number';
import { SortTheNumbersGame } from '../games/sort-the-numbers';

type AppView = 'menu' | 'build-number' | 'sort-numbers';

/**
 * Main App component with simple routing state
 *
 * Manages navigation between:
 * - Game menu (home screen)
 * - Build the Number game
 * - Sort the Numbers game
 */
export const App = (): JSX.Element => {
  const [currentView, setCurrentView] = useState<AppView>('menu');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSelectGame = useCallback((game: GameType) => {
    setCurrentView(game);
  }, []);

  const handleGoHome = useCallback(() => {
    setCurrentView('menu');
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const handleOpenSettings = useCallback(() => {
    // TODO: Implement settings modal
  }, []);

  // Get title based on current view
  const getTitle = (): string | undefined => {
    switch (currentView) {
      case 'build-number':
        return 'Build the Number';
      case 'sort-numbers':
        return 'Sort the Numbers';
      default:
        return undefined;
    }
  };

  // Render content based on current view
  const renderContent = (): JSX.Element => {
    switch (currentView) {
      case 'build-number':
        return <BuildTheNumberGame difficulty="easy" onSessionEnd={handleGoHome} />;
      case 'sort-numbers':
        return <SortTheNumbersGame difficulty="easy" onComplete={handleGoHome} />;
      default:
        return <GameMenu onSelectGame={handleSelectGame} />;
    }
  };

  return (
    <AppShell
      header={
        <Header
          title={getTitle()}
          onHomeClick={currentView !== 'menu' ? handleGoHome : undefined}
          onSettingsClick={handleOpenSettings}
          soundEnabled={soundEnabled}
          onSoundToggle={handleToggleSound}
          showNavigation={currentView !== 'menu'}
        />
      }
    >
      {renderContent()}
    </AppShell>
  );
};
