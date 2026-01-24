# NumberSense Sprint Plan

**Project:** NumberSense K-3 Math App
**Version:** 1.0 MVP
**Total Sprints:** 9 (2-week sprints)
**Total Duration:** 18 weeks

---

## Sprint Overview

| Sprint | Weeks | Focus | Parallel Streams |
|--------|-------|-------|------------------|
| 0 | 1-2 | Foundation & Setup | Infrastructure, Design System |
| 1 | 3-4 | Core UI & Auth | UI Components, Backend Auth |
| 2 | 5-6 | Game Engine Core | Engine Architecture, Block System |
| 3 | 7-8 | Build the Number | Game 1 Implementation |
| 4 | 9-10 | Sort the Numbers | Game 2 Implementation |
| 5 | 11-12 | Backend & Sync | API Completion, Offline Support |
| 6 | 13-14 | Parent Dashboard | Analytics, Settings |
| 7 | 15-16 | Polish & Testing | E2E Tests, Accessibility |
| 8 | 17-18 | Launch Preparation | Production Deploy, Monitoring |

---

## Agent Assignments

```
VP Engineering (Orchestrator)
├── Frontend Lead Agent
│   ├── UI Component Agent (Sprint 0-1)
│   ├── Game Engine Agent (Sprint 2)
│   ├── Game 1 Agent: Build the Number (Sprint 3)
│   └── Game 2 Agent: Sort the Numbers (Sprint 4)
├── Backend Lead Agent
│   ├── Auth Agent (Sprint 1)
│   ├── API Agent (Sprint 5)
│   └── Analytics Agent (Sprint 6)
├── Testing Agent (Sprint 7)
├── DevOps Agent (Sprint 0, 8)
├── Code Review Agent (All sprints)
└── Validation Agent (All sprints)
```

---

## Sprint 0: Foundation & Setup (Weeks 1-2)

### Objectives
- [ ] Project scaffolding complete
- [ ] CI/CD pipeline operational
- [ ] Design system foundation
- [ ] Development environment documented

### Stream A: Infrastructure (DevOps Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Initialize Vite + React + TypeScript | P0 | None | `src/frontend/` |
| Configure ESLint + Prettier | P0 | Vite setup | `.eslintrc.js`, `.prettierrc` |
| Setup Tailwind CSS | P0 | Vite setup | `tailwind.config.ts` |
| Configure Vitest | P1 | Vite setup | `vitest.config.ts` |
| Create GitHub Actions CI | P0 | None | `.github/workflows/ci.yml` |
| Setup Husky pre-commit hooks | P1 | CI working | `.husky/` |
| Initialize backend project | P1 | None | `src/backend/` |
| Create shared types package | P0 | None | `src/shared/` |
| Setup monorepo workspace | P1 | All projects | `pnpm-workspace.yaml` |

### Stream B: Design System Foundation (UI Component Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Define color palette (tokens) | P0 | Tailwind | `src/frontend/src/styles/tokens.css` |
| Define typography scale | P0 | Tailwind | Tailwind config |
| Define spacing scale | P0 | Tailwind | Tailwind config |
| Create Button component | P0 | Tokens | `src/frontend/src/components/ui/Button.tsx` |
| Create Card component | P1 | Tokens | `src/frontend/src/components/ui/Card.tsx` |
| Create Icon system | P1 | None | `src/frontend/src/components/ui/Icon.tsx` |
| Document design system | P2 | Components | `docs/design-system.md` |

### Deliverables
- Working development environment
- CI pipeline passing lint/type/test
- 5+ base UI components
- Design tokens documented

---

## Sprint 1: Core UI & Authentication (Weeks 3-4)

### Objectives
- [ ] App shell and navigation
- [ ] Parent authentication working
- [ ] Child profile selection
- [ ] Backend auth API complete

### Stream A: Frontend UI (UI Component Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Create App shell layout | P0 | Design system | `src/frontend/src/app/App.tsx` |
| Create Header component | P0 | Layout | `components/layout/Header.tsx` |
| Create Navigation component | P0 | Layout | `components/layout/Navigation.tsx` |
| Create Modal component | P1 | Design system | `components/ui/Modal.tsx` |
| Create Form components | P0 | Design system | `components/ui/Input.tsx`, etc. |
| Create Loading states | P1 | Design system | `components/ui/Spinner.tsx` |
| Setup React Router | P0 | App shell | `src/frontend/src/app/Router.tsx` |

### Stream B: Authentication (Auth Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Define auth types | P0 | Shared types | `src/shared/types/auth.ts` |
| Create JWT utilities | P0 | None | `src/backend/src/utils/jwt.ts` |
| Create auth middleware | P0 | JWT | `src/backend/src/middleware/auth.ts` |
| Create register endpoint | P0 | Middleware | `src/backend/src/routes/auth.ts` |
| Create login endpoint | P0 | Middleware | `src/backend/src/routes/auth.ts` |
| Create child profile endpoints | P0 | Auth | `src/backend/src/routes/children.ts` |
| Create LoginForm component | P0 | Form components | `features/auth/LoginForm.tsx` |
| Create RegisterForm component | P0 | Form components | `features/auth/RegisterForm.tsx` |
| Create ChildSelector component | P0 | Auth state | `features/auth/ChildSelector.tsx` |
| Create useAuth hook | P0 | API client | `features/auth/useAuth.ts` |
| Create auth store | P0 | Zustand | `src/frontend/src/stores/authStore.ts` |

### Stream C: Database (Backend Lead Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Define database schema | P0 | Drizzle | `src/backend/src/db/schema.ts` |
| Create migrations | P0 | Schema | `src/backend/src/db/migrations/` |
| Setup database connection | P0 | Migrations | `src/backend/src/db/index.ts` |

### Deliverables
- Parent can register and login
- Parent can create child profiles
- Child can be selected for play session
- Database schema operational

---

## Sprint 2: Game Engine Core (Weeks 5-6)

### Objectives
- [ ] Game engine architecture complete
- [ ] Block system working
- [ ] Drag-and-drop functional
- [ ] Difficulty framework implemented

### Stream A: Engine Architecture (Game Engine Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Define game types | P0 | Shared types | `src/shared/types/game.ts` |
| Create game registry | P0 | Types | `game-engine/registry.ts` |
| Create GameShell component | P0 | Registry | `game-engine/GameShell.tsx` |
| Create useGameState hook | P0 | Zustand | `game-engine/hooks/useGameState.ts` |
| Create useGameTimer hook | P1 | State | `game-engine/hooks/useGameTimer.ts` |
| Create difficulty config | P0 | Types | `game-engine/difficulty.ts` |
| Create scoring system | P0 | Types | `game-engine/scoring.ts` |

### Stream B: Block System (Game Engine Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Create Block types | P0 | Game types | `game-engine/types.ts` |
| Create UnitBlock component | P0 | Types | `game-engine/components/UnitBlock.tsx` |
| Create TenRod component | P0 | Types | `game-engine/components/TenRod.tsx` |
| Create HundredFlat component | P1 | Types | `game-engine/components/HundredFlat.tsx` |
| Create BlockTray component | P0 | Blocks | `game-engine/components/BlockTray.tsx` |
| Create Workspace component | P0 | Blocks | `game-engine/components/Workspace.tsx` |
| Setup @dnd-kit | P0 | Components | `game-engine/dnd/` |
| Create DraggableBlock | P0 | dnd-kit | `game-engine/components/DraggableBlock.tsx` |
| Create DropZone | P0 | dnd-kit | `game-engine/components/DropZone.tsx` |

### Stream C: Feedback System (UI Component Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Create SuccessAnimation | P1 | Framer Motion | `components/feedback/SuccessAnimation.tsx` |
| Create TryAgainFeedback | P1 | Framer Motion | `components/feedback/TryAgainFeedback.tsx` |
| Create HintDisplay | P1 | Design system | `game-engine/components/HintSystem.tsx` |
| Create ScoreDisplay | P1 | Design system | `game-engine/components/ScoreDisplay.tsx` |
| Setup audio system | P2 | Howler.js | `src/frontend/src/lib/audio.ts` |

### Deliverables
- Game engine can load and render games
- Blocks can be dragged and dropped
- Difficulty levels configurable
- Scoring system functional

---

## Sprint 3: Build the Number (Weeks 7-8)

### Objectives
- [ ] Build the Number fully playable
- [ ] All 4 difficulty modes working
- [ ] Validation logic complete
- [ ] Progress tracking integrated

### Stream A: Game Implementation (Game 1 Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Register Build the Number game | P0 | Registry | `games/build-the-number/index.ts` |
| Create BuildBoard component | P0 | Workspace | `games/build-the-number/BuildBoard.tsx` |
| Create TargetDisplay component | P0 | Design | `games/build-the-number/TargetDisplay.tsx` |
| Create RunningTotal component | P0 | State | `games/build-the-number/RunningTotal.tsx` |
| Create validation logic | P0 | Types | `games/build-the-number/validation.ts` |
| Create problem generator | P0 | Types | `games/build-the-number/generator.ts` |
| Implement Easy mode | P0 | Generator | Generator config |
| Implement Medium mode | P0 | Generator | Generator config |
| Implement Hard mode | P1 | Generator | Generator config |
| Implement Challenge mode | P2 | Validation | Generator + validation |
| Create level complete screen | P1 | Feedback | `games/build-the-number/LevelComplete.tsx` |
| Write unit tests | P0 | All | `tests/unit/build-the-number/` |
| Write integration tests | P1 | All | `tests/integration/build-the-number/` |

### Stream B: Progress System (Backend Lead Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Create progress types | P0 | Shared types | `src/shared/types/progress.ts` |
| Create progress endpoints | P0 | Types | `src/backend/src/routes/progress.ts` |
| Create progress service | P0 | Endpoints | `src/backend/src/services/progressService.ts` |
| Create useProgress hook | P0 | API | `src/frontend/src/hooks/useProgress.ts` |
| Integrate with game engine | P0 | Hook | Game engine updates |

### Deliverables
- Build the Number playable in all modes
- Progress saved to backend
- 80%+ test coverage on validation
- Difficulty progression working

---

## Sprint 4: Sort the Numbers (Weeks 9-10)

### Objectives
- [ ] Sort the Numbers fully playable
- [ ] Both phases working
- [ ] All 6 difficulty levels
- [ ] Visual-to-numeric transition smooth

### Stream A: Game Implementation (Game 2 Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Register Sort the Numbers game | P0 | Registry | `games/sort-the-numbers/index.ts` |
| Create SortBoard component | P0 | Engine | `games/sort-the-numbers/SortBoard.tsx` |
| Create SortableCard component | P0 | dnd-kit | `games/sort-the-numbers/SortableCard.tsx` |
| Create NumberLine component | P1 | Design | `games/sort-the-numbers/NumberLine.tsx` |
| Create problem generator | P0 | Types | `games/sort-the-numbers/generator.ts` |
| Create validation logic | P0 | Types | `games/sort-the-numbers/validation.ts` |
| Implement Phase 1 (visual) | P0 | Components | Phase config |
| Implement Phase 2 (numeric) | P0 | Components | Phase config |
| Implement all 6 levels | P1 | Generator | Level configs |
| Create transition animation | P1 | Framer Motion | Phase transition |
| Write unit tests | P0 | All | `tests/unit/sort-the-numbers/` |
| Write integration tests | P1 | All | `tests/integration/sort-the-numbers/` |

### Deliverables
- Sort the Numbers playable in all modes
- Smooth phase transitions
- Progress integrated
- 80%+ test coverage

---

## Sprint 5: Backend & Offline Support (Weeks 11-12)

### Objectives
- [ ] All API endpoints complete
- [ ] Offline mode functional
- [ ] Background sync working
- [ ] PWA installable

### Stream A: API Completion (API Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Create game state endpoints | P0 | Progress | `src/backend/src/routes/games.ts` |
| Create analytics endpoints | P1 | Analytics types | `src/backend/src/routes/analytics.ts` |
| Create settings endpoints | P1 | User types | `src/backend/src/routes/settings.ts` |
| Implement rate limiting | P1 | Middleware | `src/backend/src/middleware/rateLimit.ts` |
| Implement error handling | P0 | Middleware | `src/backend/src/middleware/errorHandler.ts` |
| Create API documentation | P2 | OpenAPI | `docs/api.md` |

### Stream B: Offline Support (DevOps Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Setup IndexedDB wrapper | P0 | idb library | `src/frontend/src/lib/offlineStorage.ts` |
| Create offline queue | P0 | IndexedDB | `src/frontend/src/lib/offlineQueue.ts` |
| Create service worker | P0 | Workbox | `src/frontend/public/sw.js` |
| Setup background sync | P1 | SW | Service worker |
| Create PWA manifest | P0 | None | `src/frontend/public/manifest.json` |
| Generate app icons | P1 | Design | `src/frontend/public/icons/` |
| Create useOnlineStatus hook | P0 | None | `hooks/useOnlineStatus.ts` |
| Create useOfflineSync hook | P0 | Queue | `hooks/useOfflineSync.ts` |
| Test offline scenarios | P0 | All | `tests/integration/offline/` |

### Deliverables
- Full API operational
- App works offline
- Background sync on reconnection
- PWA passes Lighthouse audit

---

## Sprint 6: Parent Dashboard (Weeks 13-14)

### Objectives
- [ ] Dashboard fully functional
- [ ] Progress visualization complete
- [ ] Settings working
- [ ] Weekly reports designed

### Stream A: Dashboard UI (UI Component Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Create Dashboard layout | P0 | Layout | `features/parent-dashboard/Dashboard.tsx` |
| Create ProgressChart component | P0 | Chart library | `features/parent-dashboard/ProgressChart.tsx` |
| Create SkillBreakdown component | P0 | Data | `features/parent-dashboard/SkillBreakdown.tsx` |
| Create ActivityChart component | P1 | Chart library | `features/parent-dashboard/ActivityChart.tsx` |
| Create InsightsPanel component | P1 | Analytics | `features/parent-dashboard/InsightsPanel.tsx` |
| Create ChildManagement screen | P0 | Auth | `features/parent-dashboard/ChildManagement.tsx` |
| Create Settings screen | P1 | Settings | `features/parent-dashboard/Settings.tsx` |
| Create parental gate | P0 | Design | `features/parent-dashboard/ParentalGate.tsx` |

### Stream B: Analytics Backend (Analytics Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Create analytics service | P0 | DB | `src/backend/src/services/analyticsService.ts` |
| Create progress aggregation | P0 | Service | Analytics service |
| Create insights generator | P1 | Aggregation | Analytics service |
| Create weekly report job | P2 | Email service | `src/backend/src/jobs/weeklyReport.ts` |

### Deliverables
- Parents can view child progress
- Visual charts working
- Settings functional
- Insights displaying

---

## Sprint 7: Polish & Testing (Weeks 15-16)

### Objectives
- [ ] E2E tests comprehensive
- [ ] Accessibility audit passed
- [ ] Performance optimized
- [ ] All bugs fixed

### Stream A: Testing (Testing Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Setup Playwright | P0 | None | `tests/e2e/playwright.config.ts` |
| Write auth E2E tests | P0 | Playwright | `tests/e2e/auth.spec.ts` |
| Write game flow E2E tests | P0 | Playwright | `tests/e2e/games/` |
| Write dashboard E2E tests | P0 | Playwright | `tests/e2e/dashboard.spec.ts` |
| Write offline E2E tests | P1 | Playwright | `tests/e2e/offline.spec.ts` |
| Setup visual regression | P1 | Playwright | `tests/visual/` |
| Run accessibility audit | P0 | axe-core | `tests/accessibility/` |
| Document test coverage | P1 | All | `docs/testing.md` |

### Stream B: Performance (DevOps Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Run Lighthouse audit | P0 | Build | Audit results |
| Optimize bundle size | P1 | Audit | Build config |
| Optimize images | P1 | Audit | Asset pipeline |
| Setup Web Vitals monitoring | P1 | Analytics | `src/frontend/src/lib/webVitals.ts` |
| Performance benchmarks | P1 | Tests | `tests/performance/` |

### Stream C: Bug Fixes (All Agents)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Fix critical bugs | P0 | Testing | Various |
| Fix accessibility issues | P0 | Audit | Various |
| Fix performance issues | P1 | Audit | Various |

### Deliverables
- 90%+ E2E coverage on critical paths
- WCAG 2.1 AA compliance verified
- Lighthouse scores 90+ on all categories
- All critical bugs resolved

---

## Sprint 8: Launch Preparation (Weeks 17-18)

### Objectives
- [ ] Production infrastructure ready
- [ ] Monitoring operational
- [ ] Documentation complete
- [ ] Soft launch executed

### Stream A: Infrastructure (DevOps Agent)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Setup production environment | P0 | Vercel | Vercel dashboard |
| Configure production database | P0 | Neon/Vercel Postgres | DB config |
| Setup staging environment | P0 | Vercel | Vercel dashboard |
| Configure environment variables | P0 | All | `.env.production` |
| Setup Sentry error tracking | P0 | Build | Sentry config |
| Setup uptime monitoring | P1 | Production | Monitoring tool |
| Create deployment runbook | P1 | All | `docs/deployment.md` |

### Stream B: Documentation (All Agents)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Finalize README | P0 | All | `README.md` |
| Document API | P1 | API | `docs/api.md` |
| Document architecture | P1 | Architecture | Already done |
| Create contribution guide | P2 | All | `CONTRIBUTING.md` |

### Stream C: Launch (VP)

| Task | Priority | Dependencies | Files |
|------|----------|--------------|-------|
| Final code review | P0 | All | All |
| Security audit | P0 | All | Security report |
| Beta testing coordination | P1 | Production | Test plan |
| Soft launch execution | P0 | All | Launch checklist |

### Deliverables
- Production environment operational
- Monitoring and alerting active
- Documentation complete
- MVP v1 launched

---

## Quality Gates Per Sprint

### Every Sprint Must Pass:
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code review approved
- [ ] No known critical bugs
- [ ] Accessibility verified for new components

### Before Production (Sprint 8):
- [ ] E2E tests pass
- [ ] Lighthouse scores 90+
- [ ] WCAG 2.1 AA compliance
- [ ] Security audit passed
- [ ] Load testing completed
- [ ] Error tracking operational

---

## Risk Mitigation

| Risk | Sprint | Mitigation |
|------|--------|------------|
| Animation performance | 2-4 | Early tablet testing, fallback modes |
| Offline sync complexity | 5 | Start simple, idempotent operations |
| Scope creep | All | VP approval for scope changes |
| Integration issues | 3-5 | Continuous integration, daily builds |
| Accessibility gaps | 7 | Audit early, fix progressively |

---

## Communication Protocol

- **Daily:** Agents report blockers to VP
- **Per Sprint:** Sprint review with all deliverables
- **Continuous:** Code review on all PRs
- **As Needed:** Architecture decisions via ADR

---

*Sprint Plan Version: 1.0*
*Created: January 24, 2026*
*Author: VP Engineering*
