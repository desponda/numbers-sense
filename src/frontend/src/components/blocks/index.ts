/**
 * Base-10 Block Components
 *
 * This module exports Base-10 block components for the NumberSense app.
 * These blocks are used in the "Build the Number" game to help children
 * understand place value through concrete manipulation.
 *
 * Block specifications (from game-mechanics.md):
 * - UnitCube: Value 1, 48x48px visual, 64x64px touch target, Teal (#4ECDC4)
 * - TenRod: Value 10, 480x48px, Coral Red (#FF6B6B), shows 10 segments
 * - HundredFlat: Value 100, 480x480px, Mint Green (#95E1D3), shows 10x10 grid
 *
 * @example
 * ```tsx
 * import { UnitCube, TenRod, HundredFlat, BlockTray } from '@/components/blocks';
 *
 * function BuildTheNumber() {
 *   return (
 *     <DndProvider onDragEnd={handleDrop}>
 *       <BlockTray id="tray">
 *         <UnitCube id="unit-1" />
 *         <TenRod id="ten-1" />
 *         <HundredFlat id="hundred-1" />
 *       </BlockTray>
 *     </DndProvider>
 *   );
 * }
 * ```
 */

export { UnitCube } from './UnitCube';
export type { UnitCubeProps } from './UnitCube';

export { TenRod } from './TenRod';
export type { TenRodProps } from './TenRod';

export { HundredFlat } from './HundredFlat';
export type { HundredFlatProps } from './HundredFlat';

export { BlockTray } from './BlockTray';
export type { BlockTrayProps } from './BlockTray';
