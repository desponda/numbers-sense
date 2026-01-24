/**
 * Distractor Generator Tests
 */

import { describe, it, expect } from 'vitest';

import {
  generateMultiplicationDistractors,
  generateDivisionDistractors,
} from './distractorGenerator';

describe('generateMultiplicationDistractors', () => {
  it('generates exactly 3 distractors', () => {
    const distractors = generateMultiplicationDistractors(7, 8, 56);
    expect(distractors).toHaveLength(3);
  });

  it('does not include correct answer', () => {
    const distractors = generateMultiplicationDistractors(7, 8, 56);
    expect(distractors).not.toContain(56);
  });

  it('generates unique distractors', () => {
    const distractors = generateMultiplicationDistractors(7, 8, 56);
    const uniqueDistractors = new Set(distractors);
    expect(uniqueDistractors.size).toBe(3);
  });

  it('all distractors are non-negative', () => {
    const distractors = generateMultiplicationDistractors(7, 8, 56);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
    });
  });

  it('all distractors are within 0-100 range', () => {
    const distractors = generateMultiplicationDistractors(9, 9, 81);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(100);
    });
  });

  it('handles 0×N correctly', () => {
    const distractors = generateMultiplicationDistractors(0, 5, 0);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(0);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
    });
  });

  it('handles N×0 correctly', () => {
    const distractors = generateMultiplicationDistractors(7, 0, 0);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(0);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
    });
  });

  it('handles 1×N correctly', () => {
    const distractors = generateMultiplicationDistractors(1, 7, 7);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(7);
  });

  it('generates valid distractors for edge case 9×9', () => {
    const distractors = generateMultiplicationDistractors(9, 9, 81);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(81);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(100);
    });
  });
});

describe('generateDivisionDistractors', () => {
  it('generates exactly 3 distractors', () => {
    const distractors = generateDivisionDistractors(21, 7, 3);
    expect(distractors).toHaveLength(3);
  });

  it('does not include correct answer', () => {
    const distractors = generateDivisionDistractors(21, 7, 3);
    expect(distractors).not.toContain(3);
  });

  it('generates unique distractors', () => {
    const distractors = generateDivisionDistractors(21, 7, 3);
    const uniqueDistractors = new Set(distractors);
    expect(uniqueDistractors.size).toBe(3);
  });

  it('all distractors are in valid range 0-10', () => {
    const distractors = generateDivisionDistractors(63, 7, 9);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(10);
    });
  });

  it('handles 0÷N correctly', () => {
    const distractors = generateDivisionDistractors(0, 7, 0);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(0);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(10);
    });
  });

  it('handles N÷N correctly', () => {
    const distractors = generateDivisionDistractors(7, 7, 1);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(1);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(10);
    });
  });

  it('handles division by 1 correctly', () => {
    const distractors = generateDivisionDistractors(7, 1, 7);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(7);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(10);
    });
  });

  it('handles large dividend correctly', () => {
    const distractors = generateDivisionDistractors(81, 9, 9);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(9);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(10);
    });
  });
});
