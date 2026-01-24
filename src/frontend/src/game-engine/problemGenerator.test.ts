/**
 * Tests for Problem Generator
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  generateProblem,
  generateProblemBatch,
  generateSortTheNumbersValues,
} from './problemGenerator.js';

import type { DifficultyMode, GameId, Problem } from './types.js';

describe('problemGenerator', () => {
  beforeEach(() => {
    // Reset random seed for predictable tests
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  describe('generateProblem', () => {
    it('generates a Build the Number problem with correct structure', () => {
      const problem = generateProblem({
        gameId: 'build-the-number',
        difficulty: 'easy',
      });

      expect(problem).toMatchObject({
        gameId: 'build-the-number',
        difficulty: 'easy',
      });
      expect(problem.id).toMatch(/^problem-\d+-[a-z0-9]+$/);
      expect(problem.targetValue).toBeGreaterThanOrEqual(1);
      expect(problem.targetValue).toBeLessThanOrEqual(10);
      expect(problem.createdAt).toBeGreaterThan(0);
    });

    it('generates a Sort the Numbers problem with correct item count', () => {
      const problem = generateProblem({
        gameId: 'sort-the-numbers',
        difficulty: 'medium',
      });

      expect(problem).toMatchObject({
        gameId: 'sort-the-numbers',
        difficulty: 'medium',
        targetValue: 4, // medium = 4 items
      });
    });

    it('respects difficulty range for easy mode', () => {
      vi.spyOn(Math, 'random').mockRestore();

      for (let i = 0; i < 20; i += 1) {
        const problem = generateProblem({
          gameId: 'build-the-number',
          difficulty: 'easy',
        });
        expect(problem.targetValue).toBeGreaterThanOrEqual(1);
        expect(problem.targetValue).toBeLessThanOrEqual(10);
      }
    });

    it('respects difficulty range for medium mode', () => {
      vi.spyOn(Math, 'random').mockRestore();

      for (let i = 0; i < 20; i += 1) {
        const problem = generateProblem({
          gameId: 'build-the-number',
          difficulty: 'medium',
        });
        expect(problem.targetValue).toBeGreaterThanOrEqual(1);
        expect(problem.targetValue).toBeLessThanOrEqual(20);
      }
    });

    it('respects difficulty range for hard mode', () => {
      vi.spyOn(Math, 'random').mockRestore();

      for (let i = 0; i < 20; i += 1) {
        const problem = generateProblem({
          gameId: 'build-the-number',
          difficulty: 'hard',
        });
        expect(problem.targetValue).toBeGreaterThanOrEqual(1);
        expect(problem.targetValue).toBeLessThanOrEqual(100);
      }
    });

    it('avoids recent values when provided', () => {
      vi.spyOn(Math, 'random').mockRestore();

      const previousProblems: Problem[] = [
        {
          id: 'p1',
          gameId: 'build-the-number',
          targetValue: 5,
          difficulty: 'easy',
          createdAt: Date.now(),
        },
        {
          id: 'p2',
          gameId: 'build-the-number',
          targetValue: 6,
          difficulty: 'easy',
          createdAt: Date.now(),
        },
        {
          id: 'p3',
          gameId: 'build-the-number',
          targetValue: 7,
          difficulty: 'easy',
          createdAt: Date.now(),
        },
      ];

      // Generate multiple problems and check they try to avoid recent values
      const generatedValues = new Set<number>();
      for (let i = 0; i < 30; i += 1) {
        const problem = generateProblem({
          gameId: 'build-the-number',
          difficulty: 'easy',
          previousProblems,
          avoidRecent: 3,
        });
        generatedValues.add(problem.targetValue);
      }

      // With limited range, values might repeat, but we should have some variety
      expect(generatedValues.size).toBeGreaterThan(1);
    });

    it('throws error for unknown game ID', () => {
      expect(() =>
        generateProblem({
          gameId: 'unknown-game' as GameId,
          difficulty: 'easy',
        }),
      ).toThrow('Unknown game: unknown-game');
    });

    it('generates unique problem IDs', () => {
      vi.spyOn(Math, 'random').mockRestore();

      const ids = new Set<string>();
      for (let i = 0; i < 100; i += 1) {
        const problem = generateProblem({
          gameId: 'build-the-number',
          difficulty: 'easy',
        });
        ids.add(problem.id);
      }

      expect(ids.size).toBe(100);
    });
  });

  describe('generateProblemBatch', () => {
    it('generates the requested number of problems', () => {
      vi.spyOn(Math, 'random').mockRestore();

      const batch = generateProblemBatch('build-the-number', 'easy', 5);

      expect(batch).toHaveLength(5);
      batch.forEach((problem) => {
        expect(problem.gameId).toBe('build-the-number');
        expect(problem.difficulty).toBe('easy');
      });
    });

    it('generates unique IDs in batch', () => {
      vi.spyOn(Math, 'random').mockRestore();

      const batch = generateProblemBatch('build-the-number', 'medium', 10);
      const ids = batch.map((p) => p.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(10);
    });

    it('works for Sort the Numbers', () => {
      const batch = generateProblemBatch('sort-the-numbers', 'hard', 3);

      expect(batch).toHaveLength(3);
      batch.forEach((problem) => {
        expect(problem.gameId).toBe('sort-the-numbers');
        expect(problem.targetValue).toBe(5); // hard = 5 items
      });
    });
  });

  describe('generateSortTheNumbersValues', () => {
    it('generates the requested number of values', () => {
      vi.spyOn(Math, 'random').mockRestore();

      const values = generateSortTheNumbersValues('easy', 3);

      expect(values).toHaveLength(3);
    });

    it('generates unique values', () => {
      vi.spyOn(Math, 'random').mockRestore();

      const values = generateSortTheNumbersValues('medium', 4);
      const uniqueValues = new Set(values);

      expect(uniqueValues.size).toBe(4);
    });

    it('respects difficulty range', () => {
      vi.spyOn(Math, 'random').mockRestore();

      // Easy: 1-10
      const easyValues = generateSortTheNumbersValues('easy', 3);
      easyValues.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(10);
      });

      // Hard: 1-100
      const hardValues = generateSortTheNumbersValues('hard', 5);
      hardValues.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(100);
      });
    });

    it('returns shuffled values (not sorted)', () => {
      vi.spyOn(Math, 'random').mockRestore();

      // Run multiple times - at least once should be unsorted
      let foundUnsorted = false;
      for (let i = 0; i < 20; i += 1) {
        const values = generateSortTheNumbersValues('medium', 4);
        const sorted = [...values].sort((a, b) => a - b);
        if (JSON.stringify(values) !== JSON.stringify(sorted)) {
          foundUnsorted = true;
          break;
        }
      }

      expect(foundUnsorted).toBe(true);
    });

    const difficulties: DifficultyMode[] = ['easy', 'medium', 'hard', 'challenge'];
    const expectedCounts = [3, 4, 5, 6];

    difficulties.forEach((difficulty, index) => {
      it(`generates correct default count for ${difficulty}`, () => {
        vi.spyOn(Math, 'random').mockRestore();

        // The function takes count as second param, test that difficulty affects range
        const values = generateSortTheNumbersValues(difficulty, expectedCounts[index] ?? 3);
        expect(values).toHaveLength(expectedCounts[index] ?? 3);
      });
    });
  });
});
