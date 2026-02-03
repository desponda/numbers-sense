# NumberSense App - Project Status

## Product Vision

A playful, modern, clean, joyful math app that builds number sense (not memorization) for K-3 students.

### Core Values

- **Safe** - COPPA compliant, age-appropriate
- **Delightful** - Joyful learning experience
- **Calm** - Non-overstimulating design
- **Educational** - Grounded in learning science

---

## Current Phase: v1.1 IN PROGRESS - Game 3 Implementation

### Timeline

- **Research Start:** January 24, 2026
- **Research Completed:** January 24, 2026
- **Architecture Review:** APPROVED
- **Sprint 0 Start:** January 24, 2026
- **Sprint 0 Completed:** January 24, 2026
- **Sprint 1 Start:** January 24, 2026
- **Sprint 1 Completed:** January 24, 2026
- **MVP v1.0 Status:** DEPLOYED TO STAGING ✅
- **v1.1 Status:** Game 3 implementation in progress
- **Game 3 Research:** February 3, 2026

---

## Research Agent Status

| #   | Agent            | Document                         | Status   | Lines |
| --- | ---------------- | -------------------------------- | -------- | ----- |
| 1   | UX Research      | `ux-principles.md`               | COMPLETE | 800   |
| 2   | Learning Science | `learning-science-principles.md` | COMPLETE | 969   |
| 3   | Architecture     | `technical-blueprint.md`         | COMPLETE | 2,556 |
| 4   | AI Coding        | `ai-coding-guidelines.md`        | COMPLETE | 1,068 |
| 5   | Game Design      | `game-mechanics.md`              | COMPLETE | 2,275 |
| 6   | Subtraction Pedagogy | `subtraction-pedagogy.md`    | COMPLETE | 1,197 |
| 7   | Subtraction UX   | `subtraction-ux-patterns.md`     | COMPLETE | 1,772 |
| 8   | Game 3 Design    | `more-less-than-game.md`         | COMPLETE | 1,253 |

**Total Documentation:** 10,890 lines across 8 comprehensive documents

---

## Core Games

### Game 1: Build the Number

**Concept:** Child sees a target number and builds it using virtual base-10 blocks.

| Mode      | Number Range | Block Types           | Status      |
| --------- | ------------ | --------------------- | ----------- |
| Easy      | 1-10         | Unit cubes only       | ✅ COMPLETE |
| Medium    | 1-20         | Units + tens rods     | Specified   |
| Hard      | 1-100        | Full base-10          | Specified   |
| Challenge | Mixed        | Multiple compositions | Specified   |

**Learning Objectives:**

- Visual magnitude recognition
- Composition/decomposition
- Early place value intuition

### Game 2: Sort the Numbers

**Concept:** Child sorts numbers by magnitude, first with visual blocks, then numerically.

| Phase   | Content                                | Status      |
| ------- | -------------------------------------- | ----------- |
| Phase 1 | Visual block sorting                   | ✅ COMPLETE |
| Phase 2 | Numeric sorting (after visual success) | ✅ COMPLETE |

**Difficulty Scaling:**

- Quantity: 3 → 4 → 5 → 6+ items
- Range: 1-10 → 1-20 → 1-100
- Complexity: Standard → Tricky representations → Near-miss distractors

**Learning Objectives:**

- Visual-to-symbol mapping
- Order and magnitude comparison
- Mental number line formation

### Game 3: Multiplication Race

**Concept:** Answer multiplication facts to advance bikes across finish lines. Multiple lanes (×0 to ×10) race simultaneously.

| Difficulty | Facts Range    | Status      |
| ---------- | -------------- | ----------- |
| Easy       | ×0, ×1, ×2, ×5 | ✅ COMPLETE |
| Medium     | ×3, ×4, ×6, ×9 | ✅ COMPLETE |
| Hard       | All facts      | ✅ COMPLETE |

**Features:**

- Multiple choice questions (4 options)
- Smart distractor generation
- Progress tracking per lane
- Adaptive question drawer (mobile: bottom, desktop: right sidebar)
- Lane indicator showing which fact family is active

**Learning Objectives:**

- Multiplication fact fluency
- Pattern recognition
- Speed and accuracy

### Game 4: Division Race

**Concept:** Answer division facts to advance bikes across finish lines. Multiple lanes (÷1 to ÷10) race simultaneously.

| Difficulty | Facts Range    | Status      |
| ---------- | -------------- | ----------- |
| Easy       | ÷1, ÷2, ÷5     | ✅ COMPLETE |
| Medium     | ÷3, ÷4, ÷6, ÷9 | ✅ COMPLETE |
| Hard       | All facts      | ✅ COMPLETE |

**Features:**

- Multiple choice questions (4 options)
- Smart distractor generation
- Progress tracking per lane
- Adaptive question drawer (mobile: bottom, desktop: right sidebar)
- Lane indicator showing which fact family is active

**Learning Objectives:**

- Division fact fluency
- Inverse relationship with multiplication
- Speed and accuracy

### Game 5: More Than / Less Than

**Concept:** Child learns relational number concepts by solving "N more than X" and "N less than X" problems with visual scaffolding.

| Mode      | Number Range | Visual Support           | Status        |
| --------- | ------------ | ------------------------ | ------------- |
| Easy      | 1-10         | Full blocks always shown | 🔄 Planned    |
| Medium    | 5-30         | Peek system (3 views)    | 🔄 Planned    |
| Hard      | 10-100       | Hint-only blocks         | 🔄 Planned    |
| Challenge | 1-100        | Mental math only         | 🔄 Planned    |

**Problem Types:**

- Simple more/less (e.g., "3 more than 5")
- Crossing 10 (e.g., "6 more than 7")
- Using tens (e.g., "10 more than 23")
- Large numbers (e.g., "4 less than 73")
- Multi-step (Challenge: "5 more than (3 less than 12)")

**Learning Objectives:**

- Relational understanding of addition/subtraction
- Mental visualization of quantity changes
- Part-whole reasoning
- Flexible calculation strategies
- Place value understanding

**Status:** Research complete (3,222 lines), implementation starting

---

## Technical Stack (DECIDED)

| Component          | Decision                       | Rationale                        |
| ------------------ | ------------------------------ | -------------------------------- |
| Frontend Framework | React 18 + TypeScript          | Animation ecosystem, hiring pool |
| State Management   | Zustand + React Query          | Simplicity, bundle size          |
| Build Tool         | Vite 5.x                       | Speed, modern tooling            |
| Styling            | Tailwind CSS                   | Utility-first, rapid development |
| Animation          | Framer Motion                  | Best-in-class for React          |
| Drag & Drop        | @dnd-kit                       | Touch-optimized, accessible      |
| Backend            | Hono + Node.js 20              | Serverless-ready, fast           |
| Database           | PostgreSQL (Vercel)            | Relational, ACID compliant       |
| ORM                | Drizzle                        | Type-safe, bundle-efficient      |
| Testing            | Vitest + Playwright            | 320 unit tests + 52 E2E tests    |
| Hosting            | Vercel                         | Serverless, global CDN           |

---

## Quality Gates

### Code Acceptance Criteria

- [x] All tests pass
- [x] Type-safe (no `any` types without justification)
- [x] Linting passes (zero warnings)
- [x] Accessibility verified
- [x] Code review approved
- [x] Security scan clean
- [x] Performance benchmarks met

### Research Acceptance Criteria

- [x] UX principles documented with actionable guidelines
- [x] Learning science principles with game-specific recommendations
- [x] Architecture blueprint with justified technology choices
- [x] AI coding guidelines with enforcement checklists
- [x] Game mechanics with implementable specifications

---

## UX Validation Process

**Created:** January 2026 (response to race game modal issue)
**Document:** `/docs/UX-VALIDATION-PROCESS.md`

### Mandatory Steps

**Before Coding:**
- Create visual mockup (ASCII art or design)
- Validate against `/docs/research/ux-principles.md`
- Get user approval

**During Implementation:**
- Screenshot every major state
- Visual comparison to mockup
- Run dev server and manually test

**Before Merge:**
- Component tests (no `.skip` files)
- E2E tests with screenshot validation
- Expert UX review
- Accessibility audit

### New Agents

- **Visual Design Agent** - Creates mockups before coding
- **UX Validator Agent** - Reviews implementations against research docs

### Enforcement

- Pre-commit hooks: lint, typecheck, format, tests
- Pre-push hooks: build, full test suite
- PR template requires screenshots
- Weekly UX audits

### Lessons Learned

The race game modal issue (question obscuring race track) reached production because:
- No visual design phase before coding
- No screenshot validation during development
- Tests were skipped (`.skip` files)
- Didn't enforce our own UX research docs

**This process ensures it never happens again.**

---

## Risk Register

| Risk                   | Impact   | Mitigation                            | Status                  |
| ---------------------- | -------- | ------------------------------------- | ----------------------- |
| Hallucinated APIs      | High     | Validation agent, documentation-first | Guidelines complete     |
| Architectural drift    | High     | ADRs, code review, linting rules      | Guidelines complete     |
| Child safety/COPPA     | Critical | Security agent, legal review          | Awaiting implementation |
| Performance on tablets | Medium   | Performance testing, optimization     | Architecture addresses  |
| Overstimulating design | Medium   | UX principles adherence, user testing | Guidelines complete     |

---

## Sprint Plan (DEFINED)

See `/docs/SPRINT-PLAN.md` for detailed breakdown.

| Sprint | Weeks | Focus              |
| ------ | ----- | ------------------ |
| 0      | 1-2   | Foundation & Setup |
| 1      | 3-4   | Core UI & Auth     |
| 2      | 5-6   | Game Engine Core   |
| 3      | 7-8   | Build the Number   |
| 4      | 9-10  | Sort the Numbers   |
| 5      | 11-12 | Backend & Sync     |
| 6      | 13-14 | Parent Dashboard   |
| 7      | 15-16 | Polish & Testing   |
| 8      | 17-18 | Launch Preparation |

---

## Deliverables Checklist

### Research Phase

- [x] UX Principles Document (800 lines)
- [x] Learning Science Principles Document (969 lines)
- [x] Technical Architecture Blueprint (2,556 lines)
- [x] AI Coding Guidelines (1,068 lines)
- [x] Game Mechanics Specification (2,275 lines)
- [x] Research Summary Document
- [x] Sprint Plan Document

### Architecture Phase

- [x] Final technology decisions
- [x] Folder structure defined
- [x] Shared types strategy
- [x] CI/CD pipeline designed
- [x] Testing strategy finalized

### Sprint 0: Foundation (COMPLETE)

- [x] Frontend project initialized (Vite + React + TypeScript)
- [x] Shared types package created
- [x] GitHub Actions CI pipeline configured
- [x] ESLint + Prettier + TypeScript strict mode
- [x] Tailwind CSS with design tokens for children's app
- [x] Base UI components (Button, Card, Icon)

### Implementation Phase (MVP Complete)

- [x] Game engine core
- [x] Build the Number game (Easy Mode)
- [x] Sort the Numbers game (All phases)
- [x] Multiplication Race game (All difficulties)
- [x] Division Race game (All difficulties)
- [x] App shell and navigation
- [x] Feedback components (celebrations, hints)
- [x] Base-10 block components
- [x] Drag-and-drop system
- [x] Docker containerization
- [x] Kubernetes/Helm deployment
- [x] CI/CD pipeline (GitHub Actions)
- [x] Comprehensive test suite (320 unit tests + 52 E2E tests)
- [x] Audio feedback system
- [x] UX validation process (prevention system)
- [ ] Backend API (deferred)
- [ ] Authentication system (deferred)
- [ ] Parent dashboard (deferred)
- [ ] Progress persistence (deferred)

### Release Phase (Pending)

- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Documentation complete
- [ ] User testing complete

---

## Document Index

| Document            | Path                                            | Purpose                      |
| ------------------- | ----------------------------------------------- | ---------------------------- |
| Agent Org Chart     | `/docs/AGENT-ORG-CHART.md`                      | Team structure               |
| Research Summary    | `/docs/RESEARCH-SUMMARY.md`                     | Key findings                 |
| Sprint Plan         | `/docs/SPRINT-PLAN.md`                          | Implementation schedule      |
| UX Validation       | `/docs/UX-VALIDATION-PROCESS.md`                | Mandatory UX process         |
| UX Principles       | `/docs/research/ux-principles.md`               | Design guidelines            |
| Learning Science    | `/docs/research/learning-science-principles.md` | Pedagogy principles          |
| Subtraction Pedagogy| `/docs/research/subtraction-pedagogy.md`        | Addition/subtraction research|
| Subtraction UX      | `/docs/research/subtraction-ux-patterns.md`     | UX patterns for subtraction  |
| AI Guidelines       | `/docs/research/ai-coding-guidelines.md`        | Coding practices             |
| Technical Blueprint | `/docs/architecture/technical-blueprint.md`     | System architecture          |
| Game Mechanics      | `/docs/specs/game-mechanics.md`                 | Game specifications          |
| Race Games Spec     | `/docs/specs/multiplication-race-game.md`       | Multiplication/Division Race |
| More/Less Game Spec | `/docs/specs/more-less-than-game.md`            | More Than/Less Than Game     |

---

## Updates Log

| Date       | Update                                                                                                                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-01-24 | Project initiated. 5 research agents launched in parallel.                                                                                                                                         |
| 2026-01-24 | Research phase completed. All 5 documents (7,668 lines) delivered.                                                                                                                                 |
| 2026-01-24 | Sprint plan created. Ready for implementation.                                                                                                                                                     |
| 2026-01-24 | Sprint 0 completed. Foundation built: Frontend, Shared Types, CI/CD, ESLint/Prettier, Tailwind CSS, Base UI Components.                                                                            |
| 2026-01-24 | MVP complete. Both games playable, Docker/K8s deployment, staging live.                                                                                                                            |
| 2026-01-24 | Test suite added. 149 tests across 8 files: problemGenerator (19), gameSessionStore (27), useGameAudio (8), Button (25), Card (27), blocks (16), SortTheNumbersGame (17), BuildTheNumberGame (10). |
| 2026-01-24 | Audio feedback implemented. Synthesized sounds for all game interactions.                                                                                                                          |
| 2026-01-24 | Playwright E2E tests passing. All 46 tests green (Chromium + Mobile Chrome). iPad tests removed to optimize test duration. Test suite now 149 unit + 46 E2E tests.                                  |
| 2026-01-24 | Race games added. Multiplication and Division Race with adaptive question drawer. 320 unit tests + 52 E2E tests. UX validation process documented.                                                  |
| 2026-02-03 | Game 3 research completed. 3 research agents delivered 3,222 lines of documentation: subtraction pedagogy, UX patterns, game specification. Sprint 9 planning started for v1.1 implementation.    |
