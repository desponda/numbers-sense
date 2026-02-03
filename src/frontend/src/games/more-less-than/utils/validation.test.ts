import { describe, it, expect } from 'vitest';

import { validateAnswer } from './validation';

import type { MoreLessThanProblem } from '../../../game-engine/types';

describe('validateAnswer', () => {
  describe('correct answers', () => {
    it('should validate correct answer for "more than" problem', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-1',
        gameId: 'more-less-than',
        difficulty: 'easy',
        createdAt: Date.now(),
        operation: 'more',
        delta: 3,
        startingNumber: 5,
        targetValue: 8,
      };

      const result = validateAnswer(problem, 8);

      expect(result.isCorrect).toBe(true);
      expect(result.correctAnswer).toBe(8);
      expect(result.userAnswer).toBe(8);
      expect(result.errorType).toBeUndefined();
      expect(result.hint).toBeUndefined();
      expect(result.showWorkingSolution).toBe(false);
    });

    it('should validate correct answer for "less than" problem', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-2',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'less',
        delta: 4,
        startingNumber: 7,
        targetValue: 3,
      };

      const result = validateAnswer(problem, 3);

      expect(result.isCorrect).toBe(true);
      expect(result.correctAnswer).toBe(3);
      expect(result.showWorkingSolution).toBe(false);
    });
  });

  describe('reversed_operation error', () => {
    it('should detect reversed operation for "more than" (subtracted instead of added)', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-3',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'more',
        delta: 3,
        startingNumber: 5,
        targetValue: 8,
      };

      // User did 5 - 3 = 2 instead of 5 + 3 = 8
      const result = validateAnswer(problem, 2);

      expect(result.isCorrect).toBe(false);
      expect(result.correctAnswer).toBe(8);
      expect(result.userAnswer).toBe(2);
      expect(result.errorType).toBe('reversed_operation');
      expect(result.hint).toBe('Remember: "more than" means add.');
      expect(result.showWorkingSolution).toBe(true);
    });

    it('should detect reversed operation for "less than" (added instead of subtracted)', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-4',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'less',
        delta: 4,
        startingNumber: 7,
        targetValue: 3,
      };

      // User did 7 + 4 = 11 instead of 7 - 4 = 3
      const result = validateAnswer(problem, 11);

      expect(result.isCorrect).toBe(false);
      expect(result.errorType).toBe('reversed_operation');
      expect(result.hint).toBe('Remember: "less than" means subtract.');
    });
  });

  describe('wrong_order error', () => {
    it('should detect wrong order for "less than" (delta - starting instead of starting - delta)', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-5',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'less',
        delta: 4,
        startingNumber: 7,
        targetValue: 3,
      };

      // User did 4 - 7 = -3 instead of 7 - 4 = 3
      const result = validateAnswer(problem, -3);

      expect(result.isCorrect).toBe(false);
      expect(result.errorType).toBe('wrong_order');
      expect(result.hint).toBe('Start with 7, then subtract 4.');
    });

    it('should detect wrong order with positive result', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-6',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'medium',
        operation: 'less',
        delta: 12,
        startingNumber: 8,
        targetValue: -4,
      };

      // User did 12 - 8 = 4 instead of 8 - 12 = -4
      const result = validateAnswer(problem, 4);

      expect(result.isCorrect).toBe(false);
      expect(result.errorType).toBe('wrong_order');
      expect(result.hint).toBe('Start with 8, then subtract 12.');
    });
  });

  describe('counting_error', () => {
    it('should detect counting error (off by +1)', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-7',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'more',
        delta: 3,
        startingNumber: 5,
        targetValue: 8,
      };

      // User answered 9 instead of 8 (counted one too many)
      const result = validateAnswer(problem, 9);

      expect(result.isCorrect).toBe(false);
      expect(result.errorType).toBe('counting_error');
      expect(result.hint).toBe("You're very close! Count carefully.");
    });

    it('should detect counting error (off by -1)', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-8',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'less',
        delta: 4,
        startingNumber: 7,
        targetValue: 3,
      };

      // User answered 2 instead of 3 (counted one too few)
      const result = validateAnswer(problem, 2);

      expect(result.isCorrect).toBe(false);
      expect(result.errorType).toBe('counting_error');
      expect(result.hint).toBe("You're very close! Count carefully.");
    });
  });

  describe('place_value_error', () => {
    it('should detect place value error when adding 10 (added to ones place)', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-9',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'medium',
        operation: 'more',
        delta: 10,
        startingNumber: 23,
        targetValue: 33,
      };

      // User did 23 + 1 = 24 instead of 23 + 10 = 33
      const result = validateAnswer(problem, 24);

      expect(result.isCorrect).toBe(false);
      expect(result.errorType).toBe('place_value_error');
      expect(result.hint).toBe('When adding 10, the tens place changes, not the ones place.');
    });

    it('should detect place value error when subtracting 10 (subtracted from ones place)', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-10',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'medium',
        operation: 'less',
        delta: 10,
        startingNumber: 37,
        targetValue: 27,
      };

      // User did 37 - 1 = 36 instead of 37 - 10 = 27
      const result = validateAnswer(problem, 36);

      expect(result.isCorrect).toBe(false);
      expect(result.errorType).toBe('place_value_error');
      expect(result.hint).toBe('When subtracting 10, the tens place changes, not the ones place.');
    });
  });

  describe('teen_number_confusion', () => {
    it('should detect teen number confusion for "more than" with 15', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-11',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'more',
        delta: 3,
        startingNumber: 15,
        targetValue: 18,
      };

      // User treated 15 as 5, did 5 + 3 = 8 instead of 15 + 3 = 18
      const result = validateAnswer(problem, 8);

      expect(result.isCorrect).toBe(false);
      expect(result.errorType).toBe('teen_number_confusion');
      expect(result.hint).toBe('Remember: 15 is 1 ten and 5 ones.');
    });

    it('should detect teen number confusion for "less than" with 17', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-12',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'less',
        delta: 4,
        startingNumber: 17,
        targetValue: 13,
      };

      // User treated 17 as 7, did 7 - 4 = 3 instead of 17 - 4 = 13
      const result = validateAnswer(problem, 3);

      expect(result.isCorrect).toBe(false);
      expect(result.errorType).toBe('teen_number_confusion');
      expect(result.hint).toBe('Remember: 17 is 1 ten and 7 ones.');
    });

    it('should not detect teen number confusion for non-teen numbers', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-13',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'more',
        delta: 3,
        startingNumber: 25,
        targetValue: 28,
      };

      // User answered 8 (wrong, but not teen confusion)
      const result = validateAnswer(problem, 8);

      expect(result.isCorrect).toBe(false);
      expect(result.errorType).not.toBe('teen_number_confusion');
    });
  });

  describe('unknown error', () => {
    it('should classify unrecognized error patterns as unknown', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-14',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'more',
        delta: 3,
        startingNumber: 5,
        targetValue: 8,
      };

      // User answered 42 (completely random wrong answer)
      const result = validateAnswer(problem, 42);

      expect(result.isCorrect).toBe(false);
      expect(result.errorType).toBe('unknown');
      expect(result.hint).toBe("Let's think about it together. Start with 5...");
      expect(result.showWorkingSolution).toBe(true);
    });
  });

  describe('error detection priority', () => {
    it('should prioritize reversed_operation over counting_error', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-15',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'more',
        delta: 4,
        startingNumber: 5,
        targetValue: 9,
      };

      // User answered 1 (5 - 4), which is also 2 away from correct answer
      // Should detect as reversed_operation, not counting_error
      const result = validateAnswer(problem, 1);

      expect(result.errorType).toBe('reversed_operation');
    });

    it('should prioritize teen_number_confusion over counting_error when applicable', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-16',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'more',
        delta: 2,
        startingNumber: 14,
        targetValue: 16,
      };

      // User answered 6 (treated 14 as 4, then 4 + 2 = 6)
      // This is also 10 away from correct answer, but should be teen confusion
      const result = validateAnswer(problem, 6);

      expect(result.errorType).toBe('teen_number_confusion');
    });
  });

  describe('edge cases', () => {
    it('should handle negative results correctly', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-17',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'hard',
        operation: 'less',
        delta: 10,
        startingNumber: 3,
        targetValue: -7,
      };

      const result = validateAnswer(problem, -7);

      expect(result.isCorrect).toBe(true);
    });

    it('should handle zero as starting number', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-18',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'easy',
        operation: 'more',
        delta: 5,
        startingNumber: 0,
        targetValue: 5,
      };

      const result = validateAnswer(problem, 5);

      expect(result.isCorrect).toBe(true);
    });

    it('should handle large numbers', () => {
      const problem: MoreLessThanProblem = {
        id: 'test-19',
        gameId: 'more-less-than',
        createdAt: Date.now(),
        difficulty: 'hard',
        operation: 'more',
        delta: 10,
        startingNumber: 87,
        targetValue: 97,
      };

      const result = validateAnswer(problem, 97);

      expect(result.isCorrect).toBe(true);
    });
  });
});
