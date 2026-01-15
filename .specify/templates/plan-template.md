# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/specledger.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with principles from `.specify/memory/constitution.md`:

- [ ] **TypeScript-First**: All code uses TypeScript with strict mode enabled
- [ ] **Clean Architecture**: Clear separation of UI, hooks, stores, and utilities
- [ ] **Component-Driven UI**: UI built from atomic, reusable components
- [ ] **State Management**: Zustand used for global state (no prop drilling)
- [ ] **UX First**: Visual feedback, loading states, and keyboard navigation planned
- [ ] **Performance**: Bundle size under 250KB gzipped, lazy loading planned
- [ ] **Mobile-First**: Responsive design with 375px minimum viewport tested
- [ ] **Technology Stack**: Using approved stack (Next.js 14, Tailwind, Lucide React, Zustand)
- [ ] **Issue Tracking**: Beads epic created and linked to spec

**Complexity Violations** (if any, justify in Complexity Tracking table below):
- None identified / [List violations and justifications]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/specledger.plan command output)
├── research.md          # Phase 0 output (/specledger.plan command)
├── data-model.md        # Phase 1 output (/specledger.plan command)
├── quickstart.md        # Phase 1 output (/specledger.plan command)
├── contracts/           # Phase 1 output (/specledger.plan command)
└── tasks.md             # Phase 2 output (/specledger.tasks command - NOT created by /specledger.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. This template shows the Next.js 14 App Router structure.
-->

```text
app/                          # Next.js 14 App Router
├── (auth)/                   # Auth route group
│   ├── login/
│   └── layout.tsx
├── (dashboard)/              # Dashboard route group
│   ├── booking/
│   ├── movies/
│   └── layout.tsx
├── layout.tsx                # Root layout
├── page.tsx                  # Home page
└── globals.css               # Global styles

components/                   # React components (organized by feature)
├── ui/                       # Atomic UI components (Button, Badge, etc.)
├── booking/                  # Booking feature components
├── movies/                   # Movies feature components
└── layout/                   # Layout components (Header, Footer, etc.)

lib/                          # Utility libraries
├── stores/                   # Zustand stores (useSeatStore, useBookingStore, etc.)
├── hooks/                    # Custom React hooks
├── utils/                    # Utility functions
└── api/                      # API client functions

types/                        # TypeScript type definitions
├── booking.ts
├── movie.ts
└── seat.ts

public/                       # Static assets
└── images/
```

**Structure Decision**: Next.js 14 App Router with feature-based organization. Components organized by domain (booking, movies) with atomic UI components separated. Zustand stores in lib/stores for state management.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
