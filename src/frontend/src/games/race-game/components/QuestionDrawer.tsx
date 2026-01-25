import { useEffect, useRef, type JSX } from 'react';

import { MultipleChoiceGrid } from './MultipleChoiceGrid';

import type { RaceQuestion } from '../types';

/**
 * Props for the QuestionDrawer component
 */
export interface QuestionDrawerProps {
  /** The question to display */
  question: RaceQuestion;
  /** Callback when an answer is selected */
  onAnswer: (selectedIndex: number) => void;
  /** Game type (to show correct symbol in lane header) */
  gameType?: 'multiplication' | 'division' | 'addition' | 'subtraction';
  /** Currently selected answer index (null if none selected) */
  selectedIndex?: number | null;
  /** Whether the drawer is disabled (e.g., while processing answer) */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * QuestionDrawer - Bottom drawer displaying question without blocking race track
 *
 * CRITICAL UX CHANGE (Jan 2026):
 * Previous implementation used a full-screen modal that completely obscured
 * the race track, breaking the core game metaphor. This drawer keeps the
 * track visible so students can see which lane they're helping.
 *
 * Features:
 * - Bottom drawer (45% viewport height on mobile, 40% on tablet+)
 * - Race track remains visible above (subtle 5% dim)
 * - Lane indicator header shows which lane is active
 * - Slide-up animation when question appears
 * - Does NOT trap focus (users can navigate to race track)
 *
 * Design:
 * - Fixed to bottom of screen (not full overlay)
 * - White background with top border and shadow
 * - Yellow header matching active lane highlight
 * - Rounded top corners for polish
 * - Responsive height based on device size
 *
 * Accessibility:
 * - Region role (not dialog - not blocking)
 * - Keyboard navigation to race track allowed
 * - Screen reader announces lane context
 * - Auto-focus first answer button
 *
 * @example
 * ```tsx
 * <QuestionDrawer
 *   question={currentQuestion}
 *   onAnswer={(index) => handleAnswer(index)}
 *   disabled={isProcessing}
 * />
 * ```
 */
export const QuestionDrawer = ({
  question,
  onAnswer,
  gameType,
  selectedIndex = null,
  disabled = false,
  className = '',
}: QuestionDrawerProps): JSX.Element => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLDivElement>(null);

  // Determine symbol from gameType or question fact
  const getLaneSymbol = (): string => {
    if (gameType === 'division') {
      return '÷';
    }
    if (gameType === 'multiplication') {
      return '×';
    }
    if (gameType === 'addition') {
      return '+';
    }
    if (gameType === 'subtraction') {
      return '-';
    }
    // Fallback: infer from question fact
    if (question.fact.includes('÷')) {
      return '÷';
    }
    if (question.fact.includes('+')) {
      return '+';
    }
    if (question.fact.includes('-')) {
      return '-';
    }
    return '×';
  };
  const laneSymbol = getLaneSymbol();

  // Auto-focus first button when drawer opens (but don't trap focus)
  useEffect(() => {
    const focusFirstButton = (): void => {
      if (firstButtonRef.current) {
        const firstButton = firstButtonRef.current.querySelector('button');
        firstButton?.focus();
      }
    };
    // Small delay to allow slide animation to start
    const timer = setTimeout(focusFirstButton, 150);
    return (): void => {
      clearTimeout(timer);
    };
  }, [question]);

  return (
    <div
      className={`
        fixed z-40 flex flex-col
        bg-white shadow-lift overflow-y-auto

        /* Mobile: Bottom drawer */
        bottom-0 inset-x-0
        max-h-[40vh]
        rounded-t-3xl
        border-t-4 border-primary
        animate-slide-up

        /* Desktop: Right sidebar */
        md:right-0 md:top-0 md:bottom-0 md:left-auto md:inset-x-auto
        md:w-[40vw] md:max-w-[600px] md:max-h-full
        md:rounded-l-3xl md:rounded-tr-none
        md:border-l-4 md:border-t-0
        md:animate-slide-left

        p-4 md:p-6
        ${className}
      `}
      role="region"
      aria-label="Question panel"
      aria-live="polite"
      ref={drawerRef}
    >
      {/* Lane indicator header */}
      <div className="flex items-center gap-3 mb-4 bg-yellow-100 -mx-6 -mt-6 px-6 py-3 rounded-t-3xl border-b-2 border-yellow-400">
        <span className="text-2xl" aria-hidden="true">
          👉
        </span>
        <h2 className="text-xl font-bold text-text-primary">
          Lane {laneSymbol}
          {question.lane} Question
        </h2>
      </div>

      {/* Question text */}
      <div className="text-center mb-6">
        <h3 id="question-text" className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
          {question.questionText}
        </h3>
        <p className="text-base md:text-lg text-text-secondary">Choose the correct answer</p>
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

      {/* Screen reader announcement for question context */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        New question for Lane times {question.lane}: {question.questionText}. Choose from 4 options.
      </div>
    </div>
  );
};
