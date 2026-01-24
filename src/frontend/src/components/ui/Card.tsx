import type { HTMLAttributes, JSX, ReactNode } from 'react';

/**
 * Card variants for different visual treatments
 * - elevated: Default with shadow, for content containers
 * - outlined: Border only, for secondary content
 * - flat: No shadow/border, for inline content
 */
export type CardVariant = 'elevated' | 'outlined' | 'flat';

/**
 * Card padding sizes
 * - sm: Compact padding
 * - md: Default padding
 * - lg: Generous padding (recommended for game content)
 */
export type CardPadding = 'sm' | 'md' | 'lg' | 'none';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Padding size */
  padding?: CardPadding;
  /** Card content */
  children: ReactNode;
  /** Interactive card (shows hover state) */
  interactive?: boolean;
  /** Selected state for interactive cards */
  selected?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  elevated: 'bg-white shadow-soft',
  outlined: 'bg-white border-2 border-background-warm',
  flat: 'bg-background-warm',
};

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-content',
  lg: 'p-content-lg',
};

/**
 * Card component for containing content
 *
 * Features:
 * - Soft shadows for depth
 * - Rounded corners (child-friendly)
 * - Optional interactive states
 * - Warm background colors
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg">
 *   <h2>Build the Number</h2>
 *   <p>Use blocks to make 15</p>
 * </Card>
 * ```
 */
export const Card = ({
  variant = 'elevated',
  padding = 'md',
  children,
  interactive = false,
  selected = false,
  className = '',
  ...props
}: CardProps): JSX.Element => {
  return (
    <div
      className={`
        rounded-2xl
        transition-all duration-normal
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${
          interactive
            ? `
          cursor-pointer
          hover:shadow-medium hover:scale-[1.02]
          active:scale-[0.98]
        `
            : ''
        }
        ${
          selected
            ? `
          ring-2 ring-primary ring-offset-2
          shadow-glow-primary
        `
            : ''
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card header component
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = ({
  children,
  className = '',
  ...props
}: CardHeaderProps): JSX.Element => {
  return (
    <div
      className={`
        mb-4 pb-4 border-b border-background-warm
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card content component
 */
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardContent = ({
  children,
  className = '',
  ...props
}: CardContentProps): JSX.Element => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

/**
 * Card footer component
 */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = ({
  children,
  className = '',
  ...props
}: CardFooterProps): JSX.Element => {
  return (
    <div
      className={`
        mt-4 pt-4 border-t border-background-warm
        flex items-center justify-end gap-3
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
