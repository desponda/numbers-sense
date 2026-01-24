# Race Games Technical Architecture

**Games:** Multiplication Race & Division Race
**Version:** 1.0
**Created:** January 24, 2026
**Status:** Architecture Design - Pre-Implementation

---

## Overview

The Race Games (Multiplication and Division) extend the existing NumberSense game engine with a new "bike race" metaphor. These games share 90% of their code through abstraction, differing primarily in question generation logic.

---

## Integration with Existing Codebase

### Existing Game Engine Components (Reuse)

From `/src/frontend/src/game-engine/`:

```typescript
// ✅ REUSE - No changes needed
- stores/gameSessionStore.ts       // Core game state management
- types.ts                         // Base game types
- problemGenerator.ts              // Extend for race questions
- hooks/useGameState.ts            // React hooks for game state
```

### Existing UI Components (Reuse)

From `/src/frontend/src/components/`:

```typescript
// ✅ REUSE - No changes needed
- ui/Button.tsx                    // Answer buttons
- ui/Card.tsx                      // Question card container
- feedback/CorrectFeedback.tsx     // ✅ checkmark animation
- feedback/TryAgainFeedback.tsx    // ❌ try again message
- layout/Header.tsx                // Game header with home button
```

### New Components (Create)

```
/src/frontend/src/games/race-game/
├── RaceGame.tsx                   // Main game container (shared)
├── RaceTrack.tsx                  // Visual race track with lanes
├── BikeRaceLane.tsx               // Single lane component
├── QuestionModal.tsx              // Question overlay
├── MultipleChoiceGrid.tsx         // 2×2 answer grid
├── CompletionCelebration.tsx      // All bikes finished animation
├── GameStats.tsx                  // Post-game statistics
├── types.ts                       // Race game specific types
├── raceGameStore.ts               // Race game state store
├── questionGenerator.ts           // Race question generation
├── distractorGenerator.ts         // Smart distractor creation
└── index.ts                       // Exports
```

---

## Architecture Patterns

### 1. Shared Base Game Component

```typescript
// /src/frontend/src/games/race-game/RaceGame.tsx
interface RaceGameProps {
  gameType: 'multiplication' | 'division';
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete?: (stats: GameStats) => void;
  className?: string;
}

export const RaceGame: React.FC<RaceGameProps> = ({
  gameType,
  difficulty,
  onComplete,
  className
}) => {
  // Shared logic for both games
  // Delegates to game-specific question generators
};
```

### 2. Game-Specific Wrappers

```typescript
// /src/frontend/src/games/multiplication-race/MultiplicationRaceGame.tsx
export const MultiplicationRaceGame: React.FC<GameProps> = (props) => (
  <RaceGame gameType="multiplication" {...props} />
);

// /src/frontend/src/games/division-race/DivisionRaceGame.tsx
export const DivisionRaceGame: React.FC<GameProps> = (props) => (
  <RaceGame gameType="division" {...props} />
);
```

---

## State Management

### Zustand Store Structure

```typescript
// /src/frontend/src/games/race-game/raceGameStore.ts
interface RaceGameState {
  // Game configuration
  gameType: 'multiplication' | 'division';
  difficulty: 'easy' | 'medium' | 'hard';

  // Lane state (9 or 10 lanes depending on game type)
  lanes: LaneState[];

  // Current question
  currentQuestion: RaceQuestion | null;
  currentLane: number | null;

  // Progress tracking
  totalCorrect: number;
  totalAttempts: number;
  startTime: number;
  endTime: number | null;

  // Fact mastery tracking
  factMastery: Map<string, FactMastery>;

  // Game status
  status: 'init' | 'playing' | 'paused' | 'completed';

  // Actions
  initializeGame: (type, difficulty) => void;
  generateNextQuestion: () => void;
  submitAnswer: (selectedIndex: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
}

interface LaneState {
  laneNumber: number;          // 0-9 for mult, 1-9 for div
  label: string;               // "×7" or "÷7"
  stepsCompleted: number;      // 0-20 or 0-30 (hard mode)
  stepsTotal: number;          // 20 or 30
  finished: boolean;
  facts: string[];             // ["7×0", "7×1", ...]
  progress: number;            // 0.0 to 1.0 (for animation)
}

interface FactMastery {
  fact: string;                // "7×3" or "21÷7"
  correctCount: number;        // 0, 1, or 2 (2 or 3 for hard mode)
  mastered: boolean;
}
```

### Question Generation

```typescript
// /src/frontend/src/games/race-game/questionGenerator.ts

export function generateRaceQuestion(
  gameType: 'multiplication' | 'division',
  lane: number,
  unmasteredFacts: string[]
): RaceQuestion {
  if (gameType === 'multiplication') {
    return generateMultiplicationQuestion(lane, unmasteredFacts);
  } else {
    return generateDivisionQuestion(lane, unmasteredFacts);
  }
}

function generateMultiplicationQuestion(
  multiplicand: number,
  unmasteredFacts: string[]
): RaceQuestion {
  // Pick random unmastered fact for this lane
  const fact = selectRandomFact(unmasteredFacts);
  const [, multiplierStr] = fact.split('×');
  const multiplier = parseInt(multiplierStr);
  const correctAnswer = multiplicand * multiplier;

  // Generate distractors
  const distractors = generateMultiplicationDistractors(
    multiplicand,
    multiplier,
    correctAnswer
  );

  // Randomize options
  const options = shuffle([correctAnswer, ...distractors]);

  return {
    lane: multiplicand,
    questionText: `${multiplicand} × ${multiplier} = ?`,
    correctAnswer,
    options,
    correctIndex: options.indexOf(correctAnswer),
    fact
  };
}

function generateDivisionQuestion(
  divisor: number,
  unmasteredFacts: string[]
): RaceQuestion {
  // Pick random unmastered fact for this lane
  const fact = selectRandomFact(unmasteredFacts);
  const [dividendStr] = fact.split('÷');
  const dividend = parseInt(dividendStr);
  const quotient = dividend / divisor;

  // Generate distractors
  const distractors = generateDivisionDistractors(
    dividend,
    divisor,
    quotient
  );

  // Randomize options
  const options = shuffle([quotient, ...distractors]);

  return {
    lane: divisor,
    questionText: `${dividend} ÷ ${divisor} = ?`,
    correctAnswer: quotient,
    options,
    correctIndex: options.indexOf(quotient),
    fact
  };
}
```

### Distractor Generation

```typescript
// /src/frontend/src/games/race-game/distractorGenerator.ts

export function generateMultiplicationDistractors(
  multiplicand: number,
  multiplier: number,
  correct: number
): number[] {
  const distractors: number[] = [];

  // Strategy 1: Adjacent facts (50%)
  if (Math.random() < 0.5) {
    distractors.push(
      multiplicand * (multiplier - 1), // 7×7 instead of 7×8
      multiplicand * (multiplier + 1)  // 7×9 instead of 7×8
    );
  } else {
    // Strategy 2: Column confusion
    distractors.push(
      (multiplicand - 1) * multiplier, // 6×8 instead of 7×8
      (multiplicand + 1) * multiplier  // 8×8 instead of 7×8
    );
  }

  // Strategy 3: Plausible range
  const offset = Math.floor(Math.random() * 5) + 3; // 3-7 offset
  distractors.push(correct + offset);

  // Ensure no duplicates, no correct answer
  return deduplicateAndFilter(distractors, correct).slice(0, 3);
}

export function generateDivisionDistractors(
  dividend: number,
  divisor: number,
  quotient: number
): number[] {
  const distractors: number[] = [];

  // Strategy 1: Off-by-one quotient
  if (quotient > 0) distractors.push(quotient - 1);
  if (quotient < 9) distractors.push(quotient + 1);

  // Strategy 2: Related facts confusion
  distractors.push(
    divisor,      // Show divisor as distractor
    dividend / 3  // Different divisor (if whole number)
  );

  // Strategy 3: Plausible range
  const offset = Math.floor(Math.random() * 3) + 2;
  distractors.push(quotient + offset);

  // Filter to valid range [0-10] and remove duplicates
  return deduplicateAndFilter(distractors, quotient)
    .filter(d => d >= 0 && d <= 10)
    .slice(0, 3);
}
```

---

## Component Architecture

### RaceTrack Component

```typescript
// Displays all lanes with bike positions
interface RaceTrackProps {
  lanes: LaneState[];
  currentLane: number | null;
  onLaneClick?: (lane: number) => void;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({
  lanes,
  currentLane,
  onLaneClick
}) => {
  return (
    <div className="race-track">
      {lanes.map(lane => (
        <BikeRaceLane
          key={lane.laneNumber}
          lane={lane}
          isActive={lane.laneNumber === currentLane}
          onClick={() => onLaneClick?.(lane.laneNumber)}
        />
      ))}
    </div>
  );
};
```

### BikeRaceLane Component

```typescript
interface BikeRaceLaneProps {
  lane: LaneState;
  isActive: boolean;
  onClick?: () => void;
}

export const BikeRaceLane: React.FC<BikeRaceLaneProps> = ({
  lane,
  isActive,
  onClick
}) => {
  const progressPercentage = (lane.stepsCompleted / lane.stepsTotal) * 100;

  return (
    <div
      className={`bike-lane ${isActive ? 'active' : ''} ${lane.finished ? 'finished' : ''}`}
      onClick={onClick}
      role="progressbar"
      aria-valuenow={lane.stepsCompleted}
      aria-valuemin={0}
      aria-valuemax={lane.stepsTotal}
      aria-label={`Lane ${lane.label}: ${lane.stepsCompleted} out of ${lane.stepsTotal} completed`}
    >
      {/* Lane label */}
      <div className="lane-label">{lane.label}</div>

      {/* Progress track */}
      <div className="lane-track">
        <div
          className="lane-progress-bar"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Bike icon */}
        <div
          className="bike-icon"
          style={{ left: `${progressPercentage}%` }}
          aria-hidden="true"
        >
          🚴
        </div>

        {/* Finish line */}
        <div className="finish-line">🏁</div>
      </div>

      {/* Progress counter */}
      <div className="lane-counter">
        {lane.stepsCompleted}/{lane.stepsTotal}
      </div>

      {/* Finished checkmark */}
      {lane.finished && (
        <div className="lane-finished-badge">✅</div>
      )}
    </div>
  );
};
```

### QuestionModal Component

```typescript
interface QuestionModalProps {
  question: RaceQuestion;
  onAnswer: (selectedIndex: number) => void;
  disabled?: boolean;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  onAnswer,
  disabled = false
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (disabled) return;
    setSelectedIndex(index);
    onAnswer(index);
  };

  return (
    <div
      className="question-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-text"
    >
      <Card className="question-modal">
        <h3 id="question-text" className="question-text">
          {question.questionText}
        </h3>

        <MultipleChoiceGrid
          options={question.options}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          disabled={disabled}
        />
      </Card>
    </div>
  );
};
```

### MultipleChoiceGrid Component

```typescript
interface MultipleChoiceGridProps {
  options: number[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export const MultipleChoiceGrid: React.FC<MultipleChoiceGridProps> = ({
  options,
  selectedIndex,
  onSelect,
  disabled
}) => {
  return (
    <div
      className="multiple-choice-grid"
      role="radiogroup"
      aria-label="Answer options"
    >
      {options.map((option, index) => (
        <Button
          key={index}
          variant="secondary"
          size="large"
          onClick={() => onSelect(index)}
          disabled={disabled}
          className={`answer-option ${selectedIndex === index ? 'selected' : ''}`}
          role="radio"
          aria-checked={selectedIndex === index}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};
```

---

## Lane Selection Algorithm

```typescript
// Prioritize furthest-behind lanes
function selectNextLane(lanes: LaneState[]): number {
  // Filter to unfinished lanes
  const activeLanes = lanes.filter(l => !l.finished);

  if (activeLanes.length === 0) {
    return -1; // Game complete
  }

  // Find lane(s) with most steps remaining
  const maxStepsRemaining = Math.max(
    ...activeLanes.map(l => l.stepsTotal - l.stepsCompleted)
  );

  const furthestBehindLanes = activeLanes.filter(
    l => (l.stepsTotal - l.stepsCompleted) === maxStepsRemaining
  );

  // Randomly select from furthest-behind lanes
  return furthestBehindLanes[
    Math.floor(Math.random() * furthestBehindLanes.length)
  ].laneNumber;
}
```

---

## Animation Strategy

### Bike Movement Animation

```typescript
// Use Framer Motion for smooth animations
import { motion } from 'framer-motion';

const BikeIcon = ({ progress }: { progress: number }) => (
  <motion.div
    className="bike-icon"
    animate={{ left: `${progress * 100}%` }}
    transition={{
      type: 'spring',
      damping: 20,
      stiffness: 100,
      duration: 0.5
    }}
  >
    🚴
  </motion.div>
);
```

### Celebration Animation

```typescript
// Confetti for lane completion
import Confetti from 'react-confetti';

const LaneCompletionCelebration = ({ lane }: { lane: number }) => (
  <Confetti
    width={window.innerWidth}
    height={200}
    recycle={false}
    numberOfPieces={50}
    gravity={0.3}
    confettiSource={{ x: 0, y: 0, w: window.innerWidth, h: 0 }}
  />
);
```

---

## Audio Integration

Using existing `useGameAudio` hook:

```typescript
import { useGameAudio } from '@/hooks/useGameAudio';

const RaceGame = () => {
  const audio = useGameAudio();

  const handleCorrectAnswer = () => {
    audio.playCorrect();
    // Advance bike
  };

  const handleIncorrectAnswer = () => {
    audio.playIncorrect();
    // Stay in place
  };

  const handleLaneFinish = () => {
    audio.playSuccess();
    // Show celebration
  };

  const handleGameComplete = () => {
    audio.playVictory();
    // Show final stats
  };
};
```

---

## File Structure

```
/src/frontend/src/games/
├── race-game/                     # Shared race game logic
│   ├── components/
│   │   ├── RaceTrack.tsx
│   │   ├── BikeRaceLane.tsx
│   │   ├── QuestionModal.tsx
│   │   ├── MultipleChoiceGrid.tsx
│   │   ├── CompletionCelebration.tsx
│   │   ├── GameStats.tsx
│   │   └── index.ts
│   ├── stores/
│   │   └── raceGameStore.ts
│   ├── utils/
│   │   ├── questionGenerator.ts
│   │   ├── distractorGenerator.ts
│   │   ├── laneSelector.ts
│   │   └── factMasteryTracker.ts
│   ├── types.ts
│   ├── RaceGame.tsx               # Main shared component
│   └── index.ts
│
├── multiplication-race/
│   ├── MultiplicationRaceGame.tsx  # Wrapper
│   └── index.ts
│
└── division-race/
    ├── DivisionRaceGame.tsx        # Wrapper
    └── index.ts
```

---

## Testing Strategy

### Unit Tests

```typescript
// Question generation
describe('generateMultiplicationQuestion', () => {
  it('generates correct format N×M', () => {});
  it('uses unmastered facts only', () => {});
  it('generates valid distractors', () => {});
});

// Distractor generation
describe('generateMultiplicationDistractors', () => {
  it('creates exactly 3 distractors', () => {});
  it('avoids duplicates', () => {});
  it('excludes correct answer', () => {});
});

// Lane selection
describe('selectNextLane', () => {
  it('prioritizes furthest-behind lanes', () => {});
  it('returns -1 when all lanes finished', () => {});
});
```

### Component Tests

```typescript
describe('BikeRaceLane', () => {
  it('displays correct progress', () => {});
  it('shows bike at correct position', () => {});
  it('shows checkmark when finished', () => {});
  it('highlights when active', () => {});
});

describe('QuestionModal', () => {
  it('displays question text', () => {});
  it('renders 4 answer options', () => {});
  it('calls onAnswer when option selected', () => {});
});
```

### E2E Tests (Playwright)

```typescript
test('complete multiplication race game', async ({ page }) => {
  // Navigate to game
  // Answer questions
  // Verify bike movement
  // Verify lane completion
  // Verify final celebration
});
```

---

## Performance Considerations

1. **Memoization:** Use `React.memo` for lane components (only re-render on progress change)
2. **Virtual scrolling:** If >10 lanes in future, use react-window
3. **Animation throttling:** Max 2 concurrent bike animations
4. **State updates:** Batch updates using `unstable_batchedUpdates` if needed
5. **Question pre-generation:** Generate next question while current is being answered

---

## Accessibility Checklist

- [ ] All lanes have ARIA labels with progress
- [ ] Question modal is proper dialog with focus trap
- [ ] Answer buttons are keyboard navigable
- [ ] Screen reader announces bike progress
- [ ] Screen reader announces correct/incorrect feedback
- [ ] Reduced motion disables bike animations
- [ ] High contrast mode supported
- [ ] Color is not sole differentiator for lanes

---

## Integration with App Navigation

Update `/src/frontend/src/components/layout/GameMenu.tsx`:

```typescript
const GameMenu = () => {
  return (
    <div className="game-menu">
      <GameCard
        title="Build the Number"
        description="Build numbers with blocks"
        icon="🔢"
        onClick={() => navigate('/game/build-the-number')}
      />

      <GameCard
        title="Sort the Numbers"
        description="Put numbers in order"
        icon="📊"
        onClick={() => navigate('/game/sort-the-numbers')}
      />

      {/* NEW GAMES */}
      <GameCard
        title="Multiplication Race"
        description="Race to master times tables!"
        icon="🚴×"
        onClick={() => navigate('/game/multiplication-race')}
      />

      <GameCard
        title="Division Race"
        description="Race to master division!"
        icon="🚴÷"
        onClick={() => navigate('/game/division-race')}
        locked={!hasCompletedMultiplication}  // Unlock after mult
      />
    </div>
  );
};
```

---

## Next Steps (Implementation Phase)

1. **Create base race game components** (1 agent)
2. **Implement question/distractor generators** (1 agent)
3. **Build multiplication race wrapper** (1 agent)
4. **Build division race wrapper** (1 agent)
5. **Write tests** (1 agent)
6. **Integrate with game menu** (1 agent)

**Total agents:** 6 agents working in parallel

---

## References

- `/docs/specs/multiplication-race-game.md` - Multiplication game specification
- `/docs/specs/division-race-game.md` - Division game specification
- `/docs/research/bike-race-ux-patterns.md` - UX research
- `/docs/architecture/technical-blueprint.md` - Overall architecture
- `/src/frontend/src/game-engine/` - Existing game engine patterns

---

**Document Owner:** VP of Engineering & Product
**Review Status:** Architecture Design - Pending CTO Approval
**Estimated Implementation:** 2-3 sprints with parallel agents
