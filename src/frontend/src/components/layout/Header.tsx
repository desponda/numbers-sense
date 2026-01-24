import type { JSX, ReactNode } from 'react';

import { Icon } from '../ui';

export interface HeaderProps {
  /** Optional title to display */
  title?: ReactNode;
  /** Handler for home button click */
  onHomeClick?: () => void;
  /** Handler for settings button click */
  onSettingsClick?: () => void;
  /** Current sound state */
  soundEnabled?: boolean;
  /** Handler for sound toggle */
  onSoundToggle?: () => void;
  /** Whether to show navigation buttons (hide on home screen) */
  showNavigation?: boolean;
}

/**
 * Header - Minimal navigation header
 *
 * Features:
 * - Large touch targets (48px+)
 * - Home and settings navigation
 * - Sound toggle with visual feedback
 * - Optional title area
 * - Clean, uncluttered design for children
 *
 * @example
 * ```tsx
 * <Header
 *   title="Build the Number"
 *   onHomeClick={() => navigate('menu')}
 *   soundEnabled={true}
 *   onSoundToggle={() => toggleSound()}
 * />
 * ```
 */
export const Header = ({
  title,
  onHomeClick,
  onSettingsClick,
  soundEnabled = true,
  onSoundToggle,
  showNavigation = true,
}: HeaderProps): JSX.Element => {
  return (
    <header className="flex items-center justify-between p-content bg-white/50 backdrop-blur-sm">
      {/* Left section: Home button */}
      <div className="flex items-center gap-2">
        {showNavigation && onHomeClick && (
          <button
            type="button"
            onClick={onHomeClick}
            className="
              min-w-touch min-h-touch
              flex items-center justify-center
              rounded-xl
              text-text-secondary
              hover:bg-background-warm hover:text-text-primary
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              active:scale-95
              transition-all duration-fast
              touch-manipulation
            "
            aria-label="Go to home"
          >
            <Icon name="home" size="lg" />
          </button>
        )}
      </div>

      {/* Center section: Title */}
      <div className="flex-1 text-center">
        {title !== undefined && (
          <h1 className="text-lg font-semibold text-text-primary truncate px-2">{title}</h1>
        )}
      </div>

      {/* Right section: Settings and Sound */}
      <div className="flex items-center gap-2">
        {/* Sound toggle */}
        {onSoundToggle && (
          <button
            type="button"
            onClick={onSoundToggle}
            className="
              min-w-touch min-h-touch
              flex items-center justify-center
              rounded-xl
              text-text-secondary
              hover:bg-background-warm hover:text-text-primary
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              active:scale-95
              transition-all duration-fast
              touch-manipulation
            "
            aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
            aria-pressed={soundEnabled}
          >
            <Icon name={soundEnabled ? 'sound-on' : 'sound-off'} size="lg" />
          </button>
        )}

        {/* Settings button */}
        {showNavigation && onSettingsClick && (
          <button
            type="button"
            onClick={onSettingsClick}
            className="
              min-w-touch min-h-touch
              flex items-center justify-center
              rounded-xl
              text-text-secondary
              hover:bg-background-warm hover:text-text-primary
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              active:scale-95
              transition-all duration-fast
              touch-manipulation
            "
            aria-label="Open settings"
          >
            <Icon name="settings" size="lg" />
          </button>
        )}
      </div>
    </header>
  );
};
