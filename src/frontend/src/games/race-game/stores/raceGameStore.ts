/**
 * Race Game Store
 *
 * Zustand store for managing race game state (shared by multiplication and division).
 * Handles lane progression, fact mastery tracking, and question generation.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  DIFFICULTY_CONFIGS,
  type Difficulty,
  type FactMastery,
  type GameStatus,
  type GameType,
  type LaneState,
  type RaceQuestion,
} from '../types';

// Placeholder imports for utils that will be created by another agent
// These functions will be implemented in separate files
// Once created, replace the placeholder implementations below with:
// These will be imported once the util files are created:
// import { initializeFactMastery, getUnmasteredFacts, markFactCorrect } from '../utils/factMasteryTracker';
// import { generateRaceQuestion } from '../utils/questionGenerator';
// import { selectNextLane } from '../utils/laneSelector';

// Temporary placeholder implementations (will be replaced with real imports)
/* eslint-disable @typescript-eslint/no-unused-vars */
const initializeFactMastery = (
  _gameType: GameType,
  _difficulty: Difficulty,
): Map<string, FactMastery> => {
  // Placeholder - will be implemented by utils agent
  return new Map();
};

const getUnmasteredFacts = (
  _factMastery: Map<string, FactMastery>,
  _lane: number,
  _gameType: GameType,
): string[] => {
  // Placeholder - will be implemented by utils agent
  return [];
};

const markFactCorrect = (
  factMastery: Map<string, FactMastery>,
  _fact: string,
  _masteryThreshold: number,
): Map<string, FactMastery> => {
  // Placeholder - will be implemented by utils agent
  return new Map(factMastery);
};

const generateRaceQuestion = (
  _gameType: GameType,
  lane: number,
  _unmasteredFacts: string[],
  _difficulty: Difficulty,
): RaceQuestion => {
  // Placeholder - will be implemented by utils agent
  return {
    lane,
    questionText: '',
    correctAnswer: 0,
    options: [0, 0, 0, 0],
    correctIndex: 0,
    fact: '',
  };
};

const selectNextLane = (_lanes: LaneState[]): number => {
  // Placeholder - will be implemented by utils agent
  return 0;
};
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * Initialize lanes based on game type and difficulty
 */
const initializeLanes = (gameType: GameType, difficulty: Difficulty): LaneState[] => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const lanes: LaneState[] = [];

  // For division, lanes start at 1, not 0 (can't divide by zero)
  const startLane = gameType === 'division' ? 1 : 0;
  const laneCount = gameType === 'division' ? config.laneCount - 1 : config.laneCount;

  for (let i = 0; i < laneCount; i += 1) {
    const laneNumber = startLane + i;
    const symbol = gameType === 'multiplication' ? '×' : '÷';

    lanes.push({
      laneNumber,
      label: `${symbol}${String(laneNumber)}`,
      stepsCompleted: 0,
      stepsTotal: config.stepsPerLane,
      finished: false,
      facts: [], // Will be populated by fact mastery tracker
      progress: 0.0,
    });
  }

  return lanes;
};

/**
 * Race Game State Interface
 */
interface RaceGameState {
  // Game config
  gameType: GameType;
  difficulty: Difficulty;

  // Lane state
  lanes: LaneState[];

  // Current question
  currentQuestion: RaceQuestion | null;
  currentLane: number | null;

  // Progress
  totalCorrect: number;
  totalAttempts: number;
  startTime: number;
  endTime: number | null;

  // Fact mastery
  factMastery: Map<string, FactMastery>;

  // Status
  status: GameStatus;

  // Actions
  initializeGame: (type: GameType, difficulty: Difficulty) => void;
  generateNextQuestion: () => void;
  submitAnswer: (selectedIndex: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
}

/**
 * Initial state
 */
const initialState = {
  gameType: 'multiplication' as GameType,
  difficulty: 'medium' as Difficulty,
  lanes: [],
  currentQuestion: null,
  currentLane: null,
  totalCorrect: 0,
  totalAttempts: 0,
  startTime: 0,
  endTime: null,
  factMastery: new Map<string, FactMastery>(),
  status: 'init' as GameStatus,
};

/**
 * Race Game Store
 */
export const useRaceGameStore = create<RaceGameState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      /**
       * Initialize game with type and difficulty
       */
      initializeGame: (type: GameType, difficulty: Difficulty): void => {
        set({
          gameType: type,
          difficulty,
          lanes: initializeLanes(type, difficulty),
          factMastery: initializeFactMastery(type, difficulty),
          status: 'playing',
          startTime: Date.now(),
          endTime: null,
          totalCorrect: 0,
          totalAttempts: 0,
          currentQuestion: null,
          currentLane: null,
        });

        // Generate first question
        get().generateNextQuestion();
      },

      /**
       * Generate next question based on lane selection algorithm
       */
      generateNextQuestion: (): void => {
        const state = get();
        const { lanes, gameType, difficulty, factMastery } = state;

        // Select next lane to practice
        const nextLane = selectNextLane(lanes);

        // Check if all lanes are finished
        if (nextLane === -1) {
          set({
            status: 'completed',
            endTime: Date.now(),
            currentQuestion: null,
            currentLane: null,
          });
          return;
        }

        // Get unmastered facts for this lane
        const unmasteredFacts = getUnmasteredFacts(factMastery, nextLane, gameType);

        // Generate question for this lane
        const question = generateRaceQuestion(gameType, nextLane, unmasteredFacts, difficulty);

        set({
          currentQuestion: question,
          currentLane: nextLane,
        });
      },

      /**
       * Submit answer and handle result
       */
      submitAnswer: (selectedIndex: number): void => {
        const state = get();
        const { currentQuestion, lanes, factMastery, difficulty, totalAttempts, totalCorrect } =
          state;

        if (!currentQuestion) {
          return;
        }

        const config = DIFFICULTY_CONFIGS[difficulty];
        const isCorrect = selectedIndex === currentQuestion.correctIndex;

        if (isCorrect) {
          // Mark fact as correct in mastery tracker
          const updatedFactMastery = markFactCorrect(
            factMastery,
            currentQuestion.fact,
            config.masteryThreshold,
          );

          // Advance lane progress
          const laneIndex = lanes.findIndex((l) => l.laneNumber === currentQuestion.lane);
          const updatedLanes = [...lanes];

          if (laneIndex !== -1) {
            const currentLane = updatedLanes[laneIndex];
            if (currentLane) {
              const newStepsCompleted = currentLane.stepsCompleted + 1;
              updatedLanes[laneIndex] = {
                ...currentLane,
                stepsCompleted: newStepsCompleted,
                progress: newStepsCompleted / currentLane.stepsTotal,
                finished: newStepsCompleted >= currentLane.stepsTotal,
              };
            }
          }

          set({
            totalAttempts: totalAttempts + 1,
            totalCorrect: totalCorrect + 1,
            factMastery: updatedFactMastery,
            lanes: updatedLanes,
          });

          // Generate next question after brief delay
          // Note: In actual implementation, this delay would be handled by the component
          // using setTimeout before calling generateNextQuestion
          setTimeout(() => {
            get().generateNextQuestion();
          }, 500);
        } else {
          // Incorrect answer - increment attempts only, keep same question
          set({
            totalAttempts: totalAttempts + 1,
          });
        }
      },

      /**
       * Pause game
       */
      pauseGame: (): void => {
        set({ status: 'paused' });
      },

      /**
       * Resume game
       */
      resumeGame: (): void => {
        set({ status: 'playing' });
      },

      /**
       * Reset game to initial state
       */
      resetGame: (): void => {
        set(initialState);
      },
    }),
    { name: 'race-game-store' },
  ),
);

/**
 * Export type for external use
 */
export type { RaceGameState };
