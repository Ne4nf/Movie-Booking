# Tasks Index: Seat Selection Interface (MVP)

Beads Issue Graph Index into the tasks and phases for this feature implementation.
This index does **not contain tasks directly**—those are fully managed through Beads CLI.

## Feature Tracking

* **Beads Epic ID**: `sl-cs2` (Seat Selection Interface (MVP))
* **User Stories Source**: `specs/001-seat-selection/spec.md`
* **Research Inputs**: `specs/001-seat-selection/research.md`
* **Planning Details**: `specs/001-seat-selection/plan.md`
* **Data Model**: `specs/001-seat-selection/data-model.md`
* **Contract Definitions**: `specs/001-seat-selection/contracts/`

## Beads Query Hints

Use the `bd` CLI to query and manipulate the issue graph:

```bash
# Find all open tasks for this feature
bd list --label "spec:001-seat-selection" --status open --limit 10

# Find ready tasks to implement
bd ready --label "spec:001-seat-selection" --limit 5

# See dependencies for issue
bd dep tree sl-cs2

# View issues by component
bd list --label 'component:ui' --label 'spec:001-seat-selection' --limit 5

# View issues by phase
bd list --label 'phase:setup' --label 'spec:001-seat-selection'
bd list --label 'phase:foundational' --label 'spec:001-seat-selection'
bd list --label 'phase:us1' --label 'spec:001-seat-selection'

# Define dependencies
# valid dependency-types: (blocks|related|parent-child|discovered-from) (default "blocks")
bd dep add [from-issue-id] [to-issue-id] --type [dependency-type]

# Show all phases
bd list --type feature --label 'spec:001-seat-selection'
```

## Tasks and Phases Structure

This feature follows Beads' 2-level graph structure:

* **Epic**: sl-cs2 → represents the whole feature
* **Phases**: Beads issues of type `feature`, child of the epic
  * Phase = a user story group or technical milestone (e.g., setup, foundational, us1, us2, polish)
* **Tasks**: Issues of type `task`, children of each feature issue (phase)

## Convention Summary

| Type    | Description                  | Labels                                 |
| ------- | ---------------------------- | -------------------------------------- |
| epic    | Full feature epic            | `spec:001-seat-selection`              |
| feature | Implementation phase / story | `phase:<name>`, `story:US1`            |
| task    | Implementation task          | `component:<x>`, `fr:<id>`             |

## Agent Execution Flow

MCP agents and AI workflows should:

1. **Assume `bd init` already done** by `specify init`
2. **Use `bd create`** to directly generate Beads issues
3. **Set metadata and dependencies** in the graph, not markdown
4. **Use this markdown only as a navigational anchor**

> Agents MUST NOT output tasks into this file. They MUST use Beads CLI to record all task and phase structure.

## Example Queries for Agents

```bash
# Get all tasks in tree structure for the feature
bd dep tree --reverse sl-cs2

# Get all tasks by phase
bd list --label "phase:setup" --label "spec:001-seat-selection"
bd list --label "phase:foundational" --label "spec:001-seat-selection"
bd list --label "phase:us1" --label "spec:001-seat-selection"
bd list --label "phase:us2" --label "spec:001-seat-selection"
bd list --label "phase:polish" --label "spec:001-seat-selection"

# Get tasks by story
bd list --label "story:US1" --label "spec:001-seat-selection"
bd list --label "story:US2" --label "spec:001-seat-selection"

# Add a new task
bd create "Implement OAuth redirect handler" -t task --parent sl-cs2.1 --label "spec:001-seat-selection" --label "component:backend-services"

# Update notes on a task
bd update sl-cs2.3.2 --notes "Re-use helper functions from auth module"

# Add a comment to a task based on research or findings during implementation
bd comments add sl-cs2.3.2 "Additional research identified React.memo as best practice for Seat component"

# Mark task as completed with context
bd close sl-cs2.3.2 --reason "Completed with React.memo, custom comparison function for seat.state"

# or use update to set status and additional fields
bd update sl-cs2.3.2 --status closed --notes "Completed with React.memo, <100ms re-render time"
```

## Status Tracking

Status is tracked only in Beads:

* **Open** → default
* **In Progress** → task being worked on
* **Blocked** → dependency unresolved
* **Closed** → complete

Use `bd ready`, `bd blocked`, `bd stats` with appropriate filters to query progress.

---

# Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

**Feature Issue**: `sl-cs2.1` (Setup: Project Infrastructure)

**Tasks** (sl-cs2.1.x):

- [ ] sl-cs2.1.1 - Create Next.js 14 project
- [ ] sl-cs2.1.2 - Install Zustand and Lucide React
- [ ] sl-cs2.1.3 - Create folder structure
- [ ] sl-cs2.1.4 - Configure ESLint and Prettier
- [ ] sl-cs2.1.5 - Set up pre-commit hooks

---

# Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**Feature Issue**: `sl-cs2.2` (Foundational: Core Infrastructure)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Tasks** (sl-cs2.2.x):

- [ ] sl-cs2.2.1 - Copy type definitions
- [ ] sl-cs2.2.2 - Create seat constants
- [ ] sl-cs2.2.3 - Create currency utility
- [ ] sl-cs2.2.4 - Create Zustand store

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

# Phase 3: User Story 1 - View and Select Seats (Priority: P1) 🎯 MVP

**Purpose**: Implement core seat selection functionality (primary MVP)

**Goal**: Deliver complete, independently testable seat selection interface

**Independent Test**: Users can load page, view 60-seat grid, click to select/deselect seats, see price updates, click Book button

**Feature Issue**: `sl-cs2.3` (User Story 1: View and Select Seats)

**Tasks** (sl-cs2.3.x):

- [ ] sl-cs2.3.1 - Create atomic Button component
- [ ] sl-cs2.3.2 - Create Seat component
- [ ] sl-cs2.3.3 - Create Screen visual component
- [ ] sl-cs2.3.4 - Create SeatGrid component
- [ ] sl-cs2.3.5 - Create SelectionBar component
- [ ] sl-cs2.3.6 - Create BookingButton component
- [ ] sl-cs2.3.7 - Create seat selection page

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. **This IS the MVP!**

---

# Phase 4: User Story 2 - Understand Seat Availability (Priority: P2)

**Purpose**: Enhance visual clarity of seat availability (UX improvement)

**Goal**: Improve visual distinction between available and occupied seats

**Independent Test**: Users can easily distinguish available vs occupied seats at a glance

**Feature Issue**: `sl-cs2.4` (User Story 2: Understand Seat Availability)

**Tasks** (sl-cs2.4.x):

- [ ] sl-cs2.4.1 - Create SeatLegend component
- [ ] sl-cs2.4.2 - Add SeatLegend to page

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

# Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

**Feature Issue**: `sl-cs2.5` (Polish: Cross-Cutting Concerns)

**Tasks** (sl-cs2.5.x):

- [ ] sl-cs2.5.1 - Add React.memo to Seat component (performance)
- [ ] sl-cs2.5.2 - Implement arrow key navigation (accessibility)
- [ ] sl-cs2.5.3 - Accessibility audit (ARIA labels, semantic HTML)
- [ ] sl-cs2.5.4 - Cross-browser and device testing

**Checkpoint**: Feature PRODUCTION READY!

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational (Phase 2) - No dependencies on other stories
  - User Story 2 (P2): Can start after User Story 1 - enhances US1 with legend component
- **Polish (Phase 5)**: Depends on User Stories 1 and 2 being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after User Story 1 - Adds legend component to enhance clarity

### Within Each User Story

- Atomic components (Button, Badge, Screen) → Composite components (Seat, SeatGrid, SelectionBar) → Page integration
- Models before stores
- Stores before components
- Components before page
- Page complete before moving to next priority

---

## MVP Scope

**Recommended MVP**: User Story 1 (Phase 3) ONLY

**What you get**:
- Complete seat selection interface
- 60-seat grid with 3 states
- Real-time price calculation
- Book Ticket button with enable/disable logic
- Mobile responsive design
- Full user journey from viewing to booking initiation

**Estimated effort**: 7 tasks across 3 phases (Setup → Foundational → US1)

**Time to MVP**: After completing sl-cs2.1 (Setup), sl-cs2.2 (Foundational), and sl-cs2.3 (US1)

**Post-MVP** (optional enhancements):
- User Story 2 (SeatLegend component) - adds visual guide
- Polish phase (performance, accessibility, cross-browser testing)

---

## Parallel Execution Opportunities

### Within Setup Phase (sl-cs2.1)
These tasks can be done in parallel by different agents/people:
- sl-cs2.1.1 (Create Next.js project) **blocks** sl-cs2.1.2, sl-cs2.1.3
- sl-cs2.1.2 (Install dependencies) **after** sl-cs2.1.1
- sl-cs2.1.3 (Create folders) **after** sl-cs2.1.1
- sl-cs2.1.4 (Configure linting) **parallel with** sl-cs2.1.5
- sl-cs2.1.5 (Pre-commit hooks) **parallel with** sl-cs2.1.4

### Within Foundational Phase (sl-cs2.2)
- sl-cs2.2.1 (Copy types) **blocks** sl-cs2.2.2, sl-cs2.2.3, sl-cs2.2.4
- sl-cs2.2.2 (Constants) **parallel with** sl-cs2.2.3 (Currency)
- sl-cs2.2.4 (Store) **after** sl-cs2.2.1, sl-cs2.2.2, sl-cs2.2.3

### Within User Story 1 (sl-cs2.3)
- sl-cs2.3.1 (Button) **parallel with** sl-cs2.3.2 (Seat), sl-cs2.3.3 (Screen)
- sl-cs2.3.2 (Seat) **blocks** sl-cs2.3.4 (SeatGrid)
- sl-cs2.3.5 (SelectionBar) **parallel with** sl-cs2.3.6 (BookingButton)
- sl-cs2.3.7 (Page) **after** all other sl-cs2.3.x tasks

### Within Polish Phase (sl-cs2.5)
- sl-cs2.5.1 (React.memo) **parallel with** sl-cs2.5.2 (Keyboard nav)
- sl-cs2.5.3 (A11y audit) **parallel with** sl-cs2.5.4 (Testing)

---

## Summary

**Total Phases**: 5
**Total Features**: 5 (Setup, Foundational, US1, US2, Polish)
**Total Tasks**: 24 (approximate, check Beads for exact count)

**MVP Path**:
1. Complete Setup phase (sl-cs2.1.x) - 5 tasks
2. Complete Foundational phase (sl-cs2.2.x) - 4 tasks
3. Complete User Story 1 (sl-cs2.3.x) - 7 tasks
4. **MVP COMPLETE!** 🎉

**Full Feature Path**:
1-3. MVP path (above)
4. Complete User Story 2 (sl-cs2.4.x) - 2 tasks
5. Complete Polish phase (sl-cs2.5.x) - 4 tasks
6. **PRODUCTION READY!** 🚀

---

> This file is intentionally light and index-only. Implementation data lives in Beads. Update this file only to point humans and agents to canonical query paths and feature references.
