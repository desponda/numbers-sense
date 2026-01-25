import type { JSX } from 'react';

import { BikeRaceLane } from './BikeRaceLane';

import type { LaneState } from '../types';

/**
 * Props for the RaceTrack component
 */
export interface RaceTrackProps {
  /** Array of lane states to display */
  lanes: LaneState[];
  /** Currently active lane number (null if no active question) */
  currentLane: number | null;
  /** Callback when a lane is clicked */
  onLaneClick?: (laneNumber: number) => void;
  /** Additional CSS class names */
  className?: string;
}

/**
 * RaceTrack - Main track displaying all race lanes
 *
 * Features:
 * - Displays all bike lanes in vertical stack
 * - Highlights current active lane
 * - Shows progress for each lane
 * - Responsive layout
 *
 * Layout:
 * - Vertical stack of lanes
 * - Consistent spacing between lanes
 * - Scrollable on smaller screens
 * - Maximum 10 lanes visible
 *
 * Accessibility:
 * - Each lane is keyboard navigable
 * - Screen reader announces lane states
 * - Proper ARIA roles
 *
 * @example
 * ```tsx
 * <RaceTrack
 *   lanes={allLanes}
 *   currentLane={5}
 *   onLaneClick={(lane) => console.log(`Lane ${lane} clicked`)}
 * />
 * ```
 */
export const RaceTrack = ({
  lanes,
  currentLane,
  onLaneClick,
  className = '',
}: RaceTrackProps): JSX.Element => {
  return (
    <div
      className={`
        w-full max-w-4xl mx-auto
        space-y-3 md:space-y-4
        ${className}
      `}
      role="group"
      aria-label="Race track with all lanes"
    >
      {lanes.map((lane) => (
        <BikeRaceLane
          key={lane.laneNumber}
          lane={lane}
          isActive={lane.laneNumber === currentLane}
          onClick={
            onLaneClick
              ? (): void => {
                  onLaneClick(lane.laneNumber);
                }
              : undefined
          }
        />
      ))}
    </div>
  );
};
