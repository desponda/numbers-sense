import { type JSX, useState, useCallback } from 'react';

import { AppShell, Header, GameMenu, type GameType } from '../components/layout';
import { Button } from '../components/ui';
import { AdditionRaceGame } from '../games/addition-race';
import { BuildTheNumberGame } from '../games/build-the-number';
import { DivisionRaceGame } from '../games/division-race';
import { MultiplicationRaceGame } from '../games/multiplication-race';
import { SortTheNumbersGame } from '../games/sort-the-numbers';
import { SubtractionRaceGame } from '../games/subtraction-race';

import type { DifficultyMode } from '../game-engine';

type AppView =
  | 'menu'
  | 'build-number'
  | 'sort-numbers'
  | 'multiplication-race'
  | 'division-race'
  | 'addition-race'
  | 'subtraction-race'
  | 'difficulty-select';

/**
 * Difficulty option configuration
 */
interface DifficultyOption {
  mode: DifficultyMode;
  label: string;
  description: string;
  color: string;
}

/**
 * Get difficulty options based on game type
 */
const getDifficultyOptions = (gameType: GameType | null): DifficultyOption[] => {
  if (gameType === 'multiplication-race') {
    return [
      {
        mode: 'easy',
        label: 'Easy',
        description: 'Times tables 0-5 only',
        color: 'bg-success/20 border-success hover:bg-success/30',
      },
      {
        mode: 'medium',
        label: 'Medium',
        description: 'All times tables 0-9',
        color: 'bg-primary/20 border-primary hover:bg-primary/30',
      },
      {
        mode: 'hard',
        label: 'Hard',
        description: 'All tables, 3× repetitions',
        color: 'bg-secondary/20 border-secondary hover:bg-secondary/30',
      },
    ];
  }

  if (gameType === 'division-race') {
    return [
      {
        mode: 'easy',
        label: 'Easy',
        description: 'Division by 1-5 only',
        color: 'bg-success/20 border-success hover:bg-success/30',
      },
      {
        mode: 'medium',
        label: 'Medium',
        description: 'All division facts 1-9',
        color: 'bg-primary/20 border-primary hover:bg-primary/30',
      },
      {
        mode: 'hard',
        label: 'Hard',
        description: 'All facts, 3× repetitions',
        color: 'bg-secondary/20 border-secondary hover:bg-secondary/30',
      },
    ];
  }

  if (gameType === 'addition-race') {
    return [
      {
        mode: 'easy',
        label: 'Easy',
        description: 'Addition facts 0-5 only',
        color: 'bg-success/20 border-success hover:bg-success/30',
      },
      {
        mode: 'medium',
        label: 'Medium',
        description: 'All addition facts 0-9',
        color: 'bg-primary/20 border-primary hover:bg-primary/30',
      },
      {
        mode: 'hard',
        label: 'Hard',
        description: 'All facts, 3× repetitions',
        color: 'bg-secondary/20 border-secondary hover:bg-secondary/30',
      },
    ];
  }

  if (gameType === 'subtraction-race') {
    return [
      {
        mode: 'easy',
        label: 'Easy',
        description: 'Subtraction facts 0-5 only',
        color: 'bg-success/20 border-success hover:bg-success/30',
      },
      {
        mode: 'medium',
        label: 'Medium',
        description: 'All subtraction facts 0-9',
        color: 'bg-primary/20 border-primary hover:bg-primary/30',
      },
      {
        mode: 'hard',
        label: 'Hard',
        description: 'All facts, 3× repetitions',
        color: 'bg-secondary/20 border-secondary hover:bg-secondary/30',
      },
    ];
  }

  // Default for Build the Number and Sort the Numbers
  return [
    {
      mode: 'easy',
      label: 'Easy',
      description: 'Numbers 1-10, unit blocks only',
      color: 'bg-success/20 border-success hover:bg-success/30',
    },
    {
      mode: 'medium',
      label: 'Medium',
      description: 'Numbers 1-20, units and tens',
      color: 'bg-primary/20 border-primary hover:bg-primary/30',
    },
    {
      mode: 'hard',
      label: 'Hard',
      description: 'Numbers 1-100, all block types',
      color: 'bg-secondary/20 border-secondary hover:bg-secondary/30',
    },
    {
      mode: 'challenge',
      label: 'Challenge',
      description: 'Numbers 1-100, timed mode',
      color: 'bg-accent/20 border-accent hover:bg-accent/30',
    },
  ];
};

/**
 * Main App component with simple routing state
 *
 * Manages navigation between:
 * - Game menu (home screen)
 * - Difficulty selection
 * - Build the Number game
 * - Sort the Numbers game
 */
export const App = (): JSX.Element => {
  const [currentView, setCurrentView] = useState<AppView>('menu');
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyMode>('easy');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSelectGame = useCallback((game: GameType) => {
    setSelectedGame(game);
    setCurrentView('difficulty-select');
  }, []);

  const handleSelectDifficulty = useCallback(
    (mode: DifficultyMode) => {
      setDifficulty(mode);
      if (selectedGame) {
        setCurrentView(selectedGame);
      }
    },
    [selectedGame],
  );

  const handleGoHome = useCallback(() => {
    setCurrentView('menu');
    setSelectedGame(null);
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
      case 'difficulty-select':
        return 'Choose Difficulty';
      case 'build-number':
        return 'Build the Number';
      case 'sort-numbers':
        return 'Sort the Numbers';
      case 'multiplication-race':
        return 'Multiplication Race';
      case 'division-race':
        return 'Division Race';
      case 'addition-race':
        return 'Addition Race';
      case 'subtraction-race':
        return 'Subtraction Race';
      default:
        return undefined;
    }
  };

  // Get game title for difficulty selector
  const getGameTitle = (): string => {
    switch (selectedGame) {
      case 'build-number':
        return 'Build the Number';
      case 'sort-numbers':
        return 'Sort the Numbers';
      case 'multiplication-race':
        return 'Multiplication Race';
      case 'division-race':
        return 'Division Race';
      case 'addition-race':
        return 'Addition Race';
      case 'subtraction-race':
        return 'Subtraction Race';
      default:
        return 'Select a Game';
    }
  };

  // Render difficulty selector
  const renderDifficultySelector = (): JSX.Element => {
    const difficultyOptions = getDifficultyOptions(selectedGame);

    return (
      <div className="flex flex-col gap-6 max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold text-center text-text-primary">{getGameTitle()}</h2>
        <p className="text-center text-text-secondary">Select a difficulty level:</p>
        <div className="flex flex-col gap-4">
          {difficultyOptions.map((option) => (
            <button
              key={option.mode}
              type="button"
              onClick={() => {
                handleSelectDifficulty(option.mode);
              }}
              className={`
              p-6 rounded-2xl border-2 text-left
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${option.color}
            `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-primary">{option.label}</h3>
                  <p className="text-text-secondary mt-1">{option.description}</p>
                </div>
                <div className="text-3xl">
                  {option.mode === 'easy' && '🌱'}
                  {option.mode === 'medium' && '🌿'}
                  {option.mode === 'hard' && '🌳'}
                  {option.mode === 'challenge' && '⏱️'}
                </div>
              </div>
            </button>
          ))}
        </div>
        <Button variant="secondary" onClick={handleGoHome} className="mt-4">
          Back to Menu
        </Button>
      </div>
    );
  };

  // Map difficulty for race games (they don't support 'challenge')
  const getRaceDifficulty = (): 'easy' | 'medium' | 'hard' => {
    return difficulty === 'challenge' ? 'hard' : difficulty;
  };

  // Render content based on current view
  const renderContent = (): JSX.Element => {
    switch (currentView) {
      case 'difficulty-select':
        return renderDifficultySelector();
      case 'build-number':
        return <BuildTheNumberGame difficulty={difficulty} onSessionEnd={handleGoHome} />;
      case 'sort-numbers':
        return <SortTheNumbersGame difficulty={difficulty} />;
      case 'multiplication-race':
        return <MultiplicationRaceGame difficulty={getRaceDifficulty()} />;
      case 'division-race':
        return <DivisionRaceGame difficulty={getRaceDifficulty()} />;
      case 'addition-race':
        return <AdditionRaceGame difficulty={getRaceDifficulty()} />;
      case 'subtraction-race':
        return <SubtractionRaceGame difficulty={getRaceDifficulty()} />;
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
