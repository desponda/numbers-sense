/**
 * Tests for Card Component
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Card, CardHeader, CardContent, CardFooter } from './Card.js';

describe('Card', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(<Card>Card content</Card>);

      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders as a div element', () => {
      render(<Card data-testid="card">Content</Card>);

      expect(screen.getByTestId('card').tagName).toBe('DIV');
    });
  });

  describe('variants', () => {
    it('applies elevated variant classes by default', () => {
      render(<Card data-testid="card">Elevated</Card>);

      const card = screen.getByTestId('card');
      expect(card.className).toContain('bg-white');
      expect(card.className).toContain('shadow-soft');
    });

    it('applies outlined variant classes', () => {
      render(
        <Card variant="outlined" data-testid="card">
          Outlined
        </Card>,
      );

      const card = screen.getByTestId('card');
      expect(card.className).toContain('border-2');
    });

    it('applies flat variant classes', () => {
      render(
        <Card variant="flat" data-testid="card">
          Flat
        </Card>,
      );

      const card = screen.getByTestId('card');
      expect(card.className).toContain('bg-background-warm');
    });
  });

  describe('padding', () => {
    it('applies medium padding by default', () => {
      render(<Card data-testid="card">Content</Card>);

      const card = screen.getByTestId('card');
      expect(card.className).toContain('p-content');
    });

    it('applies no padding when padding="none"', () => {
      render(
        <Card padding="none" data-testid="card">
          Content
        </Card>,
      );

      const card = screen.getByTestId('card');
      expect(card.className).toContain('p-0');
    });

    it('applies small padding', () => {
      render(
        <Card padding="sm" data-testid="card">
          Content
        </Card>,
      );

      const card = screen.getByTestId('card');
      expect(card.className).toContain('p-3');
    });

    it('applies large padding', () => {
      render(
        <Card padding="lg" data-testid="card">
          Content
        </Card>,
      );

      const card = screen.getByTestId('card');
      expect(card.className).toContain('p-content-lg');
    });
  });

  describe('interactive', () => {
    it('is not interactive by default', () => {
      render(<Card data-testid="card">Content</Card>);

      const card = screen.getByTestId('card');
      expect(card.className).not.toContain('cursor-pointer');
    });

    it('applies interactive styles when interactive is true', () => {
      render(
        <Card interactive data-testid="card">
          Interactive
        </Card>,
      );

      const card = screen.getByTestId('card');
      expect(card.className).toContain('cursor-pointer');
      expect(card.className).toContain('hover:shadow-medium');
    });

    it('handles click events when interactive', () => {
      const handleClick = vi.fn();
      render(
        <Card interactive onClick={handleClick} data-testid="card">
          Clickable
        </Card>,
      );

      fireEvent.click(screen.getByTestId('card'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('selected', () => {
    it('is not selected by default', () => {
      render(<Card data-testid="card">Content</Card>);

      const card = screen.getByTestId('card');
      expect(card.className).not.toContain('ring-2');
    });

    it('applies selected styles when selected is true', () => {
      render(
        <Card selected data-testid="card">
          Selected
        </Card>,
      );

      const card = screen.getByTestId('card');
      expect(card.className).toContain('ring-2');
      expect(card.className).toContain('ring-primary');
    });
  });

  describe('styling', () => {
    it('has rounded corners', () => {
      render(<Card data-testid="card">Content</Card>);

      const card = screen.getByTestId('card');
      expect(card.className).toContain('rounded-2xl');
    });

    it('accepts custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>,
      );

      const card = screen.getByTestId('card');
      expect(card.className).toContain('custom-class');
    });

    it('passes through other props', () => {
      render(
        <Card data-testid="card" aria-label="Test card">
          Content
        </Card>,
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('aria-label', 'Test card');
    });
  });
});

describe('CardHeader', () => {
  it('renders children correctly', () => {
    render(<CardHeader>Header content</CardHeader>);

    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('has bottom border', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>);

    const header = screen.getByTestId('header');
    expect(header.className).toContain('border-b');
  });

  it('accepts custom className', () => {
    render(
      <CardHeader className="custom-header" data-testid="header">
        Header
      </CardHeader>,
    );

    const header = screen.getByTestId('header');
    expect(header.className).toContain('custom-header');
  });
});

describe('CardContent', () => {
  it('renders children correctly', () => {
    render(<CardContent>Content</CardContent>);

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(
      <CardContent className="custom-content" data-testid="content">
        Content
      </CardContent>,
    );

    const content = screen.getByTestId('content');
    expect(content.className).toContain('custom-content');
  });
});

describe('CardFooter', () => {
  it('renders children correctly', () => {
    render(<CardFooter>Footer content</CardFooter>);

    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('has top border', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);

    const footer = screen.getByTestId('footer');
    expect(footer.className).toContain('border-t');
  });

  it('has flex layout for buttons', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);

    const footer = screen.getByTestId('footer');
    expect(footer.className).toContain('flex');
    expect(footer.className).toContain('items-center');
  });

  it('accepts custom className', () => {
    render(
      <CardFooter className="custom-footer" data-testid="footer">
        Footer
      </CardFooter>,
    );

    const footer = screen.getByTestId('footer');
    expect(footer.className).toContain('custom-footer');
  });
});

describe('Card composition', () => {
  it('works with all card parts together', () => {
    render(
      <Card data-testid="card">
        <CardHeader>Title</CardHeader>
        <CardContent>Body content</CardContent>
        <CardFooter>Actions</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
