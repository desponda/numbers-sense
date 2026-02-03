# Game 3: More Than / Less Than - Component Reuse Analysis

**Date:** February 3, 2026
**Purpose:** Validate existing components support Game 3 requirements
**Status:** ✅ APPROVED - Ready for Implementation

---

## Executive Summary

**Finding**: Existing architecture supports 95% of Game 3 requirements with minor extensions needed.

**Reusable Components**:
- ✅ Block components (UnitCube, TenRod, HundredFlat)
- ✅ Game engine store (with extension)
- ✅ Drag-and-drop system
- ⚠️ Problem generator (needs extension for new problem format)

**New Components Needed**:
- VisualScaffold (displays blocks with add/remove animations)
- ProblemDisplay (shows "N more/less than X" question)
- AnswerInput (number input with validation)
- PeekButton (for Medium mode)
- StrategyHints (for Hard mode)
- FeedbackDisplay (reusable, extends existing)

**Estimated Development**: 2-3 weeks for all 4 difficulty levels

---

## 1. Block Components Analysis

### 1.1 Existing Components

**UnitCube** (`/src/frontend/src/components/blocks/UnitCube.tsx`)
- ✅ Size: 40×40px (suitable for visualization)
- ✅ Color: #4ECDC4 (teal) - consistent with design system
- ✅ Draggable via @dnd-kit
- ✅ 3D effect with inset shadows
- ✅ ARIA labels present
- ⚠️ **Needs**: Animation support for fade-in/fade-out

**TenRod** (`/src/frontend/src/components/blocks/TenRod.tsx`)
- ✅ Size: 200×32px (10x unit cube width)
- ✅ Color: #FF8C6B (coral)
- ✅ Shows 10 segments visually
- ✅ Draggable
- ⚠️ **Needs**: Animation support for grouping/regrouping

**HundredFlat** (exists, not read but follows same pattern)
- ✅ Expected size: 200×200px
- ✅ Expected to show 10×10 grid
- ✅ Draggable

### 1.2 Required Extensions for Game 3

#### Extension 1: Animation Props
```typescript
interface BlockAnimationProps {
  // For "more than" - fade in
  animationMode?: 'add' | 'remove' | 'static';
  onAnimationComplete?: () => void;
}
```

**Implementation Strategy**:
- Wrap blocks in Framer Motion `<motion.div>`
- Add animation variants to existing components
- Maintain existing functionality (no breaking changes)

#### Extension 2: Display-Only Mode
Game 3 needs blocks that are NOT draggable (for visual scaffold display).

**Current**: All blocks wrapped in `<Draggable>`
**Needed**: Optional `displayOnly` prop that renders without Draggable wrapper

```typescript
export interface UnitCubeProps {
  id: string;
  disabled?: boolean;
  className?: string;
  displayOnly?: boolean; // NEW
  animationMode?: 'add' | 'remove' | 'static'; // NEW
}
```

**Impact**: Low - backward compatible addition

---

## 2. Game Engine Store Analysis

### 2.1 Current Capabilities

**Reviewed**: `/src/frontend/src/game-engine/stores/gameSessionStore.ts`

**Supports**:
- ✅ Session management (start/end/pause/resume)
- ✅ Problem tracking (setProblem, completeProblem)
- ✅ Workspace management (addBlock, removeBlock, clearWorkspace)
- ✅ Attempt tracking (submitAttempt)
- ✅ Hint tracking (useHint)
- ✅ Streak tracking (correctStreak, longestStreak)

**Validation Logic**:
```typescript
isCorrect: state.workspaceValue === state.session.currentProblem.targetValue
```
This works for "Build the Number" but Game 3 doesn't use workspace blocks for answers.

### 2.2 Required Extensions

#### Extension 1: Answer Field (not blocks)
Game 3 uses number input, not block placement.

**Current**: Validates `workspaceValue` (sum of blocks)
**Needed**: Support for `answerValue` (typed number)

```typescript
interface GameSessionState {
  // Existing...
  workspace: Block[];
  workspaceValue: number;

  // NEW for Game 3
  answerValue: number | null;
  setAnswerValue: (value: number) => void;
}
```

#### Extension 2: Peek Tracking (Medium mode)
Track how many times child used "peek" to see blocks.

```typescript
interface GameSessionState {
  // NEW for Medium mode
  peeksRemaining: number;
  usePeek: () => void;
}
```

#### Extension 3: Game-Specific Metadata
Store additional data per problem type.

**Existing** `Problem`:
```typescript
interface Problem {
  id: string;
  gameId: GameId;
  targetValue: number;  // For Build/Sort
  difficulty: DifficultyMode;
  createdAt: number;
}
```

**Needed for Game 3**:
```typescript
interface MoreLessProblem extends Problem {
  gameId: 'more-less-than';
  startingNumber: number;  // "4 less than 73" → 73
  operation: 'more' | 'less';  // 'less'
  delta: number;  // 4
  // targetValue: 69 (computed)
}
```

**Implementation Strategy**: Use discriminated union types
```typescript
type Problem = BuildTheNumberProblem | SortProblem | MoreLessProblem;
```

---

## 3. Problem Generator Analysis

### 3.1 Current Capabilities

**Reviewed**: `/src/frontend/src/game-engine/problemGenerator.ts`

**Supports**:
- ✅ Pluggable generators per game (switch statement)
- ✅ Avoids recent values (anti-repetition)
- ✅ Pedagogically interesting number generation
- ✅ Batch generation for offline play

**Current Games**:
- `build-the-number`: Generates target value
- `sort-the-numbers`: Generates array of values to sort

### 3.2 Required Extensions

#### Extension 1: New Game Type
Add `'more-less-than'` to GameId union and implement generator.

```typescript
const generateMoreLessThanProblem = (options: GeneratorOptions): MoreLessProblem => {
  const { difficulty, previousProblems = [] } = options;
  const config = DIFFICULTY_CONFIGS[difficulty];

  // Select operation (50/50 more vs less)
  const operation = Math.random() < 0.5 ? 'more' : 'less';

  // Select delta based on difficulty
  const deltaRanges = {
    easy: [1, 2],
    medium: [1, 2, 3, 5, 10],
    hard: [1, 2, 3, 4, 5, 10, 20],
    challenge: [1, 5, 10, 15, 20, 25],
  };
  const delta = randomFromArray(deltaRanges[difficulty]);

  // Generate starting number (ensure result stays in valid range)
  const startingNumber = generateValidStartingNumber(
    config.minValue,
    config.maxValue,
    operation,
    delta
  );

  const targetValue = operation === 'more'
    ? startingNumber + delta
    : startingNumber - delta;

  return {
    id: generateProblemId(),
    gameId: 'more-less-than',
    startingNumber,
    operation,
    delta,
    targetValue,
    difficulty,
    createdAt: Date.now(),
  };
};
```

**Impact**: Low - follows existing pattern

---

## 4. Drag-and-Drop System Analysis

### 4.1 Current System

**Location**: `/src/frontend/src/components/dnd/`
**Library**: @dnd-kit
**Supports**:
- ✅ Touch-optimized dragging
- ✅ Accessibility (keyboard support)
- ✅ 64px touch targets (UX principles compliant)

### 4.2 Game 3 Requirements

**Interaction Pattern**: Game 3 may NOT need drag-and-drop for Hard/Challenge modes.

**Easy Mode**: Could use drag-to-add/remove blocks
**Medium Mode**: Peek (no dragging)
**Hard/Challenge**: Number input only

**Conclusion**: ✅ DnD system available if needed, but NOT required for MVP

---

## 5. New Components Required

### 5.1 VisualScaffold Component

**Purpose**: Display blocks with addition/removal animations

**Location**: `/src/frontend/src/games/more-less-than/components/VisualScaffold.tsx`

**Props**:
```typescript
interface VisualScaffoldProps {
  startingNumber: number;
  operation: 'more' | 'less';
  delta: number;
  visibility: 'always' | 'peek' | 'hint' | 'none';
  onAnimationComplete?: () => void;
}
```

**Features**:
- Decomposes number into blocks (e.g., 73 = 7 tens + 3 units)
- Animates addition (scale in, fade in)
- Animates removal (fade out, strikethrough)
- Color codes: teal (starting), coral (added), gray (removed)

**Dependencies**: UnitCube, TenRod, HundredFlat (display-only mode)

---

### 5.2 ProblemDisplay Component

**Purpose**: Shows "What is N more/less than X?" question

**Location**: `/src/frontend/src/games/more-less-than/components/ProblemDisplay.tsx`

**Props**:
```typescript
interface ProblemDisplayProps {
  problem: MoreLessProblem;
}
```

**Example Output**:
```
What is 4 less than 73?
         ^^^^^^^^
      (highlighted)
```

**Features**:
- Large, readable text (28px font)
- Highlights operation ("4 less than")
- ARIA labels for screen readers

---

### 5.3 AnswerInput Component

**Purpose**: Number input with validation feedback

**Location**: `/src/frontend/src/games/more-less-than/components/AnswerInput.tsx`

**Props**:
```typescript
interface AnswerInputProps {
  value: number | null;
  onChange: (value: number) => void;
  onSubmit: () => void;
  isCorrect?: boolean | null;
  showFeedback?: boolean;
}
```

**Features**:
- Large touch-friendly input (36px font)
- Number pad for Easy mode (1-10 buttons)
- Keyboard input for Hard/Challenge
- Visual feedback (green border = correct, warm orange = try again)

---

### 5.4 PeekButton Component (Medium Mode)

**Purpose**: Button to temporarily show blocks

**Location**: `/src/frontend/src/games/more-less-than/components/PeekButton.tsx`

**Props**:
```typescript
interface PeekButtonProps {
  remaining: number;  // Peeks remaining (e.g., 3)
  onClick: () => void;
  disabled: boolean;
}
```

**Features**:
- Shows "SHOW BLOCKS (2 left)"
- 64×64px touch target
- Disabled when peeks exhausted
- Triggers 5-second timed reveal

---

### 5.5 StrategyHints Component (Hard Mode)

**Purpose**: Display strategy suggestions

**Location**: `/src/frontend/src/games/more-less-than/components/StrategyHints.tsx`

**Props**:
```typescript
interface StrategyHintsProps {
  problem: MoreLessProblem;
}
```

**Example Output**:
```
Strategy hints:
• Count back: 73, 72, 71, 70, 69
• Use tens: 73 - 3 = 70, then 70 - 1 = 69
• Break apart: 73 = 60 + 13, so 13 - 4 = 9, then 60 + 9 = 69
```

**Features**:
- Multiple strategies shown
- Adapts to problem characteristics
- Muted styling (doesn't distract)

---

### 5.6 FeedbackDisplay Component

**Purpose**: Shows success/error feedback with progressive scaffolding

**Location**: `/src/frontend/src/components/feedback/FeedbackDisplay.tsx` (extend existing)

**Props**:
```typescript
interface FeedbackDisplayProps {
  attemptNumber: 1 | 2 | 3;
  isCorrect: boolean;
  specificHint?: string;  // e.g., "Remember, 'less than' means subtract"
}
```

**Features**:
- Attempt 1: Gentle "Try again" (warm orange)
- Attempt 2: Specific hint based on error type
- Attempt 3: Full animated solution
- No harsh red or "WRONG" text (UX principles)

---

## 6. Validation Logic Extensions

### 6.1 Error Detection System

**Purpose**: Detect common error patterns and provide specific hints

**Location**: `/src/frontend/src/games/more-less-than/utils/errorDetection.ts`

**Error Types**:
1. **Reversed Operation**: "3 more than 5" answered as 2 (did 5-3 instead of 5+3)
2. **Wrong Order**: "4 less than 7" answered as -3 (did 4-7 instead of 7-4)
3. **Counting Error**: Off by ±1
4. **Place Value Error**: "10 more than 23" answered as 24 (added to ones)
5. **Teen Number Confusion**: "3 less than 15" treated 15 as 5

**Function Signature**:
```typescript
function detectCommonError(
  problem: MoreLessProblem,
  userAnswer: number
): { type: ErrorType; hint: string } | null
```

---

## 7. Adaptive Difficulty System

### 7.1 Current System

**None** - Build the Number and Sort don't adapt within session.

### 7.2 Required for Game 3

**Purpose**: Adjust problem difficulty based on accuracy

**Location**: `/src/frontend/src/games/more-less-than/utils/adaptiveDifficulty.ts`

**Logic**:
```typescript
class AdaptiveDifficultyManager {
  selectNextDelta(accuracy: number, currentMode: DifficultyMode): number {
    if (accuracy >= 0.9) {
      return this.getHarderDelta(currentMode);
    } else if (accuracy <= 0.6) {
      return this.getEasierDelta(currentMode);
    } else {
      return this.getCurrentDelta(currentMode);
    }
  }
}
```

**Tracks**:
- Rolling 10-problem accuracy
- Error patterns (reversed operations, etc.)
- Time per problem
- Hint/peek usage

---

## 8. Testing Requirements

### 8.1 Unit Tests

**Target**: 50+ tests

**Coverage**:
- Problem generator (all difficulties): 12 tests
- Validation logic (error detection): 15 tests
- Adaptive difficulty algorithm: 8 tests
- Visual scaffold component: 10 tests
- Answer input component: 5 tests

**Total Estimated**: 50 tests

---

### 8.2 E2E Tests

**Target**: 10+ tests

**Scenarios**:
1. Easy mode: Complete problem with full blocks
2. Medium mode: Use peek functionality
3. Hard mode: Solve without visual aid
4. Challenge mode: Nested operation
5. Error progression (3 attempts)
6. Adaptive difficulty adjustment
7. Keyboard navigation
8. Screen reader announcements
9. Touch interactions (mobile)
10. Streak tracking

**Total Estimated**: 10-12 tests

---

### 8.3 UX Validation Checkpoints

**Per Phase** (UX reviewer involved):

**Phase 3 (Visual Scaffold)**:
- ✅ Animation timing feels smooth (not too fast/slow)
- ✅ Colors match existing games
- ✅ Addition animation feels additive (growing)
- ✅ Removal animation feels subtractive (shrinking/fading)

**Phase 5 (Core UI)**:
- ✅ Layout consistent with Build/Sort games
- ✅ Typography matches design system
- ✅ Touch targets ≥64px
- ✅ Responsive design (mobile + tablet)

**Phase 6 (Difficulty Features)**:
- ✅ Peek button intuitive
- ✅ Strategy hints helpful (not overwhelming)
- ✅ Number pad easy for young children (Easy mode)

**Phase 8 (Final Validation)**:
- ✅ Full accessibility audit
- ✅ Color contrast WCAG AA
- ✅ No harsh red (warm orange only)
- ✅ Celebrations match existing games

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Week 1, Days 1-2)
- ✅ Architecture validation (COMPLETE)
- Extend Problem type with MoreLessProblem
- Extend GameSessionStore with answerValue, peeksRemaining
- Add 'more-less-than' to GameId
- UX Review: Type definitions

### Phase 2: Problem Generator (Week 1, Days 3-4)
- Implement generateMoreLessThanProblem
- Add adaptive delta selection
- Write 12 unit tests
- UX Review: Problem diversity and difficulty progression

### Phase 3: Visual Scaffold (Week 1, Day 5 - Week 2, Day 1)
- Add animation props to UnitCube, TenRod
- Create VisualScaffold component
- Implement add/remove animations
- Write 10 unit tests
- UX Review: Animation timing, color usage, visual clarity

### Phase 4: Validation Logic (Week 2, Days 2-3)
- Implement error detection system
- Create validation function
- Write 15 unit tests
- UX Review: Error messages are warm and helpful

### Phase 5: Core Game UI (Week 2, Days 4-5)
- Create ProblemDisplay component
- Create AnswerInput component
- Create FeedbackDisplay component
- Integrate with GameSessionStore
- Write 5 unit tests
- UX Review: Layout, typography, touch targets, responsiveness

### Phase 6: Difficulty Features (Week 3, Days 1-2)
- Easy: Number pad
- Medium: PeekButton + timed reveal
- Hard: StrategyHints + estimation
- Challenge: Multi-step problems
- Write 8 unit tests
- UX Review: Each mode's scaffolding appropriateness

### Phase 7: Testing (Week 3, Days 3-4)
- Write 10+ E2E tests
- Run full CI/CD pipeline
- Fix any issues
- Accessibility audit
- UX Review: Complete game flows

### Phase 8: Integration (Week 3, Day 5)
- Add to navigation
- Update routing
- Verify state management
- Update documentation
- UX Review: Final approval

---

## 10. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Animation performance on tablets | Medium | Low | Test early, use CSS transforms, reduce complexity if needed |
| Complexity of Challenge mode | Medium | Medium | Implement last, defer if time-constrained |
| Peek timer UX unclear | Low | Medium | Early UX review, iterate on feedback |
| Error detection false positives | Medium | Low | Comprehensive testing, tuning thresholds |

---

## 11. Conclusion

**Status**: ✅ **APPROVED FOR IMPLEMENTATION**

**Summary**:
- Existing architecture supports Game 3 with minimal extensions
- Block components need minor animation additions
- Game engine store needs answer field and peek tracking
- Problem generator needs new game type (follows existing pattern)
- 6 new components required (all straightforward)
- Testing target: 50 unit + 10 E2E tests
- UX reviewer embedded at each phase

**Estimated Timeline**: 2-3 weeks for all 4 difficulty levels

**Recommendation**: Proceed with implementation. Architecture is sound and reusable.

---

**Approved By**: VP Engineering
**Date**: February 3, 2026
**Next Step**: Begin Phase 2 (Problem Generator Implementation)
