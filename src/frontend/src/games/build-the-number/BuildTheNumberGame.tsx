import { useCallback, useEffect, useState, type JSX } from 'react';

import { BlockTray, UnitCube } from '../../components/blocks';
import { DndProvider } from '../../components/dnd';
import { Card } from '../../components/ui';
import {
  useGameSessionStore,
  generateProblem,
  type Block,
  type DifficultyMode,
} from '../../game-engine';

import { GameControls } from './GameControls';
import { TargetDisplay } from './TargetDisplay';
import { Workspace } from './Workspace';

import type { DragEndEvent } from '@dnd-kit/core';

/**
 * Props for the BuildTheNumberGame component
 */
export interface BuildTheNumberGameProps {
  /** Difficulty mode for the game */
  difficulty?: DifficultyMode;
  /** Callback when game session ends */
  onSessionEnd?: () => void;
  /** Callback when a problem is completed */
  onProblemComplete?: (isCorrect: boolean) => void;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Easy Mode configuration
 * Based on game-mechanics.md Easy Mode specs
 */
const EASY_MODE_CONFIG = {
  numberRange: { min: 1, max: 10 },
  availableBlocks: ['unit'] as const,
  hintsEnabled: true,
  maxAttempts: Infinity,
  problemsPerSession: 10,
};

/**
 * Feedback messages for encouraging children
 */
const FEEDBACK_MESSAGES = {
  correct: [
    'Great job!',
    'You did it!',
    'Awesome!',
    'Perfect!',
    'Well done!',
    'Super!',
    'Amazing!',
  ],
  incorrect: ['Almost there!', 'Try again!', 'Keep trying!', 'You can do it!', "You're so close!"],
  hint: [
    'Count the dots to help you!',
    'Add more blocks to match the number.',
    'Each block is worth 1.',
  ],
};

/**
 * Get a random message from an array
 */
const getRandomMessage = (messages: string[]): string => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex] ?? messages[0] ?? '';
};

/**
 * BuildTheNumberGame - Main game container for "Build the Number"
 *
 * Features:
 * - Shows target number prominently
 * - Contains workspace area for dropping blocks
 * - Contains block tray with available blocks
 * - Shows current value being built
 * - Check Answer and Clear buttons
 * - Uses useGameSessionStore for state management
 *
 * Easy Mode specs (from game-mechanics.md):
 * - Numbers 1-10 only
 * - Unit cubes only (no tens or hundreds)
 * - Simple, encouraging feedback
 * - Visual hint with dot pattern
 *
 * @example
 * ```tsx
 * <BuildTheNumberGame
 *   difficulty="easy"
 *   onSessionEnd={() => navigate('/games')}
 * />
 * ```
 */
export const BuildTheNumberGame = ({
  difficulty = 'easy',
  onSessionEnd,
  onProblemComplete,
  className = '',
}: BuildTheNumberGameProps): JSX.Element => {
  // Game session store
  const {
    session,
    workspace,
    workspaceValue,
    startSession,
    setProblem,
    addBlock,
    removeBlock,
    clearWorkspace,
    submitAttempt,
    completeProblem,
    useHint: recordHintUsage,
    hintsUsed,
  } = useGameSessionStore();

  // Local UI state
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'incorrect' | 'hint' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isAnimating, setIsAnimating] = useState(false);
  const [blockIdCounter, setBlockIdCounter] = useState(0);

  // Initialize game session
  useEffect(() => {
    startSession('build-the-number', difficulty);
  }, [startSession, difficulty]);

  // Generate first problem when session starts
  useEffect(() => {
    if (session !== null && session.currentProblem === null) {
      const problem = generateProblem({
        gameId: 'build-the-number',
        difficulty,
      });
      setProblem(problem);
    }
  }, [session, setProblem, difficulty]);

  // Current target value
  const targetValue = session?.currentProblem?.targetValue ?? 0;

  // Generate a new block ID
  const generateBlockId = useCallback((): string => {
    setBlockIdCounter((prev) => prev + 1);
    return `workspace-block-${String(blockIdCounter)}`;
  }, [blockIdCounter]);

  // Handle block drop from tray to workspace
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      // Check if dropped on workspace
      if (over?.id === 'workspace' && active.data.current?.type === 'unit') {
        const newBlock: Block = {
          id: generateBlockId(),
          type: 'unit',
          value: 1,
        };
        addBlock(newBlock);
        setFeedback({ type: null, message: '' });
      }
    },
    [addBlock, generateBlockId],
  );

  // Handle block removal from workspace
  const handleBlockRemove = useCallback(
    (blockId: string) => {
      removeBlock(blockId);
      setFeedback({ type: null, message: '' });
    },
    [removeBlock],
  );

  // Handle clear workspace
  const handleClear = useCallback(() => {
    clearWorkspace();
    setFeedback({ type: null, message: '' });
  }, [clearWorkspace]);

  // Handle check answer
  const handleCheckAnswer = useCallback(() => {
    const attempt = submitAttempt();
    setIsAnimating(true);

    if (attempt.isCorrect) {
      // Correct answer
      setFeedback({
        type: 'correct',
        message: getRandomMessage(FEEDBACK_MESSAGES.correct),
      });

      // Wait for celebration, then move to next problem
      setTimeout(() => {
        completeProblem(true);
        onProblemComplete?.(true);

        // Check if session should end
        const problemsCompleted = (session?.problemsCompleted ?? 0) + 1;
        if (problemsCompleted >= EASY_MODE_CONFIG.problemsPerSession) {
          onSessionEnd?.();
        } else {
          // Generate next problem
          const nextProblem = generateProblem({
            gameId: 'build-the-number',
            difficulty,
          });
          setProblem(nextProblem);
          setFeedback({ type: null, message: '' });
        }
        setIsAnimating(false);
      }, 2000);
    } else {
      // Incorrect answer - encourage retry
      setFeedback({
        type: 'incorrect',
        message: getRandomMessage(FEEDBACK_MESSAGES.incorrect),
      });
      onProblemComplete?.(false);

      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  }, [
    submitAttempt,
    completeProblem,
    onProblemComplete,
    onSessionEnd,
    session?.problemsCompleted,
    setProblem,
    difficulty,
  ]);

  // Handle hint request
  const handleHint = useCallback(() => {
    recordHintUsage();
    setFeedback({
      type: 'hint',
      message: getRandomMessage(FEEDBACK_MESSAGES.hint),
    });
  }, [recordHintUsage]);

  // Render loading state if session not ready
  if (session === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-text-secondary text-lg">Loading game...</div>
      </div>
    );
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div
        className={`
          flex flex-col gap-6
          max-w-2xl mx-auto
          p-4
          ${className}
        `}
        role="main"
        aria-label="Build the Number game"
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-text-secondary text-sm">
          <span>
            Problem {session.problemsCompleted + 1} of {EASY_MODE_CONFIG.problemsPerSession}
          </span>
          {session.correctStreak > 0 && (
            <span className="text-success font-medium">{session.correctStreak} in a row!</span>
          )}
        </div>

        {/* Target number display */}
        <TargetDisplay target={targetValue} showVisualHint={difficulty === 'easy'} />

        {/* Feedback message */}
        {feedback.type !== null && (
          <Card
            variant="flat"
            padding="md"
            className={`
              text-center font-medium text-lg
              transition-all duration-300
              ${feedback.type === 'correct' ? 'bg-success/10 text-success' : ''}
              ${feedback.type === 'incorrect' ? 'bg-secondary/10 text-secondary' : ''}
              ${feedback.type === 'hint' ? 'bg-primary/10 text-primary' : ''}
            `}
            role="status"
            aria-live="polite"
          >
            {feedback.message}
          </Card>
        )}

        {/* Workspace - drop zone for blocks */}
        <Workspace
          id="workspace"
          blocks={workspace}
          currentValue={workspaceValue}
          targetValue={targetValue}
          onBlockRemove={handleBlockRemove}
          isCorrect={feedback.type === 'correct'}
          isIncorrect={feedback.type === 'incorrect'}
          disabled={isAnimating}
        />

        {/* Block tray - draggable blocks */}
        <BlockTray id="block-tray" title="Drag blocks here">
          {/* For Easy Mode, only show unit cubes */}
          {Array.from({ length: 10 }).map((_, i) => (
            <UnitCube
              key={`tray-unit-${String(i)}`}
              id={`tray-unit-${String(i)}`}
              disabled={isAnimating}
            />
          ))}
        </BlockTray>

        {/* Game controls */}
        <GameControls
          onCheckAnswer={handleCheckAnswer}
          onClear={handleClear}
          onHint={handleHint}
          checkDisabled={workspace.length === 0}
          clearDisabled={workspace.length === 0}
          hintsEnabled={EASY_MODE_CONFIG.hintsEnabled && hintsUsed < 3}
          loading={isAnimating}
        />

        {/* Screen reader instructions */}
        <div className="sr-only">
          <p>
            This is the Build the Number game. Your goal is to build the target number {targetValue}{' '}
            using blocks. Drag unit blocks from the tray to the workspace. Each unit block is worth
            1. When you think you have the right number of blocks, press Check Answer.
          </p>
        </div>
      </div>
    </DndProvider>
  );
};

export default BuildTheNumberGame;
