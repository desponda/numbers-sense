import { useEffect, useState, useCallback, type JSX } from 'react';

import { Icon } from '../ui/Icon';

/**
 * Messages to show when answer is correct
 * Rotates through to keep feedback fresh
 */
const CELEBRATION_MESSAGES = [
  'Great job!',
  'Awesome!',
  'You got it!',
  'Perfect!',
  'Amazing!',
  'Well done!',
  'Super!',
  'Fantastic!',
];

export interface CorrectFeedbackProps {
  /** Whether to show the feedback */
  isVisible: boolean;
  /** Callback when feedback auto-dismisses */
  onDismiss?: () => void;
  /** Custom message (uses random if not provided) */
  message?: string;
  /** Auto-dismiss delay in ms (default 2000) */
  dismissDelay?: number;
}

/**
 * Star particle for confetti effect
 */
interface StarParticle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: 'sm' | 'md' | 'lg';
}

type StarSize = 'sm' | 'md' | 'lg';

const STAR_SIZES: StarSize[] = ['sm', 'md', 'lg'];

/**
 * Gets a random star size
 */
const getRandomStarSize = (): StarSize => {
  const sizeIndex = Math.floor(Math.random() * 3);
  return STAR_SIZES[sizeIndex] ?? 'md';
};

/**
 * Generates random star particles for the celebration effect
 */
const generateStars = (count: number): StarParticle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 0.5 + Math.random() * 0.3,
    size: getRandomStarSize(),
  }));
};

const starSizeClasses: Record<StarSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

/**
 * Maps star size to Icon size
 */
const getIconSize = (size: StarSize): 'sm' | 'md' | 'lg' => {
  return size;
};

/**
 * CorrectFeedback - Success celebration component
 *
 * Shows an animated celebration when the child answers correctly.
 * Features:
 * - Animated stars that float and fade
 * - Encouraging message
 * - Auto-dismisses after 2 seconds
 * - Non-overstimulating, warm animations
 *
 * @example
 * ```tsx
 * <CorrectFeedback
 *   isVisible={isCorrect}
 *   onDismiss={() => setIsCorrect(false)}
 * />
 * ```
 */
export const CorrectFeedback = ({
  isVisible,
  onDismiss,
  message,
  dismissDelay = 2000,
}: CorrectFeedbackProps): JSX.Element | null => {
  const [stars, setStars] = useState<StarParticle[]>([]);
  const [displayMessage, setDisplayMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDismiss = useCallback((): void => {
    setIsAnimating(false);
    setTimeout(() => {
      onDismiss?.();
    }, 150);
  }, [onDismiss]);

  useEffect(() => {
    if (isVisible) {
      // Generate new stars and message when becoming visible
      setStars(generateStars(8));
      const randomIndex = Math.floor(Math.random() * CELEBRATION_MESSAGES.length);
      const randomMessage = CELEBRATION_MESSAGES[randomIndex] ?? 'Great job!';
      setDisplayMessage(message ?? randomMessage);
      setIsAnimating(true);

      // Auto-dismiss after delay
      const timer = setTimeout(handleDismiss, dismissDelay);
      return (): void => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [isVisible, message, dismissDelay, handleDismiss]);

  if (!isVisible && !isAnimating) {
    return null;
  }

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        pointer-events-none
        transition-opacity duration-fast
        ${isAnimating ? 'opacity-100' : 'opacity-0'}
      `}
      role="alert"
      aria-live="polite"
      aria-label={displayMessage}
    >
      {/* Backdrop with subtle overlay */}
      <div className="absolute inset-0 bg-success-100/40" />

      {/* Star particles */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`
            absolute text-warning
            ${starSizeClasses[star.size]}
            animate-star-float
          `}
          style={{
            left: `${String(star.x)}%`,
            top: `${String(star.y)}%`,
            animationDelay: `${String(star.delay)}s`,
            animationDuration: `${String(star.duration)}s`,
          }}
          aria-hidden="true"
        >
          <Icon name="star" size={getIconSize(star.size)} />
        </div>
      ))}

      {/* Main celebration card */}
      <div
        className={`
          relative
          bg-white rounded-2xl shadow-lift
          px-8 py-6
          flex flex-col items-center gap-4
          animate-celebrate
        `}
      >
        {/* Success icon */}
        <div
          className={`
            w-16 h-16 rounded-full
            bg-success-100
            flex items-center justify-center
            text-success-600
          `}
        >
          <Icon name="check" size="xl" label="Correct" />
        </div>

        {/* Message */}
        <p className="text-xl font-bold text-success-700">{displayMessage}</p>
      </div>

      {/* CSS for star float animation */}
      <style>{`
        @keyframes star-float {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(20px);
          }
          30% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translateY(-30px);
          }
        }
        .animate-star-float {
          animation: star-float 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
