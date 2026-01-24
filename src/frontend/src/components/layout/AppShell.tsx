import type { JSX, ReactNode } from 'react';

export interface AppShellProps {
  /** Optional header component */
  header?: ReactNode;
  /** Main content area */
  children: ReactNode;
}

/**
 * AppShell - Main application wrapper
 *
 * Provides a clean, minimal container optimized for children:
 * - Warm, calming background color
 * - Responsive max-width for tablets
 * - Flexible layout with header slot
 * - Full height without scroll issues
 *
 * @example
 * ```tsx
 * <AppShell header={<Header />}>
 *   <GameMenu />
 * </AppShell>
 * ```
 */
export const AppShell = ({ header, children }: AppShellProps): JSX.Element => {
  return (
    <div className="min-h-screen bg-background-cream">
      {/* Centered container with max-width for tablets */}
      <div className="mx-auto max-w-2xl min-h-screen flex flex-col">
        {/* Header slot */}
        {header}

        {/* Main content area */}
        <main className="flex-1 p-content-lg">{children}</main>
      </div>
    </div>
  );
};
