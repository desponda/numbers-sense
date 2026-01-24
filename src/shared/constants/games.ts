/**
 * Game-related constants for NumberSense K-3
 */

import type { GameId, DifficultyMode, GameConfig, GradeLevel } from '../types/index.js';

/**
 * All available game identifiers
 */
export const GAME_IDS = {
  BUILD_THE_NUMBER: 'build-the-number',
  SORT_THE_NUMBERS: 'sort-the-numbers',
} as const;

/**
 * Array of all game IDs for iteration
 */
export const GAME_ID_LIST: readonly GameId[] = [
  GAME_IDS.BUILD_THE_NUMBER,
  GAME_IDS.SORT_THE_NUMBERS,
] as const;

/**
 * Difficulty modes from easiest to hardest
 */
export const DIFFICULTY_MODES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  CHALLENGE: 'challenge',
} as const;

/**
 * Array of difficulty modes in order
 */
export const DIFFICULTY_MODE_LIST: readonly DifficultyMode[] = [
  DIFFICULTY_MODES.EASY,
  DIFFICULTY_MODES.MEDIUM,
  DIFFICULTY_MODES.HARD,
  DIFFICULTY_MODES.CHALLENGE,
] as const;

/**
 * Grade levels supported by the application
 */
export const GRADE_LEVELS = {
  KINDERGARTEN: 'K',
  FIRST: '1',
  SECOND: '2',
  THIRD: '3',
} as const;

/**
 * Array of grade levels in order
 */
export const GRADE_LEVEL_LIST: readonly GradeLevel[] = [
  GRADE_LEVELS.KINDERGARTEN,
  GRADE_LEVELS.FIRST,
  GRADE_LEVELS.SECOND,
  GRADE_LEVELS.THIRD,
] as const;

/**
 * Configuration for each game
 */
export const GAME_CONFIGS: Record<GameId, GameConfig> = {
  'build-the-number': {
    id: 'build-the-number',
    name: 'Build the Number',
    description: 'Use blocks to build numbers and learn place value',
    minGrade: 'K',
    maxGrade: '3',
  },
  'sort-the-numbers': {
    id: 'sort-the-numbers',
    name: 'Sort the Numbers',
    description: 'Put numbers in order from smallest to largest or largest to smallest',
    minGrade: 'K',
    maxGrade: '3',
  },
} as const;

/**
 * Default number of problems per session
 */
export const DEFAULT_PROBLEMS_PER_SESSION = 10;

/**
 * Maximum hints allowed per problem
 */
export const MAX_HINTS_PER_PROBLEM = 3;

/**
 * Number ranges by difficulty mode and grade
 */
export const NUMBER_RANGES: Record<DifficultyMode, Record<GradeLevel, { min: number; max: number }>> = {
  easy: {
    K: { min: 1, max: 10 },
    '1': { min: 1, max: 20 },
    '2': { min: 1, max: 50 },
    '3': { min: 1, max: 100 },
  },
  medium: {
    K: { min: 1, max: 20 },
    '1': { min: 1, max: 50 },
    '2': { min: 1, max: 100 },
    '3': { min: 1, max: 500 },
  },
  hard: {
    K: { min: 1, max: 30 },
    '1': { min: 1, max: 100 },
    '2': { min: 1, max: 500 },
    '3': { min: 1, max: 1000 },
  },
  challenge: {
    K: { min: 1, max: 50 },
    '1': { min: 1, max: 200 },
    '2': { min: 1, max: 1000 },
    '3': { min: 1, max: 10000 },
  },
} as const;
