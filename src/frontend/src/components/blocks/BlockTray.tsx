import type { JSX, ReactNode } from 'react';

import { Droppable } from '../dnd';

/**
 * Props for the BlockTray component
 */
export interface BlockTrayProps {
  /** Unique identifier for the tray */
  id: string;
  /** Child elements (blocks) to display in the tray */
  children: ReactNode;
  /** Whether the tray is disabled */
  disabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Title/label for the tray */
  title?: string;
}

/**
 * BlockTray - Container tray for displaying available Base-10 blocks.
 *
 * Design specifications:
 * - Displays blocks to drag from
 * - Uses Droppable from @dnd-kit for return area
 * - Accepts all block types (unit, ten, hundred)
 * - Smooth animations (0.15s ease-out)
 *
 * Based on game-mechanics.md:
 * - Block tray shows available blocks
 * - Players can drag blocks from tray to workspace
 * - Blocks can be returned to tray
 *
 * @example
 * ```tsx
 * <BlockTray id="block-tray" title="Blocks">
 *   <UnitCube id="unit-1" />
 *   <TenRod id="ten-1" />
 *   <HundredFlat id="hundred-1" />
 * </BlockTray>
 * ```
 */
export const BlockTray = ({
  id,
  children,
  disabled = false,
  className = '',
  title,
}: BlockTrayProps): JSX.Element => {
  return (
    <Droppable
      id={id}
      accepts={['unit', 'ten', 'hundred']}
      disabled={disabled}
      className={`
        relative
        bg-white/50
        border-2 border-dashed border-text-light/50
        rounded-2xl
        p-4
        transition-all duration-150 ease-out
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
      styles={{
        default: {
          minHeight: '80px',
        },
        over: {
          borderColor: 'rgb(107, 154, 232)',
          backgroundColor: 'rgba(107, 154, 232, 0.05)',
        },
        accepting: {
          borderColor: 'rgba(107, 154, 232, 0.5)',
        },
      }}
    >
      {/* Optional tray label - only show if provided */}
      {title !== undefined && title !== '' && (
        <div
          className="
            absolute -top-2.5 left-4
            px-2
            bg-background-cream
            text-text-light text-xs
          "
          aria-hidden="true"
        >
          {title}
        </div>
      )}

      {/* Tray content area */}
      <div
        className="
          flex flex-wrap items-center justify-center
          min-h-[60px]
        "
        role="region"
        aria-label="Block tray - drag blocks to build your number"
      >
        {children}
      </div>

      {/* Screen reader description */}
      <div className="sr-only">Drag blocks from this tray to the workspace.</div>
    </Droppable>
  );
};

export default BlockTray;
