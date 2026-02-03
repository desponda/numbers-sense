import type { JSX } from 'react';

export interface NumberPadProps {
  onSelect: (value: number) => void;
  selectedValue: number | null;
  max?: number;
}

export const NumberPad = ({ onSelect, selectedValue, max = 10 }: NumberPadProps): JSX.Element => {
  const numbers = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 gap-3">
      {numbers.map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => {
            onSelect(num);
          }}
          className={`
            w-16 h-16
            text-2xl font-bold
            rounded-xl
            transition-all duration-150
            ${
              selectedValue === num
                ? 'bg-teal-500 text-white scale-110 shadow-lg'
                : 'bg-white text-gray-700 hover:bg-teal-100 border-2 border-gray-300'
            }
          `}
        >
          {num}
        </button>
      ))}
    </div>
  );
};
