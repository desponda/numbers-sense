/**
 * Unit tests for AnswerInput component
 * Tests user input, submission, keyboard interaction, and visual feedback
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AnswerInput } from './AnswerInput';

describe('AnswerInput', () => {
  const mockOnChange = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      expect(() =>
        render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />),
      ).not.toThrow();
    });

    it('displays label text', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      expect(screen.getByText(/your answer/i)).toBeInTheDocument();
    });

    it('displays input field', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
    });

    it('displays submit button', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      expect(screen.getByRole('button', { name: /check answer/i })).toBeInTheDocument();
    });
  });

  describe('input handling', () => {
    it('calls onChange when user types a number', async () => {
      const user = userEvent.setup();
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      await user.type(input, '5');

      expect(mockOnChange).toHaveBeenCalledWith(5);
    });

    it('calls onChange with null for empty input', async () => {
      const user = userEvent.setup();
      render(<AnswerInput value={5} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      await user.clear(input);

      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it('handles empty string as null', async () => {
      const user = userEvent.setup();
      render(<AnswerInput value={5} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);

      // Clear input (empty string should be treated as null)
      await user.clear(input);

      // When input is cleared/empty, it should call onChange with null
      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it('handles multi-digit numbers', async () => {
      const user = userEvent.setup();
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      await user.type(input, '42');

      expect(mockOnChange).toHaveBeenCalledWith(4);
      expect(mockOnChange).toHaveBeenCalledWith(42);
    });

    it('updates input value when value prop changes', () => {
      const { rerender } = render(
        <AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />,
      );

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      let input = screen.getByLabelText(/answer input/i) as HTMLInputElement;
      expect(input.value).toBe('');

      rerender(<AnswerInput value={7} onChange={mockOnChange} onSubmit={mockOnSubmit} />);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      input = screen.getByLabelText(/answer input/i) as HTMLInputElement;
      expect(input.value).toBe('7');
    });

    it('shows placeholder when value is null', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const input = screen.getByLabelText(/answer input/i) as HTMLInputElement;
      expect(input.placeholder).toBe('?');
    });
  });

  describe('submit button', () => {
    it('calls onSubmit when button clicked', async () => {
      const user = userEvent.setup();
      render(<AnswerInput value={8} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const button = screen.getByRole('button', { name: /check answer/i });
      await user.click(button);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('is disabled when value is null', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const button = screen.getByRole('button', { name: /check answer/i });
      expect(button).toBeDisabled();
    });

    it('is enabled when value is provided', () => {
      render(<AnswerInput value={5} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const button = screen.getByRole('button', { name: /check answer/i });
      expect(button).not.toBeDisabled();
    });

    it('is disabled when disabled prop is true', () => {
      render(<AnswerInput value={5} onChange={mockOnChange} onSubmit={mockOnSubmit} disabled />);

      const button = screen.getByRole('button', { name: /check answer/i });
      expect(button).toBeDisabled();
    });

    it('is disabled when both value is null and disabled is true', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} disabled />);

      const button = screen.getByRole('button', { name: /check answer/i });
      expect(button).toBeDisabled();
    });
  });

  describe('keyboard interaction', () => {
    it('submits on Enter key when value is provided', async () => {
      const user = userEvent.setup();
      render(<AnswerInput value={5} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      await user.click(input);
      await user.keyboard('{Enter}');

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('does not submit on Enter when value is null', async () => {
      const user = userEvent.setup();
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      await user.click(input);
      await user.keyboard('{Enter}');

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('allows typing numbers', async () => {
      const user = userEvent.setup();
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      await user.type(input, '123');

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('visual feedback', () => {
    it('applies default teal border when no feedback', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      expect(input).toHaveClass('border-teal-400');
    });

    it('applies green border when showFeedback is "correct"', () => {
      render(
        <AnswerInput
          value={5}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
          showFeedback="correct"
        />,
      );

      const input = screen.getByLabelText(/answer input/i);
      expect(input).toHaveClass('border-green-500');
    });

    it('applies orange border when showFeedback is "incorrect"', () => {
      render(
        <AnswerInput
          value={5}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
          showFeedback="incorrect"
        />,
      );

      const input = screen.getByLabelText(/answer input/i);
      expect(input).toHaveClass('border-orange-400');
    });

    it('transitions feedback states correctly', () => {
      const { rerender } = render(
        <AnswerInput
          value={5}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
          showFeedback={null}
        />,
      );

      let input = screen.getByLabelText(/answer input/i);
      expect(input).toHaveClass('border-teal-400');

      rerender(
        <AnswerInput
          value={5}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
          showFeedback="incorrect"
        />,
      );
      input = screen.getByLabelText(/answer input/i);
      expect(input).toHaveClass('border-orange-400');

      rerender(
        <AnswerInput
          value={5}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
          showFeedback="correct"
        />,
      );
      input = screen.getByLabelText(/answer input/i);
      expect(input).toHaveClass('border-green-500');
    });
  });

  describe('disabled state', () => {
    it('disables input when disabled prop is true', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} disabled />);

      const input = screen.getByLabelText(/answer input/i);
      expect(input).toBeDisabled();
    });

    it('applies disabled styling to input', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} disabled />);

      const input = screen.getByLabelText(/answer input/i);
      expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });

    it('applies disabled styling to button', () => {
      render(<AnswerInput value={5} onChange={mockOnChange} onSubmit={mockOnSubmit} disabled />);

      const button = screen.getByRole('button', { name: /check answer/i });
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });

  describe('accessibility', () => {
    it('has accessible label for input', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      expect(input).toBeInTheDocument();
    });

    it('has proper id attribute on input', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      expect(input).toHaveAttribute('id', 'answer-input');
    });

    it('maintains focus on input after typing', async () => {
      const user = userEvent.setup();
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      await user.click(input);
      await user.type(input, '5');

      expect(input).toHaveFocus();
    });

    it('has focus ring on input focus', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      expect(input).toHaveClass('focus:outline-none', 'focus:ring-4', 'focus:ring-teal-200');
    });
  });

  describe('styling', () => {
    it('applies large font size to input', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      expect(input).toHaveClass('text-4xl', 'font-bold', 'text-center');
    });

    it('applies proper button styling', () => {
      render(<AnswerInput value={5} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const button = screen.getByRole('button', { name: /check answer/i });
      expect(button).toHaveClass(
        'bg-teal-500',
        'hover:bg-teal-600',
        'text-white',
        'font-semibold',
        'text-lg',
        'rounded-lg',
      );
    });

    it('has minimum width for input', () => {
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      expect(input).toHaveClass('min-w-[150px]');
    });
  });

  describe('edge cases', () => {
    it('handles value of 0', () => {
      render(<AnswerInput value={0} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const input = screen.getByLabelText(/answer input/i) as HTMLInputElement;
      expect(input.value).toBe('0');
    });

    it('handles negative numbers', async () => {
      const user = userEvent.setup();
      render(<AnswerInput value={null} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText(/answer input/i);
      await user.type(input, '-5');

      // Should parse as number (browsers handle minus in number inputs)
      expect(mockOnChange).toHaveBeenCalled();
    });

    it('enables submit button for value of 0', () => {
      render(<AnswerInput value={0} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

      const button = screen.getByRole('button', { name: /check answer/i });
      expect(button).not.toBeDisabled();
    });
  });
});
