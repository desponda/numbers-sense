import { useEffect, useState } from 'react';
import type { JSX } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { TenRod } from '../../../components/blocks/TenRod';
import { UnitCube } from '../../../components/blocks/UnitCube';

export interface VisualScaffoldProps {
  /** The number we start with */
  startingNumber: number;
  /** Whether we're adding more or taking away less */
  operation: 'more' | 'less';
  /** How many we're adding or removing */
  delta: number;
  /** Visibility mode controlling when scaffold is shown */
  visibility: 'always' | 'peek' | 'hint' | 'none';
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
}

/**
 * VisualScaffold - Animated visual representation of "more than" / "less than" operations.
 *
 * Design specifications:
 * - Shows starting number as base-10 blocks (tens + units)
 * - Animates the delta (change) with operation-appropriate effects:
 *   - "more": Scale in + fade in (adding blocks)
 *   - "less": Fade out + strikethrough (removing blocks)
 * - Color codes blocks by role for clear pedagogical distinction
 *
 * Pedagogical rationale:
 * - Concretely shows the transformation: start → operation → result
 * - Animation draws attention to the change operation
 * - Color differentiation helps track what's being added/removed
 * - Supports CRA framework (concrete visual before abstract numbers)
 *
 * @example
 * ```tsx
 * <VisualScaffold
 *   startingNumber={12}
 *   operation="more"
 *   delta={5}
 *   visibility="always"
 * />
 * ```
 */
export const VisualScaffold = ({
  startingNumber,
  operation,
  delta,
  visibility,
  onAnimationComplete,
}: VisualScaffoldProps): JSX.Element | null => {
  const [showDelta, setShowDelta] = useState(false);

  useEffect(() => {
    // Reset animation state when inputs change
    setShowDelta(false);

    // Auto-play animation after brief delay
    const timer = setTimeout(() => {
      setShowDelta(true);
    }, 800);

    return (): void => {
      clearTimeout(timer);
    };
  }, [startingNumber, delta, operation]);

  if (visibility === 'none') {
    return null;
  }

  // Decompose starting number into tens and units
  const startTens = Math.floor(startingNumber / 10);
  const startUnits = startingNumber % 10;

  // Decompose delta into tens and units
  const deltaTens = Math.floor(delta / 10);
  const deltaUnits = delta % 10;

  return (
    <div className="flex flex-col items-center gap-8 p-6 bg-white/50 rounded-2xl">
      {/* Starting blocks section */}
      <div className="flex flex-col items-center gap-3">
        <div className="text-lg font-semibold text-gray-700">
          We start with: {String(startingNumber)}
        </div>
        <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
          {/* Ten rods */}
          {Array.from({ length: startTens }, (_val, i) => (
            <div
              key={`start-ten-${String(i)}`}
              style={{
                filter: 'hue-rotate(160deg) saturate(0.8)', // Shift to teal
              }}
            >
              <TenRod id={`start-ten-${String(i)}`} disabled />
            </div>
          ))}
          {/* Unit cubes */}
          {Array.from({ length: startUnits }, (_val, i) => (
            <UnitCube key={`start-unit-${String(i)}`} id={`start-unit-${String(i)}`} disabled />
          ))}
        </div>
      </div>

      {/* Operation indicator */}
      <motion.div
        className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <span className="text-3xl font-bold text-gray-700">{operation === 'more' ? '+' : '−'}</span>
        <span className="text-2xl font-semibold text-gray-600">{String(delta)}</span>
        <span className="text-sm text-gray-500 font-medium">
          {operation === 'more' ? 'more' : 'less'}
        </span>
      </motion.div>

      {/* Delta blocks section (animated) */}
      <div className="flex flex-col items-center gap-3 min-h-[100px]">
        <AnimatePresence mode="wait">
          {showDelta && (
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={
                operation === 'more' ? { scale: 0, opacity: 0, y: -30 } : { scale: 1, opacity: 1 }
              }
              animate={
                operation === 'more'
                  ? { scale: 1, opacity: 1, y: 0 }
                  : { scale: 0.95, opacity: 0.4 }
              }
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1], // Spring-like easing
              }}
              onAnimationComplete={onAnimationComplete}
            >
              <div className="text-sm font-medium text-gray-600">
                {operation === 'more' ? 'Adding:' : 'Taking away:'}
              </div>
              <div
                className={`flex flex-wrap gap-3 justify-center max-w-2xl ${
                  operation === 'less' ? 'line-through opacity-60' : ''
                }`}
              >
                {/* Ten rods */}
                {Array.from({ length: deltaTens }, (_val, i) => (
                  <div
                    key={`delta-ten-${String(i)}`}
                    style={{
                      filter:
                        operation === 'less'
                          ? 'grayscale(0.7) brightness(0.9)' // Gray for removed
                          : 'none', // Coral default for added
                    }}
                  >
                    <TenRod id={`delta-ten-${String(i)}`} disabled />
                  </div>
                ))}
                {/* Unit cubes */}
                {Array.from({ length: deltaUnits }, (_val, i) => (
                  <div
                    key={`delta-unit-${String(i)}`}
                    style={{
                      filter:
                        operation === 'less'
                          ? 'grayscale(0.7) brightness(0.9)' // Gray for removed
                          : 'hue-rotate(-30deg)', // Shift to coral for added
                    }}
                  >
                    <UnitCube id={`delta-unit-${String(i)}`} disabled />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
