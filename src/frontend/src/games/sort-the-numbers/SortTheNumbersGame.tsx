import { useCallback, useEffect, useMemo, useState } from 'react';
import type { JSX } from 'react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  Announcements,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { generateSortTheNumbersValues } from '../../game-engine/problemGenerator';
import { useGameSessionStore } from '../../game-engine/stores/gameSessionStore';
import { useGameAudio } from '../../hooks/useGameAudio';

import { BlockRepresentation } from './BlockRepresentation';
import { NumberCard } from './NumberCard';
import { SortableItem } from './SortableItem';
import { SortingArea } from './SortingArea';

import type { DifficultyMode } from '../../game-engine/types';

/**
 * Game phases for Sort the Numbers
 */
type GamePhase = 'visual' | 'numeric';

/**
 * Difficulty configurations for Sort the Numbers
 * Based on game-mechanics.md specification
 */
const DIFFICULTY_CONFIG: Record<
  DifficultyMode,
  {
    itemCount: number;
    minValue: number;
    maxValue: number;
    includeClose: boolean;
    trickyRepresentations: boolean;
  }
> = {
  easy: {
    itemCount: 3,
    minValue: 1,
    maxValue: 10,
    includeClose: false,
    trickyRepresentations: false,
  },
  medium: {
    itemCount: 4,
    minValue: 1,
    maxValue: 20,
    includeClose: false,
    trickyRepresentations: false,
  },
  hard: {
    itemCount: 5,
    minValue: 1,
    maxValue: 100,
    includeClose: true,
    trickyRepresentations: false,
  },
  challenge: {
    itemCount: 6,
    minValue: 1,
    maxValue: 100,
    includeClose: true,
    trickyRepresentations: true,
  },
};

/**
 * Represents a sortable item with its value and ID
 */
interface SortItem {
  id: string;
  value: number;
}

/**
 * Props for the SortTheNumbersGame component
 */
export interface SortTheNumbersGameProps {
  /** Difficulty mode for the game */
  difficulty?: DifficultyMode;
  /** Callback when game completes */
  onComplete?: (isCorrect: boolean, attempts: number) => void;
  /** Callback when player progresses to next phase */
  onPhaseChange?: (phase: GamePhase) => void;
  /** Additional CSS class names */
  className?: string;
}

// Accessibility announcements for screen readers
const announcements: Announcements = {
  onDragStart() {
    return `Picked up number. Use arrow keys to move it, space to drop.`;
  },
  onDragOver({ over }) {
    if (over) {
      return `Number is now in a new position.`;
    }
    return `Number is not over a valid drop area.`;
  },
  onDragEnd({ over }) {
    if (over) {
      return `Number dropped. Check your order when ready.`;
    }
    return `Number returned to its position.`;
  },
  onDragCancel() {
    return `Dragging cancelled. Number returned to its position.`;
  },
};

/**
 * SortTheNumbersGame - Main game container for the Sort the Numbers game.
 *
 * Game Flow:
 * 1. Phase 1 (Visual): Shows block representations to sort
 * 2. Phase 2 (Numeric): After Phase 1 success, shows only numbers
 *
 * Features:
 * - @dnd-kit/sortable for reordering
 * - Keyboard accessibility for all operations
 * - Visual feedback for correct/incorrect positions
 * - Integrates with useGameSessionStore for session tracking
 *
 * Difficulty scaling (from game-mechanics.md):
 * - Easy: 3 numbers, range 1-10
 * - Medium: 4 numbers, range 1-20
 * - Hard: 5 numbers, range 1-100
 * - Challenge: 6 numbers with tricky representations
 *
 * @example
 * ```tsx
 * <SortTheNumbersGame
 *   difficulty="medium"
 *   onComplete={(isCorrect, attempts) => console.log('Game over!', isCorrect)}
 * />
 * ```
 */
export const SortTheNumbersGame = ({
  difficulty = 'easy',
  onComplete,
  onPhaseChange,
  className = '',
}: SortTheNumbersGameProps): JSX.Element => {
  // Game session store
  const { session, startSession, completeProblem, submitAttempt } = useGameSessionStore();

  // Audio feedback
  const { playSound } = useGameAudio();

  // Local game state
  const [phase, setPhase] = useState<GamePhase>('visual');
  const [items, setItems] = useState<SortItem[]>([]);
  const [validationResults, setValidationResults] = useState<(boolean | null)[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localAttempts, setLocalAttempts] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  // Get difficulty config
  const config = DIFFICULTY_CONFIG[difficulty];

  // Correct order (sorted ascending)
  const correctOrder = useMemo(() => [...items].sort((a, b) => a.value - b.value), [items]);

  // Configure DnD sensors for touch, mouse, and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Generate new problem
  const generateProblem = useCallback(() => {
    const values = generateSortTheNumbersValues(difficulty, config.itemCount);
    const newItems: SortItem[] = values.map((value, index) => ({
      id: `item-${String(index)}-${String(value)}`,
      value,
    }));
    setItems(newItems);
    setValidationResults(newItems.map(() => null));
    setShowSuccess(false);
    setLocalAttempts(0);
  }, [difficulty, config.itemCount]);

  // Initialize game
  useEffect(() => {
    if (session === null || session.gameId !== 'sort-the-numbers') {
      startSession('sort-the-numbers', difficulty);
    }
    generateProblem();
  }, [difficulty, session, startSession, generateProblem]);

  // Shuffle array (Fisher-Yates)
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      const swapVal = shuffled[j];
      if (temp !== undefined && swapVal !== undefined) {
        shuffled[i] = swapVal;
        shuffled[j] = temp;
      }
    }
    return shuffled;
  }, []);

  // Handle phase change
  const handlePhaseChange = useCallback(
    (newPhase: GamePhase) => {
      setPhase(newPhase);
      onPhaseChange?.(newPhase);
      // Shuffle items for numeric phase so user must sort again
      if (newPhase === 'numeric') {
        setItems((currentItems) => {
          const shuffled = shuffleArray(currentItems);
          // Reset validation for the new shuffled items
          setValidationResults(shuffled.map(() => null));
          return shuffled;
        });
        setShowSuccess(false);
        setLocalAttempts(0);
      }
    },
    [onPhaseChange, shuffleArray],
  );

  // Handle drag start - play pickup sound
  const handleDragStart = useCallback(
    (_event: DragStartEvent) => {
      playSound('blockPickup');
    },
    [playSound],
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over !== null && active.id !== over.id) {
        playSound('blockDrop');
        setItems((currentItems) => {
          const oldIndex = currentItems.findIndex((item) => item.id === active.id);
          const newIndex = currentItems.findIndex((item) => item.id === over.id);
          return arrayMove(currentItems, oldIndex, newIndex);
        });
        // Clear validation when order changes
        setValidationResults((prev) => prev.map(() => null));
      }
    },
    [playSound],
  );

  // Validate current order
  const validateOrder = useCallback((): boolean => {
    const results = items.map((item, index) => {
      const correctItem = correctOrder[index];
      return correctItem !== undefined && item.value === correctItem.value;
    });
    setValidationResults(results);
    return results.every((r) => r);
  }, [items, correctOrder]);

  // Handle check order button click
  const handleCheckOrder = useCallback(() => {
    setIsChecking(true);
    setLocalAttempts((prev) => prev + 1);
    submitAttempt();
    playSound('buttonClick');

    // Delay to show animation
    setTimeout(() => {
      const isCorrect = validateOrder();

      if (isCorrect) {
        playSound('correct');
        setShowSuccess(true);
        setTotalCorrect((prev) => prev + 1);
        completeProblem(true);

        // If in visual phase and correct, transition to numeric phase
        if (phase === 'visual') {
          setTimeout(() => {
            handlePhaseChange('numeric');
          }, 1500);
        } else {
          // Numeric phase complete - start new round
          setRoundsCompleted((prev) => prev + 1);
          onComplete?.(true, localAttempts + 1);

          // Auto-advance to next round after celebration
          setTimeout(() => {
            setPhase('visual');
            generateProblem();
          }, 2000);
        }
      } else {
        playSound('incorrect');
      }

      setIsChecking(false);
    }, 300);
  }, [
    submitAttempt,
    playSound,
    validateOrder,
    completeProblem,
    phase,
    handlePhaseChange,
    onComplete,
    localAttempts,
    generateProblem,
  ]);

  // Handle try again (generate new problem)
  const handleTryAgain = useCallback(() => {
    generateProblem();
    setValidationResults(items.map(() => null));
  }, [generateProblem, items]);

  // Get item IDs for SortableContext
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  // Determine if any position is incorrect
  const hasIncorrect = validationResults.some((r) => r === false);

  return (
    <Card variant="elevated" padding="lg" className={`max-w-2xl mx-auto ${className}`}>
      {/* Game header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-2">Sort the Numbers</h2>
        <p className="text-text-secondary">
          {phase === 'visual'
            ? 'Put the blocks in order from smallest to biggest!'
            : 'Put the numbers in order from smallest to biggest!'}
        </p>
        <div className="mt-2 flex justify-center gap-4 text-sm">
          <span className="text-text-muted">Round: {roundsCompleted + 1}</span>
          <span className="text-success font-medium">Score: {totalCorrect}</span>
        </div>
      </div>

      {/* Sorting area with DnD context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        accessibility={{
          announcements,
          screenReaderInstructions: {
            draggable:
              'To pick up a number, press space or enter. While dragging, use the arrow keys to move it. Press space or enter to drop it, or escape to cancel.',
          },
        }}
      >
        <SortingArea
          items={itemIds}
          layout="horizontal"
          showPositions
          validationResults={validationResults}
          className="mb-6"
        >
          {items.map((item, index) => {
            const isCorrectPosition = validationResults[index] === true;
            const isIncorrectPosition = validationResults[index] === false;

            return (
              <SortableItem key={item.id} id={item.id} disabled={showSuccess}>
                {phase === 'visual' ? (
                  <div
                    className={`
                      p-3 bg-white rounded-xl border-2 transition-all duration-fast
                      ${isCorrectPosition ? 'border-success shadow-glow-success' : ''}
                      ${isIncorrectPosition ? 'border-secondary animate-wiggle' : 'border-transparent'}
                    `}
                  >
                    <BlockRepresentation
                      value={item.value}
                      showValue={difficulty !== 'easy'}
                      scale={difficulty === 'easy' ? 1.2 : 1}
                    />
                  </div>
                ) : (
                  <NumberCard
                    value={item.value}
                    isCorrect={isCorrectPosition}
                    isIncorrect={isIncorrectPosition}
                  />
                )}
              </SortableItem>
            );
          })}
        </SortingArea>
      </DndContext>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        {!showSuccess ? (
          <>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCheckOrder}
              loading={isChecking}
              disabled={isChecking}
            >
              Check Order
            </Button>
            {hasIncorrect && (
              <Button variant="ghost" size="lg" onClick={handleTryAgain}>
                Try Different Numbers
              </Button>
            )}
          </>
        ) : (
          <div className="text-center animate-celebrate">
            <div className="text-2xl font-bold text-success mb-2">Great Job!</div>
            <p className="text-text-secondary">
              {phase === 'visual' ? 'Now try sorting just the numbers!' : 'Loading next round...'}
            </p>
          </div>
        )}
      </div>

      {/* Feedback message */}
      {hasIncorrect && !showSuccess && (
        <div className="mt-4 p-3 bg-secondary-100 rounded-xl text-center">
          <p className="text-secondary-700 font-medium">
            Almost! Some numbers are not in the right spot. Try again!
          </p>
        </div>
      )}
    </Card>
  );
};

export default SortTheNumbersGame;
