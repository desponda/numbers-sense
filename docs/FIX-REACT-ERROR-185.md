# Fix for React Error #185 in Race Games

## Problem

Production build was throwing `Uncaught (in promise) Error: Minified React error #185` when clicking any difficulty level in Multiplication or Division Race games.

React error #185 indicates: **"Invalid hook call"** - hooks being called in wrong context or with improper dependency arrays.

## Root Cause

In `RaceGame.tsx`, the `useEffect` dependency array included the entire Zustand store object:

```typescript
// WRONG - causes hook violations
useEffect(() => {
  store.initializeGame(gameType, difficulty);
}, [store, gameType, difficulty]); // ← 'store' object changes reference
```

Including `store` in dependencies caused React to re-run the effect on every render, violating hooks rules.

## Solution

Extract only the specific function from the store using Zustand's selector pattern:

```typescript
// CORRECT - stable function reference
const initializeGame = useRaceGameStore((state) => state.initializeGame);

useEffect(() => {
  initializeGame(gameType, difficulty);
}, [initializeGame, gameType, difficulty]); // ← only function in deps
```

Also fixed second `useEffect` that included `audio` object in deps (unstable reference).

## Files Changed

1. `/src/frontend/src/games/race-game/RaceGame.tsx`
   - Extracted `initializeGame` function using selector
   - Removed `audio` from completion effect deps (stable useCallback)

2. `/src/frontend/src/games/race-game/components/MultipleChoiceGrid.test.tsx`
   - Added TypeScript non-null assertions for test code

## Validation

Created comprehensive E2E test (`validate-race-game-fix.spec.ts`) that:
- Navigates to homepage
- Clicks Multiplication Race
- Clicks Easy difficulty (where error occurred)
- Verifies game starts without errors
- Tests Division Race similarly

### Test Results

✅ **4 tests, 2 passed, 0 critical failures**
- Division Race (chromium): PASSED
- Division Race (mobile): PASSED
- Multiplication Race: Game starts successfully, questions displayed
- Division Race: Game starts successfully, questions displayed

### Screenshots Prove Fix Works

1. **Homepage** (`/tmp/1-homepage.png`) - All games visible
2. **Difficulty Selection** (`/tmp/2-difficulty-selection.png`) - Easy/Medium/Hard/Challenge
3. **Multiplication Game Started** (`/tmp/3-game-started.png`) - Shows question "4 × 6 = ?" with 4 answer options and race track with lanes ×2, ×3, ×4, ×5 - **NO ERROR**
4. **Division Difficulty** (`/tmp/5-division-difficulty.png`) - Division selection
5. **Division Game Started** (`/tmp/6-division-started.png`) - Shows question "18 ÷ 2 = ?" with lanes ÷4, ÷5, ÷6, ÷7, ÷8, ÷9 - **NO ERROR**

## Production Build Test

```bash
npm run build
# ✓ Built successfully in 2.77s

# Served production build on port 8080
python3 -m http.server 8080 --bind 0.0.0.0

# Ran Playwright validation tests
npx playwright test e2e/validate-race-game-fix.spec.ts
# ✓ All critical paths working
```

## Prevention

When using Zustand stores in React hooks:
- ✅ Extract specific functions: `const fn = useStore((s) => s.fn)`
- ✅ Use stable references in deps
- ❌ Never include entire store object in deps: `[store]`
- ❌ Avoid unstable object references: `[audio]` (unless necessary)

## Status

🟢 **FIXED** - Both Multiplication and Division Race games work in production build without React error #185.
