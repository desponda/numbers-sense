/**
 * Test utilities for race game testing
 * Provides mock data factories for lanes, questions, and mastery tracking
 */

/**
 * Mock lane state for testing
 */
export interface MockLaneState {
  lane: number;
  stepsCompleted: number;
  finished: boolean;
  facts: MockFactMastery[];
}

/**
 * Mock fact mastery for testing
 */
export interface MockFactMastery {
  fact: string;
  correctCount: number;
  mastered: boolean;
}

/**
 * Mock race question for testing
 */
export interface MockRaceQuestion {
  lane: number;
  questionText: string;
  correctAnswer: number;
  options: number[];
  correctIndex: number;
}

/**
 * Creates a mock lane state with sensible defaults
 */
export function mockLaneState(overrides: Partial<MockLaneState> = {}): MockLaneState {
  const lane = overrides.lane ?? 0;
  const stepsCompleted = overrides.stepsCompleted ?? 0;
  const finished = overrides.finished ?? false;

  const defaultFacts = Array.from({ length: 10 }, (_, i) => ({
    fact: `${lane.toString()}×${i.toString()}`,
    correctCount: 0,
    mastered: false,
  }));

  return {
    lane,
    stepsCompleted,
    finished,
    facts: overrides.facts ?? defaultFacts,
  };
}

/**
 * Creates a mock race question with sensible defaults
 */
export function mockRaceQuestion(overrides: Partial<MockRaceQuestion> = {}): MockRaceQuestion {
  const lane = overrides.lane ?? 3;
  const multiplier = 7;
  const correctAnswer = overrides.correctAnswer ?? lane * multiplier;
  const questionText =
    overrides.questionText ?? `${lane.toString()} × ${multiplier.toString()} = ?`;

  // Generate default options including correct answer
  const defaultOptions = [
    correctAnswer,
    correctAnswer - lane,
    correctAnswer + lane,
    correctAnswer - 1,
  ];

  const options = overrides.options ?? defaultOptions;
  const correctIndex = overrides.correctIndex ?? options.indexOf(correctAnswer);

  return {
    lane,
    questionText,
    correctAnswer,
    options,
    correctIndex,
  };
}

/**
 * Creates a mock fact mastery map
 */
export function mockFactMastery(
  overrides: Record<string, { correctCount: number; mastered: boolean }> = {},
): Record<string, { correctCount: number; mastered: boolean }> {
  const defaultMastery: Record<string, { correctCount: number; mastered: boolean }> = {
    '0×0': { correctCount: 0, mastered: false },
    '0×1': { correctCount: 0, mastered: false },
    '1×0': { correctCount: 0, mastered: false },
    '1×1': { correctCount: 0, mastered: false },
  };

  return {
    ...defaultMastery,
    ...overrides,
  };
}

/**
 * Creates a fully completed lane state for testing
 */
export function mockCompletedLane(lane: number): MockLaneState {
  return mockLaneState({
    lane,
    stepsCompleted: 20,
    finished: true,
    facts: Array.from({ length: 10 }, (_, i) => ({
      fact: `${lane.toString()}×${i.toString()}`,
      correctCount: 2,
      mastered: true,
    })),
  });
}

/**
 * Creates a partially completed lane state for testing
 */
export function mockPartialLane(lane: number, stepsCompleted: number): MockLaneState {
  const masteredCount = Math.floor(stepsCompleted / 2);

  return mockLaneState({
    lane,
    stepsCompleted,
    finished: false,
    facts: Array.from({ length: 10 }, (_, i) => {
      let correctCount = 0;
      if (i < masteredCount) {
        correctCount = 2;
      } else if (i === masteredCount) {
        correctCount = 1;
      }
      return {
        fact: `${lane.toString()}×${i.toString()}`,
        correctCount,
        mastered: i < masteredCount,
      };
    }),
  });
}
