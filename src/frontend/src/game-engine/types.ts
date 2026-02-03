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
export type GameId = 'build-the-number' | 'sort-the-numbers' | 'more-less-than';

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
    maxValue: 20,
    allowedBlocks: ['unit'],
  },
  medium: {
    mode: 'medium',
    minValue: 10,
    maxValue: 50,
    allowedBlocks: ['unit', 'ten'],
  },
  hard: {
    mode: 'hard',
    minValue: 30,
    maxValue: 100,
    allowedBlocks: ['unit', 'ten', 'hundred'],
  },
  challenge: {
    mode: 'challenge',
    minValue: 50,
    maxValue: 100,
    allowedBlocks: ['unit', 'ten', 'hundred'],
    timeLimit: 60,
  },
};

// Problem representation - Base interface
interface BaseProblem {
  id: string;
  difficulty: DifficultyMode;
  createdAt: number;
}

// Build the Number problem
export interface BuildTheNumberProblem extends BaseProblem {
  gameId: 'build-the-number';
  targetValue: number;
}

// Sort the Numbers problem
export interface SortTheNumbersProblem extends BaseProblem {
  gameId: 'sort-the-numbers';
  targetValue: number; // Number of items to sort
}

// More Than / Less Than problem
export interface MoreLessThanProblem extends BaseProblem {
  gameId: 'more-less-than';
  startingNumber: number;
  operation: 'more' | 'less';
  delta: number;
  targetValue: number; // Computed answer
}

// Discriminated union of all problem types
export type Problem = BuildTheNumberProblem | SortTheNumbersProblem | MoreLessThanProblem;

// Answer/attempt tracking
export interface Attempt {
  blocks: Block[];
  totalValue: number;
  timestamp: number;
  isCorrect: boolean;
  answerValue?: number; // For games using number input (e.g., more-less-than)
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
  // More-less-than specific state
  answerValue?: number | null;
  peeksRemaining?: number;
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
