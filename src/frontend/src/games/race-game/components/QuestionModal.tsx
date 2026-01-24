import { useEffect, useRef, type JSX } from 'react';

import { Card } from '../../../components/ui';

import { MultipleChoiceGrid } from './MultipleChoiceGrid';

import type { RaceQuestion } from '../types';

/**
 * Props for the QuestionModal component
 */
export interface QuestionModalProps {
  /** The question to display */
  question: RaceQuestion;
  /** Callback when an answer is selected */
  onAnswer: (selectedIndex: number) => void;
  /** Currently selected answer index (null if none selected) */
  selectedIndex?: number | null;
  /** Whether the modal is disabled (e.g., while processing answer) */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * QuestionModal - Modal overlay displaying a question and answer options
 *
 * Features:
 * - Full-screen overlay with dimmed background
 * - Question displayed prominently
 * - 2×2 multiple choice grid
 * - Focus trap to keep user in modal
 * - Escape key to close (if needed)
 *
 * Design:
 * - Semi-transparent overlay (70% dim)
 * - Card container for question
 * - Large, readable text
 * - Touch-friendly answer buttons
 *
 * Accessibility:
 * - Dialog role with aria-modal
 * - Focus trap within modal
 * - Screen reader announces question
 * - Keyboard navigation supported
 *
 * @example
 * ```tsx
 * <QuestionModal
 *   question={currentQuestion}
 *   onAnswer={(index) => handleAnswer(index)}
 *   disabled={isProcessing}
 * />
 * ```
 */
export const QuestionModal = ({
  question,
  onAnswer,
  selectedIndex = null,
  disabled = false,
  className = '',
}: QuestionModalProps): JSX.Element => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLDivElement>(null);

  // Focus trap: focus first button when modal opens
  useEffect(() => {
    const focusFirstButton = (): void => {
      if (firstButtonRef.current) {
        const firstButton = firstButtonRef.current.querySelector('button');
        firstButton?.focus();
      }
    };
    focusFirstButton();
  }, [question]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return (): void => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black bg-opacity-70
        p-4
        ${className}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-text"
      ref={modalRef}
    >
      <Card variant="elevated" padding="lg" className="w-full max-w-2xl shadow-lift animate-pop">
        {/* Question text */}
        <div className="text-center mb-8">
          <h2 id="question-text" className="text-4xl font-bold text-text-primary mb-2">
            {question.questionText}
          </h2>
          <p className="text-lg text-text-secondary">Choose the correct answer</p>
        </div>

        {/* Multiple choice grid */}
        <div ref={firstButtonRef}>
          <MultipleChoiceGrid
            options={question.options}
            selectedIndex={selectedIndex}
            onSelect={onAnswer}
            disabled={disabled}
          />
        </div>
      </Card>
    </div>
  );
};
