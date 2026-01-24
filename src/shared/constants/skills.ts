/**
 * Skill-related constants for NumberSense K-3
 */

/**
 * Skill categories
 */
export const SKILL_CATEGORIES = {
  COUNTING: 'counting',
  PLACE_VALUE: 'place-value',
  COMPARISON: 'comparison',
  NUMBER_SENSE: 'number-sense',
} as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[keyof typeof SKILL_CATEGORIES];

/**
 * Individual skill identifiers
 */
export const SKILL_IDS = {
  // Counting skills
  COUNT_TO_10: 'count-to-10',
  COUNT_TO_20: 'count-to-20',
  COUNT_TO_100: 'count-to-100',
  SKIP_COUNT_BY_2: 'skip-count-by-2',
  SKIP_COUNT_BY_5: 'skip-count-by-5',
  SKIP_COUNT_BY_10: 'skip-count-by-10',

  // Place value skills
  IDENTIFY_ONES: 'identify-ones',
  IDENTIFY_TENS: 'identify-tens',
  IDENTIFY_HUNDREDS: 'identify-hundreds',
  COMPOSE_NUMBERS: 'compose-numbers',
  DECOMPOSE_NUMBERS: 'decompose-numbers',

  // Comparison skills
  COMPARE_SINGLE_DIGIT: 'compare-single-digit',
  COMPARE_TWO_DIGIT: 'compare-two-digit',
  COMPARE_THREE_DIGIT: 'compare-three-digit',
  ORDER_NUMBERS: 'order-numbers',

  // Number sense skills
  NUMBER_BONDS_TO_10: 'number-bonds-to-10',
  NUMBER_BONDS_TO_20: 'number-bonds-to-20',
  ESTIMATE_QUANTITY: 'estimate-quantity',
} as const;

export type SkillId = (typeof SKILL_IDS)[keyof typeof SKILL_IDS];

/**
 * Skill definitions with metadata
 */
export interface SkillDefinition {
  id: SkillId;
  name: string;
  category: SkillCategory;
  description: string;
}

/**
 * All skill definitions
 */
export const SKILL_DEFINITIONS: Record<SkillId, SkillDefinition> = {
  // Counting skills
  'count-to-10': {
    id: 'count-to-10',
    name: 'Count to 10',
    category: SKILL_CATEGORIES.COUNTING,
    description: 'Count objects from 1 to 10',
  },
  'count-to-20': {
    id: 'count-to-20',
    name: 'Count to 20',
    category: SKILL_CATEGORIES.COUNTING,
    description: 'Count objects from 1 to 20',
  },
  'count-to-100': {
    id: 'count-to-100',
    name: 'Count to 100',
    category: SKILL_CATEGORIES.COUNTING,
    description: 'Count objects from 1 to 100',
  },
  'skip-count-by-2': {
    id: 'skip-count-by-2',
    name: 'Skip Count by 2',
    category: SKILL_CATEGORIES.COUNTING,
    description: 'Count by twos: 2, 4, 6, 8...',
  },
  'skip-count-by-5': {
    id: 'skip-count-by-5',
    name: 'Skip Count by 5',
    category: SKILL_CATEGORIES.COUNTING,
    description: 'Count by fives: 5, 10, 15, 20...',
  },
  'skip-count-by-10': {
    id: 'skip-count-by-10',
    name: 'Skip Count by 10',
    category: SKILL_CATEGORIES.COUNTING,
    description: 'Count by tens: 10, 20, 30, 40...',
  },

  // Place value skills
  'identify-ones': {
    id: 'identify-ones',
    name: 'Identify Ones',
    category: SKILL_CATEGORIES.PLACE_VALUE,
    description: 'Identify the ones place in a number',
  },
  'identify-tens': {
    id: 'identify-tens',
    name: 'Identify Tens',
    category: SKILL_CATEGORIES.PLACE_VALUE,
    description: 'Identify the tens place in a number',
  },
  'identify-hundreds': {
    id: 'identify-hundreds',
    name: 'Identify Hundreds',
    category: SKILL_CATEGORIES.PLACE_VALUE,
    description: 'Identify the hundreds place in a number',
  },
  'compose-numbers': {
    id: 'compose-numbers',
    name: 'Compose Numbers',
    category: SKILL_CATEGORIES.PLACE_VALUE,
    description: 'Build numbers from place value components',
  },
  'decompose-numbers': {
    id: 'decompose-numbers',
    name: 'Decompose Numbers',
    category: SKILL_CATEGORIES.PLACE_VALUE,
    description: 'Break numbers into place value components',
  },

  // Comparison skills
  'compare-single-digit': {
    id: 'compare-single-digit',
    name: 'Compare Single Digits',
    category: SKILL_CATEGORIES.COMPARISON,
    description: 'Compare numbers 0-9',
  },
  'compare-two-digit': {
    id: 'compare-two-digit',
    name: 'Compare Two-Digit Numbers',
    category: SKILL_CATEGORIES.COMPARISON,
    description: 'Compare numbers 10-99',
  },
  'compare-three-digit': {
    id: 'compare-three-digit',
    name: 'Compare Three-Digit Numbers',
    category: SKILL_CATEGORIES.COMPARISON,
    description: 'Compare numbers 100-999',
  },
  'order-numbers': {
    id: 'order-numbers',
    name: 'Order Numbers',
    category: SKILL_CATEGORIES.COMPARISON,
    description: 'Put numbers in order from least to greatest or greatest to least',
  },

  // Number sense skills
  'number-bonds-to-10': {
    id: 'number-bonds-to-10',
    name: 'Number Bonds to 10',
    category: SKILL_CATEGORIES.NUMBER_SENSE,
    description: 'Know pairs of numbers that add to 10',
  },
  'number-bonds-to-20': {
    id: 'number-bonds-to-20',
    name: 'Number Bonds to 20',
    category: SKILL_CATEGORIES.NUMBER_SENSE,
    description: 'Know pairs of numbers that add to 20',
  },
  'estimate-quantity': {
    id: 'estimate-quantity',
    name: 'Estimate Quantity',
    category: SKILL_CATEGORIES.NUMBER_SENSE,
    description: 'Estimate the number of objects in a group',
  },
} as const;

/**
 * Skills mapped to games
 */
export const GAME_SKILLS = {
  'build-the-number': [
    SKILL_IDS.IDENTIFY_ONES,
    SKILL_IDS.IDENTIFY_TENS,
    SKILL_IDS.IDENTIFY_HUNDREDS,
    SKILL_IDS.COMPOSE_NUMBERS,
    SKILL_IDS.DECOMPOSE_NUMBERS,
  ],
  'sort-the-numbers': [
    SKILL_IDS.COMPARE_SINGLE_DIGIT,
    SKILL_IDS.COMPARE_TWO_DIGIT,
    SKILL_IDS.COMPARE_THREE_DIGIT,
    SKILL_IDS.ORDER_NUMBERS,
  ],
} as const;
