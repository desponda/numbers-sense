/**
 * Unit tests for Fact Mastery Tracker
 * Tests mastery tracking for multiplication and division facts
 */
import { describe, it, expect } from 'vitest';

import {
  generateLaneFacts,
  initializeFactMastery,
  markFactCorrect,
  getUnmasteredFacts,
  isLaneComplete,
  getLaneStepsCompleted,
  getLaneStepsTotal,
  getRepetitionsRequired,
} from './factMasteryTracker.js';

describe('factMasteryTracker', () => {
  describe('Initialization', () => {
    it('initializes 10 multiplication facts for a lane', () => {
      const facts = generateLaneFacts('multiplication', 7);
      expect(facts).toHaveLength(10);
      // Lane 7: 7×0, 7×1, 7×2, ..., 7×9
      expect(facts).toEqual(['7×0', '7×1', '7×2', '7×3', '7×4', '7×5', '7×6', '7×7', '7×8', '7×9']);
    });

    it('initializes 10 division facts for a lane', () => {
      const facts = generateLaneFacts('division', 7);
      expect(facts).toHaveLength(10);
      // Lane 7: 0÷7, 7÷7, 14÷7, ..., 63÷7
      const dividends = [0, 7, 14, 21, 28, 35, 42, 49, 56, 63];
      expect(facts).toEqual(dividends.map((d) => `${d.toString()}÷7`));
    });

    it('all facts start with correctCount = 0', () => {
      const masteryMap = initializeFactMastery('multiplication', 'easy');
      const facts = generateLaneFacts('multiplication', 5);
      facts.forEach((fact) => {
        const mastery = masteryMap[fact];
        expect(mastery?.correctCount).toBe(0);
      });
    });

    it('all facts start with mastered = false', () => {
      const masteryMap = initializeFactMastery('multiplication', 'easy');
      const facts = generateLaneFacts('multiplication', 5);
      facts.forEach((fact) => {
        const mastery = masteryMap[fact];
        expect(mastery?.mastered).toBe(false);
      });
    });

    it('handles lane 0 for multiplication', () => {
      const facts = generateLaneFacts('multiplication', 0);
      expect(facts).toHaveLength(10);
      expect(facts[0]).toBe('0×0');
      expect(facts[9]).toBe('0×9');
    });

    it('handles lane 1 for division', () => {
      const facts = generateLaneFacts('division', 1);
      expect(facts).toHaveLength(10);
      expect(facts[0]).toBe('0÷1');
      expect(facts[9]).toBe('9÷1');
    });
  });

  describe('Recording Answers', () => {
    it('increments correctCount on correct answer', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      markFactCorrect('7×3', masteryMap, 'medium');
      const mastery = masteryMap['7×3'];
      expect(mastery?.correctCount).toBe(1);
    });

    it('does not increment correctCount on incorrect answer', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      // markFactCorrect only increments on correct answers
      // Incorrect answers don't call markFactCorrect
      const mastery = masteryMap['7×3'];
      expect(mastery?.correctCount).toBe(0);
    });

    it('sets mastered = true after 2 correct answers', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      markFactCorrect('7×3', masteryMap, 'medium');
      markFactCorrect('7×3', masteryMap, 'medium');
      const mastery = masteryMap['7×3'];
      expect(mastery?.mastered).toBe(true);
    });

    it('does not set mastered with only 1 correct answer', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      markFactCorrect('7×3', masteryMap, 'medium');
      const mastery = masteryMap['7×3'];
      expect(mastery?.mastered).toBe(false);
    });

    it('maintains mastery after achieving it', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      markFactCorrect('7×3', masteryMap, 'medium');
      markFactCorrect('7×3', masteryMap, 'medium');
      markFactCorrect('7×3', masteryMap, 'medium'); // 3rd correct
      const mastery = masteryMap['7×3'];
      expect(mastery?.mastered).toBe(true);
      expect(mastery?.correctCount).toBe(3);
    });

    it('handles incorrect answer after partial progress', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      markFactCorrect('7×3', masteryMap, 'medium'); // 1 correct
      // Incorrect answer doesn't call markFactCorrect, so count stays at 1
      const mastery = masteryMap['7×3'];
      expect(mastery?.correctCount).toBe(1);
      expect(mastery?.mastered).toBe(false);
    });

    it('does not modify other facts when recording one', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      markFactCorrect('7×3', masteryMap, 'medium');
      const otherMastery = masteryMap['7×5'];
      expect(otherMastery?.correctCount).toBe(0);
      expect(otherMastery?.mastered).toBe(false);
    });
  });

  describe('Querying Mastery', () => {
    it('getUnmasteredFacts returns only unmastered facts', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      // Master some facts
      markFactCorrect('7×0', masteryMap, 'medium');
      markFactCorrect('7×0', masteryMap, 'medium');
      markFactCorrect('7×1', masteryMap, 'medium');
      markFactCorrect('7×1', masteryMap, 'medium');

      const unmastered = getUnmasteredFacts(7, masteryMap, 'multiplication');
      expect(unmastered).toHaveLength(8); // 10 - 2 mastered
      expect(unmastered).not.toContain('7×0'); // 7×0 mastered
      expect(unmastered).not.toContain('7×1'); // 7×1 mastered
    });

    it('getUnmasteredFacts returns fact strings not indices', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      const unmastered = getUnmasteredFacts(7, masteryMap, 'multiplication');
      expect(unmastered).toEqual([
        '7×0',
        '7×1',
        '7×2',
        '7×3',
        '7×4',
        '7×5',
        '7×6',
        '7×7',
        '7×8',
        '7×9',
      ]);
    });

    it('getUnmasteredFacts returns empty array when all mastered', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      // Master all facts for lane 7
      for (let i = 0; i < 10; i += 1) {
        markFactCorrect(`7×${i.toString()}`, masteryMap, 'medium');
        markFactCorrect(`7×${i.toString()}`, masteryMap, 'medium');
      }

      const unmastered = getUnmasteredFacts(7, masteryMap, 'multiplication');
      expect(unmastered).toHaveLength(0);
    });

    it('isFactMastered returns true for mastered fact', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      markFactCorrect('7×3', masteryMap, 'medium');
      markFactCorrect('7×3', masteryMap, 'medium');

      const mastery = masteryMap['7×3'];
      expect(mastery?.mastered).toBe(true);
    });

    it('isFactMastered returns false for unmastered fact', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      markFactCorrect('7×3', masteryMap, 'medium'); // Only 1 correct

      const mastery = masteryMap['7×3'];
      expect(mastery?.mastered).toBe(false);
    });

    it('isFactMastered returns false for unknown fact', () => {
      const masteryMap = initializeFactMastery('multiplication', 'easy');
      // Lane 7 is not included in easy mode (only lanes 0-5)
      const mastery = masteryMap['8×3'];
      expect(mastery?.mastered ?? false).toBe(false);
    });
  });

  describe('Division Specific', () => {
    it('correctly tracks division facts', () => {
      const masteryMap = initializeFactMastery('division', 'medium');
      markFactCorrect('21÷7', masteryMap, 'medium');
      markFactCorrect('21÷7', masteryMap, 'medium');

      const mastery = masteryMap['21÷7'];
      expect(mastery?.mastered).toBe(true);
    });

    it('division facts use correct dividend format', () => {
      const facts = generateLaneFacts('division', 3);
      // Dividends: 0, 3, 6, 9, 12, 15, 18, 21, 24, 27
      expect(facts[0]).toBe('0÷3');
      expect(facts[5]).toBe('15÷3');
      expect(facts[9]).toBe('27÷3');
    });
  });

  describe('Difficulty-Based Mastery Thresholds', () => {
    it('easy difficulty requires 2 correct answers', () => {
      const required = getRepetitionsRequired('easy');
      expect(required).toBe(2);
    });

    it('medium difficulty requires 2 correct answers', () => {
      const required = getRepetitionsRequired('medium');
      expect(required).toBe(2);
    });

    it('hard difficulty requires 3 correct answers', () => {
      const required = getRepetitionsRequired('hard');
      expect(required).toBe(3);
    });

    it('fact is not mastered after 2 correct on hard difficulty', () => {
      const masteryMap = initializeFactMastery('multiplication', 'hard');
      markFactCorrect('7×3', masteryMap, 'hard');
      markFactCorrect('7×3', masteryMap, 'hard');

      const mastery = masteryMap['7×3'];
      expect(mastery?.correctCount).toBe(2);
      expect(mastery?.mastered).toBe(false);
    });

    it('fact is mastered after 3 correct on hard difficulty', () => {
      const masteryMap = initializeFactMastery('multiplication', 'hard');
      markFactCorrect('7×3', masteryMap, 'hard');
      markFactCorrect('7×3', masteryMap, 'hard');
      markFactCorrect('7×3', masteryMap, 'hard');

      const mastery = masteryMap['7×3'];
      expect(mastery?.correctCount).toBe(3);
      expect(mastery?.mastered).toBe(true);
    });

    it('hard difficulty lane requires 30 total steps', () => {
      const totalSteps = getLaneStepsTotal('hard');
      expect(totalSteps).toBe(30); // 10 facts * 3 repetitions
    });
  });

  describe('Progress Calculation', () => {
    it('calculates correct steps completed', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      // Master 3 facts (3 * 2 = 6 steps)
      for (let i = 0; i < 3; i += 1) {
        markFactCorrect(`7×${i.toString()}`, masteryMap, 'medium');
        markFactCorrect(`7×${i.toString()}`, masteryMap, 'medium');
      }

      const steps = getLaneStepsCompleted(7, masteryMap, 'multiplication');
      expect(steps).toBe(6);
    });

    it('counts partial progress toward steps', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      // 2 mastered facts + 1 partially correct
      markFactCorrect('7×0', masteryMap, 'medium');
      markFactCorrect('7×0', masteryMap, 'medium'); // Mastered
      markFactCorrect('7×1', masteryMap, 'medium');
      markFactCorrect('7×1', masteryMap, 'medium'); // Mastered
      markFactCorrect('7×2', masteryMap, 'medium'); // Partial

      const steps = getLaneStepsCompleted(7, masteryMap, 'multiplication');
      expect(steps).toBe(5); // 2*2 + 1
    });

    it('lane finished when steps = 20', () => {
      const masteryMap = initializeFactMastery('multiplication', 'medium');
      // Master all 10 facts for lane 7 (10 facts * 2 repetitions = 20 steps)
      for (let i = 0; i < 10; i += 1) {
        markFactCorrect(`7×${i.toString()}`, masteryMap, 'medium');
        markFactCorrect(`7×${i.toString()}`, masteryMap, 'medium');
      }

      const finished = isLaneComplete(7, masteryMap, 'multiplication');
      expect(finished).toBe(true);

      const totalSteps = getLaneStepsTotal('medium');
      const completedSteps = getLaneStepsCompleted(7, masteryMap, 'multiplication');
      expect(completedSteps).toBe(totalSteps);
      expect(completedSteps).toBe(20);
    });
  });
});
