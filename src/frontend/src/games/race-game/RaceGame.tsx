import { useEffect } from 'react';
import type { JSX } from 'react';

import { useGameAudio } from '../../hooks';

import { CompletionCelebration } from './components/CompletionCelebration';
import { QuestionDrawer } from './components/QuestionDrawer';
import { RaceTrack } from './components/RaceTrack';
import { useRaceGameStore } from './stores/raceGameStore';

/**
 * Game statistics interface
 */
export interface GameStats {
  totalCorrect: number;
  totalAttempts: number;
  accuracy: number;
  timeElapsed: number;
  completedAt: number;
}

/**
 * Props for the RaceGame component
 */
export interface RaceGameProps {
  /** Type of race game (multiplication, division, addition, or subtraction) */
  gameType: 'multiplication' | 'division' | 'addition' | 'subtraction';
  /** Difficulty level */
  difficulty: 'easy' | 'medium' | 'hard';
  /** Callback when game completes */
  onComplete?: (stats: GameStats) => void;
  /** Additional CSS class names */
  className?: string;
}

/**
 * RaceGame - Main container component for race game functionality
 *
 * Orchestrates the bike race game where students answer math facts
 * to advance bikes across finish lines. Supports multiplication,
 * division, addition, and subtraction modes.
 *
 * Game Flow:
 * 1. Initialize game with lanes based on game type and difficulty
 * 2. Select furthest-behind lane and present question
 * 3. On correct answer, advance bike in that lane
 * 4. On incorrect answer, keep bike in place, allow retry
 * 5. When lane completes 20 steps, celebrate and continue
 * 6. When all lanes complete, show final celebration
 *
 * Features:
 * - Multiple choice questions (4 options)
 * - Smart distractor generation
 * - Progress tracking per lane
 * - Audio feedback for answers
 * - Celebration animations
 *
 * Based on:
 * - /docs/specs/multiplication-race-game.md
 * - /docs/architecture/race-games-architecture.md
 *
 * @example
 * ```tsx
 * <RaceGame
 *   gameType="multiplication"
 *   difficulty="medium"
 *   onComplete={(stats) => console.log('Game complete!', stats)}
 * />
 * ```
 */
export const RaceGame = ({
  gameType,
  difficulty,
  onComplete,
  className = '',
}: RaceGameProps): JSX.Element => {
  const store = useRaceGameStore();
  const initializeGame = useRaceGameStore((state) => state.initializeGame);
  const audio = useGameAudio();

  // Initialize game on mount or when props change
  useEffect(() => {
    initializeGame(gameType, difficulty);
  }, [initializeGame, gameType, difficulty]);

  // Handle answer submission
  const handleAnswer = (selectedIndex: number): void => {
    const { currentQuestion } = store;
    const isCorrect = currentQuestion !== null && selectedIndex === currentQuestion.correctIndex;

    // Play audio feedback before submitting
    if (isCorrect) {
      audio.playSound('correct');
    } else {
      audio.playSound('incorrect');
    }

    // Submit answer to store (handles state updates)
    store.submitAnswer(selectedIndex);
  };

  // Watch for game completion
  useEffect(() => {
    if (store.status === 'completed' && store.endTime !== null) {
      const stats: GameStats = {
        totalCorrect: store.totalCorrect,
        totalAttempts: store.totalAttempts,
        accuracy: store.totalCorrect / store.totalAttempts,
        timeElapsed: store.endTime - store.startTime,
        completedAt: store.endTime,
      };

      audio.playSound('correct'); // Victory sound
      onComplete?.(stats);
    }
    // Note: audio.playSound is stable (useCallback), no need in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    store.status,
    store.totalCorrect,
    store.totalAttempts,
    store.endTime,
    store.startTime,
    onComplete,
  ]);

  // Get game type display name
  const getGameTypeName = (): string => {
    switch (gameType) {
      case 'multiplication':
        return 'Multiplication';
      case 'division':
        return 'Division';
      case 'addition':
        return 'Addition';
      case 'subtraction':
        return 'Subtraction';
      default:
        return 'Math';
    }
  };

  return (
    <div
      className={`race-game-container flex flex-col h-screen ${className}`}
      role="main"
      aria-label={`${getGameTypeName()} Race Game`}
    >
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 text-center py-4 px-6 border-b border-background-warm">
        <h1 className="text-3xl font-bold text-text-primary mb-2">{getGameTypeName()} Race</h1>
        <p className="text-text-secondary">
          Answer questions to move your bikes across the finish line!
        </p>
      </div>

      {/* Race Track Area - Scrollable, fills remaining space */}
      <div
        className={`
          flex-1 overflow-y-auto p-6
          transition-all duration-300
          ${
            store.currentQuestion !== null
              ? 'opacity-95 pb-[40vh] md:pr-[40vw] md:pb-6'
              : 'opacity-100 pb-6'
          }
        `}
      >
        <RaceTrack lanes={store.lanes} currentLane={store.currentLane} />
      </div>

      {/* Question Drawer - Slides up from bottom (overlays race track but doesn't obscure it) */}
      {store.currentQuestion !== null && (
        <QuestionDrawer
          question={store.currentQuestion}
          onAnswer={handleAnswer}
          gameType={gameType}
          disabled={store.status === 'paused'}
        />
      )}

      {/* Completion Celebration - Full overlay (this is appropriate for end state) */}
      {store.status === 'completed' && store.endTime !== null && (
        <CompletionCelebration
          stats={{
            gameType: store.gameType,
            difficulty: store.difficulty,
            totalCorrect: store.totalCorrect,
            totalAttempts: store.totalAttempts,
            accuracy: store.totalCorrect / store.totalAttempts,
            timeElapsed: store.endTime - store.startTime,
            factsMastered: Object.values(store.factMastery).filter((f) => f.mastered).length,
            totalFacts: Object.keys(store.factMastery).length,
          }}
          onPlayAgain={() => {
            store.resetGame();
          }}
          onBackToMenu={() => {
            window.location.href = '/';
          }}
        />
      )}

      {/* Screen reader instructions */}
      <div className="sr-only">
        <p>
          This is the {getGameTypeName()} Race game. Answer math questions correctly to advance
          bikes across the finish line. Each correct answer moves a bike one step forward. Complete
          all lanes to win!
        </p>
      </div>
    </div>
  );
};

export default RaceGame;
