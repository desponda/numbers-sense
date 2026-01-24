/**
 * UI Components
 *
 * Base UI components for the NumberSense app.
 * All components follow UX principles for K-3 children:
 * - Large touch targets (48-64px)
 * - Non-overstimulating colors
 * - Clear visual feedback
 * - Full accessibility support
 */

export { Button } from './Button';
export type { ButtonProps, ButtonSize, ButtonVariant } from './Button';

export { Card, CardContent, CardFooter, CardHeader } from './Card';
export type {
  CardContentProps,
  CardFooterProps,
  CardHeaderProps,
  CardPadding,
  CardProps,
  CardVariant,
} from './Card';

export { Icon } from './Icon';
export type { IconName, IconProps, IconSize } from './Icon';
