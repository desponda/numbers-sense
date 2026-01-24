/**
 * Game Session Store
 *
 * Zustand store for managing the current game session state.
 * Handles session lifecycle, problem progression, and attempt tracking.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type {
  Attempt,
  Block,
  DifficultyMode,
  GameId,
  GameSession,
  Problem,
  ProblemResult,
  SessionStatus,
} from '../types';

interface GameSessionState {
  // Current session
  session: GameSession | null;

  // Current workspace (blocks placed by player)
  workspace: Block[];
  workspaceValue: number;

  // Problem history for current session
  problemResults: ProblemResult[];

  // Current attempt tracking
  currentAttempts: number;
  hintsUsed: number;
  problemStartTime: number | null;

  // Actions
  startSession: (gameId: GameId, difficulty: DifficultyMode) => void;
  endSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;

  // Problem actions
  setProblem: (problem: Problem) => void;
  completeProblem: (isCorrect: boolean) => void;

  // Workspace actions
  addBlock: (block: Block) => void;
  removeBlock: (blockId: string) => void;
  clearWorkspace: () => void;

  // Attempt actions
  submitAttempt: () => Attempt;
  useHint: () => void;

  // Utility
  reset: () => void;
}

const generateSessionId = (): string => {
  return `session-${String(Date.now())}-${Math.random().toString(36).substring(2, 9)}`;
};

const calculateBlockValue = (blocks: Block[]): number => {
  return blocks.reduce((sum, block) => sum + block.value, 0);
};

const initialState = {
  session: null,
  workspace: [],
  workspaceValue: 0,
  problemResults: [],
  currentAttempts: 0,
  hintsUsed: 0,
  problemStartTime: null,
};

export const useGameSessionStore = create<GameSessionState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      startSession: (gameId: GameId, difficulty: DifficultyMode): void => {
        const newSession: GameSession = {
          id: generateSessionId(),
          gameId,
          difficulty,
          status: 'playing',
          startedAt: Date.now(),
          currentProblem: null,
          problemsCompleted: 0,
          problemsAttempted: 0,
          correctStreak: 0,
          longestStreak: 0,
        };

        set({
          session: newSession,
          workspace: [],
          workspaceValue: 0,
          problemResults: [],
          currentAttempts: 0,
          hintsUsed: 0,
          problemStartTime: null,
        });
      },

      endSession: (): void => {
        set((state) => ({
          session: state.session
            ? { ...state.session, status: 'completed' as SessionStatus }
            : null,
        }));
      },

      pauseSession: (): void => {
        set((state) => ({
          session: state.session ? { ...state.session, status: 'paused' as SessionStatus } : null,
        }));
      },

      resumeSession: (): void => {
        set((state) => ({
          session: state.session ? { ...state.session, status: 'playing' as SessionStatus } : null,
        }));
      },

      setProblem: (problem: Problem): void => {
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                currentProblem: problem,
                problemsAttempted: state.session.problemsAttempted + 1,
              }
            : null,
          workspace: [],
          workspaceValue: 0,
          currentAttempts: 0,
          hintsUsed: 0,
          problemStartTime: Date.now(),
        }));
      },

      completeProblem: (isCorrect: boolean): void => {
        const state = get();
        const { session, currentAttempts, hintsUsed, problemStartTime, workspace } = state;

        if (!session?.currentProblem) {
          return;
        }

        const timeSpent = problemStartTime !== null ? Date.now() - problemStartTime : 0;

        const result: ProblemResult = {
          problemId: session.currentProblem.id,
          attempts: currentAttempts,
          timeSpent,
          isCorrect,
          hintsUsed,
          finalAnswer: {
            blocks: [...workspace],
            totalValue: calculateBlockValue(workspace),
            timestamp: Date.now(),
            isCorrect,
          },
        };

        const newStreak = isCorrect ? session.correctStreak + 1 : 0;
        const newLongestStreak = Math.max(session.longestStreak, newStreak);

        set({
          session: {
            ...session,
            problemsCompleted: session.problemsCompleted + 1,
            correctStreak: newStreak,
            longestStreak: newLongestStreak,
            currentProblem: null,
          },
          problemResults: [...state.problemResults, result],
          workspace: [],
          workspaceValue: 0,
          currentAttempts: 0,
          hintsUsed: 0,
          problemStartTime: null,
        });
      },

      addBlock: (block: Block): void => {
        set((state) => {
          const newWorkspace = [...state.workspace, block];
          return {
            workspace: newWorkspace,
            workspaceValue: calculateBlockValue(newWorkspace),
          };
        });
      },

      removeBlock: (blockId: string): void => {
        set((state) => {
          const newWorkspace = state.workspace.filter((b) => b.id !== blockId);
          return {
            workspace: newWorkspace,
            workspaceValue: calculateBlockValue(newWorkspace),
          };
        });
      },

      clearWorkspace: (): void => {
        set({ workspace: [], workspaceValue: 0 });
      },

      submitAttempt: (): Attempt => {
        const state = get();
        const attempt: Attempt = {
          blocks: [...state.workspace],
          totalValue: state.workspaceValue,
          timestamp: Date.now(),
          isCorrect:
            state.session?.currentProblem !== null &&
            state.session?.currentProblem !== undefined &&
            state.workspaceValue === state.session.currentProblem.targetValue,
        };

        set({ currentAttempts: state.currentAttempts + 1 });

        return attempt;
      },

      useHint: (): void => {
        set((state) => ({ hintsUsed: state.hintsUsed + 1 }));
      },

      reset: (): void => {
        set(initialState);
      },
    }),
    { name: 'game-session-store' },
  ),
);
