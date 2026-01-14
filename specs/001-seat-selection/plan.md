# Implementation Plan: Seat Selection Interface (MVP)

**Branch**: `001-seat-selection` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-seat-selection/spec.md`

**Note**: This template is filled in by the `/specledger.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a visual seat selection interface for a movie theater booking system. Users can view a 60-seat grid (6 rows A-F × 10 columns 1-10), see seat availability states (Available/Selected/Occupied), select seats with real-time price calculation (Standard: 50,000 VND, VIP: 80,000 VND), and initiate booking through a button that enables when seats are selected. The interface will be built with Next.js 14, TypeScript, Tailwind CSS, and Zustand for state management, following mobile-first responsive design principles.

## Technical Context

**Language/Version**: TypeScript 5+ with strict mode enabled
**Primary Dependencies**: Next.js 14 (App Router), Zustand 4+, Tailwind CSS 3+, Lucide React
**Storage**: Client-side state only (Zustand), no backend persistence for MVP
**Testing**: Manual testing on mobile and desktop devices, Playwright for critical user flows (optional)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge) - desktop and mobile (375px minimum viewport)
**Project Type**: Single web application (Next.js)
**Performance Goals**:
- Seat selection/deselection response within 100ms
- Smooth transitions at 60fps
- Bundle size under 250KB gzipped (initial load)
- Support up to 60 simultaneous seat selections without performance degradation
**Constraints**:
- No user authentication required (MVP)
- No backend API integration (mock data only)
- No persistence across page refreshes
- Vietnamese currency formatting (VND with 000 separators)
- Touch targets minimum 44×44px on mobile
**Scale/Scope**:
- Single movie showing (no date/time selection)
- 60 seats total (40 Standard, 20 VIP)
- Maximum price: 3,600,000 VND (all seats selected)
- 2-page flow: Home → Seat Selection

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with principles from `.specify/memory/constitution.md`:

- [x] **TypeScript-First**: All code uses TypeScript with strict mode enabled
- [x] **Clean Architecture**: Clear separation of UI, hooks, stores, and utilities
- [x] **Component-Driven UI**: UI built from atomic, reusable components
- [x] **State Management**: Zustand used for global state (no prop drilling)
- [x] **UX First**: Visual feedback, loading states, and keyboard navigation planned
- [x] **Performance**: Bundle size under 250KB gzipped, lazy loading planned
- [x] **Mobile-First**: Responsive design with 375px minimum viewport tested
- [x] **Technology Stack**: Using approved stack (Next.js 14, Tailwind, Lucide React, Zustand)
- [ ] **Issue Tracking**: Beads epic created and linked to spec (TODO: Create epic with `/specledger.tasks`)

**Complexity Violations** (if any, justify in Complexity Tracking table below):
- None identified - Feature aligns with all constitution principles

## Project Structure

### Documentation (this feature)

```text
specs/001-seat-selection/
├── plan.md              # This file (/specledger.plan command output)
├── research.md          # Phase 0 output (/specledger.plan command)
├── data-model.md        # Phase 1 output (/specledger.plan command)
├── quickstart.md        # Phase 1 output (/specledger.plan command)
├── contracts/           # Phase 1 output (/specledger.plan command)
│   └── seat-selection-types.ts  # TypeScript type definitions
└── tasks.md             # Phase 2 output (/specledger.tasks command - NOT created by /specledger.plan)
```

### Source Code (repository root)

```text
app/                          # Next.js 14 App Router
├── seat-selection/           # Seat selection route
│   ├── page.tsx             # Seat selection page (main UI)
│   └── layout.tsx           # Layout for seat selection section
├── layout.tsx               # Root layout
├── page.tsx                 # Home page (movie list/landing)
└── globals.css              # Global styles

components/                   # React components (organized by feature)
├── ui/                      # Atomic UI components
│   ├── Button.tsx           # Reusable button component
│   ├── Badge.tsx            # Price/status badge component
│   └── Screen.tsx           # Movie screen visual component
├── seat-selection/          # Seat selection feature components
│   ├── SeatGrid.tsx         # Grid container for seats
│   ├── Seat.tsx             # Individual seat component
│   ├── SeatLegend.tsx       # Legend (Available/Selected/Occupied)
│   ├── SelectionBar.tsx     # Bottom bar with selection summary
│   └── BookingButton.tsx    # Book ticket button with state

lib/                          # Utility libraries
├── stores/                  # Zustand stores
│   ├── useSeatStore.ts      # Main seat selection store
│   └── useBookingStore.ts   # Booking session store (future use)
├── hooks/                   # Custom React hooks
│   ├── useSeatSelection.ts  # Hook for seat selection logic
│   ├── useKeyboardNavigation.ts  # Keyboard navigation for seats
│   └── useMediaQuery.ts     # Responsive breakpoint detection
├── utils/                   # Utility functions
│   ├── pricing.ts           # Price calculation utilities
│   ├── currency.ts          # Vietnamese currency formatting
│   └── seat.ts              # Seat identifier parsing/formatting
└── constants/               # Application constants
    ├── seats.ts             # Seat layout configuration
    └── pricing.ts           # Standard/VIP pricing constants

types/                        # TypeScript type definitions
├── seat.ts                  # Seat entity types
├── booking.ts               # Booking session types
└── movie.ts                 # Movie data types (mock)

public/                       # Static assets
└── images/                  # Movie images (if needed)
```

**Structure Decision**: Next.js 14 App Router with feature-based organization. Seat selection is a dedicated route under `/seat-selection`. Components organized by domain with atomic UI components separated for reusability. Zustand stores in `lib/stores/` manage seat state. Custom hooks encapsulate business logic. Utilities handle pricing, currency formatting, and seat identifier logic.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity violations - Feature follows all constitution principles with a straightforward implementation approach.
