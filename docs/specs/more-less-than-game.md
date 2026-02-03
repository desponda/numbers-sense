# More Than / Less Than Game Specification

**Version:** 1.0
**Game ID:** `more-less-than`
**Target Audience:** Kindergarten through 3rd Grade (Ages 5-8)
**Document Type:** Technical Specification for Development

---

## Table of Contents

1. [Game Overview](#1-game-overview)
2. [Core Learning Objectives](#2-core-learning-objectives)
3. [Game Mechanic](#3-game-mechanic)
4. [Difficulty Levels](#4-difficulty-levels)
5. [Visual Design Guidelines](#5-visual-design-guidelines)
6. [Validation Logic](#6-validation-logic)
7. [Technical Implementation](#7-technical-implementation)
8. [References](#8-references)

---

## 1. Game Overview

### 1.1 Concept

"More Than / Less Than" helps children develop relational number sense by understanding numbers in context of addition and subtraction operations. Instead of asking "What is 73 - 4?", the game asks "What is 4 less than 73?" - building the critical skill of understanding relative magnitude through visual and symbolic representations.

### 1.2 Educational Context

**Research Foundation:**
- **Relational Thinking** (Stephens et al., 2017): Understanding relationships between quantities is more powerful than procedural calculation
- **Part-Whole Understanding** (Carpenter et al., 1997): "More than" and "less than" develop part-whole reasoning essential for flexible arithmetic
- **Mental Math Strategies** (Van de Walle et al., 2018): Visualizing change to a quantity supports mental computation
- **Concrete-Representational-Abstract Progression** (Bruner, 1966): Visual scaffolds bridge to symbolic understanding

**Common Challenges:**
- Children struggle with language: "4 less than 73" often gets interpreted as "4 - 73" or "73 - 4" without understanding
- Larger numbers make visualization difficult
- Directional confusion: "more than" vs. "less than" reverses the operation direction in their minds
- Teen numbers (13-19) create additional cognitive load with irregular naming

### 1.3 How This Game Differs

Unlike traditional arithmetic drills, this game:
- **Emphasizes visualization** before calculation
- **Builds from concrete to abstract** through progressive scaffolding
- **Connects to existing knowledge** by reusing base-10 blocks from "Build the Number"
- **Develops language understanding** of relational terms
- **Supports mental math** through structured decomposition

---

## 2. Core Learning Objectives

### 2.1 Primary Learning Goals

| Objective | Description | Assessment Method |
|-----------|-------------|-------------------|
| **Relational Understanding** | Interpret "N more/less than X" correctly | Accuracy on word problems |
| **Mental Visualization** | Picture adding/removing quantities | Success rate without visual blocks |
| **Part-Whole Reasoning** | Understand that numbers change in relation to operations | Explain-your-thinking prompts |
| **Flexible Calculation** | Choose efficient strategies (count on, use tens, etc.) | Strategy variety tracking |

### 2.2 Secondary Learning Goals

- Reinforce place value understanding (adding/subtracting tens vs. ones)
- Strengthen number bonds and decomposition skills
- Build confidence with larger numbers through scaffolded support
- Develop estimation skills ("About how much?")

### 2.3 Progression Through Difficulty Levels

```
Easy Mode → Medium Mode → Hard Mode → Challenge Mode
   ↓            ↓              ↓             ↓
Visual      Partial Visual   Minimal      Symbolic Only
Scaffolding   Scaffolding    Scaffolding   + Complex
Small #s     Medium #s       Large #s      Multi-step
±1, ±2       ±5, ±10         ±10, ±20      Mixed ops
```

---

## 3. Game Mechanic

### 3.1 Core Gameplay Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  MORE THAN / LESS THAN GAME                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PHASE 1: PROBLEM PRESENTATION                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Question:  What is 4 less than 7?                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  PHASE 2: VISUAL SCAFFOLD (difficulty-dependent)                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Starting Number: 7                                      │   │
│  │                                                          │   │
│  │  [Visual representation of 7 blocks]                     │   │
│  │  □ □ □ □ □ □ □                                          │   │
│  │                                                          │   │
│  │  Remove 4 blocks:                                        │   │
│  │  [Interactive removal - blocks fade or drag away]        │   │
│  │                                                          │   │
│  │  Result: ?                                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  PHASE 3: ANSWER INPUT                                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Your answer:  [  3  ]                                   │   │
│  │                                                          │   │
│  │  [ CHECK ANSWER ]                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  PHASE 4: FEEDBACK                                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ✓ Correct! 7 - 4 = 3                                   │   │
│  │                                                          │   │
│  │  4 less than 7 is 3                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Interaction Modes

The game supports **three interaction modes** depending on difficulty:

#### Mode A: Guided Manipulation (Easy)
- Visual blocks are displayed for starting number
- Child physically manipulates blocks (add or remove)
- Live counter shows current total
- Answer is revealed through manipulation
- Child enters answer to confirm understanding

#### Mode B: Scaffolded Visualization (Medium)
- Blocks shown but semi-transparent
- Child can "peek" to see blocks (limited times)
- Emphasis shifts to mental visualization
- Blocks fade after peek timeout
- Encourages transition to symbolic thinking

#### Mode C: Mental Calculation (Hard/Challenge)
- Blocks not shown unless child requests hint
- Emphasis on mental math and number sense
- Optional number line for estimation
- Strategy prompts: "Can you count on?" "Can you use tens?"

### 3.3 Problem Types

| Type | Example | Difficulty | Purpose |
|------|---------|-----------|---------|
| **Simple More** | "3 more than 5" | Easy | Basic addition context |
| **Simple Less** | "2 less than 8" | Easy | Basic subtraction context |
| **Crossing 10** | "6 more than 7" | Medium | Decomposition to 10 |
| **Using Tens** | "10 more than 23" | Medium | Place value reinforcement |
| **Teen Numbers** | "3 less than 15" | Medium | Address irregular naming |
| **Large Numbers** | "4 less than 73" | Hard | Parent use case |
| **Multi-step** | "5 more than (3 less than 12)" | Challenge | Nested operations |

---

## 4. Difficulty Levels

### 4.1 EASY Mode: Building Foundation (K-1)

**Configuration:**
```javascript
const EASY_CONFIG = {
  numberRange: { min: 1, max: 10 },
  operations: [
    { type: 'more', delta: [1, 2] },  // "1 more" or "2 more"
    { type: 'less', delta: [1, 2] }   // "1 less" or "2 less"
  ],
  visualSupport: 'full_blocks_always_shown',
  answerInput: 'number_pad',
  hintsEnabled: true,
  hintDelay: 15000,  // 15 seconds
  problemsPerSession: 10,
  successThreshold: 0.80
};
```

**Visual Presentation:**
```
┌──────────────────────────────────────────────────────────────┐
│  What is 2 more than 5?                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Start with 5:                                               │
│  ┌────────────────────────────────┐                          │
│  │  □ □ □ □ □                     │                          │
│  └────────────────────────────────┘                          │
│                                                              │
│  Add 2 more:                                                 │
│  ┌────────────────────────────────┐                          │
│  │  □ □ □ □ □  +  □ □             │  ← animated addition    │
│  │     5           2               │                          │
│  └────────────────────────────────┘                          │
│                                                              │
│  Count them all:  □ □ □ □ □ □ □                            │
│                                                              │
│  Your answer: [ __ ]                                         │
│                                                              │
│  [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]                              │
│  [ 6 ] [ 7 ] [ 8 ] [ 9 ] [ 10 ]    ← number pad            │
│                                                              │
│            [ CHECK ANSWER ]                                  │
└──────────────────────────────────────────────────────────────┘
```

**Learning Scaffolds:**
- All blocks visible at all times
- Animated addition/removal of blocks
- Color coding: starting blocks in teal, added blocks in coral
- Number pad for easy input (no keyboard required)
- Verbal reinforcement: "5 plus 2 equals 7. So 2 more than 5 is 7!"

**Problem Generation Rules:**
- Equal mix of "more than" and "less than"
- Never results in negative numbers or zero (stay positive)
- Never exceeds 10 (single-digit results only)
- Ensures variety: no repeating same problem in a session

### 4.2 MEDIUM Mode: Bridging to Teens (Grade 1-2)

**Configuration:**
```javascript
const MEDIUM_CONFIG = {
  numberRange: { min: 5, max: 30 },
  operations: [
    { type: 'more', delta: [1, 2, 3, 5, 10] },
    { type: 'less', delta: [1, 2, 3, 5, 10] }
  ],
  visualSupport: 'peek_available',
  peekLimit: 3,  // Can view blocks 3 times
  peekDuration: 5000,  // Blocks visible for 5 seconds
  answerInput: 'keyboard_and_pad',
  includeTeenNumbers: true,
  includePlaceValue: true,  // "10 more" problems
  hintsEnabled: true,
  hintDelay: 20000,
  problemsPerSession: 12,
  successThreshold: 0.80
};
```

**Visual Presentation:**
```
┌──────────────────────────────────────────────────────────────┐
│  What is 10 more than 14?                                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Think about it:                                             │
│  14 = [10] + [4]      ← place value hint                    │
│                                                              │
│  Add 10:                                                     │
│  [10] + [10] + [4]                                           │
│                                                              │
│  ┌────────────────┐                                          │
│  │  Need help?    │                                          │
│  │  [ SHOW BLOCKS ] (2 peeks left)                          │
│  └────────────────┘                                          │
│                                                              │
│  Your answer: [ 24 ]                                         │
│                                                              │
│            [ CHECK ANSWER ]                                  │
└──────────────────────────────────────────────────────────────┘

After clicking "SHOW BLOCKS":
┌──────────────────────────────────────────────────────────────┐
│  14 looks like this:                                         │
│  ┌────────────────────────────────────────────┐              │
│  │  ████████████████████  (1 ten-rod)         │              │
│  │  □ □ □ □               (4 units)           │              │
│  └────────────────────────────────────────────┘              │
│                                                              │
│  Add 10 more:                                                │
│  ┌────────────────────────────────────────────┐              │
│  │  ████████████████████  (first ten)         │              │
│  │  ████████████████████  (added ten) ✨       │              │
│  │  □ □ □ □               (4 units)           │              │
│  └────────────────────────────────────────────┘              │
│                                                              │
│  Blocks will disappear in: 5... 4... 3...                    │
└──────────────────────────────────────────────────────────────┘
```

**Learning Scaffolds:**
- Peek functionality transitions child toward mental visualization
- Place value decomposition shown for teen/two-digit numbers
- Strategic hints: "Adding 10 is easy - just change the tens place!"
- Animated tens addition reinforces place value
- Timer on peek creates productive urgency

**Problem Generation Rules:**
- 40% "more than", 40% "less than", 20% mixed
- Include "crossing 10" problems (e.g., 7 + 5)
- Include "easy tens" problems (e.g., 23 + 10)
- Balance teen numbers and two-digit numbers
- Introduce benchmark comparisons (e.g., relate to 10, 20)

**Special Problem Types:**
- **Crossing 10:** "8 more than 6" = 14 (requires decomposition)
- **Adding/Subtracting Tens:** "10 more than 23" = 33 (place value focus)
- **Teen Number Practice:** "3 less than 17" = 14 (addresses naming challenge)

### 4.3 HARD Mode: Mental Math Mastery (Grade 2-3)

**Configuration:**
```javascript
const HARD_CONFIG = {
  numberRange: { min: 10, max: 100 },
  operations: [
    { type: 'more', delta: [1, 2, 3, 4, 5, 10, 20] },
    { type: 'less', delta: [1, 2, 3, 4, 5, 10, 20] }
  ],
  visualSupport: 'hint_only',  // Only shown if child requests hint
  answerInput: 'keyboard',
  includeEstimation: true,
  strategyPrompts: true,  // "Can you use place value?"
  hintsEnabled: true,
  hintDelay: 25000,
  problemsPerSession: 15,
  successThreshold: 0.85,
  trackStrategies: true  // Log which strategies child uses
};
```

**Visual Presentation:**
```
┌──────────────────────────────────────────────────────────────┐
│  What is 4 less than 73?                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Think: 73 - 4 = ?                                           │
│                                                              │
│  Strategy hint:                                              │
│  • Count back: 73, 72, 71, 70, 69                           │
│  • Use tens: 73 - 3 = 70, then 70 - 1 = 69                  │
│  • Break apart: 73 = 70 + 3, so 70 + (3-4) won't work...    │
│                73 = 60 + 13, so 60 + (13-4) = 60 + 9 = 69   │
│                                                              │
│  ┌────────────────┐                                          │
│  │ Need blocks?   │                                          │
│  │ [ SHOW HINT ]  │                                          │
│  └────────────────┘                                          │
│                                                              │
│  Your answer: [ __ ]                                         │
│                                                              │
│  First, estimate: About [ 70 ]  (optional pre-step)         │
│  Then calculate: [ 69 ]                                      │
│                                                              │
│            [ CHECK ANSWER ]                                  │
└──────────────────────────────────────────────────────────────┘
```

**Learning Scaffolds:**
- Strategy suggestions based on number properties
- Optional estimation step to build number sense
- Hints available but discouraged through UI design
- Verbal praise for efficient strategies
- Number line overlay option for visualization

**Problem Generation Rules:**
- Focus on two-digit numbers (20-99)
- Include "parent use case" problems (large - small)
- Mix easy (±10, ±20) and hard (±4, ±7)
- Include decade boundary crossings (e.g., 52 - 5 = 47)
- Adaptive difficulty: if child struggles, reduce delta; if mastery, increase delta

**Advanced Features:**
- **Strategy Tracking:** System detects counting vs. place value strategies
- **Estimation Accuracy:** Rewards close estimates even if exact answer is wrong
- **Decade Crossing:** Special feedback for problems like 42 - 7 = 35

### 4.4 CHALLENGE Mode: Complex Relational Thinking (Grade 3+)

**Configuration:**
```javascript
const CHALLENGE_CONFIG = {
  numberRange: { min: 1, max: 100 },
  operations: [
    { type: 'more', delta: [1, 2, 3, 5, 10, 15, 20, 25] },
    { type: 'less', delta: [1, 2, 3, 5, 10, 15, 20, 25] },
    { type: 'nested', depth: 2 }  // Multi-step problems
  ],
  visualSupport: 'none',
  problemTypes: [
    'comparison',      // "Which is more: 5 more than 10, or 3 less than 20?"
    'reverse',         // "73 is 4 less than what number?"
    'nested',          // "5 more than (3 less than 12)"
    'word_problem',    // "Emma had 23 stickers. She got 7 more. How many now?"
    'missing_info'     // "__ more than 15 is 22"
  ],
  answerInput: 'keyboard',
  hintsEnabled: true,
  hintDelay: 30000,
  problemsPerSession: 12,
  successThreshold: 0.80,
  creativityBonus: true  // Multiple valid solution paths
};
```

**Problem Types:**

#### Type 1: Reverse Problems
```
┌──────────────────────────────────────────────────────────────┐
│  73 is 4 less than what number?                              │
├──────────────────────────────────────────────────────────────┤
│  Think backwards:                                            │
│  If 73 is 4 LESS than ?, then ? is 4 MORE than 73           │
│                                                              │
│  ? = 73 + 4 = 77                                             │
│                                                              │
│  Your answer: [ 77 ]                                         │
│                                                              │
│  Check: 4 less than 77 = 73 ✓                               │
└──────────────────────────────────────────────────────────────┘
```

#### Type 2: Nested Operations
```
┌──────────────────────────────────────────────────────────────┐
│  What is 5 more than (3 less than 12)?                       │
├──────────────────────────────────────────────────────────────┤
│  Step 1: Solve the inside first                              │
│  3 less than 12 = 12 - 3 = 9                                 │
│                                                              │
│  Step 2: Use that result                                     │
│  5 more than 9 = 9 + 5 = 14                                  │
│                                                              │
│  ┌─────────────────────────────────┐                         │
│  │  Step 1: [ 9  ] ✓ Correct!     │                         │
│  │  Step 2: [ 14 ] (final answer) │                         │
│  └─────────────────────────────────┘                         │
│                                                              │
│            [ CHECK ANSWER ]                                  │
└──────────────────────────────────────────────────────────────┘
```

#### Type 3: Comparison Problems
```
┌──────────────────────────────────────────────────────────────┐
│  Which is greater?                                           │
│                                                              │
│  A) 5 more than 10                                           │
│  B) 3 less than 20                                           │
├──────────────────────────────────────────────────────────────┤
│  Calculate both:                                             │
│  A) 10 + 5 = [ 15 ]                                          │
│  B) 20 - 3 = [ 17 ]                                          │
│                                                              │
│  Which is greater?                                           │
│  ○ A (5 more than 10)                                        │
│  ● B (3 less than 20)  ✓                                     │
│                                                              │
│            [ CHECK ANSWER ]                                  │
└──────────────────────────────────────────────────────────────┘
```

#### Type 4: Missing Information
```
┌──────────────────────────────────────────────────────────────┐
│  Fill in the blank:                                          │
│                                                              │
│  ___ more than 15 is 22                                      │
├──────────────────────────────────────────────────────────────┤
│  Think: 15 + ? = 22                                          │
│         ? = 22 - 15                                          │
│         ? = 7                                                │
│                                                              │
│  Your answer: [ 7 ]                                          │
│                                                              │
│  Check: 7 more than 15 = 15 + 7 = 22 ✓                      │
└──────────────────────────────────────────────────────────────┘
```

**Learning Scaffolds:**
- Multi-step problems broken into explicit steps
- Reverse thinking prompted with scaffolded reasoning
- Comparison problems teach evaluation skills
- Word problems connect to real-world contexts
- Allow multiple solution strategies

**Problem Generation Rules:**
- 40% standard (single-step more/less)
- 30% reverse problems (builds algebraic thinking)
- 20% nested/multi-step
- 10% comparison and missing info
- Adaptive selection based on mastery

---

## 5. Visual Design Guidelines

### 5.1 Block Representation (Reusing Existing Components)

**From Build the Number game:**
- `<UnitCube />` - Teal (#4ECDC4), 48×48px
- `<TenRod />` - Coral Red (#FF6B6B), 480×48px
- `<HundredFlat />` - Mint Green (#95E1D3), 480×480px

**Animation States:**

```javascript
// Addition animation
const addBlocksAnimation = {
  initial: { scale: 0, opacity: 0, y: -20 },
  animate: { scale: 1, opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

// Removal animation
const removeBlocksAnimation = {
  initial: { scale: 1, opacity: 1 },
  animate: { scale: 0.8, opacity: 0, y: 20 },
  exit: { scale: 0, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeIn' }
};

// Peek reveal animation
const peekAnimation = {
  initial: { opacity: 0, filter: 'blur(8px)' },
  animate: { opacity: 0.7, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(8px)' },
  transition: { duration: 0.5 }
};
```

### 5.2 Color Coding System

| Element | Color | Purpose |
|---------|-------|---------|
| **Starting blocks** | Teal (#4ECDC4) | Original quantity |
| **Added blocks** | Coral (#FF6B6B) | "More than" operation |
| **Removed blocks** | Gray + strikethrough | "Less than" operation |
| **Result highlight** | Mint (#95E1D3) | Final answer area |
| **Peek blocks** | 50% opacity | Semi-transparent scaffolding |

### 5.3 Typography & Layout

```css
.problem-text {
  font-size: 28px;          /* Large, readable for ages 5-8 */
  font-weight: 600;
  color: #2D3748;           /* Dark gray, high contrast */
  line-height: 1.4;
  text-align: center;
  margin-bottom: 24px;
}

.operation-highlight {
  color: #E53E3E;           /* Red for emphasis */
  font-weight: 700;
  text-decoration: underline;
}

.answer-input {
  font-size: 36px;          /* Extra large for input */
  font-family: 'SF Mono', monospace;
  border: 3px solid #4ECDC4;
  border-radius: 12px;
  padding: 16px 24px;
  text-align: center;
  min-width: 120px;
}

.strategy-hint {
  font-size: 16px;
  font-style: italic;
  color: #718096;           /* Muted gray */
  background: #F7FAFC;      /* Light background */
  padding: 12px;
  border-left: 4px solid #4ECDC4;
  margin-top: 16px;
}
```

### 5.4 Responsive Layout (Tablet-First)

```
┌─────────────────────────────────────────────┐
│  iPad (1024×768) - Primary Target            │
├─────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐   │
│  │  Problem Text (28px, centered)       │   │
│  │  "What is 4 less than 73?"           │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  Visual Area (600×400)               │   │
│  │  [Blocks / Peek / Empty]             │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  Answer Input (centered, 36px)       │   │
│  │  Your answer: [  69  ]               │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  [ CHECK ANSWER ] (64×64 touch)      │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 5.5 Accessibility Features

**WCAG AA Compliance:**
- Contrast ratio ≥ 4.5:1 for text
- Touch targets ≥ 64×64px
- Keyboard navigation support
- Screen reader announcements

**Screen Reader Support:**
```javascript
const ariaLabels = {
  problem: "Question: What is 4 less than 73?",
  visualArea: "Visual representation showing 73 blocks with 4 highlighted for removal",
  answerInput: "Answer input field, currently empty",
  checkButton: "Check answer button",
  feedback: "Feedback: Correct! 4 less than 73 is 69"
};
```

---

## 6. Validation Logic

### 6.1 Answer Validation Algorithm

```typescript
/**
 * Validates answer for "more/less than" problems
 */
interface MoreLessProblem {
  startingNumber: number;
  operation: 'more' | 'less';
  delta: number;
  correctAnswer: number;
}

function validateAnswer(
  problem: MoreLessProblem,
  userAnswer: number
): ValidationResult {
  const { startingNumber, operation, delta, correctAnswer } = problem;

  const isCorrect = userAnswer === correctAnswer;

  // Check for common errors
  const commonErrors = detectCommonErrors(problem, userAnswer);

  return {
    isCorrect,
    correctAnswer,
    userAnswer,
    feedback: generateFeedback(isCorrect, commonErrors, problem),
    encouragement: selectEncouragement(isCorrect),
    showWorkingSolution: !isCorrect
  };
}

/**
 * Detects common error patterns
 */
function detectCommonErrors(
  problem: MoreLessProblem,
  userAnswer: number
): CommonError | null {
  const { startingNumber, operation, delta } = problem;

  // Error 1: Reversed operation
  const reversedAnswer = operation === 'more'
    ? startingNumber - delta
    : startingNumber + delta;
  if (userAnswer === reversedAnswer) {
    return {
      type: 'reversed_operation',
      hint: `Check if the problem says "more than" or "less than"`
    };
  }

  // Error 2: Used wrong starting number
  if (userAnswer === delta + (operation === 'more' ? 0 : -delta)) {
    return {
      type: 'wrong_starting_number',
      hint: `Start with ${startingNumber}, not ${delta}`
    };
  }

  // Error 3: Off by one (counting error)
  if (Math.abs(userAnswer - problem.correctAnswer) === 1) {
    return {
      type: 'counting_error',
      hint: `You're very close! Count carefully.`
    };
  }

  // Error 4: Place value error (teen numbers)
  if (startingNumber >= 10 && startingNumber <= 19) {
    const placeValueError = checkTeenNumberError(problem, userAnswer);
    if (placeValueError) return placeValueError;
  }

  return null;
}

/**
 * Generates specific feedback based on error type
 */
function generateFeedback(
  isCorrect: boolean,
  error: CommonError | null,
  problem: MoreLessProblem
): FeedbackMessage {
  if (isCorrect) {
    return {
      type: 'success',
      message: `Correct! ${problem.delta} ${problem.operation} than ${problem.startingNumber} is ${problem.correctAnswer}.`,
      visual: 'checkmark_animation',
      audio: 'success_chime'
    };
  }

  if (error) {
    return {
      type: 'hint',
      message: error.hint,
      visual: 'gentle_shake',
      audio: 'try_again_tone',
      showCorrectPath: true
    };
  }

  return {
    type: 'incorrect',
    message: `Not quite. Let's think about it together.`,
    visual: 'thinking_prompt',
    audio: 'try_again_tone',
    showWorkingSolution: true
  };
}
```

### 6.2 Adaptive Difficulty Algorithm

```typescript
/**
 * Adjusts difficulty based on performance
 */
class AdaptiveDifficultyManager {
  private recentAccuracy: number[] = [];

  selectNextProblem(
    currentDifficulty: DifficultyMode,
    history: ProblemResult[]
  ): MoreLessProblem {
    // Calculate rolling accuracy (last 10 problems)
    const recent = history.slice(-10);
    const accuracy = recent.filter(r => r.correct).length / recent.length;

    // Adjust delta (operation size) based on performance
    let deltaRange: number[];

    if (accuracy >= 0.9) {
      // Excellent: increase challenge
      deltaRange = this.getHarderDeltas(currentDifficulty);
    } else if (accuracy <= 0.6) {
      // Struggling: simplify
      deltaRange = this.getEasierDeltas(currentDifficulty);
    } else {
      // Steady: maintain current level
      deltaRange = this.getCurrentDeltas(currentDifficulty);
    }

    // Generate problem with appropriate delta
    return this.generateProblem(currentDifficulty, deltaRange);
  }

  private getHarderDeltas(mode: DifficultyMode): number[] {
    const deltaProgression = {
      easy: [2, 3],           // Progress from ±1 to ±2,3
      medium: [5, 10, 15],    // Introduce larger jumps
      hard: [10, 20, 25],     // Larger two-digit operations
      challenge: [15, 20, 25] // Complex multi-step
    };
    return deltaProgression[mode];
  }

  private getEasierDeltas(mode: DifficultyMode): number[] {
    const deltaRegression = {
      easy: [1],              // Back to ±1
      medium: [1, 2, 5],      // Simpler operations
      hard: [5, 10],          // Reduce to easier tens
      challenge: [10]         // Single-step only
    };
    return deltaRegression[mode];
  }
}
```

### 6.3 Estimation Validation (Hard/Challenge Mode)

```typescript
/**
 * Validates estimation attempts
 * Rewards reasonable estimates even if not exact
 */
function validateEstimation(
  problem: MoreLessProblem,
  estimate: number
): EstimationResult {
  const { correctAnswer } = problem;
  const difference = Math.abs(estimate - correctAnswer);
  const percentError = (difference / correctAnswer) * 100;

  let quality: 'excellent' | 'good' | 'fair' | 'poor';

  if (percentError <= 5) {
    quality = 'excellent';  // Within 5%
  } else if (percentError <= 10) {
    quality = 'good';       // Within 10%
  } else if (percentError <= 20) {
    quality = 'fair';       // Within 20%
  } else {
    quality = 'poor';       // More than 20% off
  }

  return {
    quality,
    difference,
    percentError,
    feedback: getEstimationFeedback(quality),
    pointsAwarded: getEstimationPoints(quality)
  };
}
```

---

## 7. Technical Implementation

### 7.1 Component Architecture

```
src/frontend/src/games/more-less-than/
├── MoreLessThanGame.tsx          # Main game container
├── components/
│   ├── ProblemDisplay.tsx        # Shows "What is X more/less than Y?"
│   ├── VisualScaffold.tsx        # Displays blocks with animations
│   ├── PeekButton.tsx            # "Show blocks" button for Medium mode
│   ├── AnswerInput.tsx           # Number input with validation
│   ├── StrategyHints.tsx         # Strategy suggestions for Hard mode
│   ├── FeedbackDisplay.tsx       # Shows success/error feedback
│   └── WorkingSolution.tsx       # Step-by-step explanation
├── hooks/
│   ├── useMoreLessProblem.ts     # Problem generation logic
│   ├── useVisualScaffold.ts      # Manages block visibility states
│   └── useAdaptiveDifficulty.ts  # Difficulty adjustment
├── utils/
│   ├── problemGenerator.ts       # Creates problems by difficulty
│   ├── validation.ts             # Answer validation logic
│   └── errorDetection.ts         # Common error pattern detection
└── types/
    └── index.ts                  # TypeScript interfaces
```

### 7.2 Reusable Components from Existing Games

**From `build-the-number`:**
- `<UnitCube />` - Unit block display
- `<TenRod />` - Ten rod display
- `<HundredFlat />` - Hundred flat display
- `<BlockTray />` - Block container (repurposed)

**From `sort-the-numbers`:**
- Drag-and-drop system (for manual manipulation mode)
- Animation patterns for feedback
- Number input validation

**From `game-engine`:**
- `useGameSessionStore()` - Session state management
- `generateProblem()` - Problem generation framework
- `DIFFICULTY_CONFIGS` - Difficulty level configurations
- `submitAttempt()` - Answer submission tracking
- `completeProblem()` - Problem completion flow

### 7.3 Problem Generation Implementation

```typescript
/**
 * Generates "more than / less than" problems
 */
export function generateMoreLessProblem(
  difficulty: DifficultyMode
): MoreLessProblem {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const { numberRange, operations } = config;

  // Select operation type (more/less)
  const operationType = selectOperation(operations);

  // Select delta (how much more/less)
  const delta = selectDelta(operationType, difficulty);

  // Generate starting number
  // Ensure result stays within valid range
  const startingNumber = generateValidStartingNumber(
    numberRange,
    operationType,
    delta
  );

  // Calculate correct answer
  const correctAnswer = operationType === 'more'
    ? startingNumber + delta
    : startingNumber - delta;

  return {
    id: generateId(),
    type: 'more-less-than',
    difficulty,
    startingNumber,
    operation: operationType,
    delta,
    correctAnswer,
    visualSupport: config.visualSupport,
    createdAt: Date.now()
  };
}

/**
 * Ensures starting number produces valid result
 */
function generateValidStartingNumber(
  range: { min: number; max: number },
  operation: 'more' | 'less',
  delta: number
): number {
  const { min, max } = range;

  if (operation === 'more') {
    // Ensure starting + delta <= max
    return randomInt(min, max - delta);
  } else {
    // Ensure starting - delta >= min (and >= 0)
    return randomInt(Math.max(min, delta), max);
  }
}
```

### 7.4 Visual Scaffold Component

```typescript
/**
 * Displays blocks with animations for addition/removal
 */
interface VisualScaffoldProps {
  startingNumber: number;
  operation: 'more' | 'less';
  delta: number;
  visibility: 'always' | 'peek' | 'hint' | 'none';
  onAnimationComplete?: () => void;
}

export const VisualScaffold = ({
  startingNumber,
  operation,
  delta,
  visibility,
  onAnimationComplete
}: VisualScaffoldProps): JSX.Element => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDelta, setShowDelta] = useState(false);

  useEffect(() => {
    // Auto-play animation after problem appears
    const timer = setTimeout(() => {
      setIsAnimating(true);
      setShowDelta(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [startingNumber, delta]);

  // Decompose starting number into blocks
  const startingBlocks = decomposeToBlocks(startingNumber);

  // Determine delta representation
  const deltaBlocks = operation === 'more'
    ? decomposeToBlocks(delta)
    : { units: delta, tens: 0, hundreds: 0 }; // For removal

  return (
    <div className="visual-scaffold">
      {/* Starting blocks */}
      <div className="starting-blocks">
        <BlockGroup blocks={startingBlocks} color="teal" />
      </div>

      {/* Operation indicator */}
      <div className="operation-indicator">
        {operation === 'more' ? '+' : '−'}
      </div>

      {/* Delta blocks (added or removed) */}
      <AnimatePresence>
        {showDelta && (
          <motion.div
            className="delta-blocks"
            initial={operation === 'more'
              ? { scale: 0, y: -20 }
              : { opacity: 1 }
            }
            animate={operation === 'more'
              ? { scale: 1, y: 0 }
              : { opacity: 0.3, textDecoration: 'line-through' }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onAnimationComplete={onAnimationComplete}
          >
            <BlockGroup
              blocks={deltaBlocks}
              color={operation === 'more' ? 'coral' : 'gray'}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

### 7.5 State Management Integration

```typescript
/**
 * Extends game session store for more/less than game
 */
interface MoreLessThanState {
  currentProblem: MoreLessProblem | null;
  peeksRemaining: number;
  estimationAttempt: number | null;
  showVisualScaffold: boolean;
  problemHistory: MoreLessProblemResult[];
}

// Add to existing useGameSessionStore
export const useMoreLessThanStore = create<MoreLessThanState>((set, get) => ({
  currentProblem: null,
  peeksRemaining: 3,
  estimationAttempt: null,
  showVisualScaffold: false,
  problemHistory: [],

  // Actions
  setProblem: (problem: MoreLessProblem) => {
    set({
      currentProblem: problem,
      peeksRemaining: getPeekLimit(problem.difficulty),
      showVisualScaffold: shouldShowByDefault(problem.difficulty)
    });
  },

  usePeek: () => {
    const { peeksRemaining } = get();
    if (peeksRemaining > 0) {
      set({
        peeksRemaining: peeksRemaining - 1,
        showVisualScaffold: true
      });

      // Auto-hide after 5 seconds
      setTimeout(() => {
        set({ showVisualScaffold: false });
      }, 5000);
    }
  },

  submitEstimation: (estimate: number) => {
    set({ estimationAttempt: estimate });
  },

  submitAnswer: (answer: number) => {
    const { currentProblem } = get();
    if (!currentProblem) return;

    const result = validateAnswer(currentProblem, answer);

    set(state => ({
      problemHistory: [...state.problemHistory, {
        problem: currentProblem,
        userAnswer: answer,
        isCorrect: result.isCorrect,
        timestamp: Date.now(),
        peeksUsed: 3 - state.peeksRemaining
      }]
    }));

    return result;
  }
}));
```

### 7.6 Accessibility Implementation

```typescript
/**
 * Accessible problem presentation
 */
export const AccessibleProblemDisplay = ({ problem }: Props) => {
  const { startingNumber, operation, delta, correctAnswer } = problem;

  // Screen reader announcement
  const announcement = `Question: What is ${delta} ${operation} than ${startingNumber}?`;

  return (
    <div
      role="main"
      aria-live="polite"
      aria-label={announcement}
    >
      <h2 className="problem-text">
        What is{' '}
        <span className="operation-highlight">
          {delta} {operation} than
        </span>{' '}
        {startingNumber}?
      </h2>

      {/* Visual scaffold with alt text */}
      <div
        className="visual-area"
        aria-label={`Visual representation: ${startingNumber} blocks with ${delta} highlighted for ${operation === 'more' ? 'addition' : 'removal'}`}
      >
        <VisualScaffold {...problem} />
      </div>

      {/* Answer input with label */}
      <label htmlFor="answer-input">
        <span className="sr-only">Your answer</span>
        <input
          id="answer-input"
          type="number"
          aria-required="true"
          aria-describedby="answer-hint"
          className="answer-input"
        />
      </label>

      <p id="answer-hint" className="sr-only">
        Enter a number and press Check Answer
      </p>
    </div>
  );
};
```

---

## 8. References

### Educational Research

1. **Carpenter, T. P., Fennema, E., Franke, M. L., Levi, L., & Empson, S. B. (1997).** *Children's mathematics: Cognitively guided instruction.* Heinemann.
   - Foundation for understanding children's mathematical thinking

2. **Stephens, A. C., Fonger, N., Strachota, S., Isler, I., Blanton, M., Knuth, E., & Gardiner, A. M. (2017).** A learning progression for elementary students' functional thinking. *Mathematical Thinking and Learning, 19*(3), 143-166.
   - Relational thinking development in K-3

3. **Van de Walle, J. A., Karp, K. S., & Bay-Williams, J. M. (2018).** *Elementary and middle school mathematics: Teaching developmentally* (10th ed.). Pearson.
   - Mental math strategies and number sense

4. **Bruner, J. S. (1966).** *Toward a theory of instruction.* Harvard University Press.
   - Concrete-Representational-Abstract learning progression

5. **Fuson, K. C. (1992).** Research on whole number addition and subtraction. In D. Grouws (Ed.), *Handbook of research on mathematics teaching and learning* (pp. 243-275). Macmillan.
   - Addition/subtraction problem types and language

### Design Precedents

6. **Todo Math** - Visual scaffolding for operations (analyzed for UX patterns)
7. **DragonBox Numbers** - Playful manipulation of quantities
8. **ST Math (MIND Research)** - Visual-first problem solving
9. **Montessori Math Apps** - Concrete material translation to digital

### Technical Resources

10. **@dnd-kit documentation** - Drag-and-drop implementation
11. **Framer Motion API** - Animation patterns
12. **React 18 Concurrent Features** - Performance optimization

---

## Appendix A: Problem Type Distribution by Difficulty

| Difficulty | Simple +/− | Crossing 10 | Using Tens | Teen Numbers | Large Numbers | Multi-step |
|-----------|-----------|-------------|-----------|-------------|--------------|-----------|
| Easy      | 100%      | 0%          | 0%        | 0%          | 0%           | 0%        |
| Medium    | 40%       | 30%         | 20%       | 10%         | 0%           | 0%        |
| Hard      | 20%       | 20%         | 20%       | 20%         | 20%          | 0%        |
| Challenge | 10%       | 10%         | 20%       | 10%         | 20%          | 30%       |

## Appendix B: Common Error Patterns & Interventions

| Error Pattern | Example | Intervention |
|--------------|---------|-------------|
| **Reversed operation** | "3 more than 5" → 2 (did 5-3) | Show equation: "more than means add, so 5 + 3" |
| **Wrong order** | "4 less than 7" → -3 (did 4-7) | Clarify: "Start with 7, then remove 4" |
| **Counting error** | Off by ±1 | Encourage careful counting with blocks |
| **Teen number confusion** | "3 less than 15" → 5 (treated 15 as 5) | Break down: "15 is 10 + 5, remove 3 from 5..." |
| **Place value error** | "10 more than 23" → 24 (added to ones) | Visual: Show adding ten-rod, not unit |

## Appendix C: Success Metrics

### Mastery Criteria (per difficulty level)

| Metric | Easy | Medium | Hard | Challenge |
|--------|------|--------|------|-----------|
| **Accuracy threshold** | 80% | 80% | 85% | 80% |
| **Minimum problems** | 20 | 30 | 40 | 30 |
| **Consistency (last 10)** | 80% | 80% | 85% | 80% |
| **Peek usage (Medium)** | N/A | ≤ 1 per problem | N/A | N/A |
| **Strategy variety (Hard)** | N/A | N/A | ≥ 2 strategies | ≥ 3 strategies |

### Learning Progression Indicators

**Advancing from Easy → Medium:**
- 80% accuracy on problems with ±1 and ±2
- Demonstrates understanding of "more" vs "less" language
- Can explain answer with blocks

**Advancing from Medium → Hard:**
- 80% accuracy with peek limit
- Successfully solves "crossing 10" problems
- Uses place value for "+10" problems

**Advancing from Hard → Challenge:**
- 85% accuracy without visual scaffolds
- Uses multiple mental strategies
- Can explain reasoning verbally

---

*Document prepared for NumberSense development. This specification builds on existing research and game patterns to create a cohesive, developmentally-appropriate learning experience.*

**Version History:**
- v1.0 (2026-02-03): Initial specification by Game Design Research Agent
