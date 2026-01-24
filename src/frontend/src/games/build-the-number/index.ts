/**
 * Build the Number Game
 *
 * A math game where children build target numbers using base-10 blocks.
 * This module exports all components for the "Build the Number" game.
 *
 * Easy Mode (default):
 * - Numbers 1-10 only
 * - Unit cubes only (no tens or hundreds)
 * - Visual hints with dot patterns
 * - Simple, encouraging feedback
 *
 * Based on game-mechanics.md specifications for K-3 children.
 *
 * @example
 * ```tsx
 * import { BuildTheNumberGame } from '@/games/build-the-number';
 *
 * function GamePage() {
 *   return (
 *     <BuildTheNumberGame
 *       difficulty="easy"
 *       onSessionEnd={() => navigate('/games')}
 *     />
 *   );
 * }
 * ```
 */

// Main game component
export { BuildTheNumberGame } from './BuildTheNumberGame';
export type { BuildTheNumberGameProps } from './BuildTheNumberGame';

// Sub-components
export { TargetDisplay } from './TargetDisplay';
export type { TargetDisplayProps } from './TargetDisplay';

export { Workspace } from './Workspace';
export type { WorkspaceProps } from './Workspace';

export { GameControls } from './GameControls';
export type { GameControlsProps } from './GameControls';
