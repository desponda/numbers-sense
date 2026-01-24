import type { JSX } from 'react';

import { Card, Icon } from '../ui';

export type GameType = 'build-number' | 'sort-numbers';

export interface GameMenuProps {
  /** Handler when a game is selected */
  onSelectGame: (game: GameType) => void;
}

interface GameCardProps {
  title: string;
  description: string;
  icon: 'blocks' | 'trophy';
  iconColor: string;
  onClick: () => void;
}

const GameCard = ({ title, description, icon, iconColor, onClick }: GameCardProps): JSX.Element => {
  return (
    <Card
      interactive
      padding="lg"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Play ${title}`}
      className="min-h-[140px] flex flex-col items-center justify-center gap-3"
    >
      {/* Game icon */}
      <div
        className="
          w-16 h-16
          flex items-center justify-center
          rounded-2xl
          bg-background-warm
        "
        style={{ color: iconColor }}
      >
        <Icon name={icon} size="xl" />
      </div>

      {/* Game title */}
      <h2 className="text-lg font-bold text-text-primary text-center">{title}</h2>

      {/* Game description */}
      <p className="text-sm text-text-secondary text-center">{description}</p>
    </Card>
  );
};

/**
 * GameMenu - Game selection screen
 *
 * Features:
 * - Two game cards with clear visuals
 * - Large touch targets for easy selection
 * - Fun icons and simple labels
 * - Accessible keyboard navigation
 *
 * @example
 * ```tsx
 * <GameMenu onSelectGame={(game) => startGame(game)} />
 * ```
 */
export const GameMenu = ({ onSelectGame }: GameMenuProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome message */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Let&apos;s Play!</h1>
        <p className="text-base text-text-secondary">Choose a game</p>
      </div>

      {/* Game cards grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <GameCard
          title="Build the Number"
          description="Use blocks to make numbers"
          icon="blocks"
          iconColor="#64B5C6"
          onClick={() => {
            onSelectGame('build-number');
          }}
        />

        <GameCard
          title="Sort the Numbers"
          description="Put numbers in order"
          icon="trophy"
          iconColor="#F6C863"
          onClick={() => {
            onSelectGame('sort-numbers');
          }}
        />
      </div>
    </div>
  );
};
