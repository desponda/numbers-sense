# NumberSense UX Principles Document
## K-3 Math Education App (Ages 5-9)

**Version:** 1.0
**Last Updated:** January 2026
**Purpose:** Comprehensive UX guidelines for designing child-friendly, accessible, and effective learning interfaces

---

## Table of Contents

1. [Visual Design for Young Children](#1-visual-design-for-young-children)
2. [Touch Interaction Design](#2-touch-interaction-design)
3. [Accessibility Standards](#3-accessibility-standards)
4. [Learning-Focused UX Patterns](#4-learning-focused-ux-patterns)
5. [Parent Dashboard Patterns](#5-parent-dashboard-patterns)
6. [Technical Specifications Summary](#6-technical-specifications-summary)

---

## 1. Visual Design for Young Children

### 1.1 Color Psychology for Learning Environments

#### Primary Palette Guidelines

| Color Family | Psychological Effect | Use Case | Hex Example |
|-------------|---------------------|----------|-------------|
| Soft Blue | Calm, focus, trust | Backgrounds, navigation | `#6B9BD1` |
| Warm Yellow | Optimism, energy, attention | Highlights, rewards | `#F9D56E` |
| Gentle Green | Growth, success, nature | Correct answers, progress | `#7BC47F` |
| Soft Purple | Creativity, imagination | Special activities | `#9B8DC4` |
| Warm Orange | Enthusiasm, friendliness | CTAs, encouragement | `#F4A460` |

#### Color Application Principles

- **Avoid pure, saturated colors**: Use tinted/muted versions (60-80% saturation) to reduce visual strain
- **Limit palette to 4-5 core colors**: Prevents cognitive overload
- **Use consistent color coding**: Same color always means the same thing
  - Green = correct/success
  - Soft red/orange = try again (never harsh red)
  - Blue = interactive elements
  - Yellow = hints/help
- **Background colors**: Use off-white (`#F8F6F0`) or very light pastels, never pure white (`#FFFFFF`)
- **Avoid red for errors**: Use warm orange or gentle coral (`#E8927C`) to indicate "try again" without anxiety

#### Contrast Requirements

- **Text on backgrounds**: Minimum 4.5:1 contrast ratio (WCAG AA)
- **Large text (24px+)**: Minimum 3:1 contrast ratio
- **Interactive elements**: Minimum 3:1 against adjacent colors
- **Never rely on color alone**: Always pair with icons, shapes, or text

### 1.2 Typography for Emerging Readers

#### Font Selection Criteria

**Recommended Font Families:**
- **Primary**: Lexie Readable, OpenDyslexic, or Sassoon Primary
- **Alternatives**: Andika, Comic Neue, Nunito
- **System fallbacks**: Arial Rounded MT Bold, Verdana

**Font Characteristics for Young Readers:**
- Single-story 'a' (looks like handwritten 'a')
- Single-story 'g' (avoids confusion)
- Clear distinction between 'b', 'd', 'p', 'q'
- Open counters (the enclosed spaces in letters)
- Consistent letter spacing
- No thin strokes or fine serifs

#### Typography Specifications

| Element | Size (Mobile) | Size (Tablet) | Weight | Line Height |
|---------|--------------|---------------|--------|-------------|
| Main headings | 28-32px | 36-44px | Bold (700) | 1.2 |
| Instructions | 22-24px | 28-32px | Medium (500) | 1.4 |
| Body text | 18-20px | 24-28px | Regular (400) | 1.5 |
| Button labels | 20-22px | 26-30px | Semi-bold (600) | 1.2 |
| Numbers (math) | 32-40px | 44-56px | Bold (700) | 1.1 |

#### Text Presentation Rules

- **Maximum line length**: 45-50 characters for children
- **Text alignment**: Left-aligned (never justified)
- **Sentence case**: Avoid ALL CAPS except single words for emphasis
- **Reading level**: K-3 vocabulary; short, simple sentences
- **Number formatting**: Use numerals, not words (use "5" not "five")
- **Spacing**: Generous paragraph spacing (1.5-2x line height)

### 1.3 Icon and Imagery Best Practices

#### Icon Design Guidelines

- **Minimum icon size**: 44x44px (mobile), 48x48px (tablet)
- **Style**: Rounded corners, thick strokes (3-4px minimum)
- **Complexity**: Simple, recognizable silhouettes
- **Consistency**: Same visual weight and style throughout
- **Meaning**: Universal symbols children recognize (house, star, heart, checkmark)

#### Icon Requirements

```
Recommended:          Avoid:
- Filled icons        - Outline-only icons
- 2-3 colors max      - Complex gradients
- Rounded corners     - Sharp corners
- Thick strokes       - Thin, delicate lines
- Clear silhouettes   - Abstract symbols
```

#### Character and Mascot Guidelines

- **Friendly expressions**: Wide eyes, soft features, smiling
- **Diverse representation**: Multiple characters reflecting user diversity
- **Consistent style**: Same illustration style throughout app
- **Animation**: Subtle, purposeful movements (blink, wave, bounce)
- **Avoid**: Scary elements, sharp teeth, angry expressions

#### Imagery Best Practices

- **Photography**: Real-world objects for math manipulatives (blocks, fruits, toys)
- **Illustrations**: Consistent, friendly style with clear outlines
- **Backgrounds**: Simple, non-distracting; avoid busy patterns
- **Cultural sensitivity**: Inclusive imagery representing diverse backgrounds

### 1.4 Calm, Non-Overstimulating Design Patterns

#### Visual Hierarchy

1. **One primary action per screen**: Clear focus point
2. **Progressive disclosure**: Show only what's needed now
3. **Whitespace**: Generous padding (minimum 16px between elements)
4. **Visual breathing room**: 40% of screen should be "empty" space

#### Animation Guidelines

| Animation Type | Duration | Easing | Use Case |
|---------------|----------|--------|----------|
| Micro-interactions | 150-200ms | ease-out | Button feedback |
| Transitions | 250-350ms | ease-in-out | Screen changes |
| Celebrations | 800-1200ms | spring | Correct answers |
| Loading | Loop (2-3s) | linear | Wait states |

#### Avoiding Overstimulation

- **No flashing content**: Nothing faster than 3 flashes per second
- **Optional celebrations**: Allow parents to reduce animation intensity
- **Sound design**: Gentle, melodic sounds; never harsh or startling
- **Limit simultaneous movements**: Maximum 2 animated elements at once
- **No autoplay video/audio**: User-initiated only

---

## 2. Touch Interaction Design

### 2.1 Minimum Touch Target Sizes

#### Size Specifications by Age Group

| Age Group | Minimum Touch Target | Recommended Size | Spacing Between |
|-----------|---------------------|------------------|-----------------|
| Ages 5-6 | 48x48px | 56-64px | 16px minimum |
| Ages 7-9 | 44x44px | 48-56px | 12px minimum |
| All ages (primary actions) | 56x56px | 64-72px | 16-20px |

#### Touch Target Rules

- **Never smaller than 44x44px**: Even for secondary actions
- **Primary buttons**: Minimum 56px height, full width when possible
- **Icon buttons**: Include padding to reach 48x48px minimum
- **Adequate spacing**: Prevent accidental adjacent taps

```
Good:                    Bad:
[  Button  ]            [Button][Button]
     ^                       ^
  64px tall              No spacing
  16px padding           32px height
```

### 2.2 Gesture Patterns for Developing Motor Skills

#### Recommended Gestures by Difficulty

| Difficulty | Gesture | Age Appropriateness | Use Case |
|------------|---------|---------------------|----------|
| Easy | Single tap | All ages | Primary interaction |
| Easy | Press and hold | Ages 6+ | Secondary menus |
| Medium | Horizontal swipe | Ages 6+ | Pagination, cards |
| Medium | Vertical scroll | Ages 7+ | Long content |
| Hard | Drag and drop | Ages 7+ | Sorting, matching |
| Avoid | Pinch/zoom | Not recommended | Use buttons instead |
| Avoid | Multi-finger gestures | Not recommended | Too complex |
| Avoid | Double-tap | Not recommended | Timing too difficult |

#### Gesture Implementation Guidelines

- **Single tap is primary**: All core functionality via tap
- **Large gesture tolerance**: Accept gestures within 20-30px of intended area
- **Visual affordances**: Clearly show draggable elements
- **Confirm destructive actions**: Never delete on single gesture

### 2.3 Drag-and-Drop Considerations

#### Drag-and-Drop Specifications

- **Draggable element size**: Minimum 64x64px
- **Drop target size**: 1.5x the size of draggable element
- **Visual feedback**:
  - Lift effect on pick-up (scale 1.1x, shadow)
  - Highlight valid drop zones
  - Snap-to-target animation
- **Error tolerance**: Accept drops within 24px of target center

#### Drag-and-Drop Best Practices

```
Pickup State:
- Scale to 110%
- Add drop shadow
- Reduce opacity to 90%
- Show ghost in original position

During Drag:
- Element follows finger precisely
- Valid drop zones highlight (green border)
- Invalid areas dim slightly

On Drop:
- Smooth snap animation (200ms)
- Satisfying sound effect
- Visual confirmation (checkmark, sparkle)

On Miss:
- Animate back to original position (300ms)
- Gentle "try again" feedback
- No penalty, no harsh sounds
```

### 2.4 Error Tolerance and Forgiveness

#### Forgiveness Patterns

- **Undo capability**: Allow reversal of last action
- **Confirmation for exits**: "Are you sure?" with clear options
- **No permanent mistakes**: Children can always try again
- **Generous hit boxes**: Touch targets extend beyond visual bounds

#### Input Validation

- **Real-time feedback**: Show validity as user interacts
- **Positive framing**: "Almost there!" not "Wrong!"
- **Visual hints**: Highlight correct drop zones after failed attempts
- **Attempt limits**: After 3 attempts, offer help or hint

#### Accidental Touch Prevention

- **Ignore edge touches**: 20px margin around screen edges
- **Debounce rapid taps**: Minimum 300ms between registered taps
- **Confirm navigation away**: Especially during activities
- **Palm rejection**: Ignore large contact areas

---

## 3. Accessibility Standards

### 3.1 WCAG Considerations for Children

#### WCAG 2.1 AA Compliance (Minimum)

| Criterion | Requirement | Implementation |
|-----------|-------------|----------------|
| 1.1.1 Non-text Content | Alt text for images | Descriptive, child-friendly labels |
| 1.3.1 Info and Relationships | Semantic structure | Proper headings, lists, landmarks |
| 1.4.3 Contrast | 4.5:1 for text | Verified with contrast checkers |
| 1.4.11 Non-text Contrast | 3:1 for UI | Buttons, icons, focus states |
| 2.1.1 Keyboard | Full keyboard access | Tab order, focus management |
| 2.4.6 Headings and Labels | Descriptive headings | Clear, simple language |
| 2.5.5 Target Size | 44x44px minimum | Larger for children (48-64px) |

#### Child-Specific Accessibility Enhancements

- **Simple language**: Reading level appropriate for age
- **Audio support**: Text-to-speech for all instructions
- **Extended timeouts**: No time limits, or very generous ones
- **Clear navigation**: Obvious back button, home button always visible

### 3.2 Color Blindness Accommodations

#### Design for All Color Vision Types

| Type | Prevalence | Accommodation |
|------|------------|---------------|
| Deuteranopia (red-green) | 6% of males | Avoid red/green only coding |
| Protanopia (red-green) | 2% of males | Use blue/yellow as alternatives |
| Tritanopia (blue-yellow) | <1% | Rare, but include patterns |

#### Color-Blind Safe Palette

```
Success: Green (#4CAF50) + Checkmark icon
Error: Orange (#FF9800) + X icon + shape (square)
Info: Blue (#2196F3) + i icon + shape (circle)
Warning: Yellow (#FFC107) + ! icon + shape (triangle)
```

#### Implementation Rules

- **Never use color alone**: Always pair with icons, patterns, or text
- **Test with simulators**: Verify visibility in all color blindness modes
- **High contrast mode**: Provide toggle for enhanced contrast
- **Pattern differentiation**: Use shapes and patterns alongside colors

### 3.3 Motor Skill Accommodations

#### Fine Motor Challenges

- **Touch target size**: 64x64px minimum for users with motor challenges
- **Touch-and-hold alternative**: For drag-and-drop (tap to select, tap to place)
- **Adjustable sensitivity**: Option to increase touch target sizes
- **Switch access**: Compatible with external switch devices

#### Gross Motor Challenges

- **Stable device support**: Design for device on table/stand
- **Minimal movement required**: Core actions near screen center
- **No rapid movements**: Never require quick gestures

#### Settings for Motor Accommodations

```
Accessibility Settings:
[ ] Large touch targets (1.5x size)
[ ] Tap-to-select mode (no drag required)
[ ] Extended touch time (hold to confirm)
[ ] Simplified gestures (tap only)
```

### 3.4 Audio/Visual Alternatives

#### Audio Accessibility

- **Captions**: All audio content captioned
- **Visual cues**: Sound effects paired with visual feedback
- **Adjustable volume**: Independent control for music, effects, voice
- **Screen reader support**: VoiceOver (iOS) and TalkBack (Android) compatible

#### Visual Accessibility

- **Audio descriptions**: Describe visual elements for blind users
- **High contrast mode**: White on black option
- **Text scaling**: Support up to 200% text zoom
- **Reduced motion**: Option to minimize animations

#### Multi-Modal Feedback

Every interaction should have:
1. **Visual feedback**: Color change, animation
2. **Audio feedback**: Sound effect (optional)
3. **Haptic feedback**: Vibration on mobile (optional)

```
Example - Correct Answer:
- Visual: Green checkmark animation, confetti
- Audio: Pleasant chime sound
- Haptic: Short vibration pulse
```

---

## 4. Learning-Focused UX Patterns

### 4.1 Progress Visualization for Children

#### Progress Indicator Types

| Type | Best For | Age Group | Example |
|------|----------|-----------|---------|
| Visual journey/path | Lesson progress | Ages 5-7 | Stepping stones, trail |
| Filling container | Activity completion | Ages 5-9 | Jar filling with stars |
| Character growth | Long-term progress | Ages 5-9 | Plant growing, building |
| Simple bar | Session progress | Ages 7-9 | Segmented progress bar |
| Collectibles | Achievement | Ages 5-9 | Stickers, badges |

#### Progress Visualization Guidelines

- **Concrete metaphors**: Stars, gems, stickers (not abstract percentages)
- **Visual, not numerical**: Young children don't understand "75% complete"
- **Always forward**: Never show regression or loss of progress
- **Celebration checkpoints**: Acknowledge milestones with small celebrations

#### Implementation Example

```
Lesson Progress:
[Star 1] --- [Star 2] --- [Star 3] --- [Trophy]
   (done)     (done)      (current)    (locked)

- Completed stars: Filled, golden
- Current star: Pulsing, highlighted
- Future stars: Outlined, grayed
- Trophy: Visible but locked (motivation)
```

### 4.2 Positive Reinforcement Without Overstimulation

#### Reinforcement Hierarchy

| Level | Trigger | Feedback Type | Duration |
|-------|---------|---------------|----------|
| Micro | Any correct answer | Subtle sound + checkmark | 200ms |
| Small | Activity completion | Character animation + phrase | 1-2s |
| Medium | Lesson completion | Stars earned + celebration | 3-5s |
| Large | Level/unit completion | Unlock + collectible + extended celebration | 5-8s |

#### Positive Reinforcement Guidelines

- **Immediate feedback**: Within 200ms of correct action
- **Specific praise**: "Great counting!" not just "Good job!"
- **Effort-based**: Praise persistence, not just correct answers
- **Varied responses**: 5-10 different phrases per feedback type
- **Skippable celebrations**: Allow users to tap to continue

#### What to Avoid

- **Excessive fanfare**: Save big celebrations for big achievements
- **Punishment for wrong answers**: No negative sounds, no losing points
- **Comparison to others**: Never show leaderboards or rankings
- **Streaks/pressure**: Avoid daily streak mechanics that create anxiety

### 4.3 Reducing Anxiety and Failure States

#### Failure-Free Design Principles

1. **No "wrong" language**: Use "try again" or "not quite"
2. **Unlimited attempts**: Never lock children out
3. **Graceful hints**: Progressively reveal help after attempts
4. **No timers**: Remove time pressure (or make optional)
5. **Safe to experiment**: Encourage guessing without penalty

#### Error Handling Flow

```
Attempt 1 (incorrect):
  - Gentle sound
  - "Try again!" with encouraging character
  - No visual indication of "wrong"

Attempt 2 (incorrect):
  - Same gentle sound
  - "Almost there! Let's think about this..."
  - Subtle hint appears

Attempt 3 (incorrect):
  - "Here's a hint!"
  - More explicit guidance
  - Option to see the answer with explanation

Attempt 4+ (incorrect):
  - "Let me help you!"
  - Walk through the solution
  - Still counts as completed (reduced stars)
```

#### Anxiety Reduction Techniques

- **Predictable navigation**: Consistent placement of buttons
- **Clear exit paths**: Always show how to leave an activity
- **Save progress automatically**: Never lose work
- **Preview before commitment**: Show what an activity involves

### 4.4 Clear, Simple Navigation

#### Navigation Principles for Children

- **Maximum 2 taps to core content**: Home > Category > Activity
- **Persistent home button**: Always visible, same location
- **Back button**: Top-left corner, always available
- **No hidden navigation**: Everything visible on screen

#### Navigation Structure

```
Recommended Hierarchy:
Home
├── Play (lessons/activities)
│   ├── Numbers
│   ├── Addition
│   ├── Subtraction
│   └── [More topics...]
├── Practice (free play)
├── My Progress (achievements)
└── Settings (parent-gated)
```

#### Navigation UI Specifications

| Element | Position | Size | Notes |
|---------|----------|------|-------|
| Back button | Top-left | 48x48px | Arrow icon + "Back" text |
| Home button | Top-left (or bottom nav) | 56x56px | House icon |
| Primary action | Bottom-center | 64px height, full width | Clear label |
| Settings | Top-right | 48x48px | Parent-gated |

#### Navigation Feedback

- **Tap feedback**: Button scales down 95% on press
- **Page transitions**: Slide or fade (250-350ms)
- **Loading states**: Animated character or progress indicator
- **Confirm exits**: "Are you sure?" when leaving mid-activity

---

## 5. Parent Dashboard Patterns

### 5.1 Progress Reporting Best Practices

#### Dashboard Information Hierarchy

1. **At-a-glance summary**: Overall progress, recent activity
2. **Detailed breakdowns**: By subject, skill, time period
3. **Insights and recommendations**: Personalized suggestions
4. **Historical data**: Trends over time

#### Metrics to Display

| Metric | Display Format | Parent Value |
|--------|---------------|--------------|
| Time spent | "30 min this week" | Engagement level |
| Activities completed | "12 of 20 lessons" | Progress |
| Skills mastered | Visual skill tree | Learning outcomes |
| Accuracy trends | Line graph | Understanding |
| Struggling areas | Highlighted topics | Where to help |

#### Progress Report Design

```
Weekly Summary Card:
┌─────────────────────────────────────┐
│ This Week's Progress                │
│                                     │
│ Time: 2h 15min (up from last week)  │
│ Lessons: 8 completed                │
│ New Skills: Counting to 20 ✓        │
│                                     │
│ [View Details] [Share Report]       │
└─────────────────────────────────────┘
```

#### Report Delivery Options

- **In-app dashboard**: Real-time, always accessible
- **Weekly email summary**: Opt-in, customizable day
- **PDF reports**: Downloadable for teachers/schools
- **Push notifications**: Milestone achievements only

### 5.2 Privacy Considerations (COPPA Compliance)

#### COPPA Requirements Summary

The Children's Online Privacy Protection Act (COPPA) applies to children under 13:

| Requirement | Implementation |
|------------|----------------|
| Verifiable parental consent | Required before collecting personal info |
| Privacy policy | Clear, comprehensive, accessible |
| Data minimization | Collect only what's necessary |
| Data security | Encrypt and protect all child data |
| Parental access | Allow parents to view/delete child data |
| No behavioral advertising | Never target ads based on child behavior |

#### Data Collection Guidelines

**Collect (with consent):**
- Child's first name or nickname (for personalization)
- Age/grade level (for appropriate content)
- Learning progress (for functionality)
- Parent email (for account management)

**Never Collect:**
- Full name
- Physical address
- Phone number
- School name
- Photos/videos of children
- Precise geolocation

#### Privacy by Design

```
Account Creation Flow:
1. Parent enters email → verification sent
2. Parent creates password → secure requirements
3. Parent provides consent → checkbox + "I am the parent"
4. Parent creates child profile → first name only, grade level
5. Child uses app → no additional data requested from child
```

#### Data Storage and Security

- **Encryption**: All data encrypted at rest and in transit
- **Retention limits**: Delete inactive accounts after 12 months
- **Data export**: Parents can download all child data
- **Data deletion**: Parents can delete all data at any time
- **Third parties**: No sharing with third parties for marketing

### 5.3 Parental Control Patterns

#### Essential Parental Controls

| Control | Default | Description |
|---------|---------|-------------|
| Screen time limits | Off | Daily/weekly time limits |
| Play schedule | Off | Allowed hours of use |
| Content restrictions | Age-appropriate | Filter by grade level |
| Sound settings | On | Music, effects, voice |
| Celebration intensity | Normal | Reduce for sensitive children |
| Purchase restrictions | On | Prevent in-app purchases |

#### Parental Gate Implementation

Access to parent features requires a gate that children cannot easily bypass:

**Recommended Gate Types:**
1. **Math problem for adults**: "Solve: 24 x 7 = ___"
2. **Hold multiple targets**: Press and hold 2 circles for 3 seconds
3. **Written instruction**: "Please ask a grown-up to help"
4. **PIN code**: 4-digit parent-set code

**Gate UI Example:**
```
┌─────────────────────────────────────┐
│        Grown-Up Area                │
│                                     │
│  Please ask a parent or guardian    │
│  to help you access this section.   │
│                                     │
│  Solve this problem to continue:    │
│                                     │
│       15 + 27 = [____]              │
│                                     │
│          [Submit]                   │
└─────────────────────────────────────┘
```

#### Parent Settings UI

- **Separate app section**: Clearly marked "For Parents"
- **Adult language**: Use proper terms, not simplified child language
- **Quick toggles**: Easy on/off for common settings
- **Detailed options**: Advanced settings for power users
- **Sync across devices**: Settings apply to all devices on account

---

## 6. Technical Specifications Summary

### 6.1 Quick Reference: Sizes and Measurements

#### Touch Targets

| Element | Minimum | Recommended | Maximum Spacing |
|---------|---------|-------------|-----------------|
| Buttons (primary) | 48x48px | 56-64px | 16px |
| Buttons (secondary) | 44x44px | 48x48px | 12px |
| Icons (tappable) | 44x44px | 48x48px | 12px |
| Draggable objects | 56x56px | 64x64px | 20px |
| Drop zones | 1.5x draggable | 2x draggable | n/a |

#### Typography

| Element | Mobile | Tablet | Line Height |
|---------|--------|--------|-------------|
| Headings | 28-32px | 36-44px | 1.2 |
| Instructions | 22-24px | 28-32px | 1.4 |
| Body text | 18-20px | 24-28px | 1.5 |
| Button labels | 20-22px | 26-30px | 1.2 |
| Math numbers | 32-40px | 44-56px | 1.1 |

#### Spacing

| Type | Value |
|------|-------|
| Minimum padding | 16px |
| Element spacing | 12-16px |
| Section spacing | 24-32px |
| Screen margins | 16-24px |
| Whitespace ratio | ~40% of screen |

### 6.2 Quick Reference: Timing and Animation

| Animation Type | Duration | Easing |
|---------------|----------|--------|
| Button press | 100-150ms | ease-out |
| Micro-feedback | 150-200ms | ease-out |
| Page transitions | 250-350ms | ease-in-out |
| Celebrations | 800-1200ms | spring |
| Drag snap | 200-250ms | ease-out |
| Error shake | 300-400ms | ease-in-out |

### 6.3 Quick Reference: Color

| Use Case | Example Hex | Notes |
|----------|-------------|-------|
| Background | `#F8F6F0` | Warm off-white |
| Primary blue | `#6B9BD1` | Calm, trustworthy |
| Success green | `#7BC47F` | Soft, not harsh |
| Try-again orange | `#E8927C` | Warm, not alarming |
| Highlight yellow | `#F9D56E` | Attention, rewards |
| Text (dark) | `#2C3E50` | High contrast |
| Text (light) | `#FFFFFF` | On dark backgrounds |

### 6.4 Accessibility Checklist

```
[ ] All touch targets >= 44x44px (48px+ for children)
[ ] Color contrast ratio >= 4.5:1 for text
[ ] Color contrast ratio >= 3:1 for UI elements
[ ] No information conveyed by color alone
[ ] All images have alt text
[ ] All audio has visual alternatives
[ ] Screen reader compatible (VoiceOver/TalkBack tested)
[ ] Keyboard navigation works (for Switch access)
[ ] No flashing content > 3 times per second
[ ] Text scales to 200% without breaking layout
[ ] Reduced motion option available
[ ] Captions available for all audio content
```

### 6.5 COPPA Compliance Checklist

```
[ ] Verifiable parental consent obtained
[ ] Privacy policy is clear and accessible
[ ] Only necessary data collected
[ ] No persistent identifiers without consent
[ ] No behavioral advertising
[ ] Data encrypted in transit and at rest
[ ] Parents can access child's data
[ ] Parents can delete child's data
[ ] No data shared with third parties for marketing
[ ] Reasonable data retention limits
[ ] Parental gate implemented for settings
```

---

## Appendix A: Research Sources and References

This document synthesizes best practices from:

1. **Nielsen Norman Group** - Children's UX research and guidelines
2. **Apple Human Interface Guidelines** - Designing for Kids
3. **Google Material Design** - Accessibility guidelines
4. **W3C WCAG 2.1** - Web Content Accessibility Guidelines
5. **FTC COPPA Rule** - Children's Online Privacy Protection
6. **PBS Kids Design Guidelines** - Educational children's media
7. **Khan Academy Kids** - Math education app patterns
8. **Academic Research** - Child development and motor skills studies
9. **Common Sense Media** - Children's app evaluation criteria

---

## Appendix B: Testing Recommendations

### Usability Testing with Children

1. **Recruit appropriate ages**: Test with 5-6, 7-8, and 8-9 year olds separately
2. **Short sessions**: Maximum 20-30 minutes
3. **Parental presence**: Parent in room but not helping
4. **Think-aloud protocol**: Encourage verbal feedback
5. **Observe behavior**: Watch for frustration, confusion, delight
6. **No leading questions**: "What do you think this does?" not "Click the blue button"

### Accessibility Testing

1. **Screen reader testing**: VoiceOver (iOS) and TalkBack (Android)
2. **Color blindness simulation**: Test with Sim Daltonism or similar
3. **Motor skill simulation**: Test with one hand, test with gloves
4. **Switch access testing**: Test with external switch device
5. **Low vision testing**: Test at 200% zoom

### Parent Dashboard Testing

1. **Comprehension testing**: Do parents understand the data?
2. **Discoverability**: Can parents find controls easily?
3. **Task completion**: Time to complete common tasks
4. **Trust assessment**: Do parents feel their child's data is safe?

---

## Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial comprehensive document |

---

*This document should be reviewed and updated quarterly to incorporate new research, platform changes, and user feedback.*
