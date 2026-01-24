/**
 * Question Generator
 *
 * Generates race questions for multiplication and division games
 */

import {
  generateMultiplicationDistractors,
  generateDivisionDistractors,
} from './distractorGenerator';

import type { GameType, RaceQuestion } from '../types';

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    const otherTemp = shuffled[j];

    if (temp !== undefined && otherTemp !== undefined) {
      shuffled[i] = otherTemp;
      shuffled[j] = temp;
    }
  }

  return shuffled;
}

/**
 * Select a random fact from an array
 */
export function selectRandomFact(facts: string[]): string {
  if (facts.length === 0) {
    throw new Error('Cannot select from empty facts array');
  }

  const randomIndex = Math.floor(Math.random() * facts.length);
  const fact = facts[randomIndex];

  if (fact === undefined) {
    throw new Error('Failed to select random fact');
  }

  return fact;
}

/**
 * Generate a multiplication question
 *
 * @param multiplicand Lane number (N in N×M)
 * @param unmasteredFacts Array of unmastered facts for this lane
 * @returns A complete race question with shuffled options
 */
export function generateMultiplicationQuestion(
  multiplicand: number,
  unmasteredFacts: string[],
): RaceQuestion {
  // Select a random unmastered fact
  const fact = selectRandomFact(unmasteredFacts);

  // Parse the fact (e.g., "7×8" -> multiplicand=7, multiplier=8)
  const parts = fact.split('×');
  const multiplierStr = parts[1];

  if (multiplierStr === undefined) {
    throw new Error(`Invalid multiplication fact format: ${fact}`);
  }

  const multiplier = parseInt(multiplierStr, 10);

  if (Number.isNaN(multiplier)) {
    throw new Error(`Invalid multiplier in fact: ${fact}`);
  }

  // Calculate correct answer
  const correctAnswer = multiplicand * multiplier;

  // Generate 3 distractors
  const distractors = generateMultiplicationDistractors(multiplicand, multiplier, correctAnswer);

  // Ensure we have exactly 3 distractors
  if (distractors.length < 3) {
    throw new Error(
      `Failed to generate 3 distractors for ${fact}. Got ${String(distractors.length)}`,
    );
  }

  // Combine correct answer with distractors and shuffle
  const options = shuffle([correctAnswer, ...distractors.slice(0, 3)]);

  // Find index of correct answer in shuffled options
  const correctIndex = options.indexOf(correctAnswer);

  return {
    lane: multiplicand,
    questionText: `${String(multiplicand)} × ${String(multiplier)} = ?`,
    correctAnswer,
    options,
    correctIndex,
    fact,
  };
}

/**
 * Generate a division question
 *
 * @param divisor Lane number (N in M÷N where N is the divisor)
 * @param unmasteredFacts Array of unmastered facts for this lane
 * @returns A complete race question with shuffled options
 */
export function generateDivisionQuestion(divisor: number, unmasteredFacts: string[]): RaceQuestion {
  // Select a random unmastered fact
  const fact = selectRandomFact(unmasteredFacts);

  // Parse the fact (e.g., "21÷7" -> dividend=21, divisor=7)
  const parts = fact.split('÷');
  const dividendStr = parts[0];

  if (dividendStr === undefined) {
    throw new Error(`Invalid division fact format: ${fact}`);
  }

  const dividend = parseInt(dividendStr, 10);

  if (Number.isNaN(dividend)) {
    throw new Error(`Invalid dividend in fact: ${fact}`);
  }

  // Calculate correct answer (quotient)
  const quotient = dividend / divisor;

  // Ensure quotient is a whole number (should always be true for our facts)
  if (!Number.isInteger(quotient)) {
    throw new Error(`Division fact ${fact} does not result in whole number`);
  }

  // Generate 3 distractors
  const distractors = generateDivisionDistractors(dividend, divisor, quotient);

  // Ensure we have exactly 3 distractors
  if (distractors.length < 3) {
    throw new Error(
      `Failed to generate 3 distractors for ${fact}. Got ${String(distractors.length)}`,
    );
  }

  // Combine correct answer with distractors and shuffle
  const options = shuffle([quotient, ...distractors.slice(0, 3)]);

  // Find index of correct answer in shuffled options
  const correctIndex = options.indexOf(quotient);

  return {
    lane: divisor,
    questionText: `${String(dividend)} ÷ ${String(divisor)} = ?`,
    correctAnswer: quotient,
    options,
    correctIndex,
    fact,
  };
}

/**
 * Main question generation function
 * Delegates to game-specific generators
 *
 * @param gameType Type of game (multiplication or division)
 * @param lane Lane number to generate question for
 * @param unmasteredFacts Array of unmastered facts for this lane
 * @returns A complete race question
 */
export function generateRaceQuestion(
  gameType: GameType,
  lane: number,
  unmasteredFacts: string[],
): RaceQuestion {
  if (unmasteredFacts.length === 0) {
    throw new Error(`No unmastered facts available for lane ${String(lane)}`);
  }

  if (gameType === 'multiplication') {
    return generateMultiplicationQuestion(lane, unmasteredFacts);
  }

  // gameType === 'division'
  return generateDivisionQuestion(lane, unmasteredFacts);
}
