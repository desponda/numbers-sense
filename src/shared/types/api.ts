/**
 * API request and response types for NumberSense K-3
 */

import type { Parent, Child, GradeLevel } from './user.js';
import type { GameProgress, SessionSummary, ProblemResult, ChildProgress } from './progress.js';
import type { GameId, DifficultyMode } from './game.js';

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean;
  /** Response data (present when success is true) */
  data?: T;
  /** Error message (present when success is false) */
  error?: string;
  /** Error code for programmatic handling */
  errorCode?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Array of items */
  items: T[];
  /** Total number of items available */
  total: number;
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Whether there are more pages */
  hasMore: boolean;
}

// ============================================================
// Authentication
// ============================================================

/**
 * Authentication response after successful login
 */
export interface AuthResponse {
  /** JWT token for subsequent requests */
  token: string;
  /** Authenticated parent account */
  parent: Parent;
  /** Children associated with the parent */
  children: Child[];
}

/**
 * Login request payload
 */
export interface LoginRequest {
  /** Parent's email address */
  email: string;
  /** Parent's password */
  password: string;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  /** Parent's email address */
  email: string;
  /** Parent's password */
  password: string;
}

// ============================================================
// Child Management
// ============================================================

/**
 * Create child request payload
 */
export interface CreateChildRequest {
  /** Child's display name */
  name: string;
  /** Child's grade level */
  grade: GradeLevel;
  /** Selected avatar identifier */
  avatar: string;
}

/**
 * Update child request payload
 */
export interface UpdateChildRequest {
  /** Updated display name */
  name?: string;
  /** Updated grade level */
  grade?: GradeLevel;
  /** Updated avatar identifier */
  avatar?: string;
}

// ============================================================
// Game Sessions
// ============================================================

/**
 * Start game session request
 */
export interface StartSessionRequest {
  /** Game to play */
  gameId: GameId;
  /** Child playing the game */
  childId: string;
  /** Requested difficulty (optional - will use adaptive if not specified) */
  difficulty?: DifficultyMode;
}

/**
 * Start game session response
 */
export interface StartSessionResponse {
  /** Unique session identifier */
  sessionId: string;
  /** Game configuration for this session */
  gameId: GameId;
  /** Selected difficulty mode */
  difficulty: DifficultyMode;
}

/**
 * Submit problem result request
 */
export interface SubmitResultRequest {
  /** Session identifier */
  sessionId: string;
  /** Result of the problem attempt */
  result: ProblemResult;
}

/**
 * End game session request
 */
export interface EndSessionRequest {
  /** Session identifier */
  sessionId: string;
}

/**
 * End game session response
 */
export interface EndSessionResponse {
  /** Summary of the completed session */
  summary: SessionSummary;
  /** Updated game progress */
  updatedProgress: GameProgress;
}

// ============================================================
// Progress
// ============================================================

/**
 * Get progress request (query params)
 */
export interface GetProgressRequest {
  /** Child ID to get progress for */
  childId: string;
  /** Optional: specific game to get progress for */
  gameId?: GameId;
}

/**
 * Get progress response
 */
export interface GetProgressResponse {
  /** Child's overall progress */
  progress: ChildProgress;
}
