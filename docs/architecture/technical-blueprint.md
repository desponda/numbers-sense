# NumberSense Technical Architecture Blueprint

**Version:** 1.0.0
**Last Updated:** January 2026
**Status:** Draft for Review

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Authentication System](#5-authentication-system)
6. [Data Storage](#6-data-storage)
7. [State Management](#7-state-management)
8. [Testing Strategy](#8-testing-strategy)
9. [CI/CD Pipeline](#9-cicd-pipeline)
10. [Modular Game Engine](#10-modular-game-engine)
11. [Performance Considerations](#11-performance-considerations)
12. [Telemetry & Analytics](#12-telemetry--analytics)
13. [Folder Structure](#13-folder-structure)
14. [Technology Summary](#14-technology-summary)
15. [Risk Assessment](#15-risk-assessment)
16. [Implementation Roadmap](#16-implementation-roadmap)

---

## 1. Executive Summary

NumberSense is a K-3 math education application designed to help young learners (ages 5-9) develop foundational math skills through interactive, game-based learning. This document outlines the technical architecture required to build a production-grade, maintainable, and extensible platform.

### Key Technical Decisions

| Area | Decision | Primary Rationale |
|------|----------|-------------------|
| Frontend | React 18+ with TypeScript | Ecosystem maturity, animation libraries, tablet support |
| State Management | Zustand + React Query | Lightweight, offline-first capable |
| Backend | Serverless (AWS Lambda/Vercel) | Cost efficiency, scalability |
| API | REST with OpenAPI | Simplicity, cacheability, offline support |
| Database | PostgreSQL + Redis | Relational data + caching |
| Auth | Custom JWT + Refresh Tokens | COPPA compliance, child profiles |
| Testing | Vitest + Playwright | Fast unit tests, reliable E2E |
| CI/CD | GitHub Actions | Native integration, cost effective |

### Design Principles

1. **Child Safety First** - COPPA compliance in every design decision
2. **Offline-First** - Learning continues without connectivity
3. **Performance-Optimized** - 60fps animations on mid-range tablets
4. **Modular & Extensible** - Easy to add new games and features
5. **Privacy-Preserving** - Minimal data collection, local processing

---

## 2. System Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    React PWA (TypeScript)                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   Game      │  │   Parent    │  │   Offline   │  │   Service   │  │   │
│  │  │   Engine    │  │  Dashboard  │  │   Storage   │  │   Worker    │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ HTTPS (REST API)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   Rate Limiting │  │   Auth Verify   │  │   Request Log   │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVERLESS FUNCTIONS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│  │   Auth    │  │  Progress │  │   Game    │  │  Parent   │  │  Sync     │  │
│  │  Service  │  │  Service  │  │  Service  │  │  Service  │  │  Service  │  │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   PostgreSQL    │  │     Redis       │  │   S3/CloudFlare │              │
│  │   (Primary DB)  │  │    (Cache)      │  │   (Assets CDN)  │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Child  │────▶│  Game   │────▶│  State  │────▶│ Offline │
│  Input  │     │ Engine  │     │  Store  │     │  Queue  │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                                     │               │
                                     ▼               │
                               ┌─────────┐          │
                               │ IndexDB │◀─────────┘
                               │ (Local) │
                               └─────────┘
                                     │
                     ┌───────────────┼───────────────┐
                     │ When Online   │               │
                     ▼               ▼               ▼
               ┌─────────┐    ┌─────────┐    ┌─────────┐
               │  Sync   │    │   API   │    │ Parent  │
               │ Service │    │ Server  │    │Dashboard│
               └─────────┘    └─────────┘    └─────────┘
```

---

## 3. Frontend Architecture

### 3.1 Framework Selection: React 18+

**Decision: React with TypeScript**

#### Evaluation Matrix

| Criteria | React | Vue 3 | Svelte | Weight |
|----------|-------|-------|--------|--------|
| TypeScript Support | 5 | 4 | 4 | High |
| Animation Ecosystem | 5 | 4 | 3 | High |
| Tablet Performance | 4 | 4 | 5 | High |
| Developer Ecosystem | 5 | 4 | 3 | Medium |
| Component Libraries | 5 | 4 | 3 | Medium |
| Drag-and-Drop Libraries | 5 | 4 | 3 | High |
| Offline/PWA Support | 5 | 5 | 4 | High |
| Team Hiring Pool | 5 | 4 | 3 | Medium |
| **Weighted Score** | **4.7** | **4.1** | **3.5** | |

#### Justification

1. **Animation Ecosystem**: React has mature libraries for educational games:
   - **Framer Motion**: Hardware-accelerated animations, gesture support
   - **React Spring**: Physics-based animations ideal for playful interactions
   - **Lottie React**: Complex vector animations for rewards/celebrations

2. **Drag-and-Drop**: Critical for block manipulation games:
   - **@dnd-kit**: Modern, accessible, touch-optimized DnD library
   - Built-in keyboard navigation for accessibility
   - Sensor system supports touch, mouse, and keyboard

3. **TypeScript Integration**: First-class support with:
   - Strong typing for game state machines
   - Type-safe API contracts with shared types
   - Better IDE support for large codebase

4. **PWA Support**: Workbox integration is well-documented:
   - Service worker strategies for offline
   - IndexedDB wrappers (idb library)
   - Cache management patterns

5. **React 18+ Features**:
   - Concurrent rendering for smooth animations
   - Automatic batching reduces re-renders
   - Suspense for loading states
   - useTransition for non-blocking updates

### 3.2 Build Tool: Vite

**Why Vite over Create React App or Next.js:**

- **Hot Module Replacement**: Instant updates during development
- **ES Modules**: Native browser modules, faster cold starts
- **Build Performance**: Rollup-based production builds
- **PWA Plugin**: vite-plugin-pwa for service worker generation
- **No SSR Overhead**: Pure SPA is sufficient for this use case

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.numbersense\.app\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 86400 }
            }
          }
        ]
      }
    })
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'game-engine': ['./src/game-engine/index.ts'],
          'animations': ['framer-motion', 'lottie-react'],
          'dnd': ['@dnd-kit/core', '@dnd-kit/sortable']
        }
      }
    }
  }
});
```

### 3.3 UI Component Strategy

**Approach: Headless UI + Custom Design System**

For a children's app, we need full control over visual design. Using headless components provides accessibility without visual constraints.

```
┌────────────────────────────────────────────────────────┐
│                  Component Layers                       │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Application Components                   │   │
│  │    (GameBoard, BlockPile, ProgressBar)          │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Design System Components                 │   │
│  │    (Button, Card, Modal, Avatar)                │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Headless Primitives                      │   │
│  │    (Radix UI, React Aria, @dnd-kit)             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Selected Libraries:**

| Purpose | Library | Rationale |
|---------|---------|-----------|
| Accessibility Primitives | Radix UI | Unstyled, accessible, composable |
| Drag & Drop | @dnd-kit | Touch-first, accessible, performant |
| Animations | Framer Motion | Gesture support, hardware acceleration |
| Styling | Tailwind CSS | Utility-first, tree-shakeable |
| Icons | Lucide React | Consistent, customizable |

### 3.4 Responsive Design Strategy

**Target Devices:**
- iPads (9.7" - 12.9")
- Android tablets (8" - 11")
- Chromebooks (11" - 14")
- Desktop browsers (for parents)

**Breakpoint System:**

```css
/* Tailwind config extension */
screens: {
  'tablet-sm': '640px',   /* Small tablets portrait */
  'tablet': '768px',       /* Standard tablets */
  'tablet-lg': '1024px',   /* Large tablets landscape */
  'desktop': '1280px',     /* Parent dashboard */
}
```

**Touch Target Guidelines (WCAG 2.1):**
- Minimum touch target: 44x44px
- Game blocks: 64x64px minimum
- Spacing between targets: 8px minimum

---

## 4. Backend Architecture

### 4.1 Architecture Pattern: Serverless-First

**Decision: Serverless Functions with API Gateway**

#### Justification

1. **Cost Efficiency**: Pay-per-execution model suits:
   - Unpredictable usage patterns (school hours vs. evenings)
   - Seasonal variations (summer vs. school year)
   - Zero cost when idle

2. **Scalability**: Automatic scaling handles:
   - Classroom deployments (30+ simultaneous users)
   - No capacity planning required

3. **Maintenance**: Reduced operational burden:
   - No server patching
   - Built-in high availability
   - Managed infrastructure

#### Recommended Platform: Vercel + Vercel Functions

**Why Vercel:**
- Integrated with frontend deployment
- Edge functions for low latency
- Generous free tier for development
- Easy PostgreSQL integration (Vercel Postgres)

**Alternative: AWS Lambda + API Gateway**
- Better for complex enterprise requirements
- More control over infrastructure
- Higher operational complexity

### 4.2 API Design: REST with OpenAPI

**Decision: REST over GraphQL**

#### Justification

| Factor | REST | GraphQL |
|--------|------|---------|
| Caching | Native HTTP caching | Complex (needs Apollo) |
| Offline Support | Simple with SWR/React Query | Requires Relay/Apollo offline |
| Learning Curve | Lower | Higher |
| Overfetching | Manageable with proper design | Solved by design |
| Tooling | Mature (OpenAPI) | Good (GraphQL Code Gen) |

For this application:
- Data shapes are predictable
- Offline caching is critical
- Team velocity > query flexibility

### 4.3 API Structure

```
/api/v1
├── /auth
│   ├── POST   /register          # Parent registration
│   ├── POST   /login             # Parent login
│   ├── POST   /refresh           # Token refresh
│   ├── POST   /logout            # Invalidate tokens
│   └── POST   /child/session     # Create child play session
│
├── /users
│   ├── GET    /me                # Current user profile
│   ├── PATCH  /me                # Update profile
│   └── DELETE /me                # Account deletion (COPPA)
│
├── /children
│   ├── GET    /                  # List child profiles
│   ├── POST   /                  # Create child profile
│   ├── GET    /:id               # Get child profile
│   ├── PATCH  /:id               # Update child profile
│   └── DELETE /:id               # Delete child profile
│
├── /progress
│   ├── GET    /children/:id      # Get child progress
│   ├── POST   /sync              # Bulk sync offline progress
│   └── GET    /children/:id/report  # Progress report for parent
│
├── /games
│   ├── GET    /                  # List available games
│   ├── GET    /:id/config        # Get game configuration
│   └── POST   /:id/complete      # Record game completion
│
└── /analytics
    └── POST   /events            # Batch analytics events
```

### 4.4 API Response Format

```typescript
// Successful response
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    };
  };
}

// Error response
interface ApiError {
  success: false;
  error: {
    code: string;           // Machine-readable: "VALIDATION_ERROR"
    message: string;        // Human-readable: "Invalid email format"
    details?: Record<string, string[]>;  // Field-level errors
  };
}
```

### 4.5 Backend Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                 Backend Technology Stack                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Runtime:        Node.js 20 LTS                         │
│  Language:       TypeScript 5.x                          │
│  Framework:      Hono (lightweight, edge-ready)          │
│  Validation:     Zod (runtime + static typing)           │
│  ORM:            Drizzle ORM (type-safe, lightweight)    │
│  Auth:           Custom JWT implementation               │
│  Caching:        Upstash Redis (serverless Redis)        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Why Hono over Express:**
- Built for serverless/edge environments
- Smaller bundle size
- First-class TypeScript support
- Middleware compatible with Express ecosystem

**Why Drizzle ORM:**
- SQL-like syntax (no magic)
- Zero runtime overhead
- Type-safe queries
- Excellent migration support

---

## 5. Authentication System

### 5.1 COPPA Compliance Requirements

The Children's Online Privacy Protection Act (COPPA) applies because our users include children under 13. Key requirements:

1. **Verifiable Parental Consent**: Required before collecting child data
2. **Minimal Data Collection**: Only collect what's necessary
3. **Parent Access**: Parents can review child data
4. **Data Deletion**: Parents can request data deletion
5. **No Behavioral Advertising**: Cannot serve targeted ads to children

### 5.2 Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PARENT FLOW                                                        │
│  ───────────                                                        │
│                                                                      │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐          │
│  │ Register│───▶│  Email  │───▶│ Consent │───▶│ Active  │          │
│  │         │    │ Verify  │    │ Accept  │    │ Account │          │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘          │
│                                                      │               │
│                                                      ▼               │
│  CHILD SESSION FLOW                    ┌─────────────────────┐      │
│  ──────────────────                    │   Parent creates    │      │
│                                        │   child profiles    │      │
│  ┌─────────┐    ┌─────────┐           └─────────────────────┘      │
│  │  Child  │───▶│ Select  │                     │                   │
│  │  Opens  │    │ Avatar  │                     ▼                   │
│  │   App   │    │         │           ┌─────────────────────┐      │
│  └─────────┘    └─────────┘           │  Child profiles     │      │
│                      │                 │  (no passwords)     │      │
│                      ▼                 └─────────────────────┘      │
│                ┌─────────┐                     │                    │
│                │ Optional│◀────────────────────┘                    │
│                │   PIN   │  (Parent can enable                      │
│                └─────────┘   4-digit PIN)                           │
│                      │                                               │
│                      ▼                                               │
│                ┌─────────┐                                          │
│                │  Play   │  (Limited session token)                 │
│                │ Session │                                          │
│                └─────────┘                                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 Token Strategy

**Parent Authentication:**
- JWT Access Token: 15 minutes expiry
- HTTP-only Refresh Token: 7 days expiry
- Stored in secure, HTTP-only cookies

**Child Session:**
- Limited JWT: 24 hours expiry
- Contains: childId, parentId, permissions
- Stored in localStorage (acceptable for child sessions)
- Can only access their own progress data
- Cannot modify parent account settings

```typescript
// Parent JWT Payload
interface ParentTokenPayload {
  sub: string;          // Parent user ID
  email: string;
  type: 'parent';
  iat: number;
  exp: number;
}

// Child Session Payload
interface ChildSessionPayload {
  sub: string;          // Child profile ID
  parentId: string;     // Parent who owns this profile
  name: string;         // Child's display name
  avatar: string;       // Avatar identifier
  type: 'child';
  permissions: ['play', 'view_progress'];
  iat: number;
  exp: number;
}
```

### 5.4 Session Management for Children

**Design Principles:**
1. **No passwords for children** - Avatar selection or optional PIN
2. **Parent oversight** - Parents can see active sessions
3. **Automatic timeout** - 30 minutes of inactivity = prompt to continue
4. **No PII in child profiles** - Only display name and avatar

```typescript
// Child profile structure (COPPA-compliant)
interface ChildProfile {
  id: string;
  parentId: string;
  displayName: string;      // e.g., "Alex" (no last name)
  avatarId: string;         // Predefined avatar selection
  gradeLevel: 'K' | '1' | '2' | '3';
  pinHash?: string;         // Optional 4-digit PIN (hashed)
  createdAt: Date;
  // NO: email, birthdate, location, school
}
```

### 5.5 Security Headers

```typescript
// Security middleware
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': generateCSP()
};
```

---

## 6. Data Storage

### 6.1 Database Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Data Storage Architecture                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    PRIMARY DATABASE                            │  │
│  │                    PostgreSQL 15+                              │  │
│  │                                                                │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │  │
│  │  │ Parents │  │ Children│  │Progress │  │  Game   │          │  │
│  │  │         │  │         │  │ Records │  │ Configs │          │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    CACHE LAYER                                 │  │
│  │                    Upstash Redis                               │  │
│  │                                                                │  │
│  │  • Session data              • Rate limiting                   │  │
│  │  • Leaderboards (optional)   • API response cache              │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    CLIENT-SIDE STORAGE                         │  │
│  │                    IndexedDB (via idb)                         │  │
│  │                                                                │  │
│  │  • Offline game progress     • Pending sync queue             │  │
│  │  • Cached game assets        • User preferences               │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Database Schema

```sql
-- Parents table
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    coppa_consent_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Child profiles table (COPPA-compliant)
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    display_name VARCHAR(50) NOT NULL,
    avatar_id VARCHAR(50) NOT NULL,
    grade_level VARCHAR(1) CHECK (grade_level IN ('K', '1', '2', '3')),
    pin_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Progress records
CREATE TABLE progress_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    game_id VARCHAR(50) NOT NULL,
    skill_id VARCHAR(50) NOT NULL,
    difficulty_level INT NOT NULL,
    score INT NOT NULL,
    time_spent_seconds INT NOT NULL,
    completed_at TIMESTAMP NOT NULL,
    synced_from_offline BOOLEAN DEFAULT FALSE,
    client_record_id VARCHAR(100), -- For deduplication
    created_at TIMESTAMP DEFAULT NOW(),

    -- Prevent duplicate syncs
    UNIQUE(child_id, client_record_id)
);

-- Create indexes
CREATE INDEX idx_progress_child_id ON progress_records(child_id);
CREATE INDEX idx_progress_completed_at ON progress_records(completed_at);
CREATE INDEX idx_children_parent_id ON children(parent_id);
```

### 6.3 Offline-First Strategy

**IndexedDB Schema:**

```typescript
// Client-side database schema
interface OfflineDatabase {
  // Stores
  childProfiles: ChildProfile[];
  progressQueue: QueuedProgressRecord[];
  cachedGameConfigs: GameConfig[];
  userPreferences: UserPreferences;
}

interface QueuedProgressRecord {
  id: string;              // Client-generated UUID
  childId: string;
  gameId: string;
  skillId: string;
  difficultyLevel: number;
  score: number;
  timeSpentSeconds: number;
  completedAt: string;     // ISO timestamp
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
  syncAttempts: number;
  lastSyncAttempt?: string;
}
```

**Sync Strategy:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Offline Sync Flow                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. GAME COMPLETION (Offline or Online)                             │
│     ──────────────────────────────────                              │
│     • Save to IndexedDB immediately                                 │
│     • Mark syncStatus: 'pending'                                    │
│     • Update local progress aggregates                              │
│                                                                      │
│  2. SYNC TRIGGER (When Online)                                      │
│     ─────────────────────────────                                   │
│     • On app open                                                   │
│     • After game completion                                         │
│     • On network reconnection                                       │
│     • Every 5 minutes while active                                  │
│                                                                      │
│  3. SYNC PROCESS                                                    │
│     ────────────                                                    │
│     ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐       │
│     │  Batch  │───▶│  POST   │───▶│ Handle  │───▶│  Mark   │       │
│     │ Pending │    │  /sync  │    │Response │    │ Synced  │       │
│     └─────────┘    └─────────┘    └─────────┘    └─────────┘       │
│                                                                      │
│  4. CONFLICT RESOLUTION                                             │
│     ────────────────────────                                        │
│     • Client wins (server dedupes by client_record_id)              │
│     • Idempotent operations                                         │
│     • Retry with exponential backoff                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.4 Data Retention Policy

| Data Type | Retention Period | Rationale |
|-----------|------------------|-----------|
| Progress Records | 2 years | Historical tracking |
| Analytics Events | 90 days | Aggregated, then purged |
| Session Logs | 30 days | Security audit |
| Deleted Child Data | Immediate | COPPA compliance |

---

## 7. State Management

### 7.1 State Architecture

**Decision: Zustand + React Query**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    State Management Layers                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    REACT QUERY                                 │  │
│  │                    (Server State)                              │  │
│  │                                                                │  │
│  │  • User profile data         • Game configurations            │  │
│  │  • Progress history          • Cached server responses        │  │
│  │  • Automatic background refresh                               │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    ZUSTAND                                     │  │
│  │                    (Client State)                              │  │
│  │                                                                │  │
│  │  • Current game state        • UI state (modals, menus)       │  │
│  │  • Active child session      • Offline queue status           │  │
│  │  • Sound/music preferences   • Animation states               │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    REACT CONTEXT                               │  │
│  │                    (Static/Rarely Changed)                     │  │
│  │                                                                │  │
│  │  • Theme configuration       • Feature flags                  │  │
│  │  • i18n strings              • Device capabilities            │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Zustand Store Structure

```typescript
// stores/gameStore.ts
interface GameState {
  // Current game session
  activeGame: string | null;
  currentLevel: number;
  score: number;
  timeElapsed: number;

  // Block manipulation state
  blocks: Block[];
  dropZones: DropZone[];

  // Actions
  startGame: (gameId: string, level: number) => void;
  placeBlock: (blockId: string, zoneId: string) => void;
  removeBlock: (blockId: string) => void;
  completeLevel: () => void;
  resetGame: () => void;
}

// stores/sessionStore.ts
interface SessionState {
  // Current session
  activeChild: ChildProfile | null;
  parentSession: ParentSession | null;

  // Offline status
  isOnline: boolean;
  pendingSyncCount: number;
  lastSyncTime: Date | null;

  // Actions
  setActiveChild: (child: ChildProfile) => void;
  clearChildSession: () => void;
  updateOnlineStatus: (online: boolean) => void;
}

// stores/uiStore.ts
interface UIState {
  // Sound settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;

  // UI state
  activeModal: string | null;
  isLoading: boolean;

  // Actions
  toggleSound: () => void;
  toggleMusic: () => void;
  setVolume: (volume: number) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}
```

### 7.3 React Query Configuration

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,         // 5 minutes
      gcTime: 24 * 60 * 60 * 1000,      // 24 hours (cache time)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      networkMode: 'offlineFirst',       // Important for offline support
    },
  },
});

// Persist to IndexedDB for offline support
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'numbersense-cache',
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});
```

### 7.4 Offline Sync Strategy

```typescript
// hooks/useOfflineSync.ts
import { useEffect, useCallback } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { syncPendingRecords, getPendingCount } from '../lib/offlineStorage';
import { useSessionStore } from '../stores/sessionStore';

export function useOfflineSync() {
  const isOnline = useOnlineStatus();
  const { updateOnlineStatus, pendingSyncCount } = useSessionStore();

  const performSync = useCallback(async () => {
    if (!isOnline) return;

    try {
      const result = await syncPendingRecords();
      console.log(`Synced ${result.synced} records`);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }, [isOnline]);

  // Sync on online status change
  useEffect(() => {
    updateOnlineStatus(isOnline);
    if (isOnline && pendingSyncCount > 0) {
      performSync();
    }
  }, [isOnline]);

  // Periodic sync while online
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(performSync, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [isOnline, performSync]);

  return { performSync, isOnline, pendingSyncCount };
}
```

---

## 8. Testing Strategy

### 8.1 Testing Pyramid

```
                    ┌───────────────┐
                   /│     E2E       │\
                  / │   (Playwright)│ \
                 /  │   ~20 tests   │  \
                /   └───────────────┘   \
               /                         \
              /   ┌─────────────────┐     \
             /    │   Integration    │      \
            /     │   (Vitest + RTL) │       \
           /      │   ~100 tests     │        \
          /       └─────────────────┘         \
         /                                     \
        /      ┌───────────────────────┐        \
       /       │      Unit Tests       │         \
      /        │      (Vitest)         │          \
     /         │      ~300+ tests      │           \
    /          └───────────────────────┘            \
   └─────────────────────────────────────────────────┘
```

### 8.2 Testing Framework Selection

| Type | Tool | Rationale |
|------|------|-----------|
| Unit | Vitest | Fast, Vite-native, Jest-compatible API |
| Component | React Testing Library | Tests behavior, not implementation |
| E2E | Playwright | Cross-browser, reliable, good touch support |
| Visual | Playwright Screenshots | Built-in, no extra tooling |
| Accessibility | axe-core | Industry standard |

### 8.3 Unit Testing Strategy

```typescript
// Example: Testing game logic
// tests/unit/game-engine/scoring.test.ts
import { describe, it, expect } from 'vitest';
import { calculateScore, calculateDifficulty } from '../../../src/game-engine/scoring';

describe('calculateScore', () => {
  it('should award full points for correct answer within time limit', () => {
    const result = calculateScore({
      correct: true,
      timeSpent: 5,
      timeLimit: 30,
      basePoints: 100,
      difficulty: 1
    });

    expect(result.points).toBe(100);
    expect(result.timeBonus).toBeGreaterThan(0);
  });

  it('should award no points for incorrect answer', () => {
    const result = calculateScore({
      correct: false,
      timeSpent: 5,
      timeLimit: 30,
      basePoints: 100,
      difficulty: 1
    });

    expect(result.points).toBe(0);
  });
});

describe('calculateDifficulty', () => {
  it('should increase difficulty after consecutive correct answers', () => {
    const history = [true, true, true, true, true];
    const newDifficulty = calculateDifficulty(1, history);

    expect(newDifficulty).toBe(2);
  });

  it('should not decrease below level 1', () => {
    const history = [false, false, false];
    const newDifficulty = calculateDifficulty(1, history);

    expect(newDifficulty).toBe(1);
  });
});
```

### 8.4 Component Testing Strategy

```typescript
// Example: Testing drag-and-drop interaction
// tests/integration/games/BlockPile.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BlockPile } from '../../../src/components/games/BlockPile';
import { DndContext } from '@dnd-kit/core';

describe('BlockPile', () => {
  it('should render the correct number of blocks', () => {
    render(
      <DndContext>
        <BlockPile blocks={[
          { id: '1', value: 5, color: 'red' },
          { id: '2', value: 3, color: 'blue' },
        ]} />
      </DndContext>
    );

    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('should be accessible with keyboard navigation', async () => {
    const onSelect = vi.fn();
    render(
      <DndContext>
        <BlockPile
          blocks={[{ id: '1', value: 5, color: 'red' }]}
          onBlockSelect={onSelect}
        />
      </DndContext>
    );

    const block = screen.getByRole('button');
    block.focus();
    fireEvent.keyDown(block, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
```

### 8.5 E2E Testing Strategy

```typescript
// Example: Testing complete game flow
// tests/e2e/games/counting-game.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Counting Game', () => {
  test.beforeEach(async ({ page }) => {
    // Set up child session
    await page.goto('/');
    await page.click('[data-testid="child-avatar-1"]');
    await page.click('[data-testid="game-counting"]');
  });

  test('should complete a level successfully', async ({ page }) => {
    // Wait for game to load
    await expect(page.locator('[data-testid="game-board"]')).toBeVisible();

    // Get the target number
    const target = await page.locator('[data-testid="target-number"]').textContent();
    const targetNum = parseInt(target!, 10);

    // Drag blocks to answer zone
    for (let i = 0; i < targetNum; i++) {
      const block = page.locator('[data-testid="block"]').first();
      const dropZone = page.locator('[data-testid="answer-zone"]');

      await block.dragTo(dropZone);
    }

    // Submit answer
    await page.click('[data-testid="submit-answer"]');

    // Verify success
    await expect(page.locator('[data-testid="success-animation"]')).toBeVisible();
  });

  test('should handle touch interactions on tablet', async ({ page }) => {
    // Emulate tablet
    await page.setViewportSize({ width: 1024, height: 768 });

    // Test touch drag
    const block = page.locator('[data-testid="block"]').first();
    const dropZone = page.locator('[data-testid="answer-zone"]');

    await block.tap();
    await dropZone.tap();

    // Verify block was moved
    await expect(dropZone.locator('[data-testid="block"]')).toBeVisible();
  });
});
```

### 8.6 Visual Regression Testing

```typescript
// tests/e2e/visual/game-screens.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('game selection screen matches snapshot', async ({ page }) => {
    await page.goto('/games');
    await expect(page).toHaveScreenshot('game-selection.png', {
      maxDiffPixels: 100
    });
  });

  test('counting game board matches snapshot', async ({ page }) => {
    await page.goto('/games/counting?level=1');
    await page.waitForSelector('[data-testid="game-board"]');

    await expect(page.locator('[data-testid="game-board"]'))
      .toHaveScreenshot('counting-game-board.png');
  });
});
```

### 8.7 Accessibility Testing

```typescript
// tests/integration/accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { GameSelection } from '../src/components/GameSelection';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('GameSelection has no accessibility violations', async () => {
    const { container } = render(<GameSelection />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
```

---

## 9. CI/CD Pipeline

### 9.1 Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CI/CD Pipeline                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PULL REQUEST                                                               │
│  ────────────                                                               │
│                                                                              │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐       │
│  │  Lint   │──▶│  Type   │──▶│  Unit   │──▶│  Build  │──▶│ Preview │       │
│  │ (ESLint)│   │  Check  │   │  Tests  │   │         │   │ Deploy  │       │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘       │
│                                                                              │
│  MERGE TO MAIN                                                              │
│  ─────────────                                                              │
│                                                                              │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐       │
│  │  All    │──▶│  E2E    │──▶│ Visual  │──▶│ Staging │──▶│ Smoke   │       │
│  │  Above  │   │  Tests  │   │  Tests  │   │ Deploy  │   │  Tests  │       │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘       │
│                                                                              │
│  PRODUCTION RELEASE                                                         │
│  ──────────────────                                                         │
│                                                                              │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐       │
│  │ Manual  │──▶│  Prod   │──▶│ Canary  │──▶│ Monitor │──▶│  Full   │       │
│  │ Approve │   │ Deploy  │   │  (10%)  │   │ Errors  │   │ Rollout │       │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '8'

jobs:
  lint-and-typecheck:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit --coverage

      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, unit-tests]
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps

      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - run: pnpm test:e2e

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./

  deploy-staging:
    name: Deploy Staging
    runs-on: ubuntu-latest
    needs: [build, e2e-tests]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    environment:
      name: staging
      url: https://staging.numbersense.app
    steps:
      - uses: actions/checkout@v4

      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          alias-domains: staging.numbersense.app
```

### 9.3 Production Deployment Workflow

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  workflow_dispatch:
    inputs:
      confirm:
        description: 'Type "deploy" to confirm production deployment'
        required: true

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Validate confirmation
        if: github.event.inputs.confirm != 'deploy'
        run: |
          echo "Deployment not confirmed. Input was: ${{ github.event.inputs.confirm }}"
          exit 1

  deploy:
    needs: validate
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://numbersense.app
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: '8'

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  smoke-tests:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: '8'

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: BASE_URL=https://numbersense.app pnpm test:smoke
```

### 9.4 Environment Strategy

| Environment | URL | Purpose | Deployment |
|-------------|-----|---------|------------|
| Local | localhost:5173 | Development | Manual |
| Preview | pr-{number}.numbersense.app | PR Review | Automatic per PR |
| Staging | staging.numbersense.app | Pre-prod testing | Auto on main merge |
| Production | numbersense.app | Live users | Manual approval |

---

## 10. Modular Game Engine

### 10.1 Game Engine Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Game Engine Architecture                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         GAME SHELL                                   │    │
│  │  (Handles lifecycle, scoring, progress, transitions)                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│            ┌───────────────────────┼───────────────────────┐                │
│            ▼                       ▼                       ▼                │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │  COUNTING GAME  │    │  ADDITION GAME  │    │   FUTURE GAME   │         │
│  │                 │    │                 │    │                 │         │
│  │  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │         │
│  │  │  Config   │  │    │  │  Config   │  │    │  │  Config   │  │         │
│  │  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │         │
│  │  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │         │
│  │  │   Board   │  │    │  │   Board   │  │    │  │   Board   │  │         │
│  │  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │         │
│  │  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │         │
│  │  │   Logic   │  │    │  │   Logic   │  │    │  │   Logic   │  │         │
│  │  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      SHARED COMPONENTS                               │    │
│  │                                                                      │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │    │
│  │  │ Blocks  │  │  Timer  │  │  Score  │  │ Rewards │  │   DnD   │   │    │
│  │  │         │  │         │  │ Display │  │Animation│  │ System  │   │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Game Interface Contract

```typescript
// src/game-engine/types.ts

/**
 * Base interface that all games must implement
 */
export interface Game<TConfig extends GameConfig, TState extends GameState> {
  id: string;
  name: string;
  description: string;
  icon: string;
  minGrade: GradeLevel;
  maxGrade: GradeLevel;
  skills: SkillId[];

  // Lifecycle methods
  initialize(config: TConfig): TState;
  generateLevel(difficulty: number): LevelData;
  validateAnswer(state: TState, answer: unknown): ValidationResult;
  calculateScore(state: TState, result: ValidationResult): ScoreResult;

  // UI Components
  BoardComponent: React.ComponentType<BoardProps<TState>>;
  InstructionsComponent: React.ComponentType<InstructionsProps>;
}

export interface GameConfig {
  difficultyRange: [number, number];
  timeLimit?: number;
  enableHints: boolean;
  soundEffects: boolean;
}

export interface GameState {
  level: number;
  difficulty: number;
  currentProblem: unknown;
  playerAnswer: unknown;
  startTime: number;
  hintsUsed: number;
}

export interface LevelData {
  problem: unknown;
  correctAnswer: unknown;
  hints: string[];
  visualElements: VisualElement[];
}

export interface ValidationResult {
  correct: boolean;
  feedback: string;
  partialCredit?: number;
}

export interface ScoreResult {
  points: number;
  timeBonus: number;
  streak: number;
  newDifficulty: number;
}

export type GradeLevel = 'K' | '1' | '2' | '3';
export type SkillId =
  | 'counting'
  | 'addition'
  | 'subtraction'
  | 'comparison'
  | 'place-value'
  | 'patterns';
```

### 10.3 Game Registration System

```typescript
// src/game-engine/registry.ts
import type { Game, GameConfig, GameState } from './types';

class GameRegistry {
  private games = new Map<string, Game<any, any>>();

  register<TConfig extends GameConfig, TState extends GameState>(
    game: Game<TConfig, TState>
  ): void {
    if (this.games.has(game.id)) {
      throw new Error(`Game "${game.id}" is already registered`);
    }
    this.games.set(game.id, game);
  }

  get(id: string): Game<any, any> | undefined {
    return this.games.get(id);
  }

  getAll(): Game<any, any>[] {
    return Array.from(this.games.values());
  }

  getByGrade(grade: GradeLevel): Game<any, any>[] {
    return this.getAll().filter(
      game => game.minGrade <= grade && game.maxGrade >= grade
    );
  }

  getBySkill(skill: SkillId): Game<any, any>[] {
    return this.getAll().filter(game => game.skills.includes(skill));
  }
}

export const gameRegistry = new GameRegistry();
```

### 10.4 Example: Counting Game Implementation

```typescript
// src/games/counting/index.ts
import type { Game, GameConfig, GameState, LevelData } from '../../game-engine/types';
import { CountingBoard } from './CountingBoard';
import { CountingInstructions } from './CountingInstructions';

interface CountingConfig extends GameConfig {
  maxNumber: number;
  blockStyle: 'cubes' | 'animals' | 'fruits';
}

interface CountingState extends GameState {
  currentProblem: {
    targetNumber: number;
    availableBlocks: Block[];
  };
  playerAnswer: {
    placedBlocks: Block[];
  };
}

interface Block {
  id: string;
  value: number;
  position?: { x: number; y: number };
}

export const countingGame: Game<CountingConfig, CountingState> = {
  id: 'counting',
  name: 'Counting Blocks',
  description: 'Learn to count by dragging blocks',
  icon: 'blocks',
  minGrade: 'K',
  maxGrade: '1',
  skills: ['counting'],

  initialize(config: CountingConfig): CountingState {
    return {
      level: 1,
      difficulty: config.difficultyRange[0],
      currentProblem: {
        targetNumber: 0,
        availableBlocks: [],
      },
      playerAnswer: {
        placedBlocks: [],
      },
      startTime: Date.now(),
      hintsUsed: 0,
    };
  },

  generateLevel(difficulty: number): LevelData {
    // Difficulty 1-3: numbers 1-5
    // Difficulty 4-6: numbers 1-10
    // Difficulty 7-10: numbers 1-20
    const maxNumber = difficulty <= 3 ? 5 : difficulty <= 6 ? 10 : 20;
    const targetNumber = Math.floor(Math.random() * maxNumber) + 1;

    // Generate extra blocks for distraction (increases with difficulty)
    const extraBlocks = Math.floor(difficulty / 2);
    const totalBlocks = targetNumber + extraBlocks;

    const blocks: Block[] = Array.from({ length: totalBlocks }, (_, i) => ({
      id: `block-${i}`,
      value: 1,
    }));

    return {
      problem: { targetNumber },
      correctAnswer: targetNumber,
      hints: [
        `Try counting out loud!`,
        `The number ${targetNumber} comes after ${targetNumber - 1}`,
        `Count each block as you drag it`,
      ],
      visualElements: blocks.map(b => ({
        type: 'block',
        id: b.id,
        data: b,
      })),
    };
  },

  validateAnswer(state: CountingState, answer: { count: number }): ValidationResult {
    const correct = answer.count === state.currentProblem.targetNumber;

    return {
      correct,
      feedback: correct
        ? 'Great job! You counted correctly!'
        : `Not quite. You counted ${answer.count}, but the answer is ${state.currentProblem.targetNumber}`,
      partialCredit: correct ? 1 : 0,
    };
  },

  calculateScore(state: CountingState, result: ValidationResult): ScoreResult {
    const basePoints = result.correct ? 100 : 0;
    const timeElapsed = (Date.now() - state.startTime) / 1000;
    const timeBonus = result.correct && timeElapsed < 30
      ? Math.floor((30 - timeElapsed) * 2)
      : 0;

    return {
      points: basePoints + timeBonus,
      timeBonus,
      streak: result.correct ? 1 : 0,
      newDifficulty: result.correct
        ? Math.min(state.difficulty + 1, 10)
        : Math.max(state.difficulty - 1, 1),
    };
  },

  BoardComponent: CountingBoard,
  InstructionsComponent: CountingInstructions,
};

// Register the game
import { gameRegistry } from '../../game-engine/registry';
gameRegistry.register(countingGame);
```

### 10.5 Shared Components

```typescript
// src/game-engine/components/DraggableBlock.tsx
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

interface DraggableBlockProps {
  id: string;
  value: number;
  style?: 'cube' | 'animal' | 'fruit';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onTap?: () => void;
}

export function DraggableBlock({
  id,
  value,
  style = 'cube',
  size = 'md',
  disabled = false,
  onTap,
}: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
      }}
      className={`
        ${sizeClasses[size]}
        rounded-xl
        cursor-grab
        active:cursor-grabbing
        touch-none
        select-none
        ${isDragging ? 'z-50 shadow-xl scale-110' : 'shadow-md'}
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      animate={{
        rotate: isDragging ? [0, -5, 5, 0] : 0,
      }}
      transition={{ rotate: { repeat: Infinity, duration: 0.5 } }}
      onClick={onTap}
      {...listeners}
      {...attributes}
      role="button"
      aria-label={`Block with value ${value}`}
      aria-grabbed={isDragging}
    >
      <BlockVisual style={style} value={value} />
    </motion.div>
  );
}
```

### 10.6 Difficulty Framework

```typescript
// src/game-engine/difficulty.ts

export interface DifficultyConfig {
  level: number;              // 1-10
  problemComplexity: number;  // How complex the problem is
  timeLimit: number;          // Seconds (0 = unlimited)
  hintsAvailable: number;     // Number of hints
  scaffolding: ScaffoldingLevel;
}

export type ScaffoldingLevel = 'full' | 'partial' | 'minimal' | 'none';

export function calculateDifficulty(
  currentLevel: number,
  recentResults: boolean[],  // Last N results (true = correct)
  config: { adaptiveMode: boolean }
): number {
  if (!config.adaptiveMode) {
    return currentLevel;
  }

  const recentCorrect = recentResults.filter(Boolean).length;
  const total = recentResults.length;

  if (total < 3) {
    return currentLevel;  // Need more data
  }

  const accuracy = recentCorrect / total;

  if (accuracy >= 0.9 && total >= 5) {
    return Math.min(currentLevel + 1, 10);  // Advance
  } else if (accuracy < 0.5) {
    return Math.max(currentLevel - 1, 1);   // Reduce
  }

  return currentLevel;  // Maintain
}

export function getDifficultyConfig(level: number): DifficultyConfig {
  const configs: Record<number, DifficultyConfig> = {
    1: { level: 1, problemComplexity: 1, timeLimit: 0, hintsAvailable: 3, scaffolding: 'full' },
    2: { level: 2, problemComplexity: 1, timeLimit: 0, hintsAvailable: 3, scaffolding: 'full' },
    3: { level: 3, problemComplexity: 2, timeLimit: 60, hintsAvailable: 3, scaffolding: 'partial' },
    4: { level: 4, problemComplexity: 2, timeLimit: 60, hintsAvailable: 2, scaffolding: 'partial' },
    5: { level: 5, problemComplexity: 3, timeLimit: 45, hintsAvailable: 2, scaffolding: 'partial' },
    6: { level: 6, problemComplexity: 3, timeLimit: 45, hintsAvailable: 2, scaffolding: 'minimal' },
    7: { level: 7, problemComplexity: 4, timeLimit: 30, hintsAvailable: 1, scaffolding: 'minimal' },
    8: { level: 8, problemComplexity: 4, timeLimit: 30, hintsAvailable: 1, scaffolding: 'minimal' },
    9: { level: 9, problemComplexity: 5, timeLimit: 30, hintsAvailable: 0, scaffolding: 'none' },
    10: { level: 10, problemComplexity: 5, timeLimit: 20, hintsAvailable: 0, scaffolding: 'none' },
  };

  return configs[level] ?? configs[1];
}
```

---

## 11. Performance Considerations

### 11.1 Animation Performance

**Target: 60fps on mid-range tablets (e.g., iPad 7th gen, Samsung Tab A)**

#### Principles

1. **Use CSS transforms** - `transform` and `opacity` are GPU-accelerated
2. **Avoid layout thrashing** - Batch DOM reads/writes
3. **Use `will-change` sparingly** - Only on actively animating elements
4. **Prefer `requestAnimationFrame`** - For JavaScript animations

#### Implementation

```typescript
// Framer Motion optimized config
const optimizedTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1,
};

// Use layout animations for complex movements
<motion.div
  layout
  layoutId={`block-${id}`}
  transition={optimizedTransition}
  style={{ willChange: isDragging ? 'transform' : 'auto' }}
>
  {/* Block content */}
</motion.div>
```

#### Touch Performance

```typescript
// Optimized touch handlers
const touchHandlers = {
  passive: true,  // Don't block scrolling
  capture: false,
};

// Use CSS touch-action
const touchStyles = {
  touchAction: 'none',        // For drag targets
  WebkitTouchCallout: 'none', // Prevent callout
  WebkitUserSelect: 'none',   // Prevent selection
};
```

### 11.2 Bundle Size Optimization

**Target: < 200KB initial load (gzipped)**

#### Strategies

```typescript
// vite.config.ts - Code splitting
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'animation': ['framer-motion'],
          'dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],

          // Feature chunks (loaded on demand)
          'parent-dashboard': [
            './src/features/parent-dashboard/index.ts'
          ],
          'game-counting': ['./src/games/counting/index.ts'],
          'game-addition': ['./src/games/addition/index.ts'],
        },
      },
    },
    // Analyze bundle
    sourcemap: true,
  },
});
```

#### Lazy Loading

```typescript
// Lazy load games
const CountingGame = lazy(() => import('./games/counting'));
const AdditionGame = lazy(() => import('./games/addition'));

// Lazy load parent dashboard
const ParentDashboard = lazy(() => import('./features/parent-dashboard'));

// Usage with Suspense
<Suspense fallback={<GameLoadingSpinner />}>
  <Routes>
    <Route path="/games/counting" element={<CountingGame />} />
    <Route path="/games/addition" element={<AdditionGame />} />
    <Route path="/parent/*" element={<ParentDashboard />} />
  </Routes>
</Suspense>
```

### 11.3 Image/Asset Optimization

#### Image Strategy

| Asset Type | Format | Optimization |
|------------|--------|--------------|
| Icons | SVG | Inline or sprite sheet |
| Characters | WebP + PNG fallback | Multiple resolutions |
| Backgrounds | WebP | Compressed, lazy loaded |
| Animations | Lottie JSON | Compressed |

#### Implementation

```typescript
// Responsive images with srcset
function GameCharacter({ character }: { character: string }) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`
          /assets/characters/${character}-1x.webp 1x,
          /assets/characters/${character}-2x.webp 2x,
          /assets/characters/${character}-3x.webp 3x
        `}
      />
      <img
        src={`/assets/characters/${character}-1x.png`}
        srcSet={`
          /assets/characters/${character}-1x.png 1x,
          /assets/characters/${character}-2x.png 2x,
          /assets/characters/${character}-3x.png 3x
        `}
        alt={character}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
```

#### Asset Preloading

```typescript
// Preload critical assets
function preloadGameAssets(gameId: string) {
  const assets = getGameAssets(gameId);

  assets.critical.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = url.endsWith('.json') ? 'fetch' : 'image';
    document.head.appendChild(link);
  });
}

// Trigger on game selection hover
<GameCard
  onMouseEnter={() => preloadGameAssets('counting')}
  onFocus={() => preloadGameAssets('counting')}
/>
```

### 11.4 Performance Monitoring

```typescript
// Web Vitals monitoring
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

function reportWebVitals() {
  onCLS(metric => sendToAnalytics('CLS', metric.value));
  onFID(metric => sendToAnalytics('FID', metric.value));
  onLCP(metric => sendToAnalytics('LCP', metric.value));
  onFCP(metric => sendToAnalytics('FCP', metric.value));
  onTTFB(metric => sendToAnalytics('TTFB', metric.value));
}

// Performance budgets
const performanceBudgets = {
  LCP: 2500,   // ms
  FID: 100,    // ms
  CLS: 0.1,    // score
  TTI: 3500,   // ms
};
```

---

## 12. Telemetry & Analytics

### 12.1 Privacy-First Analytics

**Core Principle: Collect minimal data, process locally where possible**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Analytics Architecture                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CLIENT SIDE                                                                │
│  ───────────                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Local Processing                                  │   │
│  │                                                                      │   │
│  │  • Aggregate scores locally                                         │   │
│  │  • Calculate streaks client-side                                    │   │
│  │  • Summarize session data before sending                            │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
│                              ▼                                               │
│                    ┌─────────────────┐                                      │
│                    │  Batch & Send   │ (Every 5 min or on session end)      │
│                    │  Summaries Only │                                      │
│                    └─────────────────┘                                      │
│                              │                                               │
│                              ▼                                               │
│  SERVER SIDE                                                                │
│  ───────────                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Anonymized Processing                             │   │
│  │                                                                      │   │
│  │  • No IP address storage                                            │   │
│  │  • Session IDs hashed                                               │   │
│  │  • Aggregated within 24 hours                                       │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Learning Analytics (For Parents)

```typescript
// Types of learning analytics collected
interface LearningAnalytics {
  // Progress metrics
  skillLevels: Record<SkillId, {
    currentLevel: number;
    trend: 'improving' | 'stable' | 'needs-practice';
    lastPracticed: string;
  }>;

  // Engagement metrics
  engagement: {
    totalPlayTime: number;       // Minutes
    averageSessionLength: number;
    daysActiveThisWeek: number;
    favoriteGame: string;
  };

  // Achievement metrics
  achievements: {
    id: string;
    name: string;
    earnedAt: string;
  }[];

  // Recommendations
  recommendations: {
    skill: SkillId;
    reason: string;
    suggestedGame: string;
  }[];
}
```

### 12.3 Error Tracking

**Tool: Sentry (with privacy config)**

```typescript
// sentry.config.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Privacy settings
  beforeSend(event) {
    // Remove any potential PII
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
      // Only keep anonymized user ID
      event.user = { id: event.user.id };
    }
    return event;
  },

  // Don't collect breadcrumbs that might contain PII
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === 'xhr' || breadcrumb.category === 'fetch') {
      // Redact request bodies
      if (breadcrumb.data) {
        delete breadcrumb.data.requestBody;
        delete breadcrumb.data.responseBody;
      }
    }
    return breadcrumb;
  },

  // Performance monitoring
  tracesSampleRate: 0.1,  // 10% of transactions

  // Session replay disabled for child privacy
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});
```

### 12.4 Event Schema

```typescript
// Analytics event types (COPPA-compliant)
type AnalyticsEvent =
  | { type: 'session_start'; childId: string; grade: GradeLevel }
  | { type: 'session_end'; duration: number; gamesPlayed: number }
  | { type: 'game_start'; gameId: string; difficulty: number }
  | { type: 'game_complete'; gameId: string; score: number; duration: number }
  | { type: 'level_up'; skillId: SkillId; newLevel: number }
  | { type: 'achievement_earned'; achievementId: string }
  | { type: 'hint_used'; gameId: string; hintIndex: number }
  | { type: 'error'; errorType: string; errorMessage: string };

// What we DON'T collect:
// - Child's name or any identifying info
// - Specific answers (only correct/incorrect)
// - Device identifiers
// - Location data
// - Behavioral patterns for advertising
```

---

## 13. Folder Structure

```
numbersense/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy-production.yml
│
├── docs/
│   ├── architecture/
│   │   └── technical-blueprint.md     # This document
│   ├── research/
│   └── specs/
│
├── src/
│   ├── frontend/
│   │   ├── public/
│   │   │   ├── icons/                 # PWA icons
│   │   │   ├── manifest.json          # PWA manifest
│   │   │   └── sw.js                  # Service worker (generated)
│   │   │
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── App.tsx
│   │   │   │   ├── Router.tsx
│   │   │   │   └── Providers.tsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── ui/                # Design system components
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Navigation.tsx
│   │   │   │   │   └── GameShell.tsx
│   │   │   │   │
│   │   │   │   └── feedback/
│   │   │   │       ├── SuccessAnimation.tsx
│   │   │   │       ├── EncouragementMessage.tsx
│   │   │   │       └── RewardCelebration.tsx
│   │   │   │
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── RegisterForm.tsx
│   │   │   │   │   ├── ChildSelector.tsx
│   │   │   │   │   └── useAuth.ts
│   │   │   │   │
│   │   │   │   ├── parent-dashboard/
│   │   │   │   │   ├── Dashboard.tsx
│   │   │   │   │   ├── ProgressChart.tsx
│   │   │   │   │   ├── ChildManagement.tsx
│   │   │   │   │   └── Settings.tsx
│   │   │   │   │
│   │   │   │   └── child-home/
│   │   │   │       ├── GameSelection.tsx
│   │   │   │       ├── AvatarDisplay.tsx
│   │   │   │       └── ProgressPreview.tsx
│   │   │   │
│   │   │   ├── game-engine/
│   │   │   │   ├── types.ts
│   │   │   │   ├── registry.ts
│   │   │   │   ├── difficulty.ts
│   │   │   │   ├── scoring.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── DraggableBlock.tsx
│   │   │   │   │   ├── DropZone.tsx
│   │   │   │   │   ├── Timer.tsx
│   │   │   │   │   ├── ScoreDisplay.tsx
│   │   │   │   │   └── HintSystem.tsx
│   │   │   │   └── hooks/
│   │   │   │       ├── useGameState.ts
│   │   │   │       ├── useGameTimer.ts
│   │   │   │       └── useGameSound.ts
│   │   │   │
│   │   │   ├── games/
│   │   │   │   ├── counting/
│   │   │   │   │   ├── index.ts       # Game registration
│   │   │   │   │   ├── CountingBoard.tsx
│   │   │   │   │   ├── CountingInstructions.tsx
│   │   │   │   │   └── countingLogic.ts
│   │   │   │   │
│   │   │   │   └── addition/
│   │   │   │       ├── index.ts
│   │   │   │       ├── AdditionBoard.tsx
│   │   │   │       ├── AdditionInstructions.tsx
│   │   │   │       └── additionLogic.ts
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useOnlineStatus.ts
│   │   │   │   ├── useOfflineSync.ts
│   │   │   │   └── useMediaQuery.ts
│   │   │   │
│   │   │   ├── stores/
│   │   │   │   ├── gameStore.ts
│   │   │   │   ├── sessionStore.ts
│   │   │   │   └── uiStore.ts
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   ├── api.ts             # API client
│   │   │   │   ├── queryClient.ts     # React Query setup
│   │   │   │   ├── offlineStorage.ts  # IndexedDB wrapper
│   │   │   │   └── analytics.ts       # Analytics client
│   │   │   │
│   │   │   ├── styles/
│   │   │   │   ├── globals.css
│   │   │   │   └── tailwind.config.ts
│   │   │   │
│   │   │   └── main.tsx
│   │   │
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── index.html
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── index.ts               # Entry point
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── children.ts
│   │   │   │   ├── progress.ts
│   │   │   │   ├── games.ts
│   │   │   │   └── analytics.ts
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── rateLimit.ts
│   │   │   │   ├── cors.ts
│   │   │   │   └── errorHandler.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── authService.ts
│   │   │   │   ├── progressService.ts
│   │   │   │   └── analyticsService.ts
│   │   │   │
│   │   │   ├── db/
│   │   │   │   ├── schema.ts          # Drizzle schema
│   │   │   │   ├── migrations/
│   │   │   │   └── index.ts           # DB connection
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── jwt.ts
│   │   │       └── validation.ts
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/
│       ├── types/
│       │   ├── api.ts                 # API request/response types
│       │   ├── game.ts                # Game-related types
│       │   └── user.ts                # User-related types
│       │
│       ├── constants/
│       │   ├── games.ts
│       │   └── skills.ts
│       │
│       └── package.json
│
├── tests/
│   ├── unit/
│   │   └── game-engine/
│   │       └── scoring.test.ts
│   │
│   ├── integration/
│   │   ├── games/
│   │   │   └── BlockPile.test.tsx
│   │   └── accessibility.test.tsx
│   │
│   └── e2e/
│       ├── games/
│       │   └── counting-game.spec.ts
│       ├── visual/
│       │   └── game-screens.spec.ts
│       └── playwright.config.ts
│
├── scripts/
│   ├── generate-icons.ts             # PWA icon generation
│   └── seed-db.ts                    # Development data seeding
│
├── .env.example
├── .gitignore
├── package.json                      # Root workspace config
├── pnpm-workspace.yaml
└── README.md
```

---

## 14. Technology Summary

### Frontend Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 5.x |
| Styling | Tailwind CSS | 3.x |
| State (Client) | Zustand | 4.x |
| State (Server) | TanStack Query | 5.x |
| Routing | React Router | 6.x |
| Animations | Framer Motion | 11.x |
| Drag & Drop | @dnd-kit | 6.x |
| Forms | React Hook Form + Zod | 7.x |
| Accessibility | Radix UI | Latest |

### Backend Stack

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Node.js | 20 LTS |
| Language | TypeScript | 5.x |
| Framework | Hono | 4.x |
| Database | PostgreSQL | 15+ |
| ORM | Drizzle | Latest |
| Cache | Upstash Redis | Serverless |
| Validation | Zod | 3.x |
| Auth | Custom JWT | - |

### Infrastructure

| Category | Technology |
|----------|------------|
| Hosting | Vercel |
| Database Hosting | Vercel Postgres / Neon |
| CDN | Vercel Edge Network |
| Error Tracking | Sentry |
| Analytics | Custom + Plausible |
| CI/CD | GitHub Actions |

### Development Tools

| Category | Technology |
|----------|------------|
| Package Manager | pnpm |
| Linting | ESLint + Prettier |
| Testing (Unit) | Vitest |
| Testing (E2E) | Playwright |
| Git Hooks | Husky + lint-staged |
| API Docs | OpenAPI + Swagger UI |

---

## 15. Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Offline sync conflicts | Medium | Medium | Idempotent operations, client-wins strategy |
| Animation performance on low-end tablets | Medium | High | Performance testing, graceful degradation |
| Service worker caching issues | Medium | Medium | Versioned cache, clear update UX |
| Touch gesture conflicts | Low | Medium | Dedicated gesture library, thorough testing |
| Bundle size growth | Medium | Medium | Size budgets, lazy loading, monitoring |

### Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Database scaling | Low | High | Serverless DB, read replicas ready |
| Third-party service outage | Low | Medium | Offline-first design, fallbacks |
| Security vulnerability | Low | High | Dependency scanning, security headers |

### Compliance Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| COPPA violation | Low | Critical | Legal review, minimal data collection |
| Data breach | Low | Critical | Encryption, access controls, minimal PII |
| Privacy law changes | Medium | Medium | Modular consent system, data portability |

---

## 16. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

- [ ] Project setup (Vite, TypeScript, Tailwind)
- [ ] Design system components
- [ ] Basic routing and layouts
- [ ] Authentication flow (parent accounts)
- [ ] Child profile management
- [ ] Database schema and migrations

### Phase 2: Game Engine (Weeks 5-8)

- [ ] Game engine core architecture
- [ ] Shared components (blocks, drag-drop, timer)
- [ ] Counting game implementation
- [ ] Addition game implementation
- [ ] Difficulty progression system
- [ ] Sound and animation framework

### Phase 3: Offline & Sync (Weeks 9-10)

- [ ] IndexedDB storage layer
- [ ] Service worker implementation
- [ ] Offline queue system
- [ ] Background sync
- [ ] PWA manifest and icons

### Phase 4: Parent Dashboard (Weeks 11-12)

- [ ] Progress visualization
- [ ] Learning analytics
- [ ] Child management UI
- [ ] Settings and preferences

### Phase 5: Polish & Testing (Weeks 13-16)

- [ ] E2E test coverage
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Security review
- [ ] Beta testing with families

### Phase 6: Launch Preparation (Weeks 17-18)

- [ ] Production infrastructure
- [ ] Monitoring and alerting
- [ ] Documentation
- [ ] App store submission (PWA)
- [ ] Marketing site

---

## Appendix A: Decision Log

| Date | Decision | Alternatives Considered | Rationale |
|------|----------|------------------------|-----------|
| 2026-01 | React over Vue/Svelte | Vue 3, Svelte, Solid | Animation ecosystem, hiring pool |
| 2026-01 | Zustand over Redux | Redux Toolkit, Jotai, Recoil | Simplicity, bundle size |
| 2026-01 | REST over GraphQL | GraphQL, tRPC | Caching, offline support |
| 2026-01 | Vercel over AWS | AWS, Cloudflare | Simplicity, cost for scale |
| 2026-01 | Drizzle over Prisma | Prisma, Kysely | Type safety, bundle size |
| 2026-01 | Vitest over Jest | Jest, Mocha | Vite native, speed |

---

## Appendix B: Glossary

- **COPPA**: Children's Online Privacy Protection Act
- **PWA**: Progressive Web App
- **DnD**: Drag and Drop
- **E2E**: End-to-End (testing)
- **LCP**: Largest Contentful Paint (performance metric)
- **FID**: First Input Delay (performance metric)
- **CLS**: Cumulative Layout Shift (performance metric)
- **JWT**: JSON Web Token
- **ORM**: Object-Relational Mapping

---

*This document is a living specification and will be updated as the project evolves.*
