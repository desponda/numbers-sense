import type { JSX } from 'react';

import type { LaneState } from '../types';

/**
 * Props for the BikeRaceLane component
 */
export interface BikeRaceLaneProps {
  /** Lane state data */
  lane: LaneState;
  /** Whether this lane is currently active (answering question for this lane) */
  isActive: boolean;
  /** Callback when lane is clicked */
  onClick?: () => void;
}

/**
 * BikeRaceLane - Single lane component showing bike progress
 *
 * Features:
 * - Shows bike icon at current position
 * - Visual progress bar
 * - Finish line indicator
 * - Progress counter (e.g., "7/20")
 * - Highlights when active
 * - Checkmark when finished
 * - Animates bike movement with Framer Motion
 *
 * Accessibility:
 * - ARIA progressbar role
 * - Screen reader announces progress
 * - Keyboard navigable
 *
 * @example
 * ```tsx
 * <BikeRaceLane
 *   lane={laneState}
 *   isActive={currentLane === laneState.laneNumber}
 *   onClick={() => handleLaneClick(laneState.laneNumber)}
 * />
 * ```
 */
export const BikeRaceLane = ({ lane, isActive, onClick }: BikeRaceLaneProps): JSX.Element => {
  const progressPercentage = lane.progress * 100;

  return (
    <div
      className={`
        relative flex items-center gap-3 p-3 rounded-xl
        transition-all duration-normal
        ${isActive ? 'bg-yellow-100 border-2 border-yellow-400 shadow-medium' : 'bg-background-cream border-2 border-background-warm'}
        ${lane.finished ? 'bg-success-50 border-success' : ''}
        ${onClick ? 'cursor-pointer hover:bg-background-warm' : ''}
      `}
      onClick={onClick}
      role="progressbar"
      aria-valuenow={lane.stepsCompleted}
      aria-valuemin={0}
      aria-valuemax={lane.stepsTotal}
      aria-label={`Lane ${lane.label}: ${String(lane.stepsCompleted)} out of ${String(lane.stepsTotal)} completed${lane.finished ? ', finished' : ''}${isActive ? ', currently active' : ''}`}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Lane label */}
      <div
        className="flex-shrink-0 w-16 text-center font-bold text-lg text-text-primary"
        aria-hidden="true"
      >
        {lane.label}
      </div>

      {/* Progress track */}
      <div className="flex-1 relative h-12 bg-background-warm rounded-lg border border-text-light">
        {/* Progress bar (with overflow hidden to prevent spillover) */}
        <div
          className="absolute inset-y-0 left-0 bg-primary-200 transition-all duration-slow rounded-lg overflow-hidden"
          style={{ width: `${String(progressPercentage)}%` }}
        />

        {/* Bike icon (min left position to prevent clipping) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 text-3xl z-10 drop-shadow-md transition-all duration-slow"
          style={{
            left: `max(2px, calc(${String(progressPercentage)}% - 16px))`,
          }}
          aria-hidden="true"
        >
          🚴
        </div>

        {/* Finish line */}
        <div
          className="absolute top-0 right-0 bottom-0 w-12 flex items-center justify-center text-3xl bg-background-warm"
          aria-hidden="true"
        >
          🏁
        </div>
      </div>

      {/* Progress counter */}
      <div
        className="flex-shrink-0 w-20 text-center font-semibold text-base text-text-secondary"
        aria-hidden="true"
      >
        {lane.stepsCompleted}/{lane.stepsTotal}
      </div>

      {/* Finished checkmark */}
      {lane.finished && (
        <div className="absolute -right-2 -top-2 text-3xl animate-pop" aria-hidden="true">
          ✅
        </div>
      )}

      {/* Active indicator */}
      {isActive && (
        <div
          className="absolute -left-2 top-1/2 -translate-y-1/2 text-2xl animate-pulse"
          aria-hidden="true"
        >
          👉
        </div>
      )}
    </div>
  );
};
