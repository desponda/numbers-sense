/**
 * NumberSense K-3 Shared Constants
 *
 * Re-exports all constants for easy importing.
 */

// Game constants
export {
  GAME_IDS,
  GAME_ID_LIST,
  DIFFICULTY_MODES,
  DIFFICULTY_MODE_LIST,
  GRADE_LEVELS,
  GRADE_LEVEL_LIST,
  GAME_CONFIGS,
  DEFAULT_PROBLEMS_PER_SESSION,
  MAX_HINTS_PER_PROBLEM,
  NUMBER_RANGES,
} from './games.js';

// Skill constants
export {
  SKILL_CATEGORIES,
  SKILL_IDS,
  SKILL_DEFINITIONS,
  GAME_SKILLS,
} from './skills.js';

export type { SkillCategory, SkillId, SkillDefinition } from './skills.js';
