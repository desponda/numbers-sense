import { useEffect } from 'react';
import type { JSX } from 'react';

import { useGameAudio } from '../../hooks';

import { CompletionCelebration } from './components/CompletionCelebration';
import { QuestionModal } from './components/QuestionModal';
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
  /** Type of race game (multiplication or division) */
  gameType: 'multiplication' | 'division';
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
 * to advance bikes across finish lines. Supports both multiplication
 * and division modes.
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

  return (
    <div
      className={`race-game-container max-w-6xl mx-auto p-6 ${className}`}
      role="main"
      aria-label={`${gameType === 'multiplication' ? 'Multiplication' : 'Division'} Race Game`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {gameType === 'multiplication' ? 'Multiplication' : 'Division'} Race
        </h1>
        <p className="text-text-secondary">
          Answer questions to move your bikes across the finish line!
        </p>
      </div>

      {/* Race Track */}
      <RaceTrack lanes={store.lanes} currentLane={store.currentLane} />

      {/* Question Modal (when question exists) */}
      {store.currentQuestion !== null && (
        <QuestionModal
          question={store.currentQuestion}
          onAnswer={handleAnswer}
          disabled={store.status === 'paused'}
        />
      )}

      {/* Completion Celebration (when finished) */}
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
          This is the {gameType === 'multiplication' ? 'Multiplication' : 'Division'} Race game.
          Answer math questions correctly to advance bikes across the finish line. Each correct
          answer moves a bike one step forward. Complete all lanes to win!
        </p>
      </div>
    </div>
  );
};

export default RaceGame;
