/**
 * Problem Generator
 *
 * Generates problems for the NumberSense games with:
 * - Adaptive difficulty
 * - Variety in problem types
 * - Pedagogically sound progression
 */

import { DIFFICULTY_CONFIGS } from './types';

import type { DifficultyMode, GameId, Problem } from './types';

interface GeneratorOptions {
  gameId: GameId;
  difficulty: DifficultyMode;
  previousProblems?: Problem[];
  avoidRecent?: number; // Number of recent values to avoid
}

/**
 * Generate a unique problem ID
 */
const generateProblemId = (): string => {
  return `problem-${String(Date.now())}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Generate a random integer between min and max (inclusive)
 */
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Get recently used target values to avoid repetition
 */
const getRecentValues = (problems: Problem[], count: number): number[] => {
  return problems.slice(-count).map((p) => p.targetValue);
};

/**
 * Generate a target value that avoids recent values
 */
const generateTargetValue = (
  min: number,
  max: number,
  avoid: number[] = [],
  maxAttempts = 10,
): number => {
  let attempts = 0;
  let value: number;

  do {
    value = randomInt(min, max);
    attempts += 1;
  } while (avoid.includes(value) && attempts < maxAttempts);

  return value;
};

/**
 * Generate pedagogically interesting numbers for Build the Number
 *
 * Prioritizes:
 * - Round numbers (10, 20, 30...)
 * - Near-ten numbers (9, 11, 19, 21...)
 * - Milestone numbers (5, 15, 25...)
 */
const generatePedagogicalValue = (min: number, max: number, avoid: number[] = []): number => {
  const interestingNumbers: number[] = [];

  // Add round tens
  for (let i = 10; i <= max; i += 10) {
    if (i >= min && !avoid.includes(i)) {
      interestingNumbers.push(i);
    }
  }

  // Add near-ten numbers (one away from ten)
  for (let i = 9; i <= max; i += 10) {
    if (i >= min && !avoid.includes(i)) {
      interestingNumbers.push(i);
    }
  }
  for (let i = 11; i <= max; i += 10) {
    if (i >= min && !avoid.includes(i)) {
      interestingNumbers.push(i);
    }
  }

  // Add milestone fives
  for (let i = 5; i <= max; i += 10) {
    if (i >= min && !avoid.includes(i)) {
      interestingNumbers.push(i);
    }
  }

  // 50% chance to use a pedagogically interesting number
  if (interestingNumbers.length > 0 && Math.random() < 0.5) {
    const selectedNumber = interestingNumbers[randomInt(0, interestingNumbers.length - 1)];
    if (selectedNumber !== undefined) {
      return selectedNumber;
    }
  }

  // Otherwise, generate a random value
  return generateTargetValue(min, max, avoid);
};

/**
 * Generate a problem for Build the Number game
 */
const generateBuildTheNumberProblem = (options: GeneratorOptions): Problem => {
  const { difficulty, previousProblems = [], avoidRecent = 3 } = options;
  const config = DIFFICULTY_CONFIGS[difficulty];

  const recentValues = getRecentValues(previousProblems, avoidRecent);
  const targetValue = generatePedagogicalValue(config.minValue, config.maxValue, recentValues);

  return {
    id: generateProblemId(),
    gameId: 'build-the-number',
    targetValue,
    difficulty,
    createdAt: Date.now(),
  };
};

/**
 * Generate values for Sort the Numbers game
 */
const generateSortTheNumbersValues = (difficulty: DifficultyMode, count = 4): number[] => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const values: number[] = [];

  // Generate unique values
  while (values.length < count) {
    const value = randomInt(config.minValue, config.maxValue);
    if (!values.includes(value)) {
      values.push(value);
    }
  }

  // Shuffle the values (player will need to sort them)
  return values.sort(() => Math.random() - 0.5);
};

/**
 * Generate a problem for Sort the Numbers game
 */
const generateSortTheNumbersProblem = (options: GeneratorOptions): Problem => {
  const { difficulty } = options;

  // For sort game, targetValue represents the count of items to sort
  // Difficulty scales the number of items:
  // easy: 3 items, medium: 4 items, hard: 5 items, challenge: 6 items
  const itemCounts: Record<DifficultyMode, number> = {
    easy: 3,
    medium: 4,
    hard: 5,
    challenge: 6,
  };

  return {
    id: generateProblemId(),
    gameId: 'sort-the-numbers',
    targetValue: itemCounts[difficulty],
    difficulty,
    createdAt: Date.now(),
  };
};

/**
 * Generate a problem for More Than / Less Than game
 *
 * Generates problems like "3 more than 5" or "2 less than 8"
 * Ensures results stay within valid range (no negative numbers)
 */
const generateMoreLessThanProblem = (options: GeneratorOptions): Problem => {
  const { difficulty } = options;
  const config = DIFFICULTY_CONFIGS[difficulty];

  // Define delta ranges per difficulty
  const deltaRanges: Record<DifficultyMode, number[]> = {
    easy: [1, 2],
    medium: [1, 2, 3, 5, 10],
    hard: [1, 2, 3, 4, 5, 10, 20],
    challenge: [5, 10, 15, 20, 25],
  };

  // Select operation (50/50 more vs less)
  const operation: 'more' | 'less' = Math.random() < 0.5 ? 'more' : 'less';

  // Select delta
  const deltas = deltaRanges[difficulty];
  const deltaIndex = randomInt(0, deltas.length - 1);
  const delta = deltas[deltaIndex] ?? 1; // Fallback to 1 if undefined

  // Generate valid starting number
  // For "more": ensure starting + delta <= maxValue
  // For "less": ensure starting - delta >= minValue (and >= 0)
  let startingNumber: number;
  if (operation === 'more') {
    startingNumber = randomInt(config.minValue, config.maxValue - delta);
  } else {
    startingNumber = randomInt(Math.max(config.minValue, delta), config.maxValue);
  }

  const targetValue = operation === 'more' ? startingNumber + delta : startingNumber - delta;

  return {
    id: generateProblemId(),
    gameId: 'more-less-than',
    startingNumber,
    operation,
    delta,
    targetValue,
    difficulty,
    createdAt: Date.now(),
  };
};

/**
 * Main problem generator function
 */
export const generateProblem = (options: GeneratorOptions): Problem => {
  const { gameId } = options;

  switch (gameId) {
    case 'build-the-number':
      return generateBuildTheNumberProblem(options);
    case 'sort-the-numbers':
      return generateSortTheNumbersProblem(options);
    case 'more-less-than':
      return generateMoreLessThanProblem(options);
    default:
      throw new Error(`Unknown game: ${String(gameId)}`);
  }
};

/**
 * Generate a batch of problems (useful for offline play)
 */
export const generateProblemBatch = (
  gameId: GameId,
  difficulty: DifficultyMode,
  count: number,
): Problem[] => {
  const problems: Problem[] = [];

  for (let i = 0; i < count; i += 1) {
    const problem = generateProblem({
      gameId,
      difficulty,
      previousProblems: problems,
    });
    problems.push(problem);
  }

  return problems;
};

/**
 * Export for Sort the Numbers game
 */
export { generateSortTheNumbersValues };
