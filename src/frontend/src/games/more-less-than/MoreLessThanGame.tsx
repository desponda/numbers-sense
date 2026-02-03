import { useEffect, useState } from 'react';
import type { JSX } from 'react';

import { generateProblem } from '../../game-engine/problemGenerator';
import { useGameSessionStore } from '../../game-engine/stores/gameSessionStore';

import { AnswerInput } from './components/AnswerInput';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { ProblemDisplay } from './components/ProblemDisplay';
import { VisualScaffold } from './components/VisualScaffold';
import { validateAnswer } from './utils/validation';

import type { DifficultyMode, MoreLessThanProblem } from '../../game-engine/types';

export interface MoreLessThanGameProps {
  difficulty: DifficultyMode;
  onExit?: () => void;
}

/**
 * MoreLessThanGame - Main game component for "More Than / Less Than" game.
 *
 * Game flow:
 * 1. Display problem (e.g., "What is 3 more than 5?")
 * 2. Show visual scaffold (if difficulty allows)
 * 3. Accept numerical answer input
 * 4. Validate and provide progressive feedback
 * 5. Allow up to 3 attempts
 * 6. Show answer after 3 incorrect attempts
 * 7. Generate next problem
 *
 * Features:
 * - Progressive feedback system (attempt 1: generic, attempt 2: hint, attempt 3: answer)
 * - Visual scaffolding for Easy mode
 * - Integration with game engine store for session tracking
 * - Streak tracking
 * - Problem variety via problem generator
 *
 * @example
 * ```tsx
 * <MoreLessThanGame difficulty="easy" onExit={() => navigate('/')} />
 * ```
 */
export const MoreLessThanGame = ({ difficulty, onExit }: MoreLessThanGameProps): JSX.Element => {
  const { session, setProblem, completeProblem, startSession } = useGameSessionStore();
  const [currentProblem, setCurrentProblem] = useState<MoreLessThanProblem | null>(null);
  const [answerValue, setAnswerValue] = useState<number | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; hint?: string } | null>(null);
  const [showFeedbackType, setShowFeedbackType] = useState<'correct' | 'incorrect' | null>(null);

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
  }, [difficulty, setProblem]);

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
      completeProblem(true);

      // Next problem after 2 seconds
      setTimeout(() => {
        const nextProblem = generateProblem({
          gameId: 'more-less-than',
          difficulty,
        }) as MoreLessThanProblem;

        setCurrentProblem(nextProblem);
        setProblem(nextProblem);
        setAnswerValue(null);
        setAttemptCount(0);
        setFeedback(null);
        setShowFeedbackType(null);
      }, 2000);
    } else {
      setFeedback({ isCorrect: false, hint: result.hint });
      setShowFeedbackType('incorrect');

      // If 3 attempts, show answer and move to next
      if (newAttemptCount >= 3) {
        completeProblem(false);

        setTimeout(() => {
          const nextProblem = generateProblem({
            gameId: 'more-less-than',
            difficulty,
          }) as MoreLessThanProblem;

          setCurrentProblem(nextProblem);
          setProblem(nextProblem);
          setAnswerValue(null);
          setAttemptCount(0);
          setFeedback(null);
          setShowFeedbackType(null);
        }, 3000);
      }
    }
  };

  // Determine visibility based on difficulty
  const getVisibility = (): 'always' | 'peek' | 'hint' | 'none' => {
    if (difficulty === 'easy') {
      return 'always';
    }
    if (difficulty === 'medium') {
      return 'peek';
    }
    return 'hint';
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

      {/* Problem Display */}
      <ProblemDisplay problem={currentProblem} />

      {/* Visual Scaffold - Only show for Easy mode, always visible */}
      {difficulty === 'easy' && (
        <VisualScaffold
          startingNumber={currentProblem.startingNumber}
          operation={currentProblem.operation}
          delta={currentProblem.delta}
          visibility={getVisibility()}
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
