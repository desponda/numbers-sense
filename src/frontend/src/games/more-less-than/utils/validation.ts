import type { MoreLessThanProblem } from '../../../game-engine/types';

export interface ValidationResult {
  isCorrect: boolean;
  correctAnswer: number;
  userAnswer: number;
  errorType?: ErrorType;
  hint?: string;
  showWorkingSolution: boolean;
}

export type ErrorType =
  | 'reversed_operation'
  | 'wrong_order'
  | 'counting_error'
  | 'place_value_error'
  | 'teen_number_confusion'
  | 'unknown';

/**
 * Analyzes the user's incorrect answer to identify common error patterns.
 *
 * Error patterns checked (in priority order):
 * 1. Reversed operation: Added when should subtract or vice versa
 * 2. Wrong order: Computed delta - startingNumber instead of startingNumber - delta
 * 3. Teen number confusion: Misinterpreted teen number (e.g., 15 as 5)
 * 4. Place value error: Modified wrong digit when adding/subtracting 10
 * 5. Counting error: Off by ±1
 *
 * @param problem - The problem being solved
 * @param userAnswer - The user's incorrect answer
 * @returns The detected error type
 */
function detectErrorType(problem: MoreLessThanProblem, userAnswer: number): ErrorType {
  const { startingNumber, operation, delta, targetValue } = problem;

  // Check reversed operation (most common error)
  // Example: "3 more than 5" → user answered 2 (did 5 - 3 instead of 5 + 3)
  const reversedAnswer = operation === 'more' ? startingNumber - delta : startingNumber + delta;
  if (userAnswer === reversedAnswer) {
    return 'reversed_operation';
  }

  // Check wrong order (less common, but systematic error)
  // Example: "4 less than 7" → user answered -3 (did 4 - 7 instead of 7 - 4)
  if (operation === 'less') {
    const wrongOrderAnswer = delta - startingNumber;
    if (userAnswer === wrongOrderAnswer) {
      return 'wrong_order';
    }
  }

  // Check teen number confusion
  // Example: "3 less than 15" → user answered 12 OR 5 (confused 15 with 5)
  if (startingNumber >= 13 && startingNumber <= 19) {
    const onesDigit = startingNumber % 10;
    const confusedAnswer = operation === 'more' ? onesDigit + delta : onesDigit - delta;

    if (userAnswer === confusedAnswer) {
      return 'teen_number_confusion';
    }
  }

  // Check place value error for operations with 10
  // Example: "10 more than 23" → user answered 24 (added to ones instead of tens)
  if (delta === 10) {
    const placeValueErrorAnswer = operation === 'more' ? startingNumber + 1 : startingNumber - 1;

    if (userAnswer === placeValueErrorAnswer) {
      return 'place_value_error';
    }
  }

  // Check counting error (off by 1)
  // This is a minor arithmetic mistake
  if (Math.abs(userAnswer - targetValue) === 1) {
    return 'counting_error';
  }

  // Unknown error pattern
  return 'unknown';
}

/**
 * Generates an age-appropriate, educational hint based on the error type.
 *
 * Hints are designed to:
 * - Use simple, encouraging language
 * - Focus on the conceptual misunderstanding
 * - Provide a starting point for re-solving
 * - Avoid being too prescriptive (let child think)
 *
 * @param errorType - The detected error type
 * @param problem - The problem context for personalized hints
 * @returns An educational hint string
 */
function getHintForError(errorType: ErrorType, problem: MoreLessThanProblem): string {
  const { operation, delta, startingNumber } = problem;
  const operationWord = operation === 'more' ? 'add' : 'subtract';

  switch (errorType) {
    case 'reversed_operation':
      return `Remember: "${operation} than" means ${operationWord}.`;

    case 'wrong_order':
      return `Start with ${String(startingNumber)}, then ${operationWord} ${String(delta)}.`;

    case 'counting_error':
      return `You're very close! Count carefully.`;

    case 'place_value_error':
      return `When ${operation === 'more' ? 'adding' : 'subtracting'} 10, the tens place changes, not the ones place.`;

    case 'teen_number_confusion':
      return `Remember: ${String(startingNumber)} is ${String(Math.floor(startingNumber / 10))} ten and ${String(startingNumber % 10)} ones.`;

    default:
      return `Let's think about it together. Start with ${String(startingNumber)}...`;
  }
}

/**
 * Validates a user's answer to a More/Less Than problem and provides
 * specific feedback based on common error patterns.
 *
 * @param problem - The problem being solved
 * @param userAnswer - The user's submitted answer
 * @returns Validation result with error detection and hints
 */
export function validateAnswer(problem: MoreLessThanProblem, userAnswer: number): ValidationResult {
  const { targetValue } = problem;
  const isCorrect = userAnswer === targetValue;

  if (isCorrect) {
    return {
      isCorrect: true,
      correctAnswer: targetValue,
      userAnswer,
      showWorkingSolution: false,
    };
  }

  // Detect error pattern
  const errorType = detectErrorType(problem, userAnswer);
  const hint = getHintForError(errorType, problem);

  return {
    isCorrect: false,
    correctAnswer: targetValue,
    userAnswer,
    errorType,
    hint,
    showWorkingSolution: true,
  };
}
