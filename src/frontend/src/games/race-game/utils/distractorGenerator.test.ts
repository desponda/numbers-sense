/**
 * Distractor Generator Tests
 */

import { describe, it, expect } from 'vitest';

import {
  generateMultiplicationDistractors,
  generateDivisionDistractors,
  generateAdditionDistractors,
  generateSubtractionDistractors,
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

describe('generateAdditionDistractors', () => {
  it('generates exactly 3 distractors', () => {
    const distractors = generateAdditionDistractors(7, 8, 15);
    expect(distractors).toHaveLength(3);
  });

  it('does not include correct answer', () => {
    const distractors = generateAdditionDistractors(7, 8, 15);
    expect(distractors).not.toContain(15);
  });

  it('generates unique distractors', () => {
    const distractors = generateAdditionDistractors(7, 8, 15);
    const uniqueDistractors = new Set(distractors);
    expect(uniqueDistractors.size).toBe(3);
  });

  it('all distractors are in valid range 0-18', () => {
    const distractors = generateAdditionDistractors(9, 9, 18);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(18);
    });
  });

  it('handles 0+N correctly', () => {
    const distractors = generateAdditionDistractors(0, 5, 5);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(5);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(18);
    });
  });

  it('handles N+0 correctly', () => {
    const distractors = generateAdditionDistractors(7, 0, 7);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(7);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(18);
    });
  });

  it('handles 1+1 correctly', () => {
    const distractors = generateAdditionDistractors(1, 1, 2);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(2);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(18);
    });
  });

  it('handles edge case 9+9', () => {
    const distractors = generateAdditionDistractors(9, 9, 18);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(18);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(18);
    });
  });
});

describe('generateSubtractionDistractors', () => {
  it('generates exactly 3 distractors', () => {
    const distractors = generateSubtractionDistractors(7, 3, 4);
    expect(distractors).toHaveLength(3);
  });

  it('does not include correct answer', () => {
    const distractors = generateSubtractionDistractors(7, 3, 4);
    expect(distractors).not.toContain(4);
  });

  it('generates unique distractors', () => {
    const distractors = generateSubtractionDistractors(7, 3, 4);
    const uniqueDistractors = new Set(distractors);
    expect(uniqueDistractors.size).toBe(3);
  });

  it('all distractors are in valid range 0-9', () => {
    const distractors = generateSubtractionDistractors(9, 0, 9);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(9);
    });
  });

  it('handles N-0 correctly', () => {
    const distractors = generateSubtractionDistractors(7, 0, 7);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(7);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(9);
    });
  });

  it('handles N-N correctly', () => {
    const distractors = generateSubtractionDistractors(7, 7, 0);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(0);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(9);
    });
  });

  it('handles 1-0 correctly', () => {
    const distractors = generateSubtractionDistractors(1, 0, 1);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(1);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(9);
    });
  });

  it('handles edge case 9-0', () => {
    const distractors = generateSubtractionDistractors(9, 0, 9);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(9);
    distractors.forEach((d) => {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(9);
    });
  });
});
