import type { JSX } from 'react';

import { RaceGame, type RaceGameProps } from '../race-game';

/**
 * Props for MultiplicationRaceGame
 * Omits gameType since it's hardcoded to 'multiplication'
 */
export type MultiplicationRaceGameProps = Omit<RaceGameProps, 'gameType'>;

/**
 * MultiplicationRaceGame - Multiplication fact fluency game
 *
 * Wrapper component that specializes RaceGame for multiplication.
 * Students race through all multiplication facts from 0×0 to 9×9.
 *
 * Game Concept:
 * - 10 bike lanes (lanes 0-9), or 6 lanes for easy mode (0-5)
 * - Each lane tests facts for that multiplier (e.g., Lane 7 tests 7×0, 7×1, ..., 7×9)
 * - Each fact must be answered correctly 2 times (3 times in hard mode)
 * - Smart distractor generation based on common errors
 * - Furthest-behind lanes are prioritized
 *
 * Difficulty Modes:
 * - Easy: Lanes 0-5 only, 6 lanes × 20 steps = 120 questions
 * - Medium: All lanes 0-9, 10 lanes × 20 steps = 200 questions
 * - Hard: All lanes 0-9, 10 lanes × 30 steps = 300 questions
 *
 * Based on:
 * - /docs/specs/multiplication-race-game.md
 * - /docs/architecture/race-games-architecture.md
 *
 * @example
 * ```tsx
 * <MultiplicationRaceGame
 *   difficulty="medium"
 *   onComplete={(stats) => {
 *     console.log('Completed!', stats);
 *   }}
 * />
 * ```
 */
export const MultiplicationRaceGame = (props: MultiplicationRaceGameProps): JSX.Element => {
  return <RaceGame gameType="multiplication" {...props} />;
};

export default MultiplicationRaceGame;
