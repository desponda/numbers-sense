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
        h-16 md:h-18
        ${isActive ? 'bg-yellow-100 border-2 border-yellow-400 shadow-lg shadow-yellow-200 ring-2 ring-yellow-300' : 'bg-background-cream border-2 border-background-warm'}
        ${lane.finished ? 'bg-success-50 border-success' : ''}
        ${onClick ? 'cursor-pointer hover:bg-background-warm' : ''}
      `}
      onClick={onClick}
      role="progressbar"
      aria-valuenow={lane.stepsCompleted}
      aria-valuemin={0}
      aria-valuemax={lane.stepsTotal}
      aria-label={`Lane ${lane.label} racing to ${String(lane.stepsTotal)} correct answers. Currently at ${String(lane.stepsCompleted)} answers${lane.finished ? '. Finished!' : `. ${String(lane.stepsTotal - lane.stepsCompleted)} more to go!`}${isActive ? ' Currently active lane.' : ''}`}
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
        className="flex-shrink-0 w-12 md:w-16 text-center font-bold text-lg md:text-xl text-text-primary"
        aria-hidden="true"
      >
        {lane.label}
      </div>

      {/* Race track with thick visible line */}
      <div className="flex-1 relative h-12 flex items-center">
        {/* Track line container */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 md:h-2 flex items-center">
          {/* Completed portion - thick solid line */}
          <div
            className="h-1.5 md:h-2 bg-primary-400 rounded-l-full transition-all duration-slow"
            style={{ width: `${String(progressPercentage)}%` }}
          />

          {/* Remaining portion - thick visible dashed line */}
          <div
            className="h-1.5 md:h-2 flex-1 rounded-r-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to right, #CBD5E0 0px, #CBD5E0 8px, transparent 8px, transparent 16px)',
              backgroundPosition: 'top',
              backgroundSize: '16px 100%',
            }}
          />
        </div>

        {/* Bike icon - larger and positioned along track */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-3xl md:text-4xl z-10 drop-shadow-lg transition-all duration-slow"
          style={{
            left: `max(5%, min(${String(progressPercentage)}%, 95%))`,
          }}
          aria-hidden="true"
        >
          🚴
        </div>

        {/* Finish line at end of track */}
        <div
          className="absolute top-1/2 -translate-y-1/2 right-0 text-3xl md:text-4xl"
          aria-hidden="true"
        >
          🏁
        </div>
      </div>

      {/* Progress counter */}
      <div
        className="flex-shrink-0 w-16 md:w-20 text-center font-semibold text-base md:text-lg text-text-secondary"
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
