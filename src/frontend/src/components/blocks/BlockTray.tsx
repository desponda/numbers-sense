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
  title = 'Block Tray',
}: BlockTrayProps): JSX.Element => {
  return (
    <Droppable
      id={id}
      accepts={['unit', 'ten', 'hundred']}
      disabled={disabled}
      className={`
        relative
        bg-background-cream
        border-2 border-dashed border-text-light
        rounded-2xl
        p-content-lg
        transition-all duration-150 ease-out
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
      styles={{
        default: {
          minHeight: '120px',
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
      {/* Tray label */}
      {title && (
        <div
          className="
            absolute -top-3 left-4
            px-2
            bg-background-cream
            text-text-secondary text-sm font-medium
          "
          aria-hidden="true"
        >
          {title}
        </div>
      )}

      {/* Tray content area */}
      <div
        className="
          flex flex-wrap items-center justify-center gap-gap-lg
          min-h-touch-lg
        "
        role="region"
        aria-label={`${title} - contains draggable blocks`}
      >
        {children}
      </div>

      {/* Screen reader description */}
      <div className="sr-only">
        Drag blocks from this tray to the workspace. You can also drop blocks back here to remove
        them.
      </div>
    </Droppable>
  );
};

export default BlockTray;
