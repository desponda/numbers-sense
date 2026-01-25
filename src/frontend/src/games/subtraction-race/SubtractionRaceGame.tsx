import type { JSX } from 'react';

import { RaceGame, type RaceGameProps } from '../race-game';

/**
 * Props for SubtractionRaceGame
 * Omits gameType since it's hardcoded to 'subtraction'
 */
export type SubtractionRaceGameProps = Omit<RaceGameProps, 'gameType'>;

/**
 * SubtractionRaceGame - Subtraction fact fluency game
 *
 * Wrapper component that specializes RaceGame for subtraction.
 * Students race through subtraction facts from 0-0 to 9-9.
 *
 * Game Concept:
 * - 10 bike lanes (lanes 0-9), or 6 lanes for easy mode (0-5)
 * - Each lane tests subtraction from that minuend
 *   - Lane 0: 0-0 (1 fact)
 *   - Lane 1: 1-0, 1-1 (2 facts)
 *   - Lane 7: 7-0, 7-1, ..., 7-7 (8 facts)
 *   - Lane 9: 9-0, 9-1, ..., 9-9 (10 facts)
 * - Each fact must be answered correctly 2 times (3 times in hard mode)
 * - Smart distractor generation based on common errors (off-by-one, operation confusion, reversed subtraction)
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
 * <SubtractionRaceGame
 *   difficulty="medium"
 *   onComplete={(stats) => {
 *     console.log('Subtraction mastery achieved!', stats);
 *   }}
 * />
 * ```
 */
export const SubtractionRaceGame = (props: SubtractionRaceGameProps): JSX.Element => {
  return <RaceGame gameType="subtraction" {...props} />;
};

export default SubtractionRaceGame;
