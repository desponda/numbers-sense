# UX Validation Process

**Created**: January 2026
**Purpose**: Prevent UX failures like the race game modal issue from reaching production

---

## What Went Wrong

### The Race Game Modal Issue (January 2026)

**Problem**: The question modal used a full-screen overlay that completely obscured the race track, breaking the core game metaphor.

**Why It Happened**:
1. No visual design phase before coding
2. No screenshot validation during development
3. Component tests were skipped (`.skip` files)
4. Spec explicitly stated lanes should be visible, but we didn't validate this
5. Went straight from spec → code without mockups

**Impact**: Game was fundamentally broken - students couldn't see which lane they were helping

---

## Mandatory UX Validation Steps

### Phase 1: Before Coding (REQUIRED)

**For ANY user-facing component**, complete these steps BEFORE writing code:

#### 1.1 Visual Design Mockup

Create ASCII art or description of layout:
```
┌─────────────────────────────────┐
│  Header                         │
├─────────────────────────────────┤
│                                 │
│  Main Content                   │
│  (always visible)               │
│                                 │
├─────────────────────────────────┤
│                                 │
│  Interactive Element            │
│  (drawer/panel/modal)           │
│                                 │
└─────────────────────────────────┘
```

**Include**:
- Layout structure (what's visible when)
- Responsive behavior (mobile vs desktop)
- Z-index/layering decisions
- Touch target sizes

#### 1.2 UX Checklist Against Research

Validate design against `/docs/research/ux-principles.md`:

- [ ] Touch targets ≥ 48px (recommended 64px for children)
- [ ] Color saturation 60-80% (non-overstimulating)
- [ ] Animation duration 150-300ms (smooth not distracting)
- [ ] Maintains visual metaphor throughout interaction
- [ ] No cognitive disconnection (context always visible)
- [ ] Follows WCAG AA accessibility standards
- [ ] Keyboard navigation supported
- [ ] Screen reader announces context

#### 1.3 Get Approval

Post mockup in PR or chat:
- User approves layout
- VP reviews against research docs
- Technical lead confirms feasibility

**DO NOT PROCEED** without approval.

---

### Phase 2: During Implementation (REQUIRED)

#### 2.1 Screenshot Every Major State

After implementing component, take screenshots of:
- Initial render
- Interaction states (hover, focus, active)
- Success/error states
- Mobile and desktop viewports
- With real content (not lorem ipsum)

Save to `/tmp/component-name-state.png`

#### 2.2 Visual Comparison

Compare screenshots to:
- Original mockup
- UX research principles
- Game specification
- Similar components (consistency)

Ask: "Does this match our vision?"

#### 2.3 Run Dev Server

**Mandatory**: Visually inspect component in browser before marking PR ready:
```bash
npm run dev
# Navigate to component
# Interact with it
# Verify it feels right
```

Never ship UI without seeing it.

---

### Phase 3: Testing (NO EXCEPTIONS)

#### 3.1 Component Tests

**NO `.skip` FILES ALLOWED**

Every component must have:
- [ ] Render tests (elements present)
- [ ] Interaction tests (clicks, keyboard)
- [ ] Accessibility tests (roles, labels, focus)
- [ ] Visual tests (CSS classes applied)
- [ ] Edge case tests (long text, empty states)

Example:
```typescript
describe('ComponentName', () => {
  it('maintains context visibility during interaction', () => {
    render(<ComponentName />);
    fireEvent.click(screen.getByRole('button'));
    // Verify background content still visible
    expect(screen.getByTestId('background')).toBeVisible();
  });
});
```

#### 3.2 E2E Visual Tests

Create E2E test with screenshots:
```typescript
test('Component UX validation', async ({ page }) => {
  await page.goto('...');
  await page.click('...');

  // Take screenshot at critical moment
  await page.screenshot({
    path: '/tmp/validation-screenshot.png',
    fullPage: true
  });

  // Verify critical elements visible
  await expect(page.locator('[data-critical]')).toBeVisible();
});
```

#### 3.3 Visual Regression Tests (Future)

Set up Percy or similar:
- Baseline screenshots on main branch
- Compare PR screenshots to baseline
- Flag visual changes for review

---

### Phase 4: Pre-Merge Review (REQUIRED)

#### 4.1 UX Validation Checklist

PR must include:
- [ ] Screenshots of all major states
- [ ] Comparison to original mockup/spec
- [ ] UX research checklist completed
- [ ] Component tests passing (no skips)
- [ ] E2E tests with visual validation
- [ ] Accessibility audit (axe, WAVE, or manual)
- [ ] Mobile and desktop tested
- [ ] Keyboard navigation verified
- [ ] Screen reader tested (if applicable)

#### 4.2 Self-Review Questions

Before marking PR ready, answer:

1. **Does this match the spec?** (Visual appearance and behavior)
2. **Is context always visible?** (No cognitive disconnection)
3. **Can I navigate without a mouse?** (Keyboard accessibility)
4. **Would a 6-year-old understand this?** (Age-appropriate UX)
5. **Did I test it myself?** (Not just "tests pass")
6. **Is the game metaphor preserved?** (No abstract quizzes)
7. **Are touch targets large enough?** (48-64px minimum)

If ANY answer is "no" or "unsure", **DO NOT MERGE**.

---

## Agent Responsibilities

### Visual Design Agent (NEW - MANDATORY)

**When**: Before any UI implementation
**Tools**: Read (specs), Write (mockups), AskUserQuestion
**Deliverables**:
- ASCII art mockup
- Responsive behavior description
- UX research validation
- User approval confirmation

**Example**:
```bash
claude agent design-agent "Create visual mockup for [component]
following /docs/research/ux-principles.md. Include mobile and desktop
layouts. Get user approval before proceeding."
```

### UX Validator Agent (NEW - MANDATORY)

**When**: After implementation, before merge
**Tools**: Read (code), Glob (screenshots), WebFetch (specs)
**Deliverables**:
- Screenshot analysis
- UX checklist validation
- Accessibility audit results
- Comparison to research docs

**Example**:
```bash
claude agent ux-validator "Review [component] implementation against
/docs/research/ux-principles.md. Check screenshots at /tmp/*.png.
Verify no UX violations before merge."
```

---

## Enforcement

### Pre-commit Hooks

```bash
# .husky/pre-commit
npm run typecheck
npm run lint
npm run format
npm run test -- --run  # NO SKIPPED TESTS
```

### Pre-push Hooks

```bash
# .husky/pre-push
npm run build  # Catch production issues
npm run test -- --run  # Full suite
# E2E tests run in CI (too slow for push)
```

### GitHub PR Template

```markdown
## UX Validation Checklist

- [ ] Screenshots attached (initial, interactive, mobile, desktop)
- [ ] Compared to mockup/spec
- [ ] UX research checklist completed
- [ ] Component tests passing (no .skip files)
- [ ] E2E tests with visual validation
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (if applicable)
- [ ] Tested on real device (tablet/phone)

## Screenshots

### Desktop
![Desktop view](url)

### Mobile
![Mobile view](url)

### Interactive State
![Interactive](url)
```

---

## Tools

### Required Tools

1. **Playwright** - E2E testing with screenshots
2. **Vitest** - Component testing
3. **axe-core** - Accessibility testing
4. **eslint-plugin-jsx-a11y** - A11y linting

### Recommended Tools

1. **Percy** or **Chromatic** - Visual regression testing
2. **Storybook** - Component visual documentation
3. **Figma** - Visual design (for complex UIs)
4. **VoiceOver/TalkBack** - Screen reader testing

---

## Weekly UX Audit

**Every Friday**:
1. UX Validator agent reviews all merged components from past week
2. Compares to research docs
3. Flags violations
4. Creates issues for remediation

**Run**:
```bash
claude agent ux-audit "Review all components modified in last 7 days.
Check against /docs/research/ux-principles.md. Create issues for violations."
```

---

## Examples of Good vs Bad

### ❌ BAD: Full-Screen Modal

```tsx
// WRONG: Obscures game context
<div className="fixed inset-0 bg-black bg-opacity-70">
  <QuestionModal />
</div>
```

**Problem**: Students can't see race track, breaks game metaphor

### ✅ GOOD: Bottom Drawer

```tsx
// CORRECT: Keeps context visible
<div className="flex flex-col h-screen">
  <RaceTrack className="flex-1" />  {/* Always visible */}
  <QuestionDrawer className="fixed bottom-0" />
</div>
```

**Benefit**: Race track visible, maintains context

---

## Lesson Learned

**We had excellent research but failed to enforce it.**

Having `/docs/research/ux-principles.md` is worthless if we don't:
1. Design against it (mockups)
2. Validate against it (screenshots)
3. Test against it (component + E2E tests)
4. Review against it (PR checklist)

**This process ensures we never skip these steps again.**

---

## Quick Reference

**Before coding**: Mockup → UX checklist → Approval
**During coding**: Screenshots → Visual comparison → Dev server test
**Before merge**: Full test suite → Accessibility audit → User testing
**After merge**: Weekly UX audit

**If it touches the UI, it goes through this process. NO EXCEPTIONS.**
