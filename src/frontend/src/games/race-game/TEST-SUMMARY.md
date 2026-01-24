# Race Game Test Suite - Summary

## Overview

Comprehensive test suite for Multiplication Race and Division Race games, covering:

- Unit tests for utility functions
- Component tests for UI elements
- E2E tests for complete game flow
- Accessibility testing

## Test Files Created

### Unit Tests (Utils)

#### 1. `utils/questionGenerator.test.ts` (27 todo tests)

Tests question generation for both multiplication and division:

- Multiplication question format (N×M)
- Division question format (M÷N)
- Correct answer calculation
- 4 answer options generation
- Option randomization
- Unmastered fact selection
- Edge cases (0, 1, division by zero)

#### 2. `utils/distractorGenerator.test.ts` (17 todo tests)

Tests smart distractor generation:

- Exactly 3 distractors per question
- No duplicate distractors
- Correct answer not in distractors
- Valid range (0-100 for mult, 0-10 for div)
- Adjacent fact strategy
- Column confusion strategy
- Plausible range distractors

#### 3. `utils/laneSelector.test.ts` (12 passing tests)

Tests lane prioritization algorithm:

- ✓ Returns -1 when all lanes finished
- ✓ Returns -1 for empty lanes array
- ✓ Prioritizes furthest-behind lane
- ✓ Skips finished lanes
- ✓ Handles lanes at 0 steps
- ✓ Random selection among tied lanes
- ✓ Works with 10 lanes (multiplication)
- ✓ Works with 9 lanes (division)
- ✓ getLanesByPriority sorting
- ✓ Excludes finished lanes from priority list

#### 4. `utils/factMasteryTracker.test.ts` (24 todo tests)

Tests mastery tracking:

- Initialize 10 facts per lane
- Record correct/incorrect answers
- Mastery after 2 correct answers
- Query unmastered facts
- Calculate steps completed
- Lane finish detection

#### 5. `utils/testUtils.ts` (Helper utilities)

Mock data factories:

- `mockLaneState()` - Create mock lane states
- `mockRaceQuestion()` - Create mock questions
- `mockFactMastery()` - Create mock mastery maps
- `mockCompletedLane()` - Fully completed lane
- `mockPartialLane()` - Partially completed lane

### Component Tests

#### 6. `components/BikeRaceLane.test.tsx` (21 todo tests)

Tests lane display component:

- Progress counter display (7/20)
- Lane labels (×3 or ÷7)
- Bike position reflects progress
- Finish badge when complete
- Active lane highlighting
- Progress bar visual
- Accessibility labels

#### 7. `components/QuestionModal.test.tsx` (27 todo tests)

Tests question display modal:

- Question text display
- 4 answer options rendering
- Click interaction
- Disabled state
- Touch target sizing (120px × 64px)
- Keyboard navigation (Tab, Enter, Space)
- Accessibility (ARIA labels, screen reader)
- Visual feedback (hover, focus)

#### 8. `components/MultipleChoiceGrid.test.tsx` (20 todo tests)

Tests answer grid layout:

- 2×2 grid layout
- 4 buttons rendered
- Option values display
- Click handler
- Disabled state
- Touch targets (120px × 64px minimum)
- Keyboard accessibility
- Visual styling
- Edge cases (single/triple digits)

### E2E Tests

#### 9. `e2e/race-games.spec.ts` (50+ tests)

**Multiplication Race - Medium Mode:**

- Displays game title and instructions
- Shows 10 bike lanes (×0 through ×9)
- All lanes start at 0/20
- Question format: N × M = ?
- 4 answer options displayed
- Bike advances on correct answer
- Stays in place on incorrect answer
- Shows feedback on incorrect answer
- Highlights active lane
- Score counter and timer displayed
- Keyboard navigation works
- Pause/resume functionality

**Multiplication Race - Easy Mode:**

- Shows 6 lanes (×0 through ×5)
- Only lanes 0-5 visible

**Division Race - Medium Mode:**

- Shows 9 lanes (÷1 through ÷9, no ÷0)
- Question format: M ÷ N = ?
- Only whole number division questions
- Answer options in 0-10 range
- Bike advances on correct answer

**Division Race - Easy Mode:**

- Shows 5 lanes (÷1 through ÷5)

**Accessibility:**

- Screen reader can access lane info
- Question has accessible label
- Answer buttons have accessible names
- Keyboard-only navigation possible

**Visual Design:**

- Touch targets meet 48px minimum (mobile)
- Lanes are visually distinct
- Active lane is highlighted

**Game Flow:**

- Questions change after correct answer
- Same question after incorrect answer
- Timer counts up
- Can return to menu

## Test Coverage Goals

### Coverage Targets

- **Utility functions:** 80%+ line coverage
- **Components:** 70%+ coverage
- **E2E:** All critical paths covered

### Running Tests

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:coverage

# E2E tests (requires dev server running)
npm run test:e2e

# All tests
npm run ci
```

## Implementation Status

### ✅ Completed

- Test file structure created
- Test utilities (mockLaneState, mockRaceQuestion, etc.)
- Lane selector implementation and tests (12/12 passing)
- Question generator test placeholders (27 todo tests)
- Distractor generator test placeholders (17 todo tests)
- Fact mastery tracker test placeholders (24 todo tests)
- Component test placeholders (68 todo tests)
- E2E test structure (50+ test placeholders)

### 🔄 Pending (Waiting for Implementation)

All `it.todo()` tests are placeholders that will become active once:

1. Question generator is implemented
2. Distractor generator is implemented
3. Fact mastery tracker is implemented
4. BikeRaceLane component is implemented
5. QuestionModal component is implemented
6. MultipleChoiceGrid component is implemented
7. Game routing is implemented

## Test Patterns

### Unit Test Pattern (from existing tests)

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('componentName', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  it('describes the expected behavior', () => {
    // Arrange
    const input = setupTestData();

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

### Component Test Pattern

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ComponentName', () => {
  it('renders with correct props', () => {
    render(<ComponentName prop="value" />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    const mockHandler = vi.fn();

    render(<ComponentName onClick={mockHandler} />);
    await user.click(screen.getByRole('button'));

    expect(mockHandler).toHaveBeenCalled();
  });
});
```

### E2E Test Pattern

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to feature
  });

  test('user can complete task', async ({ page }) => {
    // Interact with UI
    await page.getByRole('button', { name: /click me/i }).click();

    // Verify outcome
    await expect(page.getByText(/success/i)).toBeVisible();
  });
});
```

## Validation Checklist

- [x] All test files created
- [x] Test utilities created
- [x] Lane selector tests passing (12/12)
- [x] No TypeScript errors
- [x] No parsing errors
- [ ] Unit tests passing (waiting for implementation)
- [ ] Component tests passing (waiting for implementation)
- [ ] E2E tests passing (waiting for implementation)
- [ ] Coverage ≥ 70% overall

## Notes for Implementation Team

1. **Test-Driven Development:** Tests are ready before implementation
2. **Data Attributes:** E2E tests expect these data attributes:
   - `data-testid="bike-lane"`
   - `data-testid="progress-counter"`
   - `data-testid="question-text"`
   - `data-testid="answer-option"`
   - `data-active="true"` for active lane
   - `data-correct="true"` for correct answer (test mode only)

3. **Accessibility Requirements:**
   - All interactive elements must have accessible labels
   - Keyboard navigation must work (Tab, Enter, Space)
   - Screen reader announcements for state changes

4. **Touch Targets:**
   - Minimum 48px height (UX research standard)
   - 120px × 64px for answer buttons (spec requirement)

5. **Test Mode:**
   - Consider adding a test mode that exposes correct answers via data attributes
   - Helps E2E tests verify game logic without manual solving

## References

- Multiplication Race Game Spec: `/docs/specs/multiplication-race-game.md`
- Division Race Game Spec: `/docs/specs/division-race-game.md`
- Existing Test Pattern: `/src/game-engine/problemGenerator.test.ts`
- E2E Test Pattern: `/e2e/games.spec.ts`
