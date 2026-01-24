/**
 * NumberSense K-3 Shared Types
 *
 * This is the single source of truth for all TypeScript types
 * used across frontend and backend.
 */

// User types
export type { GradeLevel, Parent, Child, UserSession } from './user.js';

// Game types
export type {
  GameId,
  DifficultyMode,
  GameConfig,
  BlockType,
  Block,
  BuildProblem,
  SortPhase,
  SortProblem,
  GameState,
} from './game.js';

// Progress types
export type {
  GameProgress,
  ProblemResult,
  SessionSummary,
  SkillMastery,
  ChildProgress,
} from './progress.js';

// API types
export type {
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  CreateChildRequest,
  UpdateChildRequest,
  StartSessionRequest,
  StartSessionResponse,
  SubmitResultRequest,
  EndSessionRequest,
  EndSessionResponse,
  GetProgressRequest,
  GetProgressResponse,
} from './api.js';
