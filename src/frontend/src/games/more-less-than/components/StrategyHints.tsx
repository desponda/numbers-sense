import { useState } from 'react';
import type { JSX } from 'react';

import type { MoreLessThanProblem } from '../../../game-engine/types';

export interface StrategyHintsProps {
  problem: MoreLessThanProblem;
}

export const StrategyHints = ({ problem }: StrategyHintsProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { startingNumber, operation, delta, targetValue } = problem;

  const strategies: string[] = [];

  // Count back/forward strategy
  if (delta <= 5) {
    const direction = operation === 'more' ? 'up' : 'back';
    const sequence =
      operation === 'more'
        ? Array.from({ length: delta }, (_, i) => startingNumber + i + 1).join(', ')
        : Array.from({ length: delta }, (_, i) => startingNumber - i - 1)
            .reverse()
            .join(', ');
    strategies.push(
      `Count ${direction}: ${String(startingNumber)} → ${sequence} → ${String(targetValue)}`,
    );
  }

  // Use tens strategy (for ±10, ±20)
  if (delta % 10 === 0) {
    const tens = delta / 10;
    const startTens = Math.floor(startingNumber / 10);
    const startOnes = startingNumber % 10;
    const resultTens = operation === 'more' ? startTens + tens : startTens - tens;
    strategies.push(
      `Use tens: ${String(startTens)} tens + ${String(startOnes)} ones ${operation === 'more' ? '+' : '−'} ${String(tens)} tens = ${String(resultTens)} tens + ${String(startOnes)} ones = ${String(targetValue)}`,
    );
  }

  // Break apart strategy
  if (delta > 5 && operation === 'less') {
    const onesInStart = startingNumber % 10;
    if (delta > onesInStart) {
      // Needs regrouping
      const toTen = onesInStart;
      const remaining = delta - toTen;
      const intermediate = startingNumber - toTen;
      strategies.push(
        `Break apart: ${String(startingNumber)} − ${String(toTen)} = ${String(intermediate)}, then ${String(intermediate)} − ${String(remaining)} = ${String(targetValue)}`,
      );
    }
  }

  if (strategies.length === 0) {
    strategies.push(
      `Think: ${String(startingNumber)} ${operation === 'more' ? '+' : '−'} ${String(delta)} = ?`,
    );
  }

  return (
    <div className="w-full max-w-md bg-gray-50 rounded-lg border-2 border-gray-200 p-4">
      <button
        type="button"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        className="w-full flex justify-between items-center text-lg font-semibold text-gray-700 hover:text-gray-900"
      >
        <span>💡 Strategy Hints</span>
        <span>{isExpanded ? '▼' : '►'}</span>
      </button>

      {isExpanded && (
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          {strategies.map((strategy) => (
            <li key={strategy} className="flex gap-2">
              <span>•</span>
              <span>{strategy}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
