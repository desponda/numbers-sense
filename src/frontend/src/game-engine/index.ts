/**
 * Game Engine
 *
 * Core game engine for NumberSense app.
 * Provides state management, problem generation, and game logic.
 */

// Types
export type {
  Attempt,
  Block,
  BlockType,
  DifficultyConfig,
  DifficultyMode,
  Feedback,
  FeedbackType,
  GameId,
  GameSession,
  PlayerProgress,
  Problem,
  ProblemResult,
  SessionStatus,
  UIState,
} from './types';

export { DIFFICULTY_CONFIGS } from './types';

// Stores
export { useGameSessionStore } from './stores/gameSessionStore';

// Problem generation
export {
  generateProblem,
  generateProblemBatch,
  generateSortTheNumbersValues,
} from './problemGenerator';
