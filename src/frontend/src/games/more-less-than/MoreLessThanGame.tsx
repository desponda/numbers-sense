import { useEffect, useState } from 'react';
import type { JSX } from 'react';

import { generateProblem } from '../../game-engine/problemGenerator';
import { useGameSessionStore } from '../../game-engine/stores/gameSessionStore';

import { AnswerInput } from './components/AnswerInput';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { InteractiveBlockGrid } from './components/InteractiveBlockGrid';
import { PeekButton } from './components/PeekButton';
import { VisualScaffold } from './components/VisualScaffold';
import { validateAnswer } from './utils/validation';

import type { DifficultyMode, MoreLessThanProblem } from '../../game-engine/types';

export interface MoreLessThanGameProps {
  difficulty: DifficultyMode;
  onExit?: () => void;
}

type GamePhase = 'interacting' | 'answering' | 'complete';

/**
 * MoreLessThanGame - Interactive "More Than / Less Than" learning game.
 *
 * New flow (Easy/Medium):
 * 1. INTERACTION PHASE: Child manipulates blocks (tap to remove/add)
 * 2. ANSWERING PHASE: "What number do you have now?" - child types answer
 * 3. COMPLETE PHASE: Feedback and next problem
 *
 * Hard/Challenge: Skip interaction, mental math only
 *
 * Pedagogical approach:
 * - Concrete: Physical block manipulation
 * - Representational: See blocks transform
 * - Abstract: Identify resulting number
 */
export const MoreLessThanGame = ({ difficulty, onExit }: MoreLessThanGameProps): JSX.Element => {
  const { session, setProblem, completeProblem, startSession } = useGameSessionStore();
  const [currentProblem, setCurrentProblem] = useState<MoreLessThanProblem | null>(null);
  const [phase, setPhase] = useState<GamePhase>('interacting');
  const [answerValue, setAnswerValue] = useState<number | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; hint?: string } | null>(null);
  const [showFeedbackType, setShowFeedbackType] = useState<'correct' | 'incorrect' | null>(null);

  // Peek functionality for Medium mode
  const [peeksRemaining, setPeeksRemaining] = useState(3);
  const [isPeeking, setIsPeeking] = useState(false);
  const [showStaticBlocks, setShowStaticBlocks] = useState(false);

  // Determine if this difficulty uses interactive blocks
  const usesInteraction = difficulty === 'easy' || difficulty === 'medium';

  // Initialize session on mount
  useEffect(() => {
    if (!session || session.gameId !== 'more-less-than') {
      startSession('more-less-than', difficulty);
    }
  }, [session, difficulty, startSession]);

  // Load first problem
  useEffect(() => {
    const problem = generateProblem({
      gameId: 'more-less-than',
      difficulty,
    }) as MoreLessThanProblem;

    setCurrentProblem(problem);
    setProblem(problem);
    // Only use interaction for "less" (take away) operations
    const shouldInteract = usesInteraction && problem.operation === 'less';
    setPhase(shouldInteract ? 'interacting' : 'answering');
  }, [difficulty, setProblem, usesInteraction]);

  // Reset state for new problem
  const loadNextProblem = (): void => {
    const nextProblem = generateProblem({
      gameId: 'more-less-than',
      difficulty,
    }) as MoreLessThanProblem;

    setCurrentProblem(nextProblem);
    setProblem(nextProblem);
    // Only use interaction for "less" (take away) operations
    const shouldInteract = usesInteraction && nextProblem.operation === 'less';
    setPhase(shouldInteract ? 'interacting' : 'answering');
    setAnswerValue(null);
    setAttemptCount(0);
    setFeedback(null);
    setShowFeedbackType(null);
    setPeeksRemaining(3);
    setIsPeeking(false);
    setShowStaticBlocks(false);
  };

  // Handle completion of interactive phase
  const handleInteractionComplete = (): void => {
    setShowStaticBlocks(true); // Keep blocks visible for Medium mode
    setPhase('answering');
  };

  // Handle skip interaction button
  const handleSkipInteraction = (): void => {
    setPhase('answering');
  };

  // Handle answer submission
  const handleSubmit = (): void => {
    if (!currentProblem || answerValue === null) {
      return;
    }

    const result = validateAnswer(currentProblem, answerValue);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    if (result.isCorrect) {
      setFeedback({ isCorrect: true });
      setShowFeedbackType('correct');
      setPhase('complete');
      completeProblem(true);

      // Next problem after 2 seconds
      setTimeout(() => {
        loadNextProblem();
      }, 2000);
    } else {
      setFeedback({ isCorrect: false, hint: result.hint });
      setShowFeedbackType('incorrect');

      // If 3 attempts, show answer and move to next
      if (newAttemptCount >= 3) {
        setPhase('complete');
        completeProblem(false);

        setTimeout(() => {
          loadNextProblem();
        }, 3000);
      }
    }
  };

  // Handle peek button click
  const handlePeek = (): void => {
    if (peeksRemaining > 0 && !isPeeking) {
      setPeeksRemaining(peeksRemaining - 1);
      setIsPeeking(true);

      // Hide blocks after 5 seconds
      setTimeout(() => {
        setIsPeeking(false);
      }, 5000);
    }
  };

  if (!currentProblem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between w-full items-center">
        <div className="text-xl font-semibold text-gray-700">
          Difficulty: <span className="capitalize">{difficulty}</span>
        </div>
        {session && (
          <div className="text-lg text-gray-600">
            Streak: <span className="font-bold text-teal-600">{session.correctStreak}</span>
          </div>
        )}
        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Exit
          </button>
        )}
      </div>

      {/* PHASE 1: Interactive Block Manipulation */}
      {phase === 'interacting' && (
        <InteractiveBlockGrid
          startingNumber={currentProblem.startingNumber}
          targetRemovalCount={currentProblem.delta}
          operation={currentProblem.operation}
          onComplete={handleInteractionComplete}
          onSkip={handleSkipInteraction}
        />
      )}

      {/* PHASE 2: Answer Question */}
      {phase === 'answering' && (
        <>
          {/* Question */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What number do you have now?</h2>
            <p className="text-xl text-gray-600">
              You started with {currentProblem.startingNumber}, then{' '}
              {currentProblem.operation === 'more' ? 'added' : 'removed'} {currentProblem.delta}.
            </p>
          </div>

          {/* Static blocks for reference (Medium mode after interaction, or peek) */}
          {difficulty === 'medium' && (showStaticBlocks || isPeeking) && (
            <VisualScaffold
              startingNumber={currentProblem.startingNumber}
              operation={currentProblem.operation}
              delta={currentProblem.delta}
              visibility="always"
            />
          )}

          {/* Peek Button - Medium mode only */}
          {difficulty === 'medium' && !showStaticBlocks && (
            <PeekButton
              remaining={peeksRemaining}
              onClick={handlePeek}
              disabled={feedback?.isCorrect === true || attemptCount >= 3 || isPeeking}
            />
          )}

          {/* Answer Input */}
          <AnswerInput
            value={answerValue}
            onChange={setAnswerValue}
            onSubmit={handleSubmit}
            disabled={feedback?.isCorrect === true || attemptCount >= 3}
            showFeedback={showFeedbackType ?? null}
          />

          {/* Feedback */}
          {feedback && (
            <FeedbackDisplay
              attemptNumber={attemptCount as 1 | 2 | 3}
              isCorrect={feedback.isCorrect}
              hint={feedback.hint}
              correctAnswer={attemptCount >= 3 ? currentProblem.targetValue : undefined}
            />
          )}
        </>
      )}

      {/* PHASE 3: Complete (just feedback, waiting for next) */}
      {phase === 'complete' && feedback && (
        <FeedbackDisplay
          attemptNumber={attemptCount as 1 | 2 | 3}
          isCorrect={feedback.isCorrect}
          hint={feedback.hint}
          correctAnswer={attemptCount >= 3 ? currentProblem.targetValue : undefined}
        />
      )}

      {/* Progress */}
      {session && (
        <div className="mt-6 text-center space-y-2">
          <div className="text-sm text-gray-500">
            Problems completed: <span className="font-semibold">{session.problemsCompleted}</span>
          </div>
          <div className="text-sm text-gray-500">
            Longest streak: <span className="font-semibold">{session.longestStreak}</span>
          </div>
        </div>
      )}
    </div>
  );
};
