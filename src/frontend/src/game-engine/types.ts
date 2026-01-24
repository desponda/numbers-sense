/**
 * Game Engine Types
 *
 * Core type definitions for the NumberSense game engine.
 * All types follow strict TypeScript conventions for type safety.
 */

// Block types for base-10 manipulatives
export type BlockType = 'unit' | 'ten' | 'hundred';

export interface Block {
  id: string;
  type: BlockType;
  value: 1 | 10 | 100;
}

// Game identifiers
export type GameId = 'build-the-number' | 'sort-the-numbers';

// Difficulty modes with number ranges
export type DifficultyMode = 'easy' | 'medium' | 'hard' | 'challenge';

export interface DifficultyConfig {
  mode: DifficultyMode;
  minValue: number;
  maxValue: number;
  allowedBlocks: BlockType[];
  timeLimit?: number; // Optional time limit in seconds
}

export const DIFFICULTY_CONFIGS: Record<DifficultyMode, DifficultyConfig> = {
  easy: {
    mode: 'easy',
    minValue: 1,
    maxValue: 10,
    allowedBlocks: ['unit'],
  },
  medium: {
    mode: 'medium',
    minValue: 1,
    maxValue: 20,
    allowedBlocks: ['unit', 'ten'],
  },
  hard: {
    mode: 'hard',
    minValue: 1,
    maxValue: 100,
    allowedBlocks: ['unit', 'ten', 'hundred'],
  },
  challenge: {
    mode: 'challenge',
    minValue: 1,
    maxValue: 100,
    allowedBlocks: ['unit', 'ten', 'hundred'],
    timeLimit: 60,
  },
};

// Problem representation
export interface Problem {
  id: string;
  gameId: GameId;
  targetValue: number;
  difficulty: DifficultyMode;
  createdAt: number;
}

// Answer/attempt tracking
export interface Attempt {
  blocks: Block[];
  totalValue: number;
  timestamp: number;
  isCorrect: boolean;
}

// Session tracking
export type SessionStatus = 'idle' | 'playing' | 'paused' | 'completed';

export interface GameSession {
  id: string;
  gameId: GameId;
  difficulty: DifficultyMode;
  status: SessionStatus;
  startedAt: number;
  currentProblem: Problem | null;
  problemsCompleted: number;
  problemsAttempted: number;
  correctStreak: number;
  longestStreak: number;
}

// Result tracking
export interface ProblemResult {
  problemId: string;
  attempts: number;
  timeSpent: number; // milliseconds
  isCorrect: boolean;
  hintsUsed: number;
  finalAnswer: Attempt | null;
}

// Feedback types
export type FeedbackType = 'correct' | 'incorrect' | 'hint' | 'encouragement';

export interface Feedback {
  type: FeedbackType;
  message: string;
  timestamp: number;
}

// UI State
export interface UIState {
  isLoading: boolean;
  showHint: boolean;
  showCelebration: boolean;
  feedbackQueue: Feedback[];
}

// Player progress
export interface PlayerProgress {
  totalProblemsCompleted: number;
  totalCorrect: number;
  currentStreak: number;
  longestStreak: number;
  skillLevels: Record<string, number>;
  unlockedDifficulties: DifficultyMode[];
  lastPlayedAt: number | null;
}
