/**
 * Distractor Generator
 *
 * Generates smart distractors for multiple choice questions
 * Based on educational research on common student errors
 */

/**
 * Remove duplicates and filter out the correct answer
 */
function deduplicateAndFilter(distractors: number[], correctAnswer: number): number[] {
  // Remove duplicates using Set
  const unique = Array.from(new Set(distractors));

  // Filter out correct answer and invalid values (NaN, Infinity)
  return unique.filter((d) => {
    return (
      d !== correctAnswer && Number.isFinite(d) && !Number.isNaN(d) && d >= 0 // Only positive numbers
    );
  });
}

/**
 * Generate 3 distractors for a multiplication question
 *
 * Strategy distribution:
 * - 50% Adjacent facts (7×7 or 7×9 instead of 7×8)
 * - 30% Column confusion (6×8 or 8×8 instead of 7×8)
 * - 20% Plausible range (correct ± small offset)
 *
 * @param multiplicand First number (N in N×M)
 * @param multiplier Second number (M in N×M)
 * @param correct Correct answer
 * @returns Array of 3 unique distractors
 */
export function generateMultiplicationDistractors(
  multiplicand: number,
  multiplier: number,
  correct: number,
): number[] {
  const distractors: number[] = [];

  // Strategy 1: Adjacent facts (50% probability)
  if (Math.random() < 0.5) {
    // Adjacent multiplier (N × M-1 or N × M+1)
    if (multiplier > 0) {
      distractors.push(multiplicand * (multiplier - 1));
    }
    if (multiplier < 9) {
      distractors.push(multiplicand * (multiplier + 1));
    }
  } else {
    // Strategy 2: Column confusion (30% of total, but 50% when not using adjacent)
    // Adjacent multiplicand ((N-1) × M or (N+1) × M)
    if (multiplicand > 0) {
      distractors.push((multiplicand - 1) * multiplier);
    }
    if (multiplicand < 9) {
      distractors.push((multiplicand + 1) * multiplier);
    }
  }

  // Add more distractors if needed
  // Addition confusion (rarely used, but pedagogically valid)
  if (distractors.length < 3) {
    distractors.push(multiplicand + multiplier);
  }

  // Strategy 3: Plausible range (small offset from correct)
  if (distractors.length < 3) {
    const offset = Math.floor(Math.random() * 5) + 3; // 3-7 offset
    const usePositive = Math.random() < 0.5;
    distractors.push(correct + (usePositive ? offset : -offset));
  }

  // Add more random but plausible distractors if still needed
  let attempts = 0;
  while (distractors.length < 10 && attempts < 20) {
    attempts += 1;

    // Generate from nearby facts
    const nearbyMultiplicand = multiplicand + (Math.random() < 0.5 ? -1 : 1);
    const nearbyMultiplier = multiplier + (Math.random() < 0.5 ? -1 : 1);

    if (nearbyMultiplicand >= 0 && nearbyMultiplicand <= 9) {
      if (nearbyMultiplier >= 0 && nearbyMultiplier <= 9) {
        distractors.push(nearbyMultiplicand * nearbyMultiplier);
      }
    }

    // Also add some simple offsets from correct answer
    const offset = Math.floor(Math.random() * 10) + 1;
    distractors.push(correct + offset);
  }

  // Deduplicate and filter, ensuring all are in valid range [0-100]
  const filtered = deduplicateAndFilter(distractors, correct).filter((d) => d <= 100);

  // If we still don't have 3, generate simple sequential distractors
  if (filtered.length < 3) {
    let value = 1;
    while (filtered.length < 3) {
      if (value !== correct && !filtered.includes(value)) {
        filtered.push(value);
      }
      value += 1;
    }
  }

  // Return exactly 3 distractors
  return filtered.slice(0, 3);
}

/**
 * Generate 3 distractors for a division question
 *
 * Strategy distribution:
 * - 50% Off-by-one quotient (quotient ± 1)
 * - 30% Related facts confusion (dividend, divisor, or related division)
 * - 20% Plausible range (quotient ± small offset)
 *
 * @param dividend Number being divided (M in M÷N)
 * @param divisor Number dividing by (N in M÷N)
 * @param quotient Correct answer
 * @returns Array of 3 unique distractors
 */
export function generateDivisionDistractors(
  dividend: number,
  divisor: number,
  quotient: number,
): number[] {
  const distractors: number[] = [];

  // Strategy 1: Off-by-one quotient (50% of distractors)
  if (quotient > 0) {
    distractors.push(quotient - 1);
  }
  if (quotient < 9) {
    distractors.push(quotient + 1);
  }

  // Strategy 2: Related facts confusion (30%)
  // Show divisor as a distractor (common error: confusing dividend/divisor/quotient)
  if (divisor !== quotient && divisor <= 10) {
    distractors.push(divisor);
  }

  // Show result of dividing by a different divisor
  // For example, if question is 21÷7=3, show 21÷3=7
  if (dividend > 0 && quotient > 1 && dividend % quotient === 0) {
    const alternateDivisor = dividend / quotient;
    if (
      alternateDivisor !== divisor &&
      alternateDivisor <= 10 &&
      Number.isInteger(alternateDivisor)
    ) {
      distractors.push(quotient); // This will show the quotient of the alternate division
    }
  }

  // Strategy 3: Plausible range (20%)
  // Add quotient ± small offset
  if (distractors.length < 3) {
    const offset = Math.floor(Math.random() * 3) + 2; // 2-4 offset
    const usePositive = Math.random() < 0.5;
    const value = quotient + (usePositive ? offset : -offset);

    if (value >= 0 && value <= 10) {
      distractors.push(value);
    }
  }

  // Add more plausible values if needed
  while (distractors.length < 6) {
    // Generate random quotients in valid range
    const randomQuotient = Math.floor(Math.random() * 11); // 0-10

    if (randomQuotient !== quotient) {
      distractors.push(randomQuotient);
    }
  }

  // Deduplicate and filter, ensuring all are in valid range [0-10]
  const filtered = deduplicateAndFilter(distractors, quotient).filter((d) => d >= 0 && d <= 10);

  // Return exactly 3 distractors
  return filtered.slice(0, 3);
}
