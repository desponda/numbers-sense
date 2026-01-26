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
  type FeedbackEntry,
  type GameStatus,
  type GameType,
  type LaneState,
  type RaceQuestion,
} from '../types';
// Import utility functions
import {
  getUnmasteredFacts,
  initializeFactMastery,
  markFactCorrect as markFactCorrectUtil,
} from '../utils/factMasteryTracker';
import { selectNextLane } from '../utils/laneSelector';
import { generateRaceQuestion } from '../utils/questionGenerator';

/**
 * Initialize lanes based on game type and difficulty
 */
const initializeLanes = (gameType: GameType, difficulty: Difficulty): LaneState[] => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const lanes: LaneState[] = [];

  // For division, lanes start at 1, not 0 (can't divide by zero)
  const startLane = gameType === 'division' ? 1 : 0;
  const laneCount = gameType === 'division' ? config.laneCount - 1 : config.laneCount;

  // Get operation symbol
  let symbol: string;
  if (gameType === 'multiplication') {
    symbol = '×';
  } else if (gameType === 'division') {
    symbol = '÷';
  } else if (gameType === 'addition') {
    symbol = '+';
  } else {
    symbol = '-';
  }

  for (let i = 0; i < laneCount; i += 1) {
    const laneNumber = startLane + i;

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
  factMastery: Record<string, FactMastery>;

  // Status
  status: GameStatus;

  // Feedback
  currentFeedback: FeedbackEntry | null;

  // Actions
  initializeGame: (type: GameType, difficulty: Difficulty) => void;
  generateNextQuestion: () => void;
  submitAnswer: (selectedIndex: number) => void;
  dismissFeedback: () => void;
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
  factMastery: {},
  status: 'init' as GameStatus,
  currentFeedback: null,
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
          currentFeedback: null,
        });

        // Generate first question
        get().generateNextQuestion();
      },

      /**
       * Generate next question based on lane selection algorithm
       */
      generateNextQuestion: (): void => {
        const state = get();
        const { lanes, gameType, factMastery } = state;

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
        const unmasteredFacts = getUnmasteredFacts(nextLane, factMastery, gameType);

        // Generate question for this lane
        const question = generateRaceQuestion(gameType, nextLane, unmasteredFacts);

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

        const isCorrect = selectedIndex === currentQuestion.correctIndex;
        const userAnswer = currentQuestion.options[selectedIndex];

        if (isCorrect) {
          // Mark fact as correct in mastery tracker (create copy to avoid mutation)
          const updatedFactMastery = { ...factMastery };
          markFactCorrectUtil(currentQuestion.fact, updatedFactMastery, difficulty);

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
            currentFeedback: null, // Clear feedback on correct answer
          });

          // Generate next question after brief delay
          setTimeout(() => {
            get().generateNextQuestion();
          }, 500);
        } else {
          // Incorrect answer - create feedback entry and move to next question
          const feedbackEntry: FeedbackEntry = {
            id: `${String(Date.now())}-${String(currentQuestion.lane)}`,
            questionText: currentQuestion.questionText,
            userAnswer: userAnswer ?? 0,
            correctAnswer: currentQuestion.correctAnswer,
            wasCorrect: false,
            timestamp: Date.now(),
            lane: currentQuestion.lane,
          };

          set({
            totalAttempts: totalAttempts + 1,
            currentFeedback: feedbackEntry,
          });

          // Move to next question after brief delay (no retry)
          setTimeout(() => {
            get().generateNextQuestion();
          }, 500);
        }
      },

      /**
       * Dismiss current feedback
       */
      dismissFeedback: (): void => {
        set({ currentFeedback: null });
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
