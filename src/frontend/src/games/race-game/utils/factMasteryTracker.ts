/**
 * Fact Mastery Tracker
 *
 * Manages mastery state for multiplication and division facts
 */

import type { GameType, Difficulty, FactMastery } from '../types';

/**
 * Get the required number of correct repetitions for a difficulty level
 */
export function getRepetitionsRequired(difficulty: Difficulty): number {
  const repetitions: Record<Difficulty, number> = {
    easy: 2,
    medium: 2,
    hard: 3,
  };
  return repetitions[difficulty];
}

/**
 * Generate all facts for a multiplication lane
 * For lane N, generates: N×0, N×1, N×2, ..., N×9
 */
function generateMultiplicationFacts(lane: number): string[] {
  const facts: string[] = [];
  for (let multiplier = 0; multiplier <= 9; multiplier += 1) {
    facts.push(`${String(lane)}×${String(multiplier)}`);
  }
  return facts;
}

/**
 * Generate all facts for a division lane
 * For lane N (divisor), generates: 0÷N, N÷N, 2N÷N, ..., 9N÷N
 */
function generateDivisionFacts(lane: number): string[] {
  const facts: string[] = [];
  for (let quotient = 0; quotient <= 9; quotient += 1) {
    const dividend = quotient * lane;
    facts.push(`${String(dividend)}÷${String(lane)}`);
  }
  return facts;
}

/**
 * Generate all facts for an addition lane
 * For lane N, generates: N+0, N+1, N+2, ..., N+9
 */
function generateAdditionFacts(lane: number): string[] {
  const facts: string[] = [];
  for (let addend2 = 0; addend2 <= 9; addend2 += 1) {
    facts.push(`${String(lane)}+${String(addend2)}`);
  }
  return facts;
}

/**
 * Generate all facts for a subtraction lane
 * For lane N (minuend), generates: N-0, N-1, N-2, ..., N-9
 * Note: Only generates valid facts where N >= subtrahend
 */
function generateSubtractionFacts(lane: number): string[] {
  const facts: string[] = [];
  for (let subtrahend = 0; subtrahend <= Math.min(lane, 9); subtrahend += 1) {
    facts.push(`${String(lane)}-${String(subtrahend)}`);
  }
  return facts;
}

/**
 * Generate all facts for a given lane
 */
export function generateLaneFacts(gameType: GameType, lane: number): string[] {
  if (gameType === 'multiplication') {
    return generateMultiplicationFacts(lane);
  }
  if (gameType === 'division') {
    return generateDivisionFacts(lane);
  }
  if (gameType === 'addition') {
    return generateAdditionFacts(lane);
  }
  // gameType === 'subtraction'
  return generateSubtractionFacts(lane);
}

/**
 * Get lane numbers for a given difficulty
 */
function getLanesForDifficulty(gameType: GameType, difficulty: Difficulty): number[] {
  if (gameType === 'multiplication') {
    // Multiplication lanes: 0-9
    if (difficulty === 'easy') {
      return [0, 1, 2, 3, 4, 5]; // 6 lanes
    }
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // 10 lanes
  }

  if (gameType === 'division') {
    // Division lanes: 1-9 (no division by zero)
    if (difficulty === 'easy') {
      return [1, 2, 3, 4, 5]; // 5 lanes
    }
    return [1, 2, 3, 4, 5, 6, 7, 8, 9]; // 9 lanes
  }

  if (gameType === 'addition') {
    // Addition lanes: 0-9
    if (difficulty === 'easy') {
      return [0, 1, 2, 3, 4, 5]; // 6 lanes
    }
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // 10 lanes
  }

  // Subtraction lanes: 0-9
  // Note: subtraction facts are lane-subtrahend where subtrahend <= lane
  if (difficulty === 'easy') {
    return [0, 1, 2, 3, 4, 5]; // 6 lanes
  }
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // 10 lanes
}

/**
 * Initialize fact mastery map for all lanes in a game
 */
export function initializeFactMastery(
  gameType: GameType,
  difficulty: Difficulty,
): Record<string, FactMastery> {
  const masteryMap: Record<string, FactMastery> = {};

  // Determine which lanes to include based on game type and difficulty
  const lanes = getLanesForDifficulty(gameType, difficulty);

  // Generate facts for each lane
  lanes.forEach((lane) => {
    const facts = generateLaneFacts(gameType, lane);

    // Initialize mastery tracking for each fact
    facts.forEach((fact) => {
      masteryMap[fact] = {
        fact,
        correctCount: 0,
        mastered: false,
      };
    });
  });

  return masteryMap;
}

/**
 * Get all unmastered facts for a specific lane
 */
export function getUnmasteredFacts(
  lane: number,
  masteryMap: Record<string, FactMastery>,
  gameType: GameType,
): string[] {
  const allFacts = generateLaneFacts(gameType, lane);

  return allFacts.filter((fact) => {
    const mastery = masteryMap[fact];
    return mastery && !mastery.mastered;
  });
}

/**
 * Mark a fact as correctly answered
 * Mutates the masteryMap parameter
 * Returns true if the fact is now mastered
 */
export function markFactCorrect(
  fact: string,
  masteryMap: Record<string, FactMastery>,
  difficulty: Difficulty,
): boolean {
  const mastery = masteryMap[fact];

  if (!mastery) {
    console.warn(`Fact ${fact} not found in mastery map`);
    return false;
  }

  const required = getRepetitionsRequired(difficulty);
  const newCorrectCount = mastery.correctCount + 1;
  const newMastered = newCorrectCount >= required;

  // eslint-disable-next-line no-param-reassign
  masteryMap[fact] = {
    ...mastery,
    correctCount: newCorrectCount,
    mastered: newMastered,
  };

  return newMastered;
}

/**
 * Check if all facts in a lane are mastered
 */
export function isLaneComplete(
  lane: number,
  masteryMap: Record<string, FactMastery>,
  gameType: GameType,
): boolean {
  const allFacts = generateLaneFacts(gameType, lane);

  return allFacts.every((fact) => {
    const mastery = masteryMap[fact];
    return mastery?.mastered === true;
  });
}

/**
 * Get the number of steps completed in a lane
 * (Each correct answer is one step)
 */
export function getLaneStepsCompleted(
  lane: number,
  masteryMap: Record<string, FactMastery>,
  gameType: GameType,
): number {
  const allFacts = generateLaneFacts(gameType, lane);

  let totalSteps = 0;

  allFacts.forEach((fact) => {
    const mastery = masteryMap[fact];
    if (mastery) {
      totalSteps += mastery.correctCount;
    }
  });

  return totalSteps;
}

/**
 * Get the total number of steps required for a lane
 */
export function getLaneStepsTotal(difficulty: Difficulty): number {
  const factsPerLane = 10; // Always 10 facts per lane
  const repetitions = getRepetitionsRequired(difficulty);
  return factsPerLane * repetitions;
}
