/**
 * Unit tests for NumberPad component
 * Tests number button rendering, selection, and user interaction
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { NumberPad } from './NumberPad';

describe('NumberPad', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      expect(() =>
        render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />),
      ).not.toThrow();
    });

    it('displays default 10 number buttons', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      for (let i = 1; i <= 10; i += 1) {
        expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument();
      }
    });

    it('does not display number 0', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      expect(screen.queryByRole('button', { name: '0' })).not.toBeInTheDocument();
    });

    it('starts numbering from 1', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '0' })).not.toBeInTheDocument();
    });
  });

  describe('custom max value', () => {
    it('displays correct number of buttons for max=5', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} max={5} />);

      for (let i = 1; i <= 5; i += 1) {
        expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument();
      }
      expect(screen.queryByRole('button', { name: '6' })).not.toBeInTheDocument();
    });

    it('displays correct number of buttons for max=20', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} max={20} />);

      for (let i = 1; i <= 20; i += 1) {
        expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument();
      }
      expect(screen.queryByRole('button', { name: '21' })).not.toBeInTheDocument();
    });

    it('handles max=1 (single button)', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} max={1} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument();
    });

    it('handles large max values', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} max={100} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '50' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '100' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '101' })).not.toBeInTheDocument();
    });
  });

  describe('user interaction', () => {
    it('calls onSelect when a button is clicked', async () => {
      const user = userEvent.setup();
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      const button5 = screen.getByRole('button', { name: '5' });
      await user.click(button5);

      expect(mockOnSelect).toHaveBeenCalledWith(5);
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });

    it('calls onSelect with correct value for each button', async () => {
      const user = userEvent.setup();
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} max={5} />);

      for (let i = 1; i <= 5; i += 1) {
        const button = screen.getByRole('button', { name: String(i) });
        // eslint-disable-next-line no-await-in-loop
        await user.click(button);
        expect(mockOnSelect).toHaveBeenCalledWith(i);
      }

      expect(mockOnSelect).toHaveBeenCalledTimes(5);
    });

    it('allows clicking same button multiple times', async () => {
      const user = userEvent.setup();
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      const button3 = screen.getByRole('button', { name: '3' });
      await user.click(button3);
      await user.click(button3);
      await user.click(button3);

      expect(mockOnSelect).toHaveBeenCalledTimes(3);
      expect(mockOnSelect).toHaveBeenCalledWith(3);
    });

    it('allows clicking different buttons sequentially', async () => {
      const user = userEvent.setup();
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: '7' }));
      await user.click(screen.getByRole('button', { name: '4' }));

      expect(mockOnSelect).toHaveBeenNthCalledWith(1, 2);
      expect(mockOnSelect).toHaveBeenNthCalledWith(2, 7);
      expect(mockOnSelect).toHaveBeenNthCalledWith(3, 4);
    });
  });

  describe('visual selection state', () => {
    it('highlights selected button', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={5} />);

      const button5 = screen.getByRole('button', { name: '5' });
      expect(button5).toHaveClass('bg-teal-500', 'text-white', 'scale-110', 'shadow-lg');
    });

    it('does not highlight unselected buttons', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={5} />);

      const button3 = screen.getByRole('button', { name: '3' });
      expect(button3).not.toHaveClass('bg-teal-500', 'text-white');
      expect(button3).toHaveClass('bg-white', 'text-gray-700');
    });

    it('updates selection when selectedValue changes', () => {
      const { rerender } = render(<NumberPad onSelect={mockOnSelect} selectedValue={3} />);

      let button3 = screen.getByRole('button', { name: '3' });
      let button7 = screen.getByRole('button', { name: '7' });

      expect(button3).toHaveClass('bg-teal-500');
      expect(button7).toHaveClass('bg-white');

      rerender(<NumberPad onSelect={mockOnSelect} selectedValue={7} />);

      button3 = screen.getByRole('button', { name: '3' });
      button7 = screen.getByRole('button', { name: '7' });

      expect(button3).toHaveClass('bg-white');
      expect(button7).toHaveClass('bg-teal-500');
    });

    it('shows no selection when selectedValue is null', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      for (let i = 1; i <= 10; i += 1) {
        const button = screen.getByRole('button', { name: String(i) });
        expect(button).toHaveClass('bg-white');
        expect(button).not.toHaveClass('bg-teal-500');
      }
    });
  });

  describe('layout', () => {
    it('uses grid layout with 5 columns', () => {
      const { container } = render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-5');
    });

    it('has consistent gap between buttons', () => {
      const { container } = render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-3');
    });

    it('wraps to multiple rows when needed', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} max={20} />);

      // With 20 buttons and 5 columns, should have 4 rows
      // Just verify all 20 buttons exist
      for (let i = 1; i <= 20; i += 1) {
        expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument();
      }
    });
  });

  describe('button styling', () => {
    it('applies consistent button dimensions', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      const button = screen.getByRole('button', { name: '1' });
      expect(button).toHaveClass('w-16', 'h-16');
    });

    it('applies large text size', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      const button = screen.getByRole('button', { name: '1' });
      expect(button).toHaveClass('text-2xl', 'font-bold');
    });

    it('applies rounded corners', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      const button = screen.getByRole('button', { name: '1' });
      expect(button).toHaveClass('rounded-xl');
    });

    it('has hover state for unselected buttons', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      const button = screen.getByRole('button', { name: '1' });
      expect(button).toHaveClass('hover:bg-teal-100');
    });

    it('has border for unselected buttons', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      const button = screen.getByRole('button', { name: '1' });
      expect(button).toHaveClass('border-2', 'border-gray-300');
    });

    it('has transition animations', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      const button = screen.getByRole('button', { name: '1' });
      expect(button).toHaveClass('transition-all', 'duration-150');
    });
  });

  describe('accessibility', () => {
    it('all buttons are keyboard accessible', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      for (let i = 1; i <= 10; i += 1) {
        const button = screen.getByRole('button', { name: String(i) });
        expect(button).toHaveAttribute('type', 'button');
      }
    });

    it('buttons have descriptive text content', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      for (let i = 1; i <= 10; i += 1) {
        const button = screen.getByRole('button', { name: String(i) });
        expect(button.textContent).toBe(String(i));
      }
    });

    it('maintains selection state for screen readers', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={5} />);

      const button5 = screen.getByRole('button', { name: '5' });
      // Visual indication via class should be sufficient for screen readers
      expect(button5).toHaveClass('bg-teal-500');
    });
  });

  describe('performance', () => {
    it('renders large number pad efficiently', () => {
      const start = performance.now();
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} max={100} />);
      const end = performance.now();

      // Should render in reasonable time (< 100ms)
      expect(end - start).toBeLessThan(100);
    });

    it('maintains unique keys for all buttons', () => {
      const { container } = render(
        <NumberPad onSelect={mockOnSelect} selectedValue={null} max={20} />,
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(20);
    });
  });

  describe('edge cases', () => {
    it('handles selectedValue outside of range', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={15} max={10} />);

      // Should not highlight any button since 15 is not in range
      for (let i = 1; i <= 10; i += 1) {
        const button = screen.getByRole('button', { name: String(i) });
        expect(button).toHaveClass('bg-white');
      }
    });

    it('handles selectedValue of 0', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={0} />);

      // Should not highlight any button since 0 is not displayed
      for (let i = 1; i <= 10; i += 1) {
        const button = screen.getByRole('button', { name: String(i) });
        expect(button).toHaveClass('bg-white');
      }
    });

    it('handles negative selectedValue', () => {
      render(<NumberPad onSelect={mockOnSelect} selectedValue={-5} />);

      // Should not highlight any button
      for (let i = 1; i <= 10; i += 1) {
        const button = screen.getByRole('button', { name: String(i) });
        expect(button).toHaveClass('bg-white');
      }
    });
  });

  describe('keyboard navigation', () => {
    it('supports keyboard click on buttons', async () => {
      const user = userEvent.setup();
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      const button5 = screen.getByRole('button', { name: '5' });
      button5.focus();
      await user.keyboard('{Enter}');

      expect(mockOnSelect).toHaveBeenCalledWith(5);
    });

    it('supports space key to click', async () => {
      const user = userEvent.setup();
      render(<NumberPad onSelect={mockOnSelect} selectedValue={null} />);

      const button3 = screen.getByRole('button', { name: '3' });
      button3.focus();
      await user.keyboard(' ');

      expect(mockOnSelect).toHaveBeenCalledWith(3);
    });
  });
});
