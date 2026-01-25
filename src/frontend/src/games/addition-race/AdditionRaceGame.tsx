import type { JSX } from 'react';

import { RaceGame, type RaceGameProps } from '../race-game';

/**
 * Props for AdditionRaceGame
 * Omits gameType since it's hardcoded to 'addition'
 */
export type AdditionRaceGameProps = Omit<RaceGameProps, 'gameType'>;

/**
 * AdditionRaceGame - Addition fact fluency game
 *
 * Wrapper component that specializes RaceGame for addition.
 * Students race through addition facts from 0+0 to 9+9.
 *
 * Game Concept:
 * - 10 bike lanes (lanes 0-9), or 6 lanes for easy mode (0-5)
 * - Each lane tests facts for that addend (e.g., Lane 7 tests 7+0, 7+1, ..., 7+9)
 * - Each fact must be answered correctly 2 times (3 times in hard mode)
 * - Smart distractor generation based on common errors (off-by-one, operation confusion)
 * - Furthest-behind lanes are prioritized
 *
 * Difficulty Modes:
 * - Easy: Lanes 0-5 only, 6 lanes × 20 steps = 120 questions
 * - Medium: All lanes 0-9, 10 lanes × 20 steps = 200 questions
 * - Hard: All lanes 0-9, 10 lanes × 30 steps = 300 questions
 *
 * Based on:
 * - /docs/architecture/race-games-architecture.md
 *
 * @example
 * ```tsx
 * <AdditionRaceGame
 *   difficulty="medium"
 *   onComplete={(stats) => {
 *     console.log('Addition mastery achieved!', stats);
 *   }}
 * />
 * ```
 */
export const AdditionRaceGame = (props: AdditionRaceGameProps): JSX.Element => {
  return <RaceGame gameType="addition" {...props} />;
};

export default AdditionRaceGame;
