/**
 * Lane Selector
 *
 * Implements weighted lane selection to prioritize lanes that are furthest behind
 */

import type { LaneState } from '../types';

/**
 * Select the next lane to ask a question for
 * Prioritizes lanes with the most steps remaining (furthest behind)
 *
 * Uses weighted random selection:
 * - Lanes with more steps remaining have higher probability of being selected
 * - This prevents one lane from getting stuck while others finish
 *
 * @param lanes Array of lane states
 * @returns Lane number to ask a question for, or -1 if all lanes are finished
 */
export function selectNextLane(lanes: LaneState[]): number {
  // Filter to only unfinished lanes
  const activeLanes = lanes.filter((lane) => !lane.finished);

  // If no active lanes, game is complete
  if (activeLanes.length === 0) {
    return -1;
  }

  // If only one active lane, select it
  if (activeLanes.length === 1) {
    const lane = activeLanes[0];
    return lane ? lane.laneNumber : -1;
  }

  // Calculate steps remaining for each lane
  const lanesWithRemaining = activeLanes.map((lane) => ({
    laneNumber: lane.laneNumber,
    stepsRemaining: lane.stepsTotal - lane.stepsCompleted,
  }));

  // Find the maximum steps remaining
  const maxStepsRemaining = Math.max(...lanesWithRemaining.map((l) => l.stepsRemaining));

  // Find all lanes that are tied for furthest behind
  const furthestBehindLanes = lanesWithRemaining.filter(
    (l) => l.stepsRemaining === maxStepsRemaining,
  );

  // If only one lane is furthest behind, select it
  if (furthestBehindLanes.length === 1) {
    const lane = furthestBehindLanes[0];
    return lane ? lane.laneNumber : -1;
  }

  // If multiple lanes are tied for furthest behind, randomly select one
  const randomIndex = Math.floor(Math.random() * furthestBehindLanes.length);
  const selectedLane = furthestBehindLanes[randomIndex];
  if (selectedLane) {
    return selectedLane.laneNumber;
  }
  const fallbackLane = activeLanes[0];
  return fallbackLane ? fallbackLane.laneNumber : -1;
}

/**
 * Get lanes sorted by priority (furthest behind first)
 * Useful for displaying lane order or debugging
 *
 * @param lanes Array of lane states
 * @returns Sorted array of lane numbers
 */
export function getLanesByPriority(lanes: LaneState[]): number[] {
  return lanes
    .filter((lane) => !lane.finished)
    .sort((a, b) => {
      const aRemaining = a.stepsTotal - a.stepsCompleted;
      const bRemaining = b.stepsTotal - b.stepsCompleted;
      return bRemaining - aRemaining; // Descending order (most remaining first)
    })
    .map((lane) => lane.laneNumber);
}
