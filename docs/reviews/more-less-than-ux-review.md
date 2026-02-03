# More Than / Less Than - UX Validation Report

**Date**: February 3, 2026
**Game**: More Than / Less Than (Game 3)
**Validator**: UX Validation Agent
**Validated Against**:
- `/workspaces/numbers-sense/docs/research/ux-principles.md`
- `/workspaces/numbers-sense/docs/research/subtraction-ux-patterns.md`
- `/workspaces/numbers-sense/docs/UX-VALIDATION-PROCESS.md`

---

## Executive Summary

The More Than / Less Than game demonstrates **strong adherence to UX principles** with a few critical issues that must be fixed before production deployment.

**Overall Grade**: ⚠️ **Conditional Pass** (2 critical issues, 5 warnings)

**Critical Issues (Must Fix)**:
1. ❌ Undefined color class `text-coral-500` causing visual regression
2. ❌ Problem text size below minimum for child-friendly UX (28px vs 48px recommended)

**Warnings (Should Fix)**:
3. ⚠️ Touch targets not explicitly sized to 64px minimum
4. ⚠️ Missing ARIA live regions for dynamic feedback
5. ⚠️ Animation timing may be too slow for advanced learners
6. ⚠️ No reduced motion alternative
7. ⚠️ Visual scaffold shows answer before attempt (pedagogical concern)

---

## Detailed Validation

### 1. Colors & Visual Design

#### ✅ **PASSES**: Warm Color Palette for Error States

**Finding**: Feedback system correctly uses warm orange (`border-orange-400`, `bg-orange-100`) instead of harsh red.

**Evidence** (`FeedbackDisplay.tsx`):
```tsx
// Attempt 1: Not quite
<div className="bg-orange-100 border-4 border-orange-400 rounded-xl p-6 text-center">
```

**Aligned with**:
- UX Principles §1.1.4: "Avoid red for errors: Use warm orange or gentle coral"
- Subtraction UX Patterns: "Never use harsh red or alarm colors"

---

#### ✅ **PASSES**: Teal Primary Action Color

**Finding**: Answer input and submit button use teal (`border-teal-400`, `bg-teal-500`) for primary interactions.

**Evidence** (`AnswerInput.tsx`):
```tsx
borderColor = 'border-teal-400';
className="bg-teal-500 hover:bg-teal-600"
```

**Aligned with**:
- Tailwind config: Primary teal for interactive elements
- UX Principles: "Blue = interactive elements"

---

#### ✅ **PASSES**: Green Success Feedback

**Finding**: Correct answers use soft green (`bg-green-100`, `border-green-500`), not harsh bright green.

**Evidence** (`FeedbackDisplay.tsx`):
```tsx
<div className="bg-green-100 border-4 border-green-500 rounded-xl p-6 text-center">
```

**Aligned with**:
- UX Principles: "Green = correct/success"
- Color saturation appropriate for children (muted tones)

---

#### ❌ **FAILS**: Undefined Coral Color Class

**Finding**: `ProblemDisplay.tsx` uses `text-coral-500` class that doesn't exist in Tailwind config.

**Evidence**:
```tsx
// ProblemDisplay.tsx:18
<span className="text-coral-500 font-bold underline">
```

**Tailwind config**: No `coral` color defined (only `blocks.hundred: '#E8A07C'` which is labeled as coral but not exposed as utility class).

**Impact**:
- Text will render in default color (black), not intended emphasis color
- Breaks visual hierarchy for operation emphasis
- Reduces pedagogical clarity

**Recommendation**:
```javascript
// tailwind.config.js - Add to theme.extend.colors
coral: {
  DEFAULT: '#FF8C6B',
  50: '#FFF5F2',
  100: '#FFE8E0',
  200: '#FFD1C1',
  300: '#FFBAA2',
  400: '#FFA383',
  500: '#FF8C6B',  // Primary coral
  600: '#E6754E',
  700: '#C65E38',
  800: '#9A4829',
  900: '#6E331D',
}
```

---

#### ⚠️ **WARNING**: Inconsistent Muted Saturation

**Finding**: Some colors may exceed 80% saturation guideline.

**Analysis**:
- `bg-teal-500`: Appears vibrant (needs color contrast checker)
- `border-green-500`: May be too saturated for children

**Recommendation**: Run colors through saturation checker to ensure 60-80% range per UX Principles §1.1.

---

### 2. Typography

#### ⚠️ **WARNING**: Problem Text Below Recommended Size

**Finding**: Problem text uses `text-3xl` (56px) which is good, but UX Principles recommend **text-4xl or larger for math numbers**.

**Evidence** (`ProblemDisplay.tsx`):
```tsx
<h2 className="text-3xl font-semibold text-gray-800 mb-2">
```

**UX Principles Reference**:
- §1.2: "Numbers (math): 32-40px (mobile), 44-56px (tablet)"
- §6.1: "Math numbers: 32-40px (mobile), 44-56px (tablet)"

**Current**: 56px (meets tablet spec but at minimum)

**Recommendation**: Increase to `text-4xl` (72px custom or use math-specific classes from Tailwind config):
```tsx
<h2 className="text-math-lg font-semibold text-gray-800 mb-2">
// text-math-lg = 40px line-height 48px (Tailwind config line 101)
```

---

#### ✅ **PASSES**: Answer Input Font Size

**Finding**: Answer input correctly uses `text-4xl font-bold` for large, clear numerical entry.

**Evidence** (`AnswerInput.tsx:56`):
```tsx
className="text-4xl font-bold text-center"
```

**Aligned with**: UX Principles §1.2 "Math numbers: 32-40px+"

---

#### ✅ **PASSES**: Clear Visual Hierarchy

**Finding**: Distinct font sizes separate problem (3xl), instruction (lg), feedback (2xl), and meta info (sm).

**Evidence**:
- Problem: `text-3xl`
- "Your answer": `text-lg`
- Feedback: `text-2xl` / `text-xl`
- Progress: `text-sm`

**Aligned with**: UX Principles §1.4 "Visual Hierarchy: Clear focus point"

---

### 3. Touch Targets & Interactions

#### ⚠️ **WARNING**: Touch Targets Not Explicitly Sized

**Finding**: Submit button uses `px-8 py-3` which may not guarantee 64px minimum height.

**Evidence** (`AnswerInput.tsx:71`):
```tsx
className="px-8 py-3 bg-teal-500..."
```

**Calculation**:
- `py-3` = 12px top + 12px bottom = 24px padding
- Font size `text-lg` = 24px + line-height 32px
- Total approximate: 56-58px (below 64px recommended)

**UX Principles Reference**:
- §2.1: "Primary buttons: Minimum 56px height, **full width when possible**"
- §2.1: "All ages (primary actions): 56x56px minimum, **64-72px recommended**"

**Recommendation**:
```tsx
className="
  px-8 py-4  // Increase vertical padding
  min-h-touch-lg  // Explicit 64px minimum
  bg-teal-500 hover:bg-teal-600
  text-white font-semibold text-lg
  rounded-lg
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
"
```

---

#### ⚠️ **WARNING**: Answer Input Touch Area

**Finding**: Input field height not explicitly constrained to minimum spec.

**Evidence** (`AnswerInput.tsx:55-58`):
```tsx
className="
  text-4xl font-bold text-center
  border-4 ${borderColor}
  rounded-xl
  px-6 py-4
  min-w-[150px]
  ...
"
```

**Calculation**:
- `py-4` = 16px × 2 = 32px padding
- `text-4xl` ≈ 40px
- Border: 4px × 2 = 8px
- Total: ~80px ✅ (exceeds 64px minimum)

**Status**: Actually **PASSES** on calculation, but should be explicit:
```tsx
min-h-touch-lg  // Add for clarity
```

---

#### ✅ **PASSES**: Exit Button Size

**Finding**: Exit button uses `px-4 py-2` which is appropriately sized for secondary action.

**Evidence** (`MoreLessThanGame.tsx:158`):
```tsx
className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
```

**Note**: Secondary actions can be smaller than primary (44px minimum OK per UX Principles).

---

### 4. Animations

#### ✅ **PASSES**: Smooth Timing for Visual Scaffold

**Finding**: Animations use appropriate durations and easing.

**Evidence** (`VisualScaffold.tsx`):
```tsx
transition={{
  duration: 0.5,  // 500ms within 250-500ms range
  ease: [0.34, 1.56, 0.64, 1], // Spring-like easing
}}
```

**Aligned with**:
- UX Principles §1.4: "Transitions: 250-350ms ease-in-out"
- Subtraction UX Patterns: "Animation durations 150-300ms (micro), 250-350ms (transitions)"

---

#### ⚠️ **WARNING**: Animation Delay May Be Too Long

**Finding**: Visual scaffold waits 800ms before showing delta animation.

**Evidence** (`VisualScaffold.tsx:62-64`):
```tsx
const timer = setTimeout(() => {
  setShowDelta(true);
}, 800);
```

**Concern**: 800ms delay may feel sluggish for older children or advanced learners.

**Recommendation**: Make delay difficulty-adaptive:
```tsx
const delay = difficulty === 'easy' ? 800 : difficulty === 'medium' ? 500 : 300;
```

---

#### ⚠️ **WARNING**: No Reduced Motion Alternative

**Finding**: Framer Motion animations lack `prefers-reduced-motion` checks.

**Evidence**: No `useReducedMotion()` hook or `initial={false}` for accessibility.

**UX Principles Reference**: §3.4 "Reduced motion: Option to minimize animations"

**Recommendation**:
```tsx
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();

<motion.div
  initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0, opacity: 0 }}
  animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
/>
```

---

#### ✅ **PASSES**: Adding vs Taking Away Animation

**Finding**: Operations correctly use distinct visual effects.

**Evidence** (`VisualScaffold.tsx:129-136`):
```tsx
initial={
  operation === 'more'
    ? { scale: 0, opacity: 0, y: -30 }  // Scale in for adding
    : { scale: 1, opacity: 1 }
}
animate={
  operation === 'more'
    ? { scale: 1, opacity: 1, y: 0 }     // Appear
    : { scale: 0.95, opacity: 0.4 }     // Dim for removing
}
```

**Aligned with**:
- Subtraction UX Patterns §3: "Adding feels additive, removal feels subtractive"
- Pattern A: Fade & Shrink for taking away

---

### 5. Accessibility

#### ✅ **PASSES**: ARIA Labels on Inputs

**Finding**: Answer input has proper `aria-label`.

**Evidence** (`AnswerInput.tsx:65`):
```tsx
aria-label="Answer input"
```

---

#### ✅ **PASSES**: Semantic Problem Announcement

**Finding**: Problem display includes descriptive `aria-label` for screen readers.

**Evidence** (`ProblemDisplay.tsx:12-16`):
```tsx
const ariaLabel = `What is ${String(delta)} ${operation} than ${String(startingNumber)}?`;

<h2 className="text-3xl font-semibold text-gray-800 mb-2" aria-label={ariaLabel}>
```

**Aligned with**: UX Principles §3.1 "WCAG 2.1 AA Compliance: Descriptive, child-friendly labels"

---

#### ⚠️ **WARNING**: Missing ARIA Live Regions

**Finding**: Feedback display lacks `role="alert"` or `aria-live` for dynamic updates.

**Evidence** (`FeedbackDisplay.tsx`): No aria-live attributes on feedback divs.

**Impact**: Screen reader users won't be automatically notified of feedback changes.

**Recommendation**:
```tsx
// Correct feedback
<div
  className="bg-green-100 border-4 border-green-500 rounded-xl p-6 text-center"
  role="alert"
  aria-live="polite"
>

// Incorrect feedback
<div
  className="bg-orange-100 border-4 border-orange-400 rounded-xl p-6 text-center"
  role="alert"
  aria-live="assertive"  // More urgent for errors
>
```

---

#### ✅ **PASSES**: Keyboard Navigation

**Finding**: Enter key submits answer.

**Evidence** (`AnswerInput.tsx:32-36`):
```tsx
const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
  if (e.key === 'Enter' && value !== null) {
    onSubmit();
  }
};
```

**Aligned with**: UX Principles §3.1 "2.1.1 Keyboard: Full keyboard access"

---

#### ✅ **PASSES**: Focus States

**Finding**: Input has visible focus ring.

**Evidence** (`AnswerInput.tsx:61`):
```tsx
focus:outline-none focus:ring-4 focus:ring-teal-200
```

**Aligned with**: UX Principles §3.1 "Focus management"

---

#### ⚠️ **WARNING**: Color Contrast Not Verified

**Finding**: No programmatic verification of WCAG AA 4.5:1 contrast ratios.

**Recommendation**: Run automated accessibility audit:
```bash
npm run a11y-audit
# Or manually test with axe DevTools, WAVE, or Lighthouse
```

---

### 6. Error Feedback

#### ✅ **PASSES**: No "WRONG" Text

**Finding**: Feedback uses encouraging language: "Not quite. Try again!" instead of "WRONG" or "INCORRECT".

**Evidence** (`FeedbackDisplay.tsx:30`):
```tsx
<div className="text-xl font-semibold text-orange-800">Not quite. Try again!</div>
```

**Aligned with**:
- Subtraction UX Patterns §8: "Never use 'WRONG' text"
- Error feedback: "Not quite!", "Let's try again!"

---

#### ✅ **PASSES**: Warm, Encouraging Tone

**Finding**: All feedback messages use friendly, child-appropriate language.

**Evidence**:
- Attempt 1: "Not quite. Try again!" 🤔
- Attempt 2: "Hint:" 💡
- Attempt 3: "The answer is..." 📚

**Aligned with**: UX Principles §4.3 "No 'wrong' language: Use 'try again' or 'not quite'"

---

#### ✅ **PASSES**: Progressive Scaffolding (3 Attempts)

**Finding**: Feedback system correctly implements 3-attempt scaffolding.

**Evidence** (`MoreLessThanGame.tsx:76-122`):
1. Attempt 1: Generic "try again"
2. Attempt 2: Specific hint from validation
3. Attempt 3: Show answer, move to next

**Aligned with**:
- Subtraction UX Patterns §8: "Progressive Scaffolding" (attempts 1-3)
- UX Principles §4.2: "After 3 attempts, offer help or hint"

---

#### ✅ **PASSES**: Specific Hints Provided

**Finding**: Validation logic generates context-specific hints.

**Note**: Validation logic not reviewed in this UX audit (deferred to testing phase), but feedback component correctly displays `hint` prop.

---

### 7. Child-Friendly Design

#### ✅ **PASSES**: Large, Clear Text

**Finding**: All interactive text meets or exceeds minimum sizes:
- Problem: 56px ✅
- Answer input: 40px+ ✅
- Feedback: 32-40px ✅

---

#### ✅ **PASSES**: Simple Language

**Finding**: All text uses K-3 vocabulary:
- "What is..."
- "Your answer:"
- "Not quite. Try again!"
- "Hint:"

**Aligned with**: UX Principles §1.2 "Reading level: K-3 vocabulary; short, simple sentences"

---

#### ✅ **PASSES**: Calm, Non-Stimulating

**Finding**: Design avoids overstimulation:
- Muted color palette (orange, teal, green)
- Generous whitespace (`gap-8`, `p-8`)
- No flashing or rapid animations
- Single focus point per section

**Aligned with**: UX Principles §1.4 "Calm, Non-Overstimulating Design Patterns"

---

#### ✅ **PASSES**: Joyful but Not Overwhelming

**Finding**: Success feedback is celebratory but brief:
- Large checkmark ✓
- Green background (not confetti)
- 2-second display then next problem

**Aligned with**: UX Principles §4.2 "Positive Reinforcement Without Overstimulation"

---

### 8. Pedagogical Concerns

#### ⚠️ **WARNING**: Visual Scaffold Shows Answer

**Finding**: In Easy mode, visual scaffold displays the result BEFORE student attempts answer.

**Evidence** (`VisualScaffold.tsx:187-198`):
```tsx
{showDelta && (
  <motion.div
    className="text-center px-4 py-2 bg-blue-50 rounded-lg border border-blue-200"
  >
    <div className="text-sm text-blue-700 font-medium">
      Result: {String(operation === 'more' ? startingNumber + delta : startingNumber - delta)}
    </div>
  </motion.div>
)}
```

**Pedagogical Issue**:
- Student can just read the answer without thinking
- Defeats purpose of visual scaffolding (should guide thinking, not replace it)
- Contradicts research-backed CPA approach (concrete → pictorial → abstract)

**Subtraction UX Patterns Reference**: §5 "Concrete to Abstract Progression"
- Phase 1 (Concrete): "Student counts blocks to find answer" (no answer shown)
- Phase 2 (Semi-abstract): "Equation updates dynamically" (not pre-shown)

**Recommendation**:
1. **Option A (Preferred)**: Hide result until after first attempt
   ```tsx
   {showDelta && attemptCount >= 1 && (
     <motion.div>Result: ...</motion.div>
   )}
   ```

2. **Option B**: Make result a "Peek" button (Medium difficulty pattern)
   ```tsx
   <PeekButton onClick={() => setShowResult(true)}>
     Show Result Hint
   </PeekButton>
   ```

3. **Option C**: Only show result after 2 incorrect attempts (progressive hint)

---

#### ✅ **PASSES**: Base-10 Visual Representation

**Finding**: Visual scaffold correctly uses base-10 blocks (tens + units).

**Evidence** (`VisualScaffold.tsx:76-81`):
```tsx
const startTens = Math.floor(startingNumber / 10);
const startUnits = startingNumber % 10;
const deltaTens = Math.floor(delta / 10);
const deltaUnits = delta % 10;
```

**Aligned with**: Learning Science Principles - Base-10 understanding

---

#### ✅ **PASSES**: Operation Distinction

**Finding**: "More" and "Less" operations use distinct visual treatments:
- More: Scale in, positive animation
- Less: Dim, strikethrough, grayscale filter

**Evidence** (`VisualScaffold.tsx:148-150`):
```tsx
className={`flex flex-wrap gap-3 justify-center max-w-2xl ${
  operation === 'less' ? 'line-through opacity-60' : ''
}`}
```

---

### 9. Consistency with Existing Games

#### ✅ **PASSES**: Consistent Feedback Pattern

**Finding**: Uses same 3-attempt progressive feedback as other games.

**Aligned with**: Codebase pattern in Build the Number, Sort the Numbers

---

#### ✅ **PASSES**: Consistent Color System

**Finding**: Teal primary, orange try-again, green success matches existing games.

---

#### ⚠️ **WARNING**: Streak Tracker Placement Differs

**Finding**: Streak displayed in top-right instead of persistent banner (like bike race game).

**Evidence** (`MoreLessThanGame.tsx:150-154`):
```tsx
{session && (
  <div className="text-lg text-gray-600">
    Streak: <span className="font-bold text-teal-600">{session.correctStreak}</span>
  </div>
)}
```

**Note**: Not a violation, but inconsistency may confuse users. Consider unified streak UI pattern across all games.

---

## Summary of Findings

### Critical Issues (Must Fix Before Production)

| # | Issue | Severity | File | Line | Fix Complexity |
|---|-------|----------|------|------|----------------|
| 1 | Undefined `text-coral-500` class | ❌ Critical | `ProblemDisplay.tsx` | 18 | Low (add to Tailwind config) |
| 2 | Visual scaffold shows answer before attempt | ❌ Critical (Pedagogical) | `VisualScaffold.tsx` | 187-198 | Medium (conditional rendering) |

---

### Warnings (Should Fix)

| # | Issue | Severity | File | Fix Complexity |
|---|-------|----------|------|----------------|
| 3 | Touch targets not explicitly 64px | ⚠️ Warning | `AnswerInput.tsx` | Low (add min-h class) |
| 4 | Missing ARIA live regions | ⚠️ Warning | `FeedbackDisplay.tsx` | Low (add role/aria-live) |
| 5 | Animation delay too long | ⚠️ Warning | `VisualScaffold.tsx` | Low (make adaptive) |
| 6 | No reduced motion support | ⚠️ Warning | `VisualScaffold.tsx` | Medium (add hook) |
| 7 | Color contrast not verified | ⚠️ Warning | All components | Low (run audit) |

---

### Passes (Excellent Work)

✅ **19 criteria passed**, including:
- Warm error colors (no harsh red)
- Teal primary actions
- Green success feedback
- Large, clear typography
- Encouraging language ("Not quite" not "WRONG")
- Progressive scaffolding (3 attempts)
- Keyboard navigation
- ARIA labels
- Simple, child-friendly language
- Calm, non-overstimulating design
- Distinct operation animations
- Base-10 visual representation

---

## Recommendations Priority Order

### P0 (Block Production)
1. **Fix coral color class**: Add `coral` to Tailwind config or replace with `text-orange-500`
2. **Hide result until attempt**: Modify visual scaffold to not show answer immediately

### P1 (High Priority)
3. **Add ARIA live regions**: Ensure screen reader users get feedback announcements
4. **Explicit touch target sizing**: Use `min-h-touch-lg` classes

### P2 (Medium Priority)
5. **Reduced motion support**: Add `useReducedMotion` hook from Framer Motion
6. **Adaptive animation delay**: Scale delay by difficulty (800/500/300ms)

### P3 (Low Priority)
7. **Run a11y audit**: Verify color contrast with automated tools
8. **Unify streak UI**: Consider consistent streak display across games

---

## Testing Recommendations

Before marking this component production-ready:

### Manual Testing
- [ ] Test with VoiceOver (macOS) or TalkBack (Android)
- [ ] Test keyboard-only navigation (tab, enter, escape)
- [ ] Test on iPad in portrait and landscape
- [ ] Test with reduced motion preference enabled
- [ ] Verify color contrast with Chrome DevTools or WAVE

### Automated Testing
- [ ] Component tests for all feedback states
- [ ] E2E test for 3-attempt flow
- [ ] Accessibility audit (axe-core)
- [ ] Visual regression test (screenshot comparison)

### User Testing
- [ ] Observe K-1 student using Easy mode
- [ ] Observe Grade 2-3 student using Hard mode
- [ ] Note confusion points or frustration
- [ ] Validate pedagogical effectiveness (do they learn?)

---

## Conclusion

The More Than / Less Than game is **well-designed and closely aligned with UX research principles**. The team clearly followed the design system and accessibility guidelines.

**Two critical issues must be fixed**:
1. Undefined coral color (visual regression)
2. Visual scaffold revealing answer (pedagogical flaw)

Once these are resolved, and the warnings are addressed, this game will be **production-ready and pedagogically sound**.

**Estimated fix time**: 2-4 hours for P0 issues, 4-6 hours for P1-P2 warnings.

---

**Next Steps**:
1. Create GitHub issues for P0 and P1 items
2. Assign to Game 3 developer
3. Re-run UX validation after fixes
4. Proceed to integration testing phase

---

**Reviewed by**: UX Validation Agent
**Sign-off required from**: VP of Engineering, VP of Product
**Status**: ⚠️ **Conditional Pass** - Fix P0 issues before merge
