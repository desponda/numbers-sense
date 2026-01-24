/**
 * Progress and scoring types for NumberSense K-3
 */

import type { GameId, DifficultyMode } from './game.js';

/**
 * Overall progress for a specific game
 */
export interface GameProgress {
  /** Game identifier */
  gameId: GameId;
  /** Current level within the game */
  currentLevel: number;
  /** Accuracy percentage (0-100) */
  accuracy: number;
  /** Total problems completed in this game */
  problemsCompleted: number;
  /** Current difficulty mode */
  currentDifficulty: DifficultyMode;
  /** Last played timestamp */
  lastPlayedAt: Date;
}

/**
 * Result of a single problem attempt
 */
export interface ProblemResult {
  /** Whether the problem was solved correctly */
  correct: boolean;
  /** Number of attempts before success or giving up */
  attempts: number;
  /** Number of hints used */
  hintsUsed: number;
  /** Time taken to complete in milliseconds */
  timeMs: number;
}

/**
 * Summary of a game session
 */
export interface SessionSummary {
  /** Total duration of the session in milliseconds */
  duration: number;
  /** Number of problems completed */
  problemsCompleted: number;
  /** Accuracy percentage for this session (0-100) */
  accuracy: number;
  /** Number of levels gained during the session */
  levelsGained: number;
  /** Problems solved correctly */
  correctCount: number;
  /** Problems solved incorrectly */
  incorrectCount: number;
}

/**
 * Skill mastery tracking
 */
export interface SkillMastery {
  /** Skill identifier */
  skillId: string;
  /** Mastery level (0-100) */
  masteryLevel: number;
  /** Number of times practiced */
  practiceCount: number;
  /** Last practiced timestamp */
  lastPracticedAt: Date;
}

/**
 * Child's overall progress across all games
 */
export interface ChildProgress {
  /** Child's ID */
  childId: string;
  /** Progress for each game */
  games: GameProgress[];
  /** Skill mastery data */
  skills: SkillMastery[];
  /** Total time spent learning (in milliseconds) */
  totalLearningTime: number;
  /** Total problems completed across all games */
  totalProblemsCompleted: number;
  /** Streak days (consecutive days played) */
  streakDays: number;
}
