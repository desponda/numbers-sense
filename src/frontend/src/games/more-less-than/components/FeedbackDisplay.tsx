import type { JSX } from 'react';

export interface FeedbackDisplayProps {
  attemptNumber: 1 | 2 | 3;
  isCorrect: boolean;
  hint?: string;
  correctAnswer?: number;
}

export const FeedbackDisplay = ({
  attemptNumber,
  isCorrect,
  hint,
  correctAnswer,
}: FeedbackDisplayProps): JSX.Element | null => {
  if (isCorrect) {
    return (
      <div className="bg-green-100 border-4 border-green-500 rounded-xl p-6 text-center">
        <div className="text-4xl mb-2">✓</div>
        <div className="text-2xl font-bold text-green-800">Correct!</div>
      </div>
    );
  }

  // Progressive hints
  if (attemptNumber === 1) {
    return (
      <div className="bg-orange-100 border-4 border-orange-400 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">🤔</div>
        <div className="text-xl font-semibold text-orange-800">Not quite. Try again!</div>
      </div>
    );
  }

  if (attemptNumber === 2 && hint !== undefined && hint !== '') {
    return (
      <div className="bg-orange-100 border-4 border-orange-400 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">💡</div>
        <div className="text-xl font-semibold text-orange-800 mb-2">Hint:</div>
        <div className="text-lg text-orange-700">{hint}</div>
      </div>
    );
  }

  if (attemptNumber === 3 && correctAnswer !== undefined) {
    return (
      <div className="bg-blue-100 border-4 border-blue-400 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">📚</div>
        <div className="text-xl font-semibold text-blue-800 mb-2">
          The answer is {correctAnswer}
        </div>
        <div className="text-lg text-blue-700">Let&apos;s try a new one!</div>
      </div>
    );
  }

  return null;
};
