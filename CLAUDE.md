# CLAUDE.md - Project Context for Claude

## Project Overview

**NumberSense** is a K-3 math education app designed to build number sense in young learners. The app focuses on helping children develop an intuitive understanding of numbers, quantities, and their relationships through interactive, research-backed games.

## Core Games

### 1. Build the Number
Players use virtual base-10 blocks (ones, tens, hundreds) to construct target numbers. This game reinforces place value understanding and the composition/decomposition of numbers.

### 2. Sort the Numbers
Players sort visual and numeric representations by magnitude, developing number comparison skills and magnitude estimation abilities.

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript 5.x (strict mode enabled)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Backend**: Hono API

## Key Directories

```
/src/frontend     - React frontend application
/src/backend      - Hono API server (not yet created)
/src/shared       - Shared TypeScript types and utilities
/docs/research    - UX and learning science principles
/docs/specs       - Game mechanics specifications
/docs/architecture - Technical blueprint and system design
```

## Code Style

- **Linting**: ESLint with Airbnb configuration + TypeScript strict rules
- **Formatting**: Prettier
- **TypeScript**: Strict mode enabled - no implicit any, strict null checks

## UX Principles

- **Large touch targets**: 48-64px minimum for child-friendly interaction
- **Muted color palette**: Calming colors to reduce overstimulation
- **No overstimulation**: Minimal animations, avoid flashing or rapid visual changes
- **Full accessibility**: WCAG compliance, screen reader support, keyboard navigation

## Testing

- **Unit/Integration**: Vitest (not yet set up)
- **E2E**: Playwright (not yet set up)

## Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```
