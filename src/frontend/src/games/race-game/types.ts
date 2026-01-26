/**
 * Race Game Types
 *
 * Type definitions for Multiplication Race and Division Race games.
 * These games share the same core logic and UI, differing only in question generation.
 */

// Game type identifiers
export type GameType = 'multiplication' | 'division' | 'addition' | 'subtraction';

// Difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Lane state for each bike in the race
export interface LaneState {
  /** Lane number (0-9 for multiplication, 1-9 for division) */
  laneNumber: number;

  /** Lane label (e.g., "×7" or "÷7") */
  label: string;

  /** Steps completed in this lane */
  stepsCompleted: number;

  /** Total steps required to finish lane */
  stepsTotal: number;

  /** Whether this lane is finished */
  finished: boolean;

  /** All facts for this lane (e.g., ["7×0", "7×1", ...]) */
  facts: string[];

  /** Progress percentage (0.0 to 1.0, for animation) */
  progress: number;
}

// Race question with multiple choice answers
export interface RaceQuestion {
  /** Lane this question is for */
  lane: number;

  /** Question text (e.g., "7 × 8 = ?") */
  questionText: string;

  /** Correct answer */
  correctAnswer: number;

  /** All answer options (4 total, shuffled) */
  options: number[];

  /** Index of correct answer in options array */
  correctIndex: number;

  /** Fact being tested (e.g., "7×8") */
  fact: string;
}

// Fact mastery tracking
export interface FactMastery {
  /** Fact identifier (e.g., "7×8" or "56÷7") */
  fact: string;

  /** Number of times answered correctly */
  correctCount: number;

  /** Whether this fact is mastered (2+ correct for medium, 3+ for hard) */
  mastered: boolean;
}

// Game statistics for completion screen
export interface GameStats {
  /** Game type */
  gameType: GameType;

  /** Difficulty level */
  difficulty: Difficulty;

  /** Total correct answers */
  totalCorrect: number;

  /** Total attempts */
  totalAttempts: number;

  /** Accuracy percentage */
  accuracy: number;

  /** Time elapsed (milliseconds) */
  timeElapsed: number;

  /** Facts mastered during session */
  factsMastered: number;

  /** Total facts in game */
  totalFacts: number;
}

// Game status
export type GameStatus = 'init' | 'playing' | 'paused' | 'completed';

// Difficulty configuration
export interface DifficultyConfig {
  /** Difficulty mode */
  difficulty: Difficulty;

  /** Number of lanes */
  laneCount: number;

  /** Starting lane (0 for mult, 1 for div) */
  startLane: number;

  /** Ending lane (exclusive) */
  endLane: number;

  /** Steps per lane */
  stepsPerLane: number;

  /** Times correct required for mastery */
  masteryThreshold: number;
}

// Difficulty configurations
// Updated based on educational research for K-3 attention spans and optimal session length
// Easy: 50 questions (5-8 min) for K-1, Medium: 80 questions (8-12 min) for Grade 2, Hard: 120 questions (12-15 min) for Grade 3
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    difficulty: 'easy',
    laneCount: 5,
    startLane: 0, // Will be adjusted for division (1-5)
    endLane: 5,
    stepsPerLane: 10,
    masteryThreshold: 2,
  },
  medium: {
    difficulty: 'medium',
    laneCount: 8,
    startLane: 0, // Will be adjusted for division (1-8)
    endLane: 8,
    stepsPerLane: 10,
    masteryThreshold: 2,
  },
  hard: {
    difficulty: 'hard',
    laneCount: 10,
    startLane: 0,
    endLane: 10,
    stepsPerLane: 12,
    masteryThreshold: 3,
  },
};
