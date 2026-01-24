# Multiplication Race Game - Product Specification

**Game Type:** Bike Race - Multiplication Fact Fluency
**Target Audience:** K-3 students (ages 5-8)
**Learning Objective:** Master multiplication facts 0×0 through 9×9
**Version:** 1.0
**Created:** January 24, 2026

---

## Executive Summary

The Multiplication Race Game uses a bike racing metaphor to build multiplication fact fluency. Students see 10 bike lanes (one for each multiplier 0-9) and answer randomized multiplication questions. Each correct answer advances the corresponding bike one step forward. The game ends when all 10 bikes cross the finish line.

---

## Game Concept

### Core Mechanic

**10 Bike Lanes Racing Together:**
- Lane 0: Tests 0×0, 0×1, 0×2, ..., 0×9 (10 facts × 2 repetitions = 20 steps)
- Lane 1: Tests 1×0, 1×1, 1×2, ..., 1×9 (10 facts × 2 repetitions = 20 steps)
- Lane 2: Tests 2×0, 2×1, 2×2, ..., 2×9 (10 facts × 2 repetitions = 20 steps)
- ...
- Lane 9: Tests 9×0, 9×1, 9×2, ..., 9×9 (10 facts × 2 repetitions = 20 steps)

**Total:** 10 lanes × 20 steps = 200 correct answers to complete game

### Question Format

For a given lane N:
- **Question format:** N × M (where M ∈ {0,1,2,3,4,5,6,7,8,9})
- **Example (Lane 7):** "7 × 3 = ?"
- **NOT included:** M × 7 (commutative property covered by other lanes)

### Answer Input

**Multiple Choice with 4 options:**
- 1 correct answer
- 3 distractors (smart generation - see Distractor Strategy below)
- Touch targets: 120px × 64px minimum (per UX research)
- 2×2 grid layout for easy touch selection

---

## Question Selection Algorithm

### Priority System

When presenting next question:

1. **Check remaining facts per lane:**
   - Lane 0: 5/20 remaining
   - Lane 1: 12/20 remaining
   - Lane 2: 18/20 remaining
   - ...

2. **Prioritize furthest-behind lanes:**
   - Weight selection by number of steps remaining
   - Lane with most steps remaining = highest probability
   - Prevents one lane getting stuck while others finish

3. **Full randomization within selected lane:**
   - Once lane selected, randomly pick from un-mastered facts
   - Each fact must be answered correctly 2× before considered mastered

### Mastery Tracking

```typescript
interface FactMastery {
  fact: string;           // "7×3"
  correctCount: number;   // 0, 1, or 2
  mastered: boolean;      // true when correctCount === 2
}

interface LaneProgress {
  lane: number;           // 0-9
  facts: FactMastery[];   // 10 facts per lane
  stepsCompleted: number; // 0-20
  finished: boolean;      // true when stepsCompleted === 20
}
```

---

## Distractor Strategy (Multiple Choice)

Based on educational research, generate 3 distractors using:

### Strategy 1: Off-by-One Errors (50% of distractors)
For question "7 × 8 = ?", correct = 56:
- Adjacent fact result: 7×7=49 or 7×9=63
- Column shift: 6×8=48 or 8×8=64

### Strategy 2: Operand Confusion (30% of distractors)
- Addition instead: 7+8=15
- Wrong column: 7×7=49

### Strategy 3: Plausible Range (20% of distractors)
- Correct ± small offset: 56±5 (but not exactly ±1)
- Must be mathematically plausible

### Distractor Rules
- No duplicate distractors
- No distractor === correct answer
- All options within reasonable range (0-100)
- Randomize option positions (correct answer not always position A)

---

## Visual Design

### Race Track Layout

```
┌─────────────────────────────────────────────────┐
│  🏁 MULTIPLICATION RACE 🏁                      │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  Question: 7 × 8 = ?                   │    │
│  │  ┌──────────┬──────────┐              │    │
│  │  │   48     │   56 ✓   │              │    │
│  │  ├──────────┼──────────┤              │    │
│  │  │   63     │   49     │              │    │
│  │  └──────────┴──────────┘              │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  Lane 0: 🚴─────────────────🏁 20/20 ✅        │
│  Lane 1: 🚴───────────────────🏁 15/20         │
│  Lane 2: 🚴──────────────────🏁 12/20          │
│  Lane 3: 🚴─────────────────🏁 8/20            │
│  Lane 4: 🚴────────────────🏁 5/20  👈         │
│  Lane 5: 🚴───────────────────🏁 14/20         │
│  Lane 6: 🚴──────────────────🏁 11/20          │
│  Lane 7: 🚴─────────────────🏁 7/20            │
│  Lane 8: 🚴────────────────🏁 6/20             │
│  Lane 9: 🚴───────────────────🏁 13/20         │
│                                                 │
│  Score: 102/200 | Time: 3:45                   │
└─────────────────────────────────────────────────┘
```

### Lane Components

Each lane shows:
- **Bike icon:** 🚴 (animated, moves right on correct answer)
- **Progress:** "7/20" counter
- **Finish line:** 🏁
- **Visual track:** Progress bar showing position
- **Current question indicator:** 👈 (highlight active lane)

### Animation Timing

Per UX research:
- **Correct answer → bike moves:** 500ms smooth animation
- **Incorrect answer → shake:** 300ms gentle shake, stay in place
- **Finish line crossed:** 800ms celebration (confetti, sound)
- **All bikes finished:** 2000ms grand celebration

---

## Feedback System

### Correct Answer
1. ✅ Green checkmark appears on selected option
2. 🎵 Positive sound (400ms beep, 440Hz)
3. 🚴 Bike animates forward (500ms)
4. New question appears (after 600ms delay)

### Incorrect Answer
1. ❌ Red X appears on selected option
2. 🎵 Gentle "try again" sound (not harsh)
3. 💬 "Try a different answer!" message (800ms)
4. Same question remains, allow re-selection
5. Wrong answer doesn't consume a "life" - just no progress

### Bike Crosses Finish Line
1. 🎉 Confetti animation on that lane
2. 🎵 Success sound (triumph jingle)
3. ✅ Green checkmark on lane
4. Bike stays at finish line, no more questions for that lane

### All 10 Bikes Finish
1. 🎊 Grand celebration animation (full screen)
2. 🎵 Victory music (2-3 second jingle)
3. 📊 Stats screen:
   - Total time
   - Total questions answered (should be ~200, could be more if mistakes)
   - Accuracy percentage
   - Per-lane completion times
4. 🏆 Mastery badge awarded
5. "Play Again" or "Return to Menu" buttons

---

## Difficulty Modes

### Easy Mode (0-5 Lanes)
- **Lanes:** 0, 1, 2, 3, 4, 5 only (6 lanes)
- **Total steps:** 6 × 20 = 120 correct answers
- **Facts covered:** 0×n through 5×n (36 unique facts × 2 = 72 masteries)
- **Target time:** 8-12 minutes
- **Recommendation:** Kindergarten - Grade 1

### Medium Mode (0-9 Lanes) - DEFAULT
- **Lanes:** All 10 lanes (0-9)
- **Total steps:** 10 × 20 = 200 correct answers
- **Facts covered:** All 100 multiplication facts (0×0 through 9×9) × 2
- **Target time:** 12-18 minutes
- **Recommendation:** Grade 2-3

### Hard Mode (0-9 Lanes, 3× Repetitions)
- **Lanes:** All 10 lanes (0-9)
- **Total steps:** 10 × 30 = 300 correct answers
- **Facts covered:** All 100 facts × 3 repetitions
- **Target time:** 18-25 minutes
- **Recommendation:** Advanced Grade 3, review sessions

---

## Accessibility

### Screen Reader Support
- **Lane announcements:** "Lane 7, 7 steps completed out of 20"
- **Question announcements:** "Question: 7 times 8 equals what?"
- **Answer announcements:** "Option A: 48, Option B: 56, Option C: 63, Option D: 49"
- **Feedback announcements:** "Correct! Bike 7 moved forward"
- **Finish announcements:** "Lane 7 completed! 3 lanes remaining"

### Keyboard Navigation
- Tab through answer options (A, B, C, D)
- Enter/Space to select answer
- Arrow keys to navigate lanes (view progress)
- Escape to pause/menu

### Reduced Motion
- Disable bike animations (instant position change)
- Disable confetti
- Keep core feedback (checkmarks, counters)

### Color Blind Support
- Don't rely solely on color for lane differentiation
- Use icons + patterns + labels
- High contrast mode available

---

## Performance Targets

Per UX research:
- **60fps animation** on iPad Air 2+ (2014 device)
- **< 100ms** response time for answer selection
- **< 50ms** question generation time
- **< 500KB** total game bundle size (images + code)

---

## Edge Cases

### Zero and One Facts
**Include them** - pedagogically important:
- 0×n = 0 (foundational concept)
- 1×n = n (identity property)
- Easy wins build confidence at start

### Division by Zero
Not applicable (multiplication game only)

### Commutative Property
**Not explicitly taught in this game:**
- Lane 3 tests 3×7, Lane 7 tests 7×3
- Both facts practiced separately
- Understanding 3×7 = 7×3 is separate learning objective

### Student Quits Mid-Game
- **Save progress?** NO (v1.0 - games are short enough)
- **Track partial completion?** YES (for analytics)
- **Resume from pause?** YES (pause menu available)

---

## Success Metrics

### Learning Outcomes
- ✅ Student completes all 10 lanes (mastery indicator)
- ✅ Accuracy ≥ 80% on first attempt per fact
- ✅ Time per fact ≤ 5 seconds (fluency indicator)

### Engagement
- ✅ Students complete game without quitting
- ✅ Students choose to "Play Again"
- ✅ Session length ≥ 10 minutes

### Accessibility
- ✅ Keyboard-only completion possible
- ✅ Screen reader announces all critical info
- ✅ Reduced motion doesn't break game

---

## Out of Scope (v1.0)

- ❌ Timed races (no time pressure)
- ❌ Multiplayer racing
- ❌ Power-ups or special items
- ❌ Customizable bikes/avatars
- ❌ Leaderboards
- ❌ Daily challenges
- ❌ Division facts (separate game)

---

## Technical Requirements

### Data Structures

```typescript
interface MultiplicationGame {
  mode: 'easy' | 'medium' | 'hard';
  lanes: LaneProgress[];         // 6 or 10 lanes
  currentQuestion: Question | null;
  totalCorrect: number;
  totalAttempts: number;
  startTime: number;
  endTime: number | null;
  completed: boolean;
}

interface Question {
  lane: number;              // 0-9
  multiplicand: number;      // The lane number (N in N×M)
  multiplier: number;        // 0-9 (M in N×M)
  correctAnswer: number;
  options: number[];         // 4 options including correct
  correctIndex: number;      // 0-3
}

interface AnswerAttempt {
  questionId: string;
  selectedAnswer: number;
  correct: boolean;
  timestamp: number;
  responseTime: number;      // milliseconds
}
```

### Game State Machine

```
INIT → PLAYING → [CORRECT | INCORRECT] → PLAYING → COMPLETED → END
         ↓
       PAUSED → PLAYING
```

---

## References

- `/docs/research/bike-race-ux-patterns.md` - UX design patterns
- `/docs/research/learning-science-principles.md` - Pedagogical foundation
- `/docs/specs/game-mechanics.md` - Core game engine patterns
- Educational Research (pending): multiplication pedagogy specifics

---

**Document Owner:** VP of Engineering & Product
**Review Status:** Draft - Pending CTO Approval
**Next Steps:**
1. Create Division Race Game spec (parallel document)
2. Create technical architecture document
3. Assign to engineering agents for implementation
