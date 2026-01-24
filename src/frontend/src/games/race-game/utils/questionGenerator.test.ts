/**
 * Question Generator Tests
 */

import { describe, it, expect } from 'vitest';

import {
  generateRaceQuestion,
  generateMultiplicationQuestion,
  generateDivisionQuestion,
  selectRandomFact,
  shuffle,
} from './questionGenerator';

describe('shuffle', () => {
  it('returns array with same length', () => {
    const input = [1, 2, 3, 4, 5];
    const shuffled = shuffle(input);
    expect(shuffled).toHaveLength(input.length);
  });

  it('contains all original elements', () => {
    const input = [1, 2, 3, 4, 5];
    const shuffled = shuffle(input);

    input.forEach((item) => {
      expect(shuffled).toContain(item);
    });
  });

  it('does not mutate original array', () => {
    const input = [1, 2, 3, 4, 5];
    const original = [...input];
    shuffle(input);
    expect(input).toEqual(original);
  });
});

describe('selectRandomFact', () => {
  it('returns a fact from the array', () => {
    const facts = ['7×0', '7×1', '7×2', '7×3'];
    const selected = selectRandomFact(facts);
    expect(facts).toContain(selected);
  });

  it('throws error for empty array', () => {
    expect(() => selectRandomFact([])).toThrow('Cannot select from empty facts array');
  });

  it('returns single fact when array has one element', () => {
    const facts = ['7×8'];
    const selected = selectRandomFact(facts);
    expect(selected).toBe('7×8');
  });
});

describe('generateMultiplicationQuestion', () => {
  it('generates correct question format', () => {
    const question = generateMultiplicationQuestion(7, ['7×8']);
    expect(question.questionText).toBe('7 × 8 = ?');
    expect(question.correctAnswer).toBe(56);
    expect(question.lane).toBe(7);
    expect(question.fact).toBe('7×8');
  });

  it('generates 4 options', () => {
    const question = generateMultiplicationQuestion(7, ['7×8']);
    expect(question.options).toHaveLength(4);
  });

  it('includes correct answer in options', () => {
    const question = generateMultiplicationQuestion(7, ['7×8']);
    expect(question.options).toContain(question.correctAnswer);
  });

  it('has valid correctIndex', () => {
    const question = generateMultiplicationQuestion(7, ['7×8']);
    expect(question.correctIndex).toBeGreaterThanOrEqual(0);
    expect(question.correctIndex).toBeLessThan(4);
    expect(question.options[question.correctIndex]).toBe(question.correctAnswer);
  });

  it('generates unique options', () => {
    const question = generateMultiplicationQuestion(7, ['7×8']);
    const uniqueOptions = new Set(question.options);
    expect(uniqueOptions.size).toBe(4);
  });

  it('handles 0×N facts', () => {
    const question = generateMultiplicationQuestion(0, ['0×5']);
    expect(question.correctAnswer).toBe(0);
    expect(question.options).toContain(0);
  });

  it('handles N×0 facts', () => {
    const question = generateMultiplicationQuestion(5, ['5×0']);
    expect(question.correctAnswer).toBe(0);
    expect(question.options).toContain(0);
  });

  it('selects from multiple unmastered facts', () => {
    const facts = ['7×3', '7×5', '7×8'];
    const question = generateMultiplicationQuestion(7, facts);
    expect(facts).toContain(question.fact);
  });
});

describe('generateDivisionQuestion', () => {
  it('generates correct question format', () => {
    const question = generateDivisionQuestion(7, ['21÷7']);
    expect(question.questionText).toBe('21 ÷ 7 = ?');
    expect(question.correctAnswer).toBe(3);
    expect(question.lane).toBe(7);
    expect(question.fact).toBe('21÷7');
  });

  it('generates 4 options', () => {
    const question = generateDivisionQuestion(7, ['21÷7']);
    expect(question.options).toHaveLength(4);
  });

  it('includes correct answer in options', () => {
    const question = generateDivisionQuestion(7, ['21÷7']);
    expect(question.options).toContain(question.correctAnswer);
  });

  it('has valid correctIndex', () => {
    const question = generateDivisionQuestion(7, ['21÷7']);
    expect(question.correctIndex).toBeGreaterThanOrEqual(0);
    expect(question.correctIndex).toBeLessThan(4);
    expect(question.options[question.correctIndex]).toBe(question.correctAnswer);
  });

  it('generates unique options', () => {
    const question = generateDivisionQuestion(7, ['21÷7']);
    const uniqueOptions = new Set(question.options);
    expect(uniqueOptions.size).toBe(4);
  });

  it('handles 0÷N facts', () => {
    const question = generateDivisionQuestion(7, ['0÷7']);
    expect(question.correctAnswer).toBe(0);
    expect(question.options).toContain(0);
  });

  it('handles N÷N facts', () => {
    const question = generateDivisionQuestion(7, ['7÷7']);
    expect(question.correctAnswer).toBe(1);
    expect(question.options).toContain(1);
  });

  it('selects from multiple unmastered facts', () => {
    const facts = ['14÷7', '21÷7', '35÷7'];
    const question = generateDivisionQuestion(7, facts);
    expect(facts).toContain(question.fact);
  });

  it('all division options are in valid range 0-10', () => {
    const question = generateDivisionQuestion(7, ['56÷7']);
    question.options.forEach((option) => {
      expect(option).toBeGreaterThanOrEqual(0);
      expect(option).toBeLessThanOrEqual(10);
    });
  });
});

describe('generateRaceQuestion', () => {
  it('generates multiplication question when gameType is multiplication', () => {
    const question = generateRaceQuestion('multiplication', 7, ['7×8']);
    expect(question.questionText).toContain('×');
    expect(question.correctAnswer).toBe(56);
  });

  it('generates division question when gameType is division', () => {
    const question = generateRaceQuestion('division', 7, ['21÷7']);
    expect(question.questionText).toContain('÷');
    expect(question.correctAnswer).toBe(3);
  });

  it('throws error for empty facts array', () => {
    expect(() => generateRaceQuestion('multiplication', 7, [])).toThrow(
      'No unmastered facts available',
    );
  });

  it('throws error for unknown game type', () => {
    expect(() =>
      // @ts-expect-error Testing invalid game type
      generateRaceQuestion('invalid', 7, ['7×8']),
    ).toThrow('Unknown game type');
  });
});
