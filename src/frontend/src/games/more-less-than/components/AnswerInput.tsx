import { useState, useEffect } from 'react';
import type { JSX, ChangeEvent, KeyboardEvent } from 'react';

export interface AnswerInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  onSubmit: () => void;
  disabled?: boolean;
  showFeedback?: 'correct' | 'incorrect' | null;
}

export const AnswerInput = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  showFeedback = null,
}: AnswerInputProps): JSX.Element => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(value !== null ? String(value) : '');
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    setInputValue(val);
    const num = parseInt(val, 10);
    onChange(Number.isNaN(num) ? null : num);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && value !== null) {
      onSubmit();
    }
  };

  let borderColor = 'border-teal-400';
  if (showFeedback === 'correct') {
    borderColor = 'border-green-500';
  } else if (showFeedback === 'incorrect') {
    borderColor = 'border-orange-400';
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-lg font-medium text-gray-700">Your answer:</div>
      <input
        id="answer-input"
        type="number"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          text-4xl font-bold text-center
          border-4 ${borderColor}
          rounded-xl
          px-6 py-4
          min-w-[150px]
          focus:outline-none focus:ring-4 focus:ring-teal-200
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        placeholder="?"
        aria-label="Answer input"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || value === null}
        className="
          px-8 py-3
          bg-teal-500 hover:bg-teal-600
          text-white font-semibold text-lg
          rounded-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        "
      >
        Check Answer
      </button>
    </div>
  );
};
