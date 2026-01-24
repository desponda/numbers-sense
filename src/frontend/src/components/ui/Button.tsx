import type { ButtonHTMLAttributes, JSX, ReactNode } from 'react';

/**
 * Button variants for different use cases
 * - primary: Main actions (submit, continue)
 * - secondary: Alternative actions, "try again" (warm orange, not error)
 * - success: Correct answer feedback, completion
 * - ghost: Subtle actions, navigation
 */
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost';

/**
 * Button sizes following UX guidelines
 * - lg: Default for children (64px touch target)
 * - md: Standard (48px minimum touch target)
 * - sm: Compact, use sparingly
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button (lg recommended for children) */
  size?: ButtonSize;
  /** Button content */
  children: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state - disables button and shows loading indicator */
  loading?: boolean;
  /** Icon to display before text */
  leftIcon?: ReactNode;
  /** Icon to display after text */
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-primary text-white
    hover:bg-primary-600
    focus-visible:ring-primary
    active:bg-primary-700
  `,
  secondary: `
    bg-secondary text-white
    hover:bg-secondary-600
    focus-visible:ring-secondary
    active:bg-secondary-700
  `,
  success: `
    bg-success text-white
    hover:bg-success-600
    focus-visible:ring-success
    active:bg-success-700
  `,
  ghost: `
    bg-transparent text-text-primary
    hover:bg-background-warm
    focus-visible:ring-primary
    active:bg-background-cream
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[36px] min-w-[36px] px-4 py-2 text-sm rounded-lg',
  md: 'min-h-touch min-w-touch px-5 py-3 text-base rounded-xl',
  lg: 'min-h-touch-lg min-w-touch-lg px-6 py-4 text-lg rounded-xl',
};

/**
 * Button component optimized for K-3 children
 *
 * Features:
 * - Large touch targets (48-64px)
 * - Clear visual feedback
 * - Accessible focus states
 * - Non-overstimulating colors
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">
 *   Let's Play!
 * </Button>
 * ```
 */
export const Button = ({
  variant = 'primary',
  size = 'lg',
  children,
  fullWidth = false,
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className,
  ...props
}: ButtonProps): JSX.Element => {
  const isDisabled = (disabled ?? false) ? true : loading;
  const showLoading = loading;
  const showFullWidth = fullWidth;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold
        shadow-soft
        transition-all duration-normal
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        select-none touch-manipulation
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${showFullWidth ? 'w-full' : ''}
        ${className ?? ''}
      `}
      {...props}
    >
      {showLoading ? (
        <span
          className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!showLoading ? rightIcon : null}
    </button>
  );
};
