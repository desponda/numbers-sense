import type { JSX } from 'react';

import type { MoreLessThanProblem } from '../../../game-engine/types';

export interface ProblemDisplayProps {
  problem: MoreLessThanProblem;
}

export const ProblemDisplay = ({ problem }: ProblemDisplayProps): JSX.Element => {
  const { delta, operation, startingNumber } = problem;

  const ariaLabel = `What is ${String(delta)} ${operation} than ${String(startingNumber)}?`;

  return (
    <div className="text-center">
      <h2 className="text-3xl font-semibold text-gray-800 mb-2" aria-label={ariaLabel}>
        What is{' '}
        <span className="text-orange-500 font-bold underline">
          {delta} {operation} than
        </span>{' '}
        {startingNumber}?
      </h2>
    </div>
  );
};
