/**
 * Lane Selector Tests
 */

import { describe, it, expect } from 'vitest';

import { selectNextLane, getLanesByPriority } from './laneSelector';

import type { LaneState } from '../types';

// Helper to create mock lane states
function createLane(
  laneNumber: number,
  stepsCompleted: number,
  stepsTotal = 20,
  finished = false,
): LaneState {
  return {
    laneNumber,
    label: `×${laneNumber.toString()}`,
    stepsCompleted,
    stepsTotal,
    finished,
    facts: [],
    progress: stepsCompleted / stepsTotal,
  };
}

describe('selectNextLane', () => {
  it('returns -1 when all lanes are finished', () => {
    const lanes = [
      createLane(0, 20, 20, true),
      createLane(1, 20, 20, true),
      createLane(2, 20, 20, true),
    ];

    expect(selectNextLane(lanes)).toBe(-1);
  });

  it('returns -1 when lanes array is empty', () => {
    expect(selectNextLane([])).toBe(-1);
  });

  it('returns only unfinished lane when one lane active', () => {
    const lanes = [
      createLane(0, 20, 20, true),
      createLane(1, 20, 20, true),
      createLane(2, 10, 20, false),
    ];

    expect(selectNextLane(lanes)).toBe(2);
  });

  it('prioritizes lane with most steps remaining', () => {
    const lanes = [
      createLane(0, 18, 20, false), // 2 remaining
      createLane(1, 5, 20, false), // 15 remaining - furthest behind
      createLane(2, 12, 20, false), // 8 remaining
    ];

    expect(selectNextLane(lanes)).toBe(1);
  });

  it('skips finished lanes', () => {
    const lanes = [
      createLane(0, 20, 20, true), // Finished
      createLane(1, 5, 20, false), // Active
      createLane(2, 10, 20, false), // Active
    ];

    const selected = selectNextLane(lanes);
    expect(selected).not.toBe(0);
    expect([1, 2]).toContain(selected);
  });

  it('handles lanes at 0 steps completed', () => {
    const lanes = [
      createLane(0, 0, 20, false), // 20 steps remaining
      createLane(1, 0, 20, false), // 20 steps remaining
      createLane(2, 5, 20, false), // 15 steps remaining
    ];

    // Should prioritize lanes with 0 progress (20 steps remaining)
    // Since lanes 0 and 1 are tied for most remaining, it should select one of them
    const selected = selectNextLane(lanes);
    expect([0, 1]).toContain(selected);
  });

  it('selects from tied lanes when multiple lanes have same steps remaining', () => {
    const lanes = [
      createLane(0, 10, 20, false),
      createLane(1, 10, 20, false),
      createLane(2, 10, 20, false),
    ];

    const selected = selectNextLane(lanes);
    expect([0, 1, 2]).toContain(selected);
  });

  it('works with 10 lanes (multiplication)', () => {
    const lanes = Array.from({ length: 10 }, (_, i) => createLane(i, i * 2, 20, false));

    const selected = selectNextLane(lanes);
    expect(selected).toBeGreaterThanOrEqual(0);
    expect(selected).toBeLessThan(10);
  });

  it('works with 9 lanes starting at 1 (division)', () => {
    const lanes = Array.from({ length: 9 }, (_, i) => createLane(i + 1, i * 2, 20, false));

    const selected = selectNextLane(lanes);
    expect(selected).toBeGreaterThanOrEqual(1);
    expect(selected).toBeLessThanOrEqual(9);
  });
});

describe('getLanesByPriority', () => {
  it('returns lanes sorted by steps remaining (descending)', () => {
    const lanes = [
      createLane(0, 18, 20, false), // 2 remaining
      createLane(1, 5, 20, false), // 15 remaining
      createLane(2, 12, 20, false), // 8 remaining
    ];

    const sorted = getLanesByPriority(lanes);
    expect(sorted).toEqual([1, 2, 0]); // Most remaining first
  });

  it('excludes finished lanes', () => {
    const lanes = [
      createLane(0, 20, 20, true), // Finished
      createLane(1, 5, 20, false), // 15 remaining
      createLane(2, 12, 20, false), // 8 remaining
    ];

    const sorted = getLanesByPriority(lanes);
    expect(sorted).toEqual([1, 2]);
    expect(sorted).not.toContain(0);
  });

  it('returns empty array when all lanes finished', () => {
    const lanes = [createLane(0, 20, 20, true), createLane(1, 20, 20, true)];

    const sorted = getLanesByPriority(lanes);
    expect(sorted).toEqual([]);
  });
});
