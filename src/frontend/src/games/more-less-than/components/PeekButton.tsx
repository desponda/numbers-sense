import type { JSX } from 'react';

export interface PeekButtonProps {
  remaining: number;
  onClick: () => void;
  disabled: boolean;
}

export const PeekButton = ({ remaining, onClick, disabled }: PeekButtonProps): JSX.Element => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || remaining === 0}
      className={`
        px-6 py-4
        min-w-[200px] min-h-[64px]
        text-lg font-semibold
        rounded-xl
        transition-all duration-200
        ${
          remaining > 0 && !disabled
            ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }
      `}
    >
      👀 SHOW BLOCKS ({String(remaining)} left)
    </button>
  );
};
