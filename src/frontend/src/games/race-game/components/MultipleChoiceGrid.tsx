import type { JSX } from 'react';

import { Button } from '../../../components/ui';

/**
 * Props for the MultipleChoiceGrid component
 */
export interface MultipleChoiceGridProps {
  /** Four answer options to display */
  options: number[];
  /** Currently selected option index (null if none selected) */
  selectedIndex: number | null;
  /** Callback when an option is selected */
  onSelect: (index: number) => void;
  /** Whether the grid is disabled (e.g., while processing answer) */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * MultipleChoiceGrid - 2×2 grid of answer buttons
 *
 * Features:
 * - Four options in 2×2 grid layout
 * - Large touch targets (120px × 64px minimum)
 * - Clear visual feedback on selection
 * - Accessible with keyboard navigation
 * - Uses existing Button component
 *
 * Layout:
 * - 2 columns on all screen sizes
 * - Consistent spacing
 * - Touch-friendly sizing
 *
 * Accessibility:
 * - ARIA radiogroup role
 * - Each button is a radio button
 * - Keyboard navigation (arrow keys, tab)
 * - Screen reader announces options
 *
 * @example
 * ```tsx
 * <MultipleChoiceGrid
 *   options={[48, 56, 63, 49]}
 *   selectedIndex={1}
 *   onSelect={(index) => handleAnswer(index)}
 *   disabled={false}
 * />
 * ```
 */
export const MultipleChoiceGrid = ({
  options,
  selectedIndex,
  onSelect,
  disabled = false,
  className = '',
}: MultipleChoiceGridProps): JSX.Element => {
  const handleKeyDown = (event: React.KeyboardEvent, index: number): void => {
    if (disabled) {
      return;
    }

    // Handle Enter and Space keys
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(index);
    }
  };

  return (
    <div
      className={`
        grid grid-cols-2 gap-4 w-full max-w-md mx-auto
        ${className}
      `}
      role="radiogroup"
      aria-label="Answer options"
    >
      {options.map((option, index) => (
        <Button
          key={`option-${String(option)}-${String(index)}`}
          variant={selectedIndex === index ? 'primary' : 'secondary'}
          size="lg"
          onClick={() => {
            onSelect(index);
          }}
          onKeyDown={(event) => {
            handleKeyDown(event, index);
          }}
          disabled={disabled}
          className={`
            min-h-touch-lg min-w-[120px]
            text-2xl font-bold
            ${selectedIndex === index ? 'ring-2 ring-primary ring-offset-2' : ''}
          `}
          role="radio"
          aria-checked={selectedIndex === index}
          aria-label={`Option ${String.fromCharCode(65 + index)}: ${String(option)}`}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};
