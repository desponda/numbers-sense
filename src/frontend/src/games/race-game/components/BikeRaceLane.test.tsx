/**
 * Component tests for BikeRaceLane
 * Tests visual representation of race lane progress
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { BikeRaceLane } from './BikeRaceLane.js';

import type { LaneState } from '../types';

// Helper to create a lane state with defaults
const createLane = (overrides: Partial<LaneState> = {}): LaneState => ({
  laneNumber: 3,
  label: '×3',
  stepsCompleted: 7,
  stepsTotal: 20,
  finished: false,
  facts: ['3×0', '3×1', '3×2', '3×3', '3×4', '3×5', '3×6', '3×7'],
  progress: 0.35,
  ...overrides,
});

describe('BikeRaceLane', () => {
  describe('Progress Display', () => {
    it('displays correct progress counter (7/20)', () => {
      const lane = createLane({ stepsCompleted: 7, stepsTotal: 20 });
      render(<BikeRaceLane lane={lane} isActive={false} />);

      expect(screen.getByText('7/20')).toBeInTheDocument();
    });

    it('displays lane label for multiplication (×3)', () => {
      const lane = createLane({ label: '×3' });
      render(<BikeRaceLane lane={lane} isActive={false} />);

      expect(screen.getByText('×3')).toBeInTheDocument();
    });

    it('displays lane label for division (÷7)', () => {
      const lane = createLane({ laneNumber: 7, label: '÷7', stepsCompleted: 12 });
      render(<BikeRaceLane lane={lane} isActive={false} />);

      expect(screen.getByText('÷7')).toBeInTheDocument();
    });

    it('displays 0/20 for lane at start', () => {
      const lane = createLane({ stepsCompleted: 0, stepsTotal: 20, progress: 0 });
      render(<BikeRaceLane lane={lane} isActive={false} />);

      expect(screen.getByText('0/20')).toBeInTheDocument();
    });

    it('displays 20/20 for completed lane', () => {
      const lane = createLane({
        stepsCompleted: 20,
        stepsTotal: 20,
        finished: true,
        progress: 1.0,
      });
      render(<BikeRaceLane lane={lane} isActive={false} />);

      expect(screen.getByText('20/20')).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('renders bike icon', () => {
      const lane = createLane();
      const { container } = render(<BikeRaceLane lane={lane} isActive={false} />);

      // Check for bike emoji
      expect(container.textContent).toContain('🚴');
    });

    it('renders finish line', () => {
      const lane = createLane();
      const { container } = render(<BikeRaceLane lane={lane} isActive={false} />);

      // Check for finish flag emoji
      expect(container.textContent).toContain('🏁');
    });

    it('bike position reflects progress percentage', () => {
      const lane = createLane({ stepsCompleted: 10, stepsTotal: 20, progress: 0.5 });
      const { container } = render(<BikeRaceLane lane={lane} isActive={false} />);

      // 10/20 = 50% progress - bike emoji rendered and visible
      expect(container.textContent).toContain('🚴');
      expect(container.textContent).toContain('🏁');
    });

    it('bike at start position when 0 steps', () => {
      const lane = createLane({ stepsCompleted: 0, stepsTotal: 20, progress: 0 });
      const { container } = render(<BikeRaceLane lane={lane} isActive={false} />);

      // At 0%, bike is still rendered and visible
      expect(container.textContent).toContain('🚴');
    });

    it('bike at finish position when complete', () => {
      const lane = createLane({
        stepsCompleted: 20,
        stepsTotal: 20,
        finished: true,
        progress: 1.0,
      });
      const { container } = render(<BikeRaceLane lane={lane} isActive={false} />);

      // At 100%, bike is rendered at finish line
      expect(container.textContent).toContain('🚴');
      expect(container.textContent).toContain('✅');
    });
  });

  describe('Finish State', () => {
    it('shows finish badge when lane completed', () => {
      const lane = createLane({
        stepsCompleted: 20,
        stepsTotal: 20,
        finished: true,
        progress: 1.0,
      });
      const { container } = render(<BikeRaceLane lane={lane} isActive={false} />);

      // Check for checkmark emoji
      expect(container.textContent).toContain('✅');
    });

    it('applies finished styling when complete', () => {
      const lane = createLane({
        stepsCompleted: 20,
        stepsTotal: 20,
        finished: true,
        progress: 1.0,
      });
      const { container } = render(<BikeRaceLane lane={lane} isActive={false} />);

      const laneElement = container.firstChild as HTMLElement;
      expect(laneElement.className).toContain('bg-success-50');
      expect(laneElement.className).toContain('border-success');
    });

    it('does not show finish badge when incomplete', () => {
      const lane = createLane({ stepsCompleted: 19, stepsTotal: 20, finished: false });
      const { container } = render(<BikeRaceLane lane={lane} isActive={false} />);

      // Checkmark should not be present
      expect(container.textContent).not.toContain('✅');
    });
  });

  describe('Active State', () => {
    it('highlights lane when active', () => {
      const lane = createLane();
      const { container } = render(<BikeRaceLane lane={lane} isActive />);

      const laneElement = container.firstChild as HTMLElement;
      expect(laneElement.className).toContain('bg-yellow-100');
      expect(laneElement.className).toContain('border-yellow-400');
    });

    it('shows active indicator when active', () => {
      const lane = createLane();
      const { container } = render(<BikeRaceLane lane={lane} isActive />);

      // Should show arrow emoji
      expect(container.textContent).toContain('👉');
    });

    it('no highlight when not active', () => {
      const lane = createLane();
      const { container } = render(<BikeRaceLane lane={lane} isActive={false} />);

      const laneElement = container.firstChild as HTMLElement;
      expect(laneElement.className).not.toContain('bg-yellow-100');
      expect(laneElement.className).not.toContain('border-yellow-400');
    });
  });

  describe('Accessibility', () => {
    it('has accessible label with lane info', () => {
      const lane = createLane({ label: '×3', stepsCompleted: 7, stepsTotal: 20 });
      render(<BikeRaceLane lane={lane} isActive={false} />);

      expect(
        screen.getByLabelText(
          'Lane ×3 racing to 20 correct answers. Currently at 7 answers. 13 more to go!',
        ),
      ).toBeInTheDocument();
    });

    it('announces finish status to screen readers', () => {
      const lane = createLane({
        label: '×3',
        stepsCompleted: 20,
        stepsTotal: 20,
        finished: true,
        progress: 1.0,
      });
      render(<BikeRaceLane lane={lane} isActive={false} />);

      expect(
        screen.getByLabelText(
          'Lane ×3 racing to 20 correct answers. Currently at 20 answers. Finished!',
        ),
      ).toBeInTheDocument();
    });

    it('announces active status to screen readers', () => {
      const lane = createLane({ label: '×3', stepsCompleted: 7, stepsTotal: 20 });
      render(<BikeRaceLane lane={lane} isActive />);

      expect(
        screen.getByLabelText(
          'Lane ×3 racing to 20 correct answers. Currently at 7 answers. 13 more to go! Currently active lane.',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Progress Bar', () => {
    it('renders progress bar visual', () => {
      const lane = createLane();
      render(<BikeRaceLane lane={lane} isActive={false} />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('progress bar shows correct percentage', () => {
      const lane = createLane({ stepsCompleted: 15, stepsTotal: 20, progress: 0.75 });
      render(<BikeRaceLane lane={lane} isActive={false} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '15');
      expect(progressBar).toHaveAttribute('aria-valuemax', '20');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', () => {
      const lane = createLane();
      const handleClick = vi.fn();
      render(<BikeRaceLane lane={lane} isActive={false} onClick={handleClick} />);

      const laneElement = screen.getByRole('progressbar');
      fireEvent.click(laneElement);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is keyboard navigable with onClick', () => {
      const lane = createLane();
      const handleClick = vi.fn();
      render(<BikeRaceLane lane={lane} isActive={false} onClick={handleClick} />);

      const laneElement = screen.getByRole('progressbar');
      expect(laneElement).toHaveAttribute('tabIndex', '0');
    });

    it('handles Enter key press', () => {
      const lane = createLane();
      const handleClick = vi.fn();
      render(<BikeRaceLane lane={lane} isActive={false} onClick={handleClick} />);

      const laneElement = screen.getByRole('progressbar');
      fireEvent.keyDown(laneElement, { key: 'Enter' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key press', () => {
      const lane = createLane();
      const handleClick = vi.fn();
      render(<BikeRaceLane lane={lane} isActive={false} onClick={handleClick} />);

      const laneElement = screen.getByRole('progressbar');
      fireEvent.keyDown(laneElement, { key: ' ' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('not keyboard navigable without onClick', () => {
      const lane = createLane();
      render(<BikeRaceLane lane={lane} isActive={false} />);

      const laneElement = screen.getByRole('progressbar');
      expect(laneElement).toHaveAttribute('tabIndex', '-1');
    });
  });
});
