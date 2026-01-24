/**
 * Tests for UnitCube, TenRod, and HundredFlat Block Components
 */
import React from 'react';

import { DndContext } from '@dnd-kit/core';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { HundredFlat } from './HundredFlat.js';
import { TenRod } from './TenRod.js';
import { UnitCube } from './UnitCube.js';

// Wrapper to provide DnD context
const DndWrapper = ({ children }: { children: React.ReactNode }) => (
  <DndContext>{children}</DndContext>
);

describe('UnitCube', () => {
  describe('rendering', () => {
    it('displays the value "1"', () => {
      render(
        <DndWrapper>
          <UnitCube id="unit-1" />
        </DndWrapper>,
      );

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('has correct aria-label for accessibility', () => {
      render(
        <DndWrapper>
          <UnitCube id="unit-1" />
        </DndWrapper>,
      );

      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'One block, value 1');
    });

    it('has correct data attributes', () => {
      render(
        <DndWrapper>
          <UnitCube id="unit-1" />
        </DndWrapper>,
      );

      const block = screen.getByRole('img');
      expect(block).toHaveAttribute('data-block-type', 'unit');
      expect(block).toHaveAttribute('data-block-value', '1');
    });
  });

  describe('styling', () => {
    it('has proper dimensions', () => {
      render(
        <DndWrapper>
          <UnitCube id="unit-1" />
        </DndWrapper>,
      );

      const block = screen.getByRole('img');
      expect(block).toHaveStyle({ width: '40px', height: '40px' });
    });

    it('uses teal color', () => {
      render(
        <DndWrapper>
          <UnitCube id="unit-1" />
        </DndWrapper>,
      );

      const block = screen.getByRole('img');
      expect(block).toHaveStyle({ backgroundColor: '#4ECDC4' });
    });
  });
});

describe('TenRod', () => {
  describe('rendering', () => {
    it('displays the value "10"', () => {
      render(
        <DndWrapper>
          <TenRod id="ten-1" />
        </DndWrapper>,
      );

      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('has correct aria-label for accessibility', () => {
      render(
        <DndWrapper>
          <TenRod id="ten-1" />
        </DndWrapper>,
      );

      expect(screen.getByRole('img')).toHaveAttribute(
        'aria-label',
        'Ten rod: 10 ones grouped together, value 10',
      );
    });

    it('has correct data attributes', () => {
      render(
        <DndWrapper>
          <TenRod id="ten-1" />
        </DndWrapper>,
      );

      const block = screen.getByRole('img');
      expect(block).toHaveAttribute('data-block-type', 'ten');
      expect(block).toHaveAttribute('data-block-value', '10');
    });
  });

  describe('segment lines', () => {
    it('renders SVG with segment lines', () => {
      render(
        <DndWrapper>
          <TenRod id="ten-1" />
        </DndWrapper>,
      );

      // Should have 9 segment lines (dividing 10 sections)
      const svg = screen.getByRole('img').querySelector('svg');
      expect(svg).toBeInTheDocument();

      const lines = svg?.querySelectorAll('line');
      expect(lines?.length).toBe(9);
    });
  });

  describe('styling', () => {
    it('has proper dimensions', () => {
      render(
        <DndWrapper>
          <TenRod id="ten-1" />
        </DndWrapper>,
      );

      const block = screen.getByRole('img');
      expect(block).toHaveStyle({ width: '200px', height: '32px' });
    });

    it('uses coral color', () => {
      render(
        <DndWrapper>
          <TenRod id="ten-1" />
        </DndWrapper>,
      );

      const block = screen.getByRole('img');
      expect(block).toHaveStyle({ backgroundColor: '#FF8C6B' });
    });
  });
});

describe('HundredFlat', () => {
  describe('rendering', () => {
    it('has correct aria-label for accessibility', () => {
      render(
        <DndWrapper>
          <HundredFlat id="hundred-1" />
        </DndWrapper>,
      );

      expect(screen.getByRole('img')).toHaveAttribute(
        'aria-label',
        'Hundred flat: 100 ones grouped together, value 100',
      );
    });

    it('has correct data attributes', () => {
      render(
        <DndWrapper>
          <HundredFlat id="hundred-1" />
        </DndWrapper>,
      );

      const block = screen.getByRole('img');
      expect(block).toHaveAttribute('data-block-type', 'hundred');
      expect(block).toHaveAttribute('data-block-value', '100');
    });
  });

  describe('grid structure', () => {
    it('renders 10x10 grid (100 cells)', () => {
      render(
        <DndWrapper>
          <HundredFlat id="hundred-1" />
        </DndWrapper>,
      );

      // Each cell is visually hidden, we check the container structure
      const block = screen.getByRole('img');
      const rows = block.querySelectorAll('.flex.flex-col > div');
      expect(rows.length).toBe(10);

      // Each row should have 10 cells
      rows.forEach((row) => {
        const cells = row.querySelectorAll('div');
        expect(cells.length).toBe(10);
      });
    });
  });

  describe('styling', () => {
    it('uses mint frame color', () => {
      render(
        <DndWrapper>
          <HundredFlat id="hundred-1" />
        </DndWrapper>,
      );

      const block = screen.getByRole('img');
      expect(block).toHaveStyle({ backgroundColor: '#95E1D3' });
    });

    it('cells use teal color (same as unit cubes)', () => {
      render(
        <DndWrapper>
          <HundredFlat id="hundred-1" />
        </DndWrapper>,
      );

      const block = screen.getByRole('img');
      const firstCell = block.querySelector('.rounded-sm');
      expect(firstCell).toHaveStyle({ backgroundColor: '#4ECDC4' });
    });
  });
});
