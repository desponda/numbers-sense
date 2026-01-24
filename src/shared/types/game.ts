/**
 * Game-related types for NumberSense K-3
 */

import type { GradeLevel } from './user.js';

/**
 * Available game identifiers
 */
export type GameId = 'build-the-number' | 'sort-the-numbers';

/**
 * Difficulty modes for adaptive gameplay
 */
export type DifficultyMode = 'easy' | 'medium' | 'hard' | 'challenge';

/**
 * Configuration for a game
 */
export interface GameConfig {
  /** Unique game identifier */
  id: GameId;
  /** Display name of the game */
  name: string;
  /** Description of the game and its learning objectives */
  description: string;
  /** Minimum grade level for this game */
  minGrade: GradeLevel;
  /** Maximum grade level for this game */
  maxGrade: GradeLevel;
}

/**
 * Block types for Build the Number game
 * Represents base-10 manipulatives
 */
export type BlockType = 'unit' | 'ten' | 'hundred';

/**
 * A single block in the Build the Number game
 */
export interface Block {
  /** Type of block (unit, ten, or hundred) */
  type: BlockType;
  /** Numeric value of the block */
  value: number;
}

/**
 * Problem configuration for Build the Number game
 */
export interface BuildProblem {
  /** Target number to build */
  target: number;
  /** Current difficulty mode */
  mode: DifficultyMode;
  /** Available blocks for this problem (optional - defaults based on mode) */
  availableBlocks?: BlockType[];
}

/**
 * Phases for Sort the Numbers game
 */
export type SortPhase = 'visual' | 'numeric';

/**
 * Problem configuration for Sort the Numbers game
 */
export interface SortProblem {
  /** Numbers to be sorted */
  items: number[];
  /** Current phase of the game */
  phase: SortPhase;
  /** Whether to sort ascending or descending */
  ascending: boolean;
}

/**
 * Generic game state that can be extended by specific games
 */
export interface GameState {
  /** Current game being played */
  gameId: GameId;
  /** Current difficulty mode */
  difficulty: DifficultyMode;
  /** Whether the game is currently active */
  isActive: boolean;
  /** Current problem number in the session */
  currentProblemIndex: number;
  /** Total problems in this session */
  totalProblems: number;
}
