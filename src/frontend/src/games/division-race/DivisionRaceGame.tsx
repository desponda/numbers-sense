import type { JSX } from 'react';

import { RaceGame, type RaceGameProps } from '../race-game';

/**
 * Props for DivisionRaceGame
 * Omits gameType since it's hardcoded to 'division'
 */
export type DivisionRaceGameProps = Omit<RaceGameProps, 'gameType'>;

/**
 * DivisionRaceGame - Division fact fluency game
 *
 * Wrapper component that specializes RaceGame for division.
 * Students race through division facts (inverses of multiplication facts).
 *
 * Game Concept:
 * - 9 bike lanes (lanes 1-9, no division by zero)
 * - Each lane tests division by that divisor
 *   - Lane 1: 0÷1, 1÷1, 2÷1, ..., 9÷1
 *   - Lane 2: 0÷2, 2÷2, 4÷2, ..., 18÷2
 *   - Lane 7: 0÷7, 7÷7, 14÷7, ..., 63÷7
 *   - Lane 9: 0÷9, 9÷9, 18÷9, ..., 81÷9
 * - Each fact must be answered correctly 2 times (3 times in hard mode)
 * - Only whole number division (no remainders)
 * - Smart distractor generation based on common errors
 *
 * Difficulty Modes:
 * - Easy: Lanes 1-5 only, 5 lanes × 20 steps = 100 questions
 * - Medium: All lanes 1-9, 9 lanes × 20 steps = 180 questions
 * - Hard: All lanes 1-9, 9 lanes × 30 steps = 270 questions
 *
 * Based on:
 * - /docs/specs/division-race-game.md (pending)
 * - /docs/architecture/race-games-architecture.md
 *
 * @example
 * ```tsx
 * <DivisionRaceGame
 *   difficulty="medium"
 *   onComplete={(stats) => {
 *     console.log('Division mastery achieved!', stats);
 *   }}
 * />
 * ```
 */
export const DivisionRaceGame = (props: DivisionRaceGameProps): JSX.Element => {
  return <RaceGame gameType="division" {...props} />;
};

export default DivisionRaceGame;
