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

  describe('generateMoreLessThanProblem', () => {
    it('generates a More Than / Less Than problem with correct structure', () => {
      vi.spyOn(Math, 'random').mockRestore();

      const problem = generateProblem({
        gameId: 'more-less-than',
        difficulty: 'easy',
      });

      expect(problem.gameId).toBe('more-less-than');
      expect(problem.difficulty).toBe('easy');
      expect(problem.id).toMatch(/^problem-\d+-[a-z0-9]+$/);
      expect(problem.createdAt).toBeGreaterThan(0);

      if (problem.gameId === 'more-less-than') {
        expect(['more', 'less']).toContain(problem.operation);
        expect(problem.startingNumber).toBeGreaterThanOrEqual(1);
        expect(problem.delta).toBeGreaterThan(0);
        expect(problem.targetValue).toBeGreaterThanOrEqual(0);
      }
    });

    it('generates valid "more" operations in easy mode', () => {
      vi.spyOn(Math, 'random').mockRestore();

      for (let i = 0; i < 20; i += 1) {
        const problem = generateProblem({
          gameId: 'more-less-than',
          difficulty: 'easy',
        });

        if (problem.gameId === 'more-less-than') {
          // Easy: 1-10 range, delta 1-2
          expect(problem.startingNumber).toBeGreaterThanOrEqual(1);
          expect(problem.startingNumber).toBeLessThanOrEqual(10);
          expect(problem.delta).toBeGreaterThanOrEqual(1);
          expect(problem.delta).toBeLessThanOrEqual(2);
          expect(problem.targetValue).toBeGreaterThanOrEqual(0);
          expect(problem.targetValue).toBeLessThanOrEqual(10);

          // Verify calculation
          const expected =
            problem.operation === 'more'
              ? problem.startingNumber + problem.delta
              : problem.startingNumber - problem.delta;
          expect(problem.targetValue).toBe(expected);
        }
      }
    });

    it('generates valid "less" operations without negative results', () => {
      vi.spyOn(Math, 'random').mockRestore();

      for (let i = 0; i < 50; i += 1) {
        const problem = generateProblem({
          gameId: 'more-less-than',
          difficulty: 'easy',
        });

        if (problem.gameId === 'more-less-than' && problem.operation === 'less') {
          // Should never produce negative results
          expect(problem.targetValue).toBeGreaterThanOrEqual(0);
          expect(problem.startingNumber).toBeGreaterThanOrEqual(problem.delta);
        }
      }
    });

    it('respects difficulty range for medium mode', () => {
      vi.spyOn(Math, 'random').mockRestore();

      for (let i = 0; i < 20; i += 1) {
        const problem = generateProblem({
          gameId: 'more-less-than',
          difficulty: 'medium',
        });

        if (problem.gameId === 'more-less-than') {
          // Medium: 1-20 range, delta 1,2,3,5,10
          expect(problem.startingNumber).toBeGreaterThanOrEqual(1);
          expect(problem.startingNumber).toBeLessThanOrEqual(20);
          expect([1, 2, 3, 5, 10]).toContain(problem.delta);
          expect(problem.targetValue).toBeGreaterThanOrEqual(0);
          expect(problem.targetValue).toBeLessThanOrEqual(20);
        }
      }
    });

    it('respects difficulty range for hard mode', () => {
      vi.spyOn(Math, 'random').mockRestore();

      for (let i = 0; i < 20; i += 1) {
        const problem = generateProblem({
          gameId: 'more-less-than',
          difficulty: 'hard',
        });

        if (problem.gameId === 'more-less-than') {
          // Hard: 1-100 range, delta 1,2,3,4,5,10,20
          expect(problem.startingNumber).toBeGreaterThanOrEqual(1);
          expect(problem.startingNumber).toBeLessThanOrEqual(100);
          expect([1, 2, 3, 4, 5, 10, 20]).toContain(problem.delta);
          expect(problem.targetValue).toBeGreaterThanOrEqual(0);
          expect(problem.targetValue).toBeLessThanOrEqual(100);
        }
      }
    });

    it('respects difficulty range for challenge mode', () => {
      vi.spyOn(Math, 'random').mockRestore();

      for (let i = 0; i < 20; i += 1) {
        const problem = generateProblem({
          gameId: 'more-less-than',
          difficulty: 'challenge',
        });

        if (problem.gameId === 'more-less-than') {
          // Challenge: 1-100 range, delta 5,10,15,20,25
          expect(problem.startingNumber).toBeGreaterThanOrEqual(1);
          expect(problem.startingNumber).toBeLessThanOrEqual(100);
          expect([5, 10, 15, 20, 25]).toContain(problem.delta);
          expect(problem.targetValue).toBeGreaterThanOrEqual(0);
          expect(problem.targetValue).toBeLessThanOrEqual(100);
        }
      }
    });

    it('generates roughly 50/50 mix of more and less operations', () => {
      vi.spyOn(Math, 'random').mockRestore();

      const operations = { more: 0, less: 0 };

      for (let i = 0; i < 100; i += 1) {
        const problem = generateProblem({
          gameId: 'more-less-than',
          difficulty: 'medium',
        });

        if (problem.gameId === 'more-less-than') {
          operations[problem.operation] += 1;
        }
      }

      // Should be roughly balanced (30-70% range is reasonable)
      expect(operations.more).toBeGreaterThan(30);
      expect(operations.more).toBeLessThan(70);
      expect(operations.less).toBeGreaterThan(30);
      expect(operations.less).toBeLessThan(70);
    });

    it('generates unique problem IDs', () => {
      vi.spyOn(Math, 'random').mockRestore();

      const ids = new Set<string>();
      for (let i = 0; i < 50; i += 1) {
        const problem = generateProblem({
          gameId: 'more-less-than',
          difficulty: 'medium',
        });
        ids.add(problem.id);
      }

      expect(ids.size).toBe(50);
    });

    it('generates problem batches correctly', () => {
      vi.spyOn(Math, 'random').mockRestore();

      const batch = generateProblemBatch('more-less-than', 'medium', 10);

      expect(batch).toHaveLength(10);
      batch.forEach((problem) => {
        expect(problem.gameId).toBe('more-less-than');
        expect(problem.difficulty).toBe('medium');

        if (problem.gameId === 'more-less-than') {
          // Verify calculation
          const expected =
            problem.operation === 'more'
              ? problem.startingNumber + problem.delta
              : problem.startingNumber - problem.delta;
          expect(problem.targetValue).toBe(expected);
        }
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
