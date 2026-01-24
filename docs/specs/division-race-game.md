# Division Race Game - Product Specification

**Game Type:** Bike Race - Division Fact Fluency
**Target Audience:** K-3 students (ages 5-8)
**Learning Objective:** Master division facts (inverse of multiplication)
**Version:** 1.0
**Created:** January 24, 2026

---

## Executive Summary

The Division Race Game mirrors the Multiplication Race mechanic but tests division fact fluency. Students see 9 bike lanes (one for each divisor 1-9, excluding 0) and answer randomized division questions. Each correct answer advances the corresponding bike one step forward. The game ends when all 9 bikes cross the finish line.

**Key Difference from Multiplication:** Only whole number division (no remainders) for K-3 appropriateness.

---

## Game Concept

### Core Mechanic

**9 Bike Lanes Racing Together** (no division by zero):

- Lane 1: Tests 0÷1, 1÷1, 2÷1, ..., 9÷1 (10 facts × 2 repetitions = 20 steps)
- Lane 2: Tests 0÷2, 2÷2, 4÷2, 6÷2, 8÷2, 10÷2, 12÷2, 14÷2, 16÷2, 18÷2 (10 even dividends × 2 = 20 steps)
- Lane 3: Tests 0÷3, 3÷3, 6÷3, 9÷3, 12÷3, 15÷3, 18÷3, 21÷3, 24÷3, 27÷3 (10 multiples of 3 × 2 = 20 steps)
- ...
- Lane 9: Tests 0÷9, 9÷9, 18÷9, 27÷9, 36÷9, 45÷9, 54÷9, 63÷9, 72÷9, 81÷9 (10 multiples of 9 × 2 = 20 steps)

**Total:** 9 lanes × 20 steps = 180 correct answers to complete game

### Question Format

For a given lane N (where N is the divisor):
- **Question format:** M ÷ N (where M is a multiple of N)
- **Example (Lane 7):** "21 ÷ 7 = ?"
- **Dividend range:** 0 to (N × 9) - covers 0 through 9 quotients
- **No remainders:** Only include dividends that are multiples of divisor

### Divisor-Specific Facts

| Lane | Divisor | Facts Tested | Example Questions |
|------|---------|--------------|-------------------|
| 1 | ÷1 | 0÷1, 1÷1, 2÷1, ..., 9÷1 | "5 ÷ 1 = ?" |
| 2 | ÷2 | 0÷2, 2÷2, 4÷2, ..., 18÷2 | "8 ÷ 2 = ?" |
| 3 | ÷3 | 0÷3, 3÷3, 6÷3, ..., 27÷3 | "12 ÷ 3 = ?" |
| 4 | ÷4 | 0÷4, 4÷4, 8÷4, ..., 36÷4 | "16 ÷ 4 = ?" |
| 5 | ÷5 | 0÷5, 5÷5, 10÷5, ..., 45÷5 | "25 ÷ 5 = ?" |
| 6 | ÷6 | 0÷6, 6÷6, 12÷6, ..., 54÷6 | "30 ÷ 6 = ?" |
| 7 | ÷7 | 0÷7, 7÷7, 14÷7, ..., 63÷7 | "35 ÷ 7 = ?" |
| 8 | ÷8 | 0÷8, 8÷8, 16÷8, ..., 72÷8 | "40 ÷ 8 = ?" |
| 9 | ÷9 | 0÷9, 9÷9, 18÷9, ..., 81÷9 | "54 ÷ 9 = ?" |

**Total Unique Facts:** 90 facts (10 facts per lane × 9 lanes)
**Total Required Correct Answers:** 180 (each fact answered correctly 2×)

### Answer Input

**Multiple Choice with 4 options:**
- 1 correct answer
- 3 distractors (see Distractor Strategy below)
- Touch targets: 120px × 64px minimum
- 2×2 grid layout

---

## Question Selection Algorithm

### Priority System

Identical to multiplication game:

1. **Check remaining facts per lane**
2. **Prioritize furthest-behind lanes**
3. **Full randomization within selected lane**
4. **Each fact must be answered correctly 2× before mastered**

### Mastery Tracking

```typescript
interface DivisionFactMastery {
  fact: string;           // "21÷7"
  dividend: number;       // 21
  divisor: number;        // 7
  quotient: number;       // 3
  correctCount: number;   // 0, 1, or 2
  mastered: boolean;      // true when correctCount === 2
}

interface DivisionLaneProgress {
  lane: number;           // 1-9 (divisor)
  facts: DivisionFactMastery[];  // 10 facts per lane
  stepsCompleted: number; // 0-20
  finished: boolean;
}
```

---

## Distractor Strategy

Division-specific distractor generation:

### Strategy 1: Off-by-One Quotient (50% of distractors)
For question "21 ÷ 7 = ?", correct = 3:
- Adjacent quotient: 2 or 4
- Corresponds to adjacent dividend: (21-7)÷7=2 or (21+7)÷7=4

### Strategy 2: Related Facts Confusion (30% of distractors)
- Multiplication confusion: Show dividend (21) or divisor (7)
- Related division: 21÷3=7 (swapped divisor/quotient)

### Strategy 3: Plausible Range (20% of distractors)
- Quotient ± small offset: 3±2 (but not ±1, which is Strategy 1)
- Must be within 0-9 range (quotient cannot exceed 9)

### Distractor Rules
- No duplicate distractors
- No distractor === correct answer
- All options within 0-10 range
- Randomize option positions

---

## Visual Design

### Race Track Layout

```
┌─────────────────────────────────────────────────┐
│  🏁 DIVISION RACE 🏁                            │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │  Question: 21 ÷ 7 = ?                  │    │
│  │  ┌──────────┬──────────┐              │    │
│  │  │    2     │    3 ✓   │              │    │
│  │  ├──────────┼──────────┤              │    │
│  │  │    7     │    4     │              │    │
│  │  └──────────┴──────────┘              │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  Lane ÷1: 🚴─────────────────🏁 20/20 ✅       │
│  Lane ÷2: 🚴───────────────────🏁 15/20        │
│  Lane ÷3: 🚴──────────────────🏁 12/20         │
│  Lane ÷4: 🚴─────────────────🏁 8/20           │
│  Lane ÷5: 🚴────────────────🏁 5/20            │
│  Lane ÷6: 🚴───────────────────🏁 14/20        │
│  Lane ÷7: 🚴──────────────────🏁 11/20  👈     │
│  Lane ÷8: 🚴────────────────🏁 6/20            │
│  Lane ÷9: 🚴───────────────────🏁 13/20        │
│                                                 │
│  Score: 96/180 | Time: 3:20                    │
└─────────────────────────────────────────────────┘
```

### Lane Labels

Each lane shows divisor:
- **Lane ÷1** (not "Lane 1" - clarity for division)
- **Lane ÷2**
- **Lane ÷3**
- ... etc.

All other visual elements identical to multiplication game.

---

## Feedback System

Identical to multiplication game:
- ✅ Correct: checkmark, sound, bike advances
- ❌ Incorrect: X, gentle sound, no progress, try again
- 🎉 Lane finish: celebration for that lane
- 🎊 All lanes finish: grand celebration + stats

---

## Difficulty Modes

### Easy Mode (÷1 through ÷5 Lanes)
- **Lanes:** 1, 2, 3, 4, 5 only (5 lanes)
- **Total steps:** 5 × 20 = 100 correct answers
- **Facts covered:** Division by 1-5 (50 unique facts × 2)
- **Target time:** 6-10 minutes
- **Recommendation:** Grade 2 (after multiplication ÷1-÷5 mastered)

### Medium Mode (÷1 through ÷9 Lanes) - DEFAULT
- **Lanes:** All 9 lanes
- **Total steps:** 9 × 20 = 180 correct answers
- **Facts covered:** All 90 division facts × 2
- **Target time:** 10-16 minutes
- **Recommendation:** Grade 3

### Hard Mode (÷1 through ÷9, 3× Repetitions)
- **Lanes:** All 9 lanes
- **Total steps:** 9 × 30 = 270 correct answers
- **Facts covered:** All 90 facts × 3 repetitions
- **Target time:** 15-22 minutes
- **Recommendation:** Advanced Grade 3, review sessions

---

## Pedagogical Rationale

### Why No Division by Zero?

**Mathematical:** Division by zero is undefined (0 cannot be a divisor)
**Pedagogical:** K-3 students should not encounter this edge case
**Solution:** No "Lane ÷0" - start lanes at ÷1

### Why Only Whole Number Division?

**Developmentally Appropriate:** K-3 students focus on fact fluency, not remainder concepts
**Builds Foundation:** Master whole number division before introducing remainders (Grade 4+)
**Inverse Relationship:** Reinforces multiplication-division connection (7×3=21, 21÷7=3)

### Why Include 0 ÷ N = 0?

**Foundational Concept:** Understanding that zero divided by any number is zero
**Pattern Recognition:** Complements 0×N=0 from multiplication game
**Confidence Building:** Easy wins at the start of each lane

---

## Relationship to Multiplication Game

### Prerequisite
Students should master **Multiplication Race** before attempting **Division Race**:
- Division is the inverse operation of multiplication
- Knowing 7×3=21 helps solve 21÷7=?
- Recommendation: Require medium multiplication completion before unlocking division

### Fact Families
Each division fact corresponds to a multiplication fact:
- **Multiplication:** 7 × 3 = 21
- **Division:** 21 ÷ 7 = 3
- **Alternative division:** 21 ÷ 3 = 7

This reinforces the inverse relationship without explicitly teaching it.

---

## Accessibility

Identical to multiplication game:
- ✅ Screen reader support
- ✅ Keyboard navigation
- ✅ Reduced motion mode
- ✅ Color-blind safe

---

## Performance Targets

Identical to multiplication game:
- 60fps animation on iPad Air 2+
- <100ms answer selection response
- <50ms question generation
- <500KB bundle size

---

## Edge Cases

### Zero Divided by N
**Include:** 0÷1=0, 0÷2=0, ..., 0÷9=0
- Pedagogically important concept
- Easy wins build confidence

### N Divided by N
**Include:** 1÷1=1, 2÷2=1, ..., 9÷9=1
- Foundational concept (any number divided by itself is 1)
- Pattern recognition

### Division Resulting in 0
**Include:** Only 0÷N facts
- No other division facts result in quotient 0 (since we exclude remainders)

### Large Dividends
**Maximum dividend:** 81 (for 81÷9=9)
- All dividends fit within K-3 number sense (0-81)
- Manageable for mental math

---

## Success Metrics

Identical to multiplication game:
- ✅ Student completes all 9 lanes
- ✅ Accuracy ≥ 80% on first attempt per fact
- ✅ Time per fact ≤ 5 seconds
- ✅ Students complete without quitting
- ✅ Students choose "Play Again"

---

## Out of Scope (v1.0)

- ❌ Division with remainders
- ❌ Division by decimals/fractions
- ❌ Long division algorithm
- ❌ Division by 0 (mathematically invalid)
- ❌ Timed races, multiplayer, power-ups (same as multiplication)

---

## Technical Requirements

### Data Structures

```typescript
interface DivisionGame {
  mode: 'easy' | 'medium' | 'hard';
  lanes: DivisionLaneProgress[];  // 5 or 9 lanes
  currentQuestion: DivisionQuestion | null;
  totalCorrect: number;
  totalAttempts: number;
  startTime: number;
  endTime: number | null;
  completed: boolean;
}

interface DivisionQuestion {
  lane: number;              // 1-9 (divisor)
  dividend: number;          // Must be multiple of divisor
  divisor: number;           // 1-9 (the lane number)
  correctAnswer: number;     // Quotient (0-9)
  options: number[];         // 4 options including correct
  correctIndex: number;      // 0-3
}
```

### Dividend Generation

```typescript
function generateDividendsForLane(divisor: number): number[] {
  // For divisor N, generate N×0, N×1, N×2, ..., N×9
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => n * divisor);
}

// Examples:
// divisor=7: [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]
// divisor=3: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27]
```

---

## Game State Machine

Identical to multiplication game:
```
INIT → PLAYING → [CORRECT | INCORRECT] → PLAYING → COMPLETED → END
         ↓
       PAUSED → PLAYING
```

---

## References

- `/docs/research/bike-race-ux-patterns.md` - UX design patterns
- `/docs/research/learning-science-principles.md` - Pedagogical foundation
- `/docs/specs/multiplication-race-game.md` - Parallel multiplication game spec
- `/docs/specs/game-mechanics.md` - Core game engine patterns

---

**Document Owner:** VP of Engineering & Product
**Review Status:** Draft - Pending CTO Approval
**Next Steps:**
1. Create technical architecture document
2. Assign to engineering agents for implementation (parallel with multiplication)
3. Ensure division game unlocks AFTER multiplication medium mode completion
