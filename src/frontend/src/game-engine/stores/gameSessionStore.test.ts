/**
 * Tests for Game Session Store (Zustand)
 */
import { act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { useGameSessionStore } from './gameSessionStore.js';

import type { Block } from '../types.js';

describe('gameSessionStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    act(() => {
      useGameSessionStore.getState().reset();
    });
  });

  describe('startSession', () => {
    it('creates a new session with correct initial state', () => {
      const { startSession } = useGameSessionStore.getState();

      act(() => {
        startSession('build-the-number', 'easy');
      });

      const newState = useGameSessionStore.getState();
      expect(newState.session).not.toBeNull();
      expect(newState.session?.gameId).toBe('build-the-number');
      expect(newState.session?.difficulty).toBe('easy');
      expect(newState.session?.status).toBe('playing');
      expect(newState.session?.problemsCompleted).toBe(0);
      expect(newState.session?.correctStreak).toBe(0);
      expect(newState.session?.startedAt).toBeGreaterThan(0);
    });

    it('clears the workspace when starting a new session', () => {
      const { addBlock, startSession } = useGameSessionStore.getState();

      // Add a block first
      act(() => {
        addBlock({ id: 'block-1', type: 'unit', value: 1 });
      });

      expect(useGameSessionStore.getState().workspace.length).toBe(1);

      // Start new session should clear workspace
      act(() => {
        startSession('build-the-number', 'easy');
      });

      expect(useGameSessionStore.getState().workspace.length).toBe(0);
    });
  });

  describe('addBlock', () => {
    it('adds a unit block to the workspace', () => {
      const { addBlock } = useGameSessionStore.getState();
      const block: Block = { id: 'unit-1', type: 'unit', value: 1 };

      act(() => {
        addBlock(block);
      });

      const { workspace } = useGameSessionStore.getState();
      expect(workspace).toHaveLength(1);
      expect(workspace[0]?.type).toBe('unit');
      expect(workspace[0]?.value).toBe(1);
    });

    it('adds a ten block to the workspace', () => {
      const { addBlock } = useGameSessionStore.getState();
      const block: Block = { id: 'ten-1', type: 'ten', value: 10 };

      act(() => {
        addBlock(block);
      });

      const { workspace } = useGameSessionStore.getState();
      expect(workspace).toHaveLength(1);
      expect(workspace[0]?.type).toBe('ten');
      expect(workspace[0]?.value).toBe(10);
    });

    it('adds a hundred block to the workspace', () => {
      const { addBlock } = useGameSessionStore.getState();
      const block: Block = { id: 'hundred-1', type: 'hundred', value: 100 };

      act(() => {
        addBlock(block);
      });

      const { workspace } = useGameSessionStore.getState();
      expect(workspace).toHaveLength(1);
      expect(workspace[0]?.type).toBe('hundred');
      expect(workspace[0]?.value).toBe(100);
    });

    it('updates workspace value correctly', () => {
      const { addBlock } = useGameSessionStore.getState();

      act(() => {
        addBlock({ id: 'unit-1', type: 'unit', value: 1 });
        addBlock({ id: 'unit-2', type: 'unit', value: 1 });
        addBlock({ id: 'unit-3', type: 'unit', value: 1 });
      });

      expect(useGameSessionStore.getState().workspaceValue).toBe(3);
    });
  });

  describe('removeBlock', () => {
    it('removes a block by ID', () => {
      const { addBlock, removeBlock } = useGameSessionStore.getState();

      act(() => {
        addBlock({ id: 'block-1', type: 'unit', value: 1 });
      });

      const blockId = useGameSessionStore.getState().workspace[0]?.id;
      expect(blockId).toBeDefined();

      act(() => {
        removeBlock(blockId!);
      });

      expect(useGameSessionStore.getState().workspace).toHaveLength(0);
    });

    it('only removes the specified block', () => {
      const { addBlock, removeBlock } = useGameSessionStore.getState();

      act(() => {
        addBlock({ id: 'unit-1', type: 'unit', value: 1 });
        addBlock({ id: 'ten-1', type: 'ten', value: 10 });
        addBlock({ id: 'unit-2', type: 'unit', value: 1 });
      });

      const { workspace } = useGameSessionStore.getState();
      const tenBlock = workspace.find((b) => b.type === 'ten');
      expect(tenBlock).toBeDefined();

      act(() => {
        removeBlock(tenBlock?.id!);
      });

      const newWorkspace = useGameSessionStore.getState().workspace;
      expect(newWorkspace).toHaveLength(2);
      expect(newWorkspace.every((b) => b.type === 'unit')).toBe(true);
    });

    it('does nothing when block ID does not exist', () => {
      const { addBlock, removeBlock } = useGameSessionStore.getState();

      act(() => {
        addBlock({ id: 'block-1', type: 'unit', value: 1 });
      });

      act(() => {
        removeBlock('non-existent-id');
      });

      expect(useGameSessionStore.getState().workspace).toHaveLength(1);
    });
  });

  describe('clearWorkspace', () => {
    it('removes all blocks from workspace', () => {
      const { addBlock, clearWorkspace } = useGameSessionStore.getState();

      act(() => {
        addBlock({ id: 'unit-1', type: 'unit', value: 1 });
        addBlock({ id: 'ten-1', type: 'ten', value: 10 });
        addBlock({ id: 'hundred-1', type: 'hundred', value: 100 });
      });

      expect(useGameSessionStore.getState().workspace).toHaveLength(3);

      act(() => {
        clearWorkspace();
      });

      expect(useGameSessionStore.getState().workspace).toHaveLength(0);
    });

    it('resets workspace value to 0', () => {
      const { addBlock, clearWorkspace } = useGameSessionStore.getState();

      act(() => {
        addBlock({ id: 'ten-1', type: 'ten', value: 10 });
        addBlock({ id: 'unit-1', type: 'unit', value: 1 });
      });

      expect(useGameSessionStore.getState().workspaceValue).toBe(11);

      act(() => {
        clearWorkspace();
      });

      expect(useGameSessionStore.getState().workspaceValue).toBe(0);
    });
  });

  describe('workspaceValue', () => {
    it('returns 0 for empty workspace', () => {
      expect(useGameSessionStore.getState().workspaceValue).toBe(0);
    });

    it('calculates sum of unit blocks', () => {
      const { addBlock } = useGameSessionStore.getState();

      act(() => {
        addBlock({ id: 'unit-1', type: 'unit', value: 1 });
        addBlock({ id: 'unit-2', type: 'unit', value: 1 });
        addBlock({ id: 'unit-3', type: 'unit', value: 1 });
      });

      expect(useGameSessionStore.getState().workspaceValue).toBe(3);
    });

    it('calculates sum of mixed blocks', () => {
      const { addBlock } = useGameSessionStore.getState();

      act(() => {
        addBlock({ id: 'hundred-1', type: 'hundred', value: 100 });
        addBlock({ id: 'ten-1', type: 'ten', value: 10 });
        addBlock({ id: 'ten-2', type: 'ten', value: 10 });
        addBlock({ id: 'unit-1', type: 'unit', value: 1 });
        addBlock({ id: 'unit-2', type: 'unit', value: 1 });
        addBlock({ id: 'unit-3', type: 'unit', value: 1 });
      });

      // 100 + 10 + 10 + 1 + 1 + 1 = 123
      expect(useGameSessionStore.getState().workspaceValue).toBe(123);
    });
  });

  describe('setProblem', () => {
    it('sets the current problem', () => {
      const { startSession, setProblem } = useGameSessionStore.getState();

      act(() => {
        startSession('build-the-number', 'easy');
      });

      const problem = {
        id: 'problem-1',
        gameId: 'build-the-number' as const,
        targetValue: 5,
        difficulty: 'easy' as const,
        createdAt: Date.now(),
      };

      act(() => {
        setProblem(problem);
      });

      const { session } = useGameSessionStore.getState();
      expect(session?.currentProblem?.id).toBe('problem-1');
      expect(session?.currentProblem?.targetValue).toBe(5);
    });

    it('clears workspace when setting a new problem', () => {
      const { startSession, setProblem, addBlock } = useGameSessionStore.getState();

      act(() => {
        startSession('build-the-number', 'easy');
        addBlock({ id: 'block-1', type: 'unit', value: 1 });
      });

      expect(useGameSessionStore.getState().workspace.length).toBe(1);

      const problem = {
        id: 'problem-1',
        gameId: 'build-the-number' as const,
        targetValue: 5,
        difficulty: 'easy' as const,
        createdAt: Date.now(),
      };

      act(() => {
        setProblem(problem);
      });

      expect(useGameSessionStore.getState().workspace.length).toBe(0);
    });
  });

  describe('completeProblem', () => {
    beforeEach(() => {
      const { startSession, setProblem } = useGameSessionStore.getState();
      act(() => {
        startSession('build-the-number', 'medium');
        setProblem({
          id: 'problem-1',
          gameId: 'build-the-number',
          targetValue: 5,
          difficulty: 'medium',
          createdAt: Date.now(),
        });
      });
    });

    it('increments problems completed', () => {
      const { completeProblem } = useGameSessionStore.getState();

      act(() => {
        completeProblem(true);
      });

      const { session } = useGameSessionStore.getState();
      expect(session?.problemsCompleted).toBe(1);
    });

    it('increments streak on correct answer', () => {
      const { completeProblem, setProblem } = useGameSessionStore.getState();

      act(() => {
        completeProblem(true);
      });

      expect(useGameSessionStore.getState().session?.correctStreak).toBe(1);

      // Set a new problem to continue the session
      act(() => {
        setProblem({
          id: 'problem-2',
          gameId: 'build-the-number',
          targetValue: 7,
          difficulty: 'medium',
          createdAt: Date.now(),
        });
      });

      act(() => {
        completeProblem(true);
      });

      expect(useGameSessionStore.getState().session?.correctStreak).toBe(2);
    });

    it('resets streak on incorrect answer', () => {
      const { completeProblem, setProblem } = useGameSessionStore.getState();

      // Build up a streak
      for (let i = 0; i < 3; i += 1) {
        act(() => {
          completeProblem(true);
          setProblem({
            id: `problem-${String(i + 2)}`,
            gameId: 'build-the-number',
            targetValue: 5 + i,
            difficulty: 'medium',
            createdAt: Date.now(),
          });
        });
      }

      expect(useGameSessionStore.getState().session?.correctStreak).toBe(3);

      act(() => {
        completeProblem(false);
      });

      expect(useGameSessionStore.getState().session?.correctStreak).toBe(0);
    });

    it('clears workspace after completion', () => {
      const { addBlock, completeProblem } = useGameSessionStore.getState();

      act(() => {
        addBlock({ id: 'block-1', type: 'unit', value: 1 });
        addBlock({ id: 'block-2', type: 'ten', value: 10 });
      });

      expect(useGameSessionStore.getState().workspace.length).toBe(2);

      act(() => {
        completeProblem(true);
      });

      expect(useGameSessionStore.getState().workspace.length).toBe(0);
    });

    it('clears current problem after completion', () => {
      const { completeProblem } = useGameSessionStore.getState();

      expect(useGameSessionStore.getState().session?.currentProblem).not.toBeNull();

      act(() => {
        completeProblem(true);
      });

      expect(useGameSessionStore.getState().session?.currentProblem).toBeNull();
    });
  });

  describe('endSession', () => {
    beforeEach(() => {
      act(() => {
        useGameSessionStore.getState().startSession('build-the-number', 'easy');
      });
    });

    it('sets session status to completed', () => {
      const { endSession } = useGameSessionStore.getState();

      act(() => {
        endSession();
      });

      expect(useGameSessionStore.getState().session?.status).toBe('completed');
    });
  });

  describe('submitAttempt', () => {
    beforeEach(() => {
      const { startSession, setProblem } = useGameSessionStore.getState();
      act(() => {
        startSession('build-the-number', 'easy');
        setProblem({
          id: 'problem-1',
          gameId: 'build-the-number',
          targetValue: 5,
          difficulty: 'easy',
          createdAt: Date.now(),
        });
      });
    });

    it('returns attempt with correct flag when value matches target', () => {
      const { addBlock, submitAttempt } = useGameSessionStore.getState();

      act(() => {
        // Add 5 unit blocks to match target of 5
        for (let i = 0; i < 5; i += 1) {
          addBlock({ id: `block-${String(i)}`, type: 'unit', value: 1 });
        }
      });

      let attempt: ReturnType<typeof submitAttempt> | undefined;
      act(() => {
        attempt = submitAttempt();
      });

      expect(attempt?.isCorrect).toBe(true);
      expect(attempt?.totalValue).toBe(5);
    });

    it('returns attempt with incorrect flag when value does not match', () => {
      const { addBlock, submitAttempt } = useGameSessionStore.getState();

      act(() => {
        // Add 3 unit blocks (target is 5)
        for (let i = 0; i < 3; i += 1) {
          addBlock({ id: `block-${String(i)}`, type: 'unit', value: 1 });
        }
      });

      let attempt: ReturnType<typeof submitAttempt> | undefined;
      act(() => {
        attempt = submitAttempt();
      });

      expect(attempt?.isCorrect).toBe(false);
      expect(attempt?.totalValue).toBe(3);
    });

    it('increments attempt count', () => {
      const { submitAttempt } = useGameSessionStore.getState();

      expect(useGameSessionStore.getState().currentAttempts).toBe(0);

      act(() => {
        submitAttempt();
      });

      expect(useGameSessionStore.getState().currentAttempts).toBe(1);

      act(() => {
        submitAttempt();
      });

      expect(useGameSessionStore.getState().currentAttempts).toBe(2);
    });
  });

  describe('useHint', () => {
    it('increments hints used count', () => {
      const { useHint } = useGameSessionStore.getState();

      expect(useGameSessionStore.getState().hintsUsed).toBe(0);

      act(() => {
        useHint();
      });

      expect(useGameSessionStore.getState().hintsUsed).toBe(1);

      act(() => {
        useHint();
      });

      expect(useGameSessionStore.getState().hintsUsed).toBe(2);
    });
  });

  describe('reset', () => {
    it('resets all state to initial values', () => {
      const { startSession, addBlock, reset } = useGameSessionStore.getState();

      act(() => {
        startSession('build-the-number', 'easy');
        addBlock({ id: 'block-1', type: 'unit', value: 1 });
      });

      expect(useGameSessionStore.getState().session).not.toBeNull();
      expect(useGameSessionStore.getState().workspace.length).toBe(1);

      act(() => {
        reset();
      });

      expect(useGameSessionStore.getState().session).toBeNull();
      expect(useGameSessionStore.getState().workspace.length).toBe(0);
      expect(useGameSessionStore.getState().workspaceValue).toBe(0);
    });
  });
});
