# NumberSense: Game Mechanics Specification

**Version:** 1.0
**Target Audience:** Kindergarten through 3rd Grade (Ages 5-8)
**Document Type:** Technical Specification for Development

---

## Table of Contents

1. [Research Foundation](#1-research-foundation)
2. [Game 1: Build the Number](#2-game-1-build-the-number)
3. [Game 2: Sort the Numbers](#3-game-2-sort-the-numbers)
4. [Shared Systems](#4-shared-systems)
5. [Technical Implementation Notes](#5-technical-implementation-notes)

---

## 1. Research Foundation

### 1.1 Theoretical Framework

This specification is grounded in established educational research:

**Constructivist Learning Theory (Piaget, Bruner)**
- Children construct understanding through active manipulation
- Concrete-Representational-Abstract (CRA) progression is essential
- Virtual manipulatives can be as effective as physical ones when properly designed

**Cognitive Load Theory (Sweller)**
- Minimize extraneous cognitive load
- Scaffold intrinsic load progressively
- Use germane load to promote schema building

**Self-Determination Theory (Deci & Ryan)**
- Autonomy: Player choice in approach
- Competence: Appropriate challenge level
- Relatedness: Connection to learning context

**Research-Backed Design Principles**

| Principle | Application | Source |
|-----------|-------------|--------|
| Immediate feedback | Validate within 200ms of action | Shute (2008) |
| Productive failure | Allow exploration before correction | Kapur (2008) |
| Interleaved practice | Mix problem types | Rohrer (2012) |
| Spaced repetition | Return to mastered concepts | Cepeda et al. (2006) |
| Embodied cognition | Touch-based manipulation | Alibali & Nathan (2012) |

### 1.2 Successful Precedents Analysis

**DragonBox (WeWantToKnow)**
- Transforms abstract algebra into visual puzzles
- Gradual symbol introduction
- No explicit instruction - discovery-based

**Montessori Number Rods**
- Physical proportionality (rod length = value)
- Self-correcting through physical feedback
- Isolation of difficulty

**Bedtime Math**
- Low-pressure engagement
- Story-based context
- Parent involvement design

**Todo Math**
- Adaptive difficulty
- Multi-representational approach
- Mission-based progression

---

## 2. Game 1: Build the Number

### 2.1 Core Mechanic Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GAME SCREEN                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ┌─────────────────────────────────────────┐                 │
│    │         TARGET NUMBER DISPLAY           │                 │
│    │              [ 14 ]                     │                 │
│    │         (with optional visual)          │                 │
│    └─────────────────────────────────────────┘                 │
│                                                                 │
│    ┌─────────────────────────────────────────┐                 │
│    │           BUILDING WORKSPACE            │                 │
│    │                                         │                 │
│    │    ████████████  □ □ □ □               │                 │
│    │    (ten rod)     (4 units)              │                 │
│    │                                         │                 │
│    │         Current Value: 14               │                 │
│    └─────────────────────────────────────────┘                 │
│                                                                 │
│    ┌─────────────────────────────────────────┐                 │
│    │           BLOCK TRAY                    │                 │
│    │                                         │                 │
│    │   □  ████████  ┌────────────┐          │                 │
│    │   1s   10s     │    100s    │          │                 │
│    │               └────────────┘          │                 │
│    └─────────────────────────────────────────┘                 │
│                                                                 │
│    [ CLEAR ]              [ CHECK MY ANSWER ]                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Block Types Specification

#### 2.2.1 Unit Cubes (Ones)

```
Visual Representation:
    ┌───┐
    │   │    Size: 48x48 pixels (base unit)
    └───┘    Color: #4ECDC4 (Teal)
             Touch target: 64x64 pixels minimum
```

**Properties:**
- Value: 1
- Drag behavior: Individual placement
- Stacking: Up to 9 units can be placed in a row before visual grouping hint
- Sound: Soft "click" on placement (see Audio Spec 4.2)
- Animation: Gentle bounce on drop (0.15s ease-out)

#### 2.2.2 Ten Rods

```
Visual Representation:
    ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
    │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │10 │
    └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘

    Size: 480x48 pixels (10 unit cubes wide)
    Color: #FF6B6B (Coral Red)
    Segmentation lines visible but subtle
```

**Properties:**
- Value: 10
- Introduction: After 80% mastery of numbers 1-10
- Visual: Shows 10 segments to reinforce "10 ones = 1 ten"
- Tap behavior: Optional counting animation (1, 2, 3... 10)
- Long-press: Breaks into 10 individual units (decomposition teaching)

**Introduction Sequence:**
1. First appearance: Animated assembly of 10 unit cubes into a rod
2. Narration: "When we have 10 ones, we can make a ten!"
3. Interactive: Child assembles their first rod
4. Celebration: Confetti animation, unlock notification

#### 2.2.3 Hundred Flats

```
Visual Representation:
    ┌─────────────────────────────────────────────┐
    │ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫                        │
    │ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫                        │
    │ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫                        │
    │ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫       10 rows         │
    │ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫       of 10           │
    │ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫                        │
    │ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫                        │
    │ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫                        │
    │ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫                        │
    │ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫ ▫                        │
    └─────────────────────────────────────────────┘

    Size: 480x480 pixels
    Color: #95E1D3 (Mint Green)
    Grid pattern visible
```

**Properties:**
- Value: 100
- Introduction: After mastery of two-digit numbers
- Tap behavior: Shows row highlighting with counting
- Long-press: Breaks into 10 ten-rods

### 2.3 Visual Design Principles

#### 2.3.1 Color System

```
Block Colors (WCAG AAA compliant):
┌──────────────────────────────────────────────────────────┐
│  Units (1s)    │  #4ECDC4  │  Teal      │  Calm/Start   │
│  Tens (10s)    │  #FF6B6B  │  Coral     │  Energy/Growth│
│  Hundreds      │  #95E1D3  │  Mint      │  Achievement  │
├──────────────────────────────────────────────────────────┤
│  Background    │  #FAFBFC  │  Off-white │  Low fatigue  │
│  Workspace     │  #FFFFFF  │  White     │  Focus area   │
│  Success       │  #7DCE82  │  Green     │  Positive     │
│  Try Again     │  #FFB347  │  Orange    │  Warm/Safe    │
└──────────────────────────────────────────────────────────┘
```

#### 2.3.2 Proportionality

All blocks maintain strict proportional relationships:
- 1 ten-rod = exactly 10 unit cube widths
- 1 hundred-flat = exactly 10 ten-rod widths = 100 unit cube widths

This visual proportionality is critical for developing number sense.

#### 2.3.3 Touch Targets

Per WCAG and Apple HIG for children:
- Minimum touch target: 44x44 points
- Recommended for ages 5-8: 64x64 points
- Spacing between targets: Minimum 8 points

### 2.4 Difficulty Modes

#### 2.4.1 Mode: EASY (Foundation)

**Configuration:**
```javascript
const EASY_CONFIG = {
  numberRange: { min: 1, max: 10 },
  availableBlocks: ['unit'],
  targetDisplay: 'numeral_with_visual',  // Shows dots/objects too
  validationMode: 'immediate_feedback',
  hintsEnabled: true,
  hintDelay: 15000,  // 15 seconds before hint
  maxAttempts: Infinity,  // No failure, only learning
  successThreshold: 0.8,  // 80% correct to advance
  problemsPerSession: 10
};
```

**Target Presentation:**
```
┌─────────────────────┐
│         5           │  ← Numeral (large, clear)
│                     │
│     ●  ●  ●        │  ← Visual representation
│       ●  ●          │     (dice pattern for 1-6)
└─────────────────────┘
```

**Problem Types:**
1. Simple construction: "Build the number 5"
2. Matching: "Make your blocks look like this" (shows completed model)
3. Counting prompt: "How many apples? Build that number!"

#### 2.4.2 Mode: MEDIUM (Bridge)

**Configuration:**
```javascript
const MEDIUM_CONFIG = {
  numberRange: { min: 1, max: 20 },
  availableBlocks: ['unit', 'ten'],
  targetDisplay: 'numeral_only',  // Transition away from visual supports
  validationMode: 'check_button',  // Child decides when ready
  hintsEnabled: true,
  hintDelay: 20000,
  successThreshold: 0.8,
  problemsPerSession: 12,
  includeDecomposition: true  // "Can you build 12 a different way?"
};
```

**Key Learning Moments:**
- First time a number > 10: Scaffolded introduction
- Place value concept: "14 is one ten and four ones"
- Multiple representations accepted

**Teen Number Special Handling:**
```
Target: 14

VALID ANSWERS:
├── 1 ten-rod + 4 units     ← Canonical (highlighted as "efficient")
├── 14 units                ← Valid, prompt: "Can you use a ten-rod?"
└── (conceptually: 7+7, etc. - reserved for Challenge mode)
```

#### 2.4.3 Mode: HARD (Mastery)

**Configuration:**
```javascript
const HARD_CONFIG = {
  numberRange: { min: 1, max: 100 },
  availableBlocks: ['unit', 'ten', 'hundred'],
  targetDisplay: 'numeral_only',
  validationMode: 'check_button',
  hintsEnabled: true,
  hintDelay: 30000,
  successThreshold: 0.85,
  problemsPerSession: 15,
  placeValueFocus: true,
  estimationWarmup: true  // "About how many tens in 47?"
};
```

**Three-Digit Introduction (Extended Mode for Grade 3):**
```
Target: 147

Expected construction:
┌────────────┐  ████████████████████  □ □ □ □ □ □ □
│ 100-flat   │  ████████████████████
│            │  ████████████████████
│            │  ████████████████████
└────────────┘       4 ten-rods           7 units

Verbal scaffold: "147 is 1 hundred, 4 tens, and 7 ones"
```

#### 2.4.4 Mode: CHALLENGE (Extension)

**Configuration:**
```javascript
const CHALLENGE_CONFIG = {
  numberRange: { min: 10, max: 100 },
  availableBlocks: ['unit', 'ten', 'hundred'],
  problemTypes: [
    'decomposition',      // "Build 15 three different ways"
    'constraints',        // "Build 15 using exactly 7 blocks"
    'comparison',         // "Build a number bigger than 20 but smaller than 30"
    'mystery'            // "I have 2 tens and some ones. I have 25. How many ones?"
  ],
  validationMode: 'multi_answer',
  creativityBonus: true
};
```

**Decomposition Puzzles:**
```
┌──────────────────────────────────────────────────────────┐
│  Challenge: Build 15 in THREE different ways!            │
│                                                          │
│  Way 1: [empty workspace 1]     ○ Not yet complete      │
│  Way 2: [empty workspace 2]     ○ Not yet complete      │
│  Way 3: [empty workspace 3]     ○ Not yet complete      │
│                                                          │
│  Valid solutions you've found: 0/3                       │
└──────────────────────────────────────────────────────────┘

VALID SOLUTIONS FOR 15:
├── 1 ten + 5 units
├── 15 units
├── 10 units + 5 units (visual grouping shown)
├── 1 ten + 3 units + 2 units
└── ... (system tracks unique valid compositions)
```

### 2.5 Validation Logic

#### 2.5.1 Core Validation Algorithm

```javascript
/**
 * Validates a block arrangement against a target number
 * @param {BlockArrangement} arrangement - Current workspace state
 * @param {number} target - Target number to build
 * @param {ValidationMode} mode - Current difficulty mode settings
 * @returns {ValidationResult}
 */
function validateArrangement(arrangement, target, mode) {
  // Calculate total value
  const totalValue =
    arrangement.hundreds * 100 +
    arrangement.tens * 10 +
    arrangement.units * 1;

  // Basic correctness check
  const isCorrect = totalValue === target;

  // Efficiency analysis (for feedback, not scoring)
  const efficiency = analyzeEfficiency(arrangement, target, mode);

  // Partial progress detection
  const progress = analyzeProgress(arrangement, target);

  return {
    isCorrect,
    totalValue,
    efficiency,
    progress,
    feedback: generateFeedback(isCorrect, efficiency, progress, mode)
  };
}

/**
 * Analyzes if the representation is efficient (uses appropriate blocks)
 */
function analyzeEfficiency(arrangement, target, mode) {
  if (mode.level === 'EASY') return 'N/A';  // Don't judge efficiency for beginners

  const optimalHundreds = Math.floor(target / 100);
  const optimalTens = Math.floor((target % 100) / 10);
  const optimalUnits = target % 10;

  const isCanonical =
    arrangement.hundreds === optimalHundreds &&
    arrangement.tens === optimalTens &&
    arrangement.units === optimalUnits;

  const hasExcessUnits = arrangement.units >= 10;
  const hasExcessTens = arrangement.tens >= 10;

  return {
    isCanonical,
    hasExcessUnits,
    hasExcessTens,
    suggestionType: hasExcessUnits ? 'group_to_tens' :
                    hasExcessTens ? 'group_to_hundreds' :
                    'none'
  };
}

/**
 * Determines partial progress for scaffolding
 */
function analyzeProgress(arrangement, target) {
  const current = arrangement.hundreds * 100 + arrangement.tens * 10 + arrangement.units;
  const difference = target - current;

  return {
    currentValue: current,
    difference: difference,
    direction: difference > 0 ? 'need_more' : difference < 0 ? 'too_many' : 'exact',
    percentComplete: Math.min(100, Math.round((current / target) * 100)),
    isClose: Math.abs(difference) <= 2
  };
}
```

#### 2.5.2 Multiple Valid Answer Handling

```javascript
/**
 * For Challenge mode: tracks multiple valid compositions
 */
const VALID_COMPOSITIONS_TRACKER = {
  target: 15,
  foundCompositions: [],

  /**
   * Checks if a composition is valid AND unique
   */
  checkComposition(arrangement) {
    const value = this.calculateValue(arrangement);
    if (value !== this.target) return { valid: false };

    const signature = this.getCompositionSignature(arrangement);
    const isNew = !this.foundCompositions.includes(signature);

    if (isNew) {
      this.foundCompositions.push(signature);
    }

    return {
      valid: true,
      isNew: isNew,
      totalFound: this.foundCompositions.length
    };
  },

  /**
   * Creates a unique signature for a composition
   * Groups blocks by position to detect truly different arrangements
   */
  getCompositionSignature(arrangement) {
    // Sort blocks by value, then create signature
    // [1,1,1,1,1,10] and [10,1,1,1,1,1] are the SAME composition
    const values = [];
    for (let i = 0; i < arrangement.hundreds; i++) values.push(100);
    for (let i = 0; i < arrangement.tens; i++) values.push(10);
    for (let i = 0; i < arrangement.units; i++) values.push(1);
    return values.sort((a,b) => b-a).join('-');
  }
};
```

#### 2.5.3 Partial Credit and Scaffolding System

```javascript
/**
 * Feedback generation based on validation results
 */
function generateFeedback(isCorrect, efficiency, progress, mode) {
  if (isCorrect) {
    return {
      type: 'success',
      message: getSuccessMessage(efficiency),
      animation: 'celebrate',
      audioId: 'success_chime',
      nextAction: 'next_problem'
    };
  }

  // Scaffolded hints based on progress
  if (progress.direction === 'need_more') {
    if (progress.isClose) {
      return {
        type: 'hint',
        message: `Almost there! You need just ${progress.difference} more.`,
        animation: 'encourage',
        audioId: 'hint_soft',
        highlight: 'block_tray'
      };
    } else {
      return {
        type: 'hint',
        message: `You have ${progress.currentValue}. The target is ${mode.target}.`,
        animation: 'thinking',
        audioId: 'hint_soft',
        showComparison: true
      };
    }
  }

  if (progress.direction === 'too_many') {
    return {
      type: 'hint',
      message: `Oops! That's ${Math.abs(progress.difference)} too many. Try removing some blocks.`,
      animation: 'thinking',
      audioId: 'hint_soft',
      highlight: 'workspace'
    };
  }
}

/**
 * Success messages vary to maintain engagement
 */
function getSuccessMessage(efficiency) {
  const messages = {
    canonical: [
      "Perfect! That's the standard way to write {n}!",
      "Excellent place value thinking!",
      "You've got it! {n} = {h} hundreds, {t} tens, and {u} ones!"
    ],
    valid_not_canonical: [
      "That's correct! You built {n}!",
      "Great job! Can you think of another way to build {n}?",
      "You did it! There might be an even quicker way..."
    ]
  };

  const category = efficiency.isCanonical ? 'canonical' : 'valid_not_canonical';
  return messages[category][Math.floor(Math.random() * messages[category].length)];
}
```

### 2.6 Progression System

#### 2.6.1 Mastery Criteria

```javascript
const MASTERY_CRITERIA = {
  EASY: {
    requiredAccuracy: 0.80,      // 80% correct
    minimumProblems: 20,         // At least 20 problems
    consistencyWindow: 10,       // Last 10 problems
    consistencyThreshold: 0.80,  // 8/10 correct
    timeThreshold: null          // No time pressure for beginners
  },

  MEDIUM: {
    requiredAccuracy: 0.80,
    minimumProblems: 30,
    consistencyWindow: 10,
    consistencyThreshold: 0.80,
    subSkillMastery: {
      teensNumbers: { accuracy: 0.85, minProblems: 10 },
      twentiesNumbers: { accuracy: 0.80, minProblems: 10 }
    }
  },

  HARD: {
    requiredAccuracy: 0.85,
    minimumProblems: 40,
    consistencyWindow: 15,
    consistencyThreshold: 0.85,
    subSkillMastery: {
      twoDigitNumbers: { accuracy: 0.85, minProblems: 15 },
      threeDigitNumbers: { accuracy: 0.80, minProblems: 15 }
    }
  }
};
```

#### 2.6.2 Advancement Logic

```javascript
/**
 * Determines if player should advance to next difficulty
 */
function checkAdvancement(playerData, currentLevel) {
  const criteria = MASTERY_CRITERIA[currentLevel];
  const recentProblems = playerData.history.slice(-criteria.consistencyWindow);

  // Check minimum problem count
  if (playerData.totalProblems < criteria.minimumProblems) {
    return { advance: false, reason: 'need_more_practice' };
  }

  // Check overall accuracy
  const overallAccuracy = playerData.correctCount / playerData.totalProblems;
  if (overallAccuracy < criteria.requiredAccuracy) {
    return { advance: false, reason: 'accuracy_below_threshold' };
  }

  // Check recent consistency
  const recentAccuracy = recentProblems.filter(p => p.correct).length / recentProblems.length;
  if (recentAccuracy < criteria.consistencyThreshold) {
    return { advance: false, reason: 'inconsistent_recent_performance' };
  }

  // Check sub-skill mastery if applicable
  if (criteria.subSkillMastery) {
    for (const [skill, req] of Object.entries(criteria.subSkillMastery)) {
      const skillData = playerData.subSkills[skill];
      if (!skillData || skillData.problems < req.minProblems ||
          skillData.accuracy < req.accuracy) {
        return { advance: false, reason: `need_mastery_${skill}` };
      }
    }
  }

  return { advance: true };
}
```

#### 2.6.3 Regression Handling (Struggling Detection)

```javascript
/**
 * Detects when a player is struggling and needs support
 */
const STRUGGLE_DETECTOR = {
  // Trigger conditions
  triggers: {
    consecutiveErrors: 3,           // 3 wrong in a row
    sessionAccuracyDrop: 0.20,      // 20% drop from baseline
    timePerProblemIncrease: 2.0,    // Taking 2x longer than average
    hintDependency: 0.5             // Using hints on 50%+ of problems
  },

  /**
   * Analyzes session for struggle indicators
   */
  analyze(sessionData, playerBaseline) {
    const indicators = [];

    // Check consecutive errors
    const recentResults = sessionData.problems.slice(-5);
    let consecutiveErrors = 0;
    for (let i = recentResults.length - 1; i >= 0; i--) {
      if (!recentResults[i].correct) consecutiveErrors++;
      else break;
    }
    if (consecutiveErrors >= this.triggers.consecutiveErrors) {
      indicators.push('consecutive_errors');
    }

    // Check accuracy drop
    const sessionAccuracy = sessionData.correctCount / sessionData.totalProblems;
    if (playerBaseline.accuracy - sessionAccuracy > this.triggers.sessionAccuracyDrop) {
      indicators.push('accuracy_drop');
    }

    // Check time increase
    const avgTime = sessionData.totalTime / sessionData.totalProblems;
    if (avgTime > playerBaseline.avgTime * this.triggers.timePerProblemIncrease) {
      indicators.push('taking_longer');
    }

    return {
      isStruggling: indicators.length >= 2,
      indicators: indicators,
      recommendation: this.getRecommendation(indicators)
    };
  },

  /**
   * Generates intervention recommendation
   */
  getRecommendation(indicators) {
    if (indicators.includes('consecutive_errors')) {
      return {
        action: 'reduce_difficulty',
        message: 'Let\'s try some easier numbers first!',
        adjustment: 'previous_mastered_range'
      };
    }
    if (indicators.includes('accuracy_drop')) {
      return {
        action: 'provide_scaffolding',
        message: 'Would you like a hint?',
        adjustment: 'enable_visual_supports'
      };
    }
    return {
      action: 'encourage',
      message: 'Keep trying! Math takes practice.',
      adjustment: 'none'
    };
  }
};
```

#### 2.6.4 Spaced Repetition for Mastered Concepts

```javascript
/**
 * Ensures previously mastered concepts are periodically reviewed
 */
const SPACED_REPETITION = {
  intervals: [1, 3, 7, 14, 30],  // Days between reviews

  /**
   * Selects problems mixing new challenges with review items
   */
  selectProblems(playerData, sessionLength) {
    const problems = [];
    const reviewItems = this.getDueReviews(playerData);

    // 20% of session should be review
    const reviewCount = Math.ceil(sessionLength * 0.2);
    const newCount = sessionLength - reviewCount;

    // Add review problems
    for (let i = 0; i < reviewCount && i < reviewItems.length; i++) {
      problems.push({
        type: 'review',
        ...reviewItems[i]
      });
    }

    // Add new problems at current level
    for (let i = 0; i < newCount; i++) {
      problems.push({
        type: 'new',
        level: playerData.currentLevel
      });
    }

    // Shuffle to interleave review and new
    return this.shuffle(problems);
  }
};
```

---

## 3. Game 2: Sort the Numbers

### 3.1 Core Mechanic Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SORT THE NUMBERS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Instruction: Put these numbers in order from smallest to       │
│               biggest!                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              UNSORTED ITEMS (drag from here)            │   │
│  │                                                         │   │
│  │    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐           │   │
│  │    │  7  │    │  3  │    │ 12  │    │  9  │           │   │
│  │    │█████│    │███  │    │████ │    │████ │           │   │
│  │    │██   │    │     │    │████ │    │████ │           │   │
│  │    └─────┘    └─────┘    │██   │    │█    │           │   │
│  │                         └─────┘    └─────┘           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              SORTED AREA (drop here in order)           │   │
│  │                                                         │   │
│  │    [ 1st ]    [ 2nd ]    [ 3rd ]    [ 4th ]            │   │
│  │   smallest                          biggest            │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                          [ CHECK ORDER ]                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Phase 1: Visual Sorting

#### 3.2.1 Visual Representation Cards

```
CARD STRUCTURE (Block Representation Mode):
┌───────────────────────────┐
│                           │
│    ████████████████████   │  ← Ten rod
│    ████████████████████   │  ← Ten rod
│    ████████████████████   │  ← Ten rod
│                           │
│    □ □ □ □ □              │  ← 5 unit cubes
│                           │
│         = 35              │  ← Value shown below (optional)
│                           │
└───────────────────────────┘

Card Size: 160x200 pixels
Block scale: Consistent with Build the Number game
Background: White with subtle shadow
Border: 2px rounded, color indicates nothing (neutral gray)
```

#### 3.2.2 Visual Comparison Strategies Supported

The game is designed to encourage and recognize multiple comparison strategies:

**Strategy 1: Count All (Inefficient but Valid)**
```
Child physically counts each unit in both representations
System: Allows unlimited time, no penalty for this approach
Detection: Long interaction time, may tap individual blocks
```

**Strategy 2: Group Comparison (Developing)**
```
Child compares tens first, then units
System: Highlights matched groups when compared
Detection: Quick decisions when tens differ significantly

Example:
  23 vs 45
  ├── Child notices 23 has 2 tens, 45 has 4 tens
  └── Correctly identifies 45 as larger without counting units
```

**Strategy 3: Magnitude Estimation (Advanced)**
```
Child uses visual "bulk" to estimate
System: Arranges blocks consistently to support this
Detection: Very fast correct decisions

Example:
  8 vs 42
  ├── Visual bulk obviously different
  └── Immediate correct sorting
```

#### 3.2.3 Phase 1 Problem Generation

```javascript
const VISUAL_SORTING_GENERATOR = {
  /**
   * Generates a set of numbers for visual sorting
   */
  generateProblem(config) {
    const { count, range, difficulty } = config;
    let numbers = [];

    switch (difficulty) {
      case 'very_easy':
        // Numbers far apart, easy to compare
        numbers = this.generateSpacedNumbers(count, range, minGap: 5);
        break;

      case 'easy':
        // Numbers somewhat spread
        numbers = this.generateSpacedNumbers(count, range, minGap: 3);
        break;

      case 'medium':
        // May include adjacent numbers
        numbers = this.generateNumbers(count, range);
        break;

      case 'hard':
        // Intentionally includes near-misses
        numbers = this.generateWithNearMisses(count, range);
        break;
    }

    return {
      numbers: this.shuffle(numbers),
      correctOrder: [...numbers].sort((a, b) => a - b),
      representations: numbers.map(n => this.toBlockRepresentation(n))
    };
  },

  /**
   * Creates visual block representation
   */
  toBlockRepresentation(number) {
    const hundreds = Math.floor(number / 100);
    const tens = Math.floor((number % 100) / 10);
    const units = number % 10;

    return {
      value: number,
      blocks: { hundreds, tens, units },
      displayMode: 'standard'  // or 'decomposed' for tricky representations
    };
  },

  /**
   * Generates "tricky" representations for advanced practice
   */
  generateTrickyRepresentation(number) {
    // Example: Show 14 as 7+7 blocks instead of 10+4
    const representations = [
      { mode: 'standard', blocks: this.toStandardBlocks(number) },
      { mode: 'decomposed', blocks: this.toDecomposedBlocks(number) }
    ];

    return representations[Math.floor(Math.random() * representations.length)];
  }
};
```

### 3.3 Phase 2: Numeric Sorting

#### 3.3.1 Transition from Visual to Symbolic

```
PHASE TRANSITION SEQUENCE:

Step 1: Visual with number label
┌─────────┐
│ ████    │
│ ███     │
│   = 7   │  ← Number shown below blocks
└─────────┘

Step 2: Fading visual
┌─────────┐
│ (faded  │
│ blocks) │  ← Blocks at 50% opacity
│   = 7   │
└─────────┘

Step 3: Number only
┌─────────┐
│         │
│    7    │  ← Just the numeral
│         │
└─────────┘

Step 4: Optional scaffold
┌─────────┐
│    7    │
│ [Show?] │  ← Tap to reveal blocks if needed
└─────────┘
```

#### 3.3.2 Phase 2 Configuration

```javascript
const NUMERIC_SORTING_CONFIG = {
  unlockCriteria: {
    phase1Accuracy: 0.85,        // 85% correct in visual sorting
    phase1MinProblems: 15,       // At least 15 visual problems
    phase1Consistency: 0.80      // 80% in last 10
  },

  scaffoldingOptions: {
    peekEnabled: true,           // Tap to see blocks
    peekLimit: 3,                // Max 3 peeks per problem
    peekCooldown: 5000,          // 5 seconds between peeks
    fadeAfterPeek: true          // Blocks fade away after 3 seconds
  },

  difficultyScaling: {
    initial: {
      count: 3,
      range: { min: 1, max: 20 },
      includeClose: false
    },
    advanced: {
      count: 5,
      range: { min: 1, max: 100 },
      includeClose: true,
      trickyFormats: true        // "23" vs "twenty-three"
    }
  }
};
```

### 3.4 Difficulty Scaling

#### 3.4.1 Scaling Parameters

```javascript
const DIFFICULTY_PROGRESSION = {
  level1: {
    name: 'Getting Started',
    itemCount: 3,
    numberRange: { min: 1, max: 10 },
    representation: 'visual_only',
    constraints: {
      minGap: 3,          // Numbers at least 3 apart
      noAdjacent: true    // No consecutive numbers
    }
  },

  level2: {
    name: 'Growing',
    itemCount: 3,
    numberRange: { min: 1, max: 20 },
    representation: 'visual_with_label',
    constraints: {
      minGap: 2,
      allowTeens: true
    }
  },

  level3: {
    name: 'Expanding',
    itemCount: 4,
    numberRange: { min: 1, max: 50 },
    representation: 'visual_with_label',
    constraints: {
      minGap: 1,
      includeNearMiss: true  // e.g., 23 vs 24
    }
  },

  level4: {
    name: 'Numeric',
    itemCount: 4,
    numberRange: { min: 1, max: 50 },
    representation: 'numeric_only',
    constraints: {
      allowAdjacent: true,
      peekAvailable: true
    }
  },

  level5: {
    name: 'Expert',
    itemCount: 5,
    numberRange: { min: 1, max: 100 },
    representation: 'numeric_only',
    constraints: {
      trickyPairs: true,    // 32 vs 23 (reversal)
      decadeComparison: true // 29 vs 30
    }
  },

  level6: {
    name: 'Master',
    itemCount: 6,
    numberRange: { min: 1, max: 100 },
    representation: 'mixed',  // Some visual, some numeric
    constraints: {
      trickyRepresentations: true,  // 14 shown as 7+7
      distractors: true              // Include decoys
    }
  }
};
```

#### 3.4.2 Tricky Representations

```
EXAMPLE: Number 14

Standard representation:
┌─────────────┐
│ ██████████  │  ← 1 ten-rod
│ □ □ □ □     │  ← 4 units
│    = 14     │
└─────────────┘

Tricky representation (tests true understanding):
┌─────────────┐
│ □□□□□□□     │  ← 7 units
│ □□□□□□□     │  ← 7 units
│    = 14     │
└─────────────┘

Purpose: Ensures child understands VALUE not just PATTERN
Detection: If child struggles with tricky but not standard,
           indicates pattern-matching rather than true understanding
```

#### 3.4.3 Near-Miss Distractors

```javascript
/**
 * Generates problems with intentional near-misses to test precision
 */
function generateNearMissProblem() {
  // Types of near-misses:
  return {
    adjacent: [23, 24, 25],           // Consecutive numbers
    reversal: [23, 32],               // Digit swap
    decadeBoundary: [29, 30, 31],     // Crossing tens
    sameDigits: [12, 21],             // Same digits, different value
    visualSimilar: [14, 41]           // Similar looking
  };
}
```

### 3.5 Validation and Feedback

#### 3.5.1 Sort Order Validation

```javascript
/**
 * Validates the sorted arrangement
 */
function validateSortOrder(playerOrder, correctOrder) {
  const result = {
    isCorrect: true,
    errors: [],
    partialCredit: 0,
    feedback: null
  };

  // Check each position
  for (let i = 0; i < correctOrder.length; i++) {
    if (playerOrder[i] !== correctOrder[i]) {
      result.isCorrect = false;
      result.errors.push({
        position: i,
        playerValue: playerOrder[i],
        correctValue: correctOrder[i]
      });
    }
  }

  // Calculate partial credit (useful for longer sequences)
  if (!result.isCorrect) {
    result.partialCredit = calculatePartialCredit(playerOrder, correctOrder);
  }

  // Generate specific feedback
  result.feedback = generateSortFeedback(result);

  return result;
}

/**
 * Calculates partial credit based on correct relative orderings
 */
function calculatePartialCredit(playerOrder, correctOrder) {
  // Count correct pairwise orderings
  let correctPairs = 0;
  let totalPairs = 0;

  for (let i = 0; i < playerOrder.length; i++) {
    for (let j = i + 1; j < playerOrder.length; j++) {
      totalPairs++;
      const playerRelation = playerOrder[i] < playerOrder[j];
      const correctRelation = correctOrder.indexOf(playerOrder[i]) <
                              correctOrder.indexOf(playerOrder[j]);
      if (playerRelation === correctRelation) {
        correctPairs++;
      }
    }
  }

  return correctPairs / totalPairs;
}
```

#### 3.5.2 Progressive Hint System

```javascript
const HINT_SYSTEM = {
  levels: [
    {
      trigger: 'first_error',
      hint: 'general_encouragement',
      message: "Not quite! Look carefully at each number.",
      visual: 'shake_incorrect_items',
      delay: 0
    },
    {
      trigger: 'second_error',
      hint: 'comparison_prompt',
      message: "Try comparing these two: which is smaller?",
      visual: 'highlight_swapped_pair',
      delay: 2000
    },
    {
      trigger: 'third_error',
      hint: 'direct_guidance',
      message: "Let's find the smallest first. Look at all the numbers...",
      visual: 'highlight_minimum',
      delay: 3000
    },
    {
      trigger: 'fourth_error',
      hint: 'show_answer',
      message: "Here's the correct order. Let's see why!",
      visual: 'animate_correct_sorting',
      delay: 5000
    }
  ],

  /**
   * Delivers appropriate hint based on error count
   */
  getHint(errorCount, problemContext) {
    const level = Math.min(errorCount - 1, this.levels.length - 1);
    const hintConfig = this.levels[level];

    return {
      ...hintConfig,
      message: this.personalizeMessage(hintConfig.message, problemContext)
    };
  }
};
```

#### 3.5.3 Feedback Animations

```
SUCCESS ANIMATION SEQUENCE (2.5 seconds total):

Time 0.0s: Cards glow green simultaneously
         ┌───┐ ┌───┐ ┌───┐ ┌───┐
         │ 3 │ │ 7 │ │12 │ │15 │
         └───┘ └───┘ └───┘ └───┘
           ↓     ↓     ↓     ↓
          glow  glow  glow  glow

Time 0.3s: Cards rise slightly (4px) with ease-out
Time 0.6s: Checkmark appears above sorted row
                    ✓
         ┌───┐ ┌───┐ ┌───┐ ┌───┐
         │ 3 │ │ 7 │ │12 │ │15 │
         └───┘ └───┘ └───┘ └───┘

Time 1.0s: Optional - connecting line animates L to R
         ────→────→────→────→

Time 2.0s: Elements settle, "Great job!" text fades in
Time 2.5s: Transition to next problem or summary

ERROR ANIMATION (1.5 seconds):

Time 0.0s: Incorrect pair highlighted in orange
         ┌───┐ ┌───┐ ┌───┐ ┌───┐
         │ 3 │ │15 │ │12 │ │ 7 │
         └───┘ └───┘ └───┘ └───┘
                 ↑──────↑
               orange highlight

Time 0.3s: Gentle shake (3px horizontal, 2 cycles)
Time 0.8s: Highlight fades
Time 1.5s: Ready for retry
```

---

## 4. Shared Systems

### 4.1 Reward Systems (Intrinsic Motivation Focus)

#### 4.1.1 Design Philosophy

Based on Self-Determination Theory and research on gamification:

**DO:**
- Emphasize mastery and progress over points
- Provide meaningful feedback tied to learning
- Support autonomy through choice
- Create "flow" through appropriate challenge

**DON'T:**
- Use leaderboards (promotes performance goals over learning goals)
- Excessive extrinsic rewards that undermine intrinsic motivation
- Time pressure that induces anxiety
- Punishment or negative consequences for mistakes

#### 4.1.2 Reward Mechanics

```javascript
const REWARD_SYSTEM = {
  /**
   * Mastery Badges (earned through demonstrated understanding)
   */
  badges: {
    'number_explorer': {
      name: 'Number Explorer',
      description: 'Built your first 10 numbers!',
      criteria: { problemsCompleted: 10 },
      icon: 'compass_numbers',
      celebration: 'badge_unlock_small'
    },
    'ten_master': {
      name: 'Ten Master',
      description: 'You understand tens!',
      criteria: { tensAccuracy: 0.9, tensProblems: 20 },
      icon: 'ten_rod_gold',
      celebration: 'badge_unlock_medium'
    },
    'place_value_pro': {
      name: 'Place Value Pro',
      description: 'Built numbers with hundreds, tens, and ones!',
      criteria: { threeDigitAccuracy: 0.85, threeDigitProblems: 15 },
      icon: 'trophy_blocks',
      celebration: 'badge_unlock_large'
    },
    'sorter_supreme': {
      name: 'Sorter Supreme',
      description: 'Sorted 50 numbers correctly!',
      criteria: { sortProblems: 50, sortAccuracy: 0.8 },
      icon: 'rainbow_sort',
      celebration: 'badge_unlock_medium'
    },
    'persistence': {
      name: 'Never Give Up',
      description: 'Kept trying even when it was hard!',
      criteria: { recoveredFromStruggle: true },
      icon: 'mountain_climb',
      celebration: 'badge_unlock_special'
    }
  },

  /**
   * Progress Visualization (not competitive)
   */
  progressDisplay: {
    type: 'garden_metaphor',  // Knowledge grows like a garden
    elements: {
      seeds: 'concepts_introduced',
      sprouts: 'concepts_practiced',
      flowers: 'concepts_mastered',
      trees: 'skill_areas_completed'
    }
  },

  /**
   * Session Rewards (process-focused)
   */
  sessionRewards: {
    'great_effort': {
      trigger: 'completed_full_session',
      message: "You practiced math today! That's how we grow.",
      type: 'acknowledgment'
    },
    'improvement': {
      trigger: 'accuracy_improved',
      message: "You're getting better! Practice helps!",
      type: 'progress_note'
    },
    'challenge_accepted': {
      trigger: 'attempted_hard_problem',
      message: "Wow, you tried a tough one!",
      type: 'effort_praise'
    }
  }
};
```

#### 4.1.3 Celebration Calibration

```javascript
/**
 * Celebrations are designed to be satisfying without being overstimulating
 */
const CELEBRATION_LEVELS = {
  minimal: {
    name: 'Correct answer (routine)',
    duration: 800,
    elements: ['soft_chime', 'green_checkmark', 'subtle_pulse'],
    intensity: 0.3
  },

  small: {
    name: 'Streak of 3',
    duration: 1200,
    elements: ['pleasant_ding', 'sparkle_burst_small', 'text_encouragement'],
    intensity: 0.5
  },

  medium: {
    name: 'Level completion / Badge earned',
    duration: 2500,
    elements: ['achievement_sound', 'confetti_small', 'badge_reveal', 'text_celebration'],
    intensity: 0.7
  },

  large: {
    name: 'Major milestone',
    duration: 4000,
    elements: ['fanfare_short', 'confetti_medium', 'character_celebration', 'badge_showcase'],
    intensity: 0.85
  },

  special: {
    name: 'Rare achievement (persistence, comeback)',
    duration: 3000,
    elements: ['warm_music', 'personal_message', 'unique_animation'],
    intensity: 0.7,
    note: 'Emotional resonance over visual intensity'
  }
};

// IMPORTANT: No celebration should exceed 4 seconds
// No flashing lights (accessibility)
// Always skippable after 1 second
```

### 4.2 Audio Feedback Specifications

#### 4.2.1 Sound Design Principles

- **Non-annoying:** Sounds parents can tolerate hearing repeatedly
- **Informative:** Distinct sounds for different feedback types
- **Calming:** Overall soundscape should reduce, not increase, anxiety
- **Optional:** All sounds can be muted; visual feedback always available

#### 4.2.2 Sound Inventory

```yaml
# Sound Effect Specifications

interaction_sounds:
  block_pickup:
    description: Soft click when block is selected
    duration: 80ms
    frequency: 800Hz base, soft attack
    volume: 0.3

  block_drop:
    description: Gentle thud when block placed
    duration: 120ms
    frequency: 400Hz, fast decay
    volume: 0.4

  block_connect:
    description: Satisfying snap when blocks align
    duration: 150ms
    frequency: 600Hz, crisp
    volume: 0.5

  card_slide:
    description: Smooth slide for sorting cards
    duration: 200ms
    type: swoosh
    volume: 0.3

feedback_sounds:
  correct_simple:
    description: Pleasant ding for correct answer
    duration: 300ms
    notes: [C5, E5]  # Major third, positive
    volume: 0.5

  correct_excellent:
    description: Ascending chime for great performance
    duration: 500ms
    notes: [C5, E5, G5]  # Major chord arpeggio
    volume: 0.6

  try_again:
    description: Gentle, non-judgmental tone
    duration: 400ms
    notes: [E4, D4]  # Descending, but not sad
    volume: 0.4
    note: "Must NOT sound like a buzzer or error"

  hint_available:
    description: Soft chime indicating help is available
    duration: 200ms
    notes: [G4]
    volume: 0.3

achievement_sounds:
  badge_unlock:
    description: Celebratory but brief fanfare
    duration: 1200ms
    type: melodic_fanfare
    volume: 0.7

  level_complete:
    description: Triumphant but gentle completion sound
    duration: 800ms
    type: resolution_chord
    volume: 0.6

ambient_sounds:
  background_music:
    description: Optional calm background
    type: looping_ambient
    tempo: 70bpm
    key: C major / A minor
    volume: 0.2
    note: "Fades out during problem-solving focus"
```

#### 4.2.3 Audio Accessibility

```javascript
const AUDIO_SETTINGS = {
  masterVolume: {
    default: 0.7,
    range: [0, 1],
    userAdjustable: true
  },

  categories: {
    effects: { default: 0.8, mutable: true },
    music: { default: 0.5, mutable: true },
    voice: { default: 1.0, mutable: true }
  },

  // Screen reader compatibility
  screenReaderMode: {
    disableEffects: true,
    enhanceVoice: true,
    announceAllActions: true
  },

  // Hearing sensitivity mode
  reducedAudioMode: {
    removeHighFrequencies: true,
    lowerVolumeCeiling: 0.5,
    longerFades: true
  }
};
```

### 4.3 Animation Specifications

#### 4.3.1 Animation Principles

Based on Material Design and Apple HIG for children's apps:

- **Purposeful:** Every animation conveys meaning
- **Brief:** Most animations 200-400ms
- **Smooth:** 60fps minimum, ease curves preferred
- **Interruptible:** User action can cancel animations
- **Accessible:** Reduced motion mode available

#### 4.3.2 Core Animations

```javascript
const ANIMATIONS = {
  // Block Interactions
  blockPickup: {
    duration: 150,
    easing: 'ease-out',
    transform: 'scale(1.1)',
    shadow: 'elevate(8dp)',
    description: 'Block lifts and grows slightly'
  },

  blockDrop: {
    duration: 200,
    easing: 'ease-in-out',
    transform: 'scale(1.0)',
    bounce: {
      enabled: true,
      height: 4,
      cycles: 1
    },
    description: 'Block settles with tiny bounce'
  },

  blockSnap: {
    duration: 100,
    easing: 'ease-out',
    transform: 'translateToSnapPoint',
    pulse: {
      enabled: true,
      scale: 1.05,
      duration: 200
    },
    description: 'Quick snap to grid position'
  },

  // Validation Feedback
  correctAnswer: {
    duration: 600,
    sequence: [
      { time: 0, action: 'glow_green', duration: 300 },
      { time: 200, action: 'checkmark_appear', duration: 400 },
      { time: 400, action: 'subtle_bounce', duration: 200 }
    ],
    description: 'Green glow, checkmark draws in, subtle lift'
  },

  incorrectAnswer: {
    duration: 500,
    sequence: [
      { time: 0, action: 'highlight_orange', duration: 300 },
      { time: 100, action: 'gentle_shake', duration: 300, params: { distance: 4, cycles: 2 } }
    ],
    description: 'Orange highlight with gentle shake (NOT red, NOT alarming)'
  },

  // Number Transitions
  numberCountUp: {
    duration: 'dynamic', // 50ms per unit, max 1000ms
    easing: 'linear',
    style: 'odometer',
    description: 'Running total display counts up as blocks added'
  },

  // Card Sorting
  cardSlide: {
    duration: 250,
    easing: 'ease-in-out',
    transform: 'translateX/Y',
    description: 'Card smoothly moves to new position'
  },

  cardSwap: {
    duration: 400,
    easing: 'ease-in-out',
    style: 'arc_path', // Cards move in slight arc, not straight line
    description: 'Two cards elegantly swap positions'
  },

  // Progress & Rewards
  progressFill: {
    duration: 800,
    easing: 'ease-out',
    style: 'liquid_fill',
    description: 'Progress bar fills with satisfying flow'
  },

  badgeReveal: {
    duration: 2000,
    sequence: [
      { time: 0, action: 'badge_fade_in', duration: 500 },
      { time: 300, action: 'shimmer', duration: 800 },
      { time: 800, action: 'settle', duration: 400 }
    ],
    description: 'Badge fades in with shimmer effect'
  }
};
```

#### 4.3.3 Reduced Motion Mode

```javascript
const REDUCED_MOTION = {
  enabled: false, // Set by system preference or user setting

  /**
   * Transforms animations for users who prefer reduced motion
   */
  transform(animation) {
    return {
      ...animation,
      duration: Math.min(animation.duration, 200),
      bounce: { enabled: false },
      sequence: animation.sequence?.map(s => ({
        ...s,
        action: this.simplifyAction(s.action)
      }))
    };
  },

  simplifyAction(action) {
    const replacements = {
      'gentle_shake': 'border_pulse',
      'bounce': 'none',
      'confetti': 'glow',
      'shimmer': 'fade'
    };
    return replacements[action] || action;
  }
};
```

### 4.4 Accessibility Requirements

#### 4.4.1 Visual Accessibility

```javascript
const VISUAL_ACCESSIBILITY = {
  // Color blindness support
  colorBlindModes: {
    protanopia: {
      unit: '#4ECDC4',     // Unchanged (teal OK)
      ten: '#FFB347',      // Orange instead of red
      hundred: '#95E1D3',  // Unchanged
      success: '#7DCE82',  // Unchanged
      error: '#FFB347'     // Orange instead of red
    },
    deuteranopia: {
      // Similar adjustments
    },
    tritanopia: {
      // Similar adjustments
    }
  },

  // High contrast mode
  highContrast: {
    enabled: false,
    background: '#000000',
    foreground: '#FFFFFF',
    primary: '#FFFF00',
    secondary: '#00FFFF',
    borders: '2px solid white'
  },

  // Text sizing
  textScaling: {
    minimum: 1.0,
    default: 1.0,
    maximum: 2.0,
    increment: 0.25
  },

  // Visual indicators (not color-dependent)
  nonColorIndicators: {
    correct: 'checkmark_icon',
    incorrect: 'x_icon',
    hint: 'lightbulb_icon',
    progress: 'pattern_fill'  // Stripes, not just color
  }
};
```

#### 4.4.2 Motor Accessibility

```javascript
const MOTOR_ACCESSIBILITY = {
  // Touch target sizes (exceeds WCAG)
  touchTargets: {
    minimum: 44,  // points
    recommended: 64,
    spacing: 8
  },

  // Alternative input methods
  inputMethods: {
    touch: true,
    keyboard: true,
    switch: true,  // Switch access support
    voiceControl: true
  },

  // Drag-and-drop alternatives
  dragAlternatives: {
    tapToSelect: true,      // Tap source, tap destination
    holdAndRelease: true,   // Long-press source, release on destination
    keyboardNavigation: {
      arrows: 'move_selection',
      space: 'pick_up_or_drop',
      enter: 'confirm_placement'
    }
  },

  // Timing accommodations
  timing: {
    noTimeLimit: true,       // No timed challenges by default
    extendedTime: true,      // 2x time if timed features exist
    pauseAnytime: true       // Pause button always visible
  }
};
```

#### 4.4.3 Cognitive Accessibility

```javascript
const COGNITIVE_ACCESSIBILITY = {
  // Simplified mode
  simplifiedMode: {
    reducedOptions: true,       // Fewer blocks visible at once
    clearerInstructions: true,  // Step-by-step instructions
    persistentHints: true,      // Hints don't disappear
    slowerPacing: true          // More time between problems
  },

  // Focus support
  focusSupport: {
    highlightCurrentTask: true,
    dimIrrelevantUI: true,
    sequentialPresentation: true  // One thing at a time
  },

  // Memory support
  memorySupport: {
    targetAlwaysVisible: true,
    runningTotalShown: true,
    historyAccessible: true      // Can review previous problems
  },

  // Anxiety reduction
  anxietyReduction: {
    noFailureMessages: true,     // "Try again" not "Wrong"
    unlimitedAttempts: true,
    praiseEffort: true,          // Not just success
    calmFeedback: true           // No alarming sounds/visuals
  }
};
```

#### 4.4.4 Screen Reader Support

```javascript
const SCREEN_READER_SUPPORT = {
  // All elements have appropriate labels
  ariaLabels: {
    block_unit: 'One block, value 1',
    block_ten: 'Ten rod, value 10',
    block_hundred: 'Hundred flat, value 100',
    workspace: 'Building workspace, currently contains {description}',
    target: 'Target number is {n}',
    tray: 'Block tray, contains units, tens, and hundreds blocks'
  },

  // Live announcements
  liveRegions: {
    totalValue: 'Current total: {n}',
    feedback: '{message}',
    hint: 'Hint: {message}'
  },

  // Navigation
  focusManagement: {
    logicalOrder: true,
    skipLinks: true,
    landmarkRegions: true
  }
};
```

### 4.5 Parent Visibility

#### 4.5.1 Parent Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                    PARENT DASHBOARD                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Child: Emma                           Last Active: Today       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  OVERALL PROGRESS                                        │  │
│  │                                                          │  │
│  │  Build the Number: ████████████░░░░  Level 3 (75%)       │  │
│  │  Sort the Numbers: ██████░░░░░░░░░░  Level 2 (40%)       │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  THIS WEEK'S ACTIVITY                                    │  │
│  │                                                          │  │
│  │  Mon ██████  15 min                                      │  │
│  │  Tue ████    10 min                                      │  │
│  │  Wed ████████████  30 min                                │  │
│  │  Thu (no activity)                                       │  │
│  │  Fri ██████  15 min                                      │  │
│  │                                                          │  │
│  │  Total: 70 minutes  |  Streak: 3 days                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SKILL BREAKDOWN                                         │  │
│  │                                                          │  │
│  │  ✓ Counting 1-10      Mastered                          │  │
│  │  ✓ Building 1-10      Mastered                          │  │
│  │  ◐ Teen numbers       Developing (72% accuracy)         │  │
│  │  ○ Two-digit numbers  Not started                       │  │
│  │  ○ Place value        Not started                       │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  INSIGHTS                                                │  │
│  │                                                          │  │
│  │  💡 Emma is doing great with numbers 1-10!              │  │
│  │                                                          │  │
│  │  📚 She's working on understanding teen numbers.         │  │
│  │     At home, try counting objects in groups of 10.      │  │
│  │                                                          │  │
│  │  ⏰ Most productive sessions: Morning before school      │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [ Weekly Report ]  [ Detailed Analytics ]  [ Settings ]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.5.2 Progress Data Model

```javascript
const PARENT_ANALYTICS = {
  /**
   * Data collected and displayed to parents
   */
  metrics: {
    // Engagement metrics
    engagement: {
      totalTime: 'minutes',
      sessionsCount: 'number',
      averageSessionLength: 'minutes',
      dayStreak: 'number',
      lastActiveDate: 'date'
    },

    // Learning metrics
    learning: {
      currentLevel: {
        buildTheNumber: 'level_name',
        sortTheNumbers: 'level_name'
      },
      accuracyBySkill: {
        // e.g., { 'teen_numbers': 0.72, 'place_value': 0.85 }
      },
      problemsCompleted: 'number',
      conceptsMastered: ['skill_id'],
      conceptsInProgress: ['skill_id']
    },

    // Behavioral insights
    insights: {
      bestTimeOfDay: 'time_range',
      averageProblemsPerSession: 'number',
      hintUsageRate: 'percentage',
      persistenceScore: 'rating',  // Keeps trying after difficulty
      improvementTrend: 'up|stable|down'
    }
  },

  /**
   * Parent-friendly explanations
   */
  explanations: {
    'teen_numbers': {
      what: 'Understanding numbers 11-19',
      why: 'Teen numbers are tricky because we say "fourteen" but write "14" (one ten and four ones)',
      homeActivity: 'Count objects together, grouping them into tens. "We have 14 crayons - that\'s one group of 10 and 4 more!"'
    },
    'place_value': {
      what: 'Understanding that digit position determines value',
      why: 'This is the foundation for all arithmetic - knowing that 23 means "2 tens and 3 ones"',
      homeActivity: 'Use coins: 10 pennies = 1 dime. Ask "How many tens and ones in 35?"'
    }
  },

  /**
   * Privacy controls
   */
  privacy: {
    dataRetention: '2 years',
    exportable: true,
    deletable: true,
    sharedWith: 'none',  // Data is private to family
    advertisingUse: false
  }
};
```

#### 4.5.3 Weekly Report Email

```javascript
const WEEKLY_REPORT = {
  template: {
    subject: '{childName}\'s NumberSense Progress - Week of {date}',
    sections: [
      {
        name: 'summary',
        content: '{childName} practiced math for {totalMinutes} minutes this week!'
      },
      {
        name: 'achievements',
        content: 'New badges earned: {badges}\nConcepts mastered: {concepts}'
      },
      {
        name: 'focusAreas',
        content: 'Currently working on: {currentFocus}\nAccuracy: {accuracy}%'
      },
      {
        name: 'suggestion',
        content: 'Home activity idea: {homeActivity}'
      },
      {
        name: 'encouragement',
        content: '{personalizedEncouragement}'
      }
    ]
  },

  frequency: 'weekly',
  dayOfWeek: 'sunday',
  optOut: true
};
```

---

## 5. Technical Implementation Notes

### 5.1 State Management

```javascript
/**
 * Core game state structure
 */
const GAME_STATE_SCHEMA = {
  // Session state
  session: {
    id: 'uuid',
    startTime: 'timestamp',
    currentGame: 'build | sort',
    currentProblem: 'ProblemState',
    problemHistory: ['ProblemResult'],
    hintsUsed: 'number',
    timeElapsed: 'milliseconds'
  },

  // Player state (persisted)
  player: {
    id: 'uuid',
    profile: {
      name: 'string',
      avatar: 'string',
      createdAt: 'timestamp'
    },
    progress: {
      buildTheNumber: 'GameProgress',
      sortTheNumbers: 'GameProgress'
    },
    settings: 'PlayerSettings',
    badges: ['BadgeId'],
    statistics: 'PlayerStatistics'
  },

  // UI state
  ui: {
    currentScreen: 'ScreenId',
    modalOpen: 'ModalId | null',
    animationInProgress: 'boolean',
    audioEnabled: 'boolean'
  }
};

/**
 * Problem state for Build the Number
 */
const BUILD_PROBLEM_STATE = {
  target: 'number',
  workspace: {
    hundreds: 'number',
    tens: 'number',
    units: 'number',
    positions: ['BlockPosition']  // For visual layout
  },
  attempts: 'number',
  hintsShown: ['HintId'],
  startTime: 'timestamp',
  validationResult: 'ValidationResult | null'
};

/**
 * Problem state for Sort the Numbers
 */
const SORT_PROBLEM_STATE = {
  items: ['SortItem'],
  correctOrder: ['number'],
  currentOrder: ['number'],
  attempts: 'number',
  hintsShown: ['HintId'],
  startTime: 'timestamp',
  phase: 'visual | numeric'
};
```

### 5.2 Event System

```javascript
/**
 * Events emitted by game systems
 */
const GAME_EVENTS = {
  // Block interactions
  BLOCK_PICKED_UP: { blockType: 'string', source: 'tray | workspace' },
  BLOCK_DROPPED: { blockType: 'string', position: 'Position', valid: 'boolean' },
  BLOCK_REMOVED: { blockType: 'string', position: 'Position' },

  // Validation
  ANSWER_SUBMITTED: { problemId: 'string', answer: 'Answer' },
  ANSWER_VALIDATED: { problemId: 'string', result: 'ValidationResult' },

  // Progression
  PROBLEM_COMPLETED: { problemId: 'string', result: 'ProblemResult' },
  LEVEL_COMPLETED: { game: 'string', level: 'number' },
  BADGE_EARNED: { badgeId: 'string' },

  // Hints
  HINT_REQUESTED: { problemId: 'string', hintLevel: 'number' },
  HINT_SHOWN: { problemId: 'string', hintId: 'string' },

  // Session
  SESSION_STARTED: { playerId: 'string' },
  SESSION_ENDED: { playerId: 'string', duration: 'number', summary: 'SessionSummary' },

  // Analytics (for parent dashboard)
  ANALYTICS_UPDATE: { playerId: 'string', metrics: 'Metrics' }
};
```

### 5.3 Problem Generation Algorithm

```javascript
/**
 * Generates problems with appropriate difficulty and variety
 */
class ProblemGenerator {
  constructor(playerData, gameConfig) {
    this.player = playerData;
    this.config = gameConfig;
    this.recentProblems = [];
  }

  /**
   * Generates next problem with adaptive difficulty
   */
  generateNext() {
    // Determine difficulty based on recent performance
    const difficulty = this.calculateAdaptiveDifficulty();

    // Select problem type (with variety)
    const problemType = this.selectProblemType(difficulty);

    // Generate specific problem
    const problem = this.generateProblem(problemType, difficulty);

    // Ensure variety (no repeats of same number)
    if (this.recentProblems.includes(problem.target)) {
      return this.generateNext();  // Try again
    }

    // Track for variety
    this.recentProblems.push(problem.target);
    if (this.recentProblems.length > 5) {
      this.recentProblems.shift();
    }

    return problem;
  }

  /**
   * Calculates adaptive difficulty based on recent performance
   */
  calculateAdaptiveDifficulty() {
    const recent = this.player.history.slice(-10);
    const accuracy = recent.filter(p => p.correct).length / recent.length;

    if (accuracy > 0.9) return this.config.currentDifficulty + 0.1;
    if (accuracy < 0.6) return this.config.currentDifficulty - 0.1;
    return this.config.currentDifficulty;
  }

  /**
   * Selects problem type with interleaved practice
   */
  selectProblemType(difficulty) {
    const types = this.config.availableTypes.filter(t => t.minDifficulty <= difficulty);

    // Weighted random selection favoring less-practiced types
    const weights = types.map(t => {
      const practiced = this.player.typePractice[t.id] || 0;
      return 1 / (practiced + 1);  // Less practiced = higher weight
    });

    return this.weightedRandom(types, weights);
  }
}
```

### 5.4 Performance Considerations

```javascript
const PERFORMANCE_REQUIREMENTS = {
  // Rendering
  frameRate: {
    target: 60,
    minimum: 30
  },

  // Response times
  responseTimes: {
    blockPickup: 16,      // ms - immediate
    validation: 200,      // ms - feels instant
    problemLoad: 500,     // ms - acceptable
    levelTransition: 1000 // ms - with animation
  },

  // Memory
  memory: {
    maxTextures: '50MB',
    maxAudio: '20MB',
    stateSize: '1MB'
  },

  // Offline support
  offline: {
    enabled: true,
    syncOnReconnect: true,
    offlineProblems: 50  // Pre-generated for offline play
  }
};
```

### 5.5 Testing Requirements

```javascript
const TESTING_REQUIREMENTS = {
  // Unit tests
  unit: {
    validationLogic: 'full coverage',
    progressionLogic: 'full coverage',
    problemGeneration: 'full coverage'
  },

  // Integration tests
  integration: {
    gameFlows: ['complete_level', 'earn_badge', 'struggle_recovery'],
    dataSync: ['offline_to_online', 'multi_device'],
    accessibility: ['screen_reader', 'keyboard_only', 'switch_access']
  },

  // User testing
  user: {
    ageGroups: ['5-6', '6-7', '7-8'],
    sessionLength: '15-20 minutes',
    metrics: ['engagement', 'learning_gains', 'frustration_indicators'],
    parentFeedback: ['dashboard_clarity', 'report_usefulness']
  },

  // Accessibility testing
  accessibility: {
    wcag: '2.1 AA',
    screenReaders: ['VoiceOver', 'TalkBack'],
    colorBlindness: ['protanopia', 'deuteranopia', 'tritanopia'],
    motorImpairment: ['switch_access', 'eye_tracking']
  }
};
```

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| Base-10 Blocks | Manipulatives representing ones, tens, and hundreds |
| CRA | Concrete-Representational-Abstract progression |
| Decomposition | Breaking a number into parts (e.g., 15 = 10 + 5) |
| Intrinsic Motivation | Motivation from internal satisfaction, not external rewards |
| Place Value | The value of a digit based on its position |
| Scaffold | Temporary support to help learning |
| SDT | Self-Determination Theory |
| Ten Frame | Visual organizer showing numbers as groups up to 10 |

## Appendix B: References

1. Bruner, J.S. (1966). Toward a Theory of Instruction
2. Moyer-Packenham, P.S. & Westenskow, A. (2013). Effects of Virtual Manipulatives on Student Achievement and Mathematics Learning
3. Deci, E.L. & Ryan, R.M. (2000). Self-Determination Theory and the Facilitation of Intrinsic Motivation
4. Sweller, J. (1988). Cognitive Load During Problem Solving
5. Shute, V.J. (2008). Focus on Formative Feedback
6. Kapur, M. (2008). Productive Failure
7. Rohrer, D. (2012). Interleaving Helps Students Distinguish Among Similar Concepts

---

*Document Version: 1.0*
*Last Updated: 2026-01-24*
*Authors: Game Design Research Agent*
