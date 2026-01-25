/**
 * Games Module
 *
 * Exports all game components for the NumberSense app.
 */

// Build the Number game
export { BuildTheNumberGame, TargetDisplay, Workspace, GameControls } from './build-the-number';

export type {
  BuildTheNumberGameProps,
  TargetDisplayProps,
  WorkspaceProps,
  GameControlsProps,
} from './build-the-number';

// Race games
export { MultiplicationRaceGame } from './multiplication-race';
export type { MultiplicationRaceGameProps } from './multiplication-race';

export { DivisionRaceGame } from './division-race';
export type { DivisionRaceGameProps } from './division-race';

export { AdditionRaceGame } from './addition-race';
export type { AdditionRaceGameProps } from './addition-race';

export { SubtractionRaceGame } from './subtraction-race';
export type { SubtractionRaceGameProps } from './subtraction-race';
