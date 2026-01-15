<!--
Sync Impact Report:
Version: 1.0.0 (initial ratification)
Modified Principles: N/A (initial version)
Added Sections: All sections (initial version)
Removed Sections: N/A (initial version)
Templates Requiring Updates:
  ✅ plan-template.md - Reviewed, aligned with principles
  ✅ spec-template.md - Reviewed, aligned with principles
  ✅ tasks-template.md - Reviewed, aligned with principles
Follow-up TODOs: None
-->

# Movie Seat Booking MVP Constitution

## Core Principles

### I. TypeScript-First Development

All code MUST be written in TypeScript with strict type checking enabled. Types provide compile-time safety, improve developer experience, and serve as inline documentation.

- **MUST**: Enable `strict: true` in `tsconfig.json`
- **MUST**: Avoid `any` types - use `unknown` with type guards if type is truly unknown
- **MUST**: Type all function parameters, return values, and component props
- **SHOULD**: Leverage TypeScript's type inference for readability but never compromise type safety
- **MUST**: Fix all TypeScript errors before committing code

**Rationale**: Strong typing prevents entire classes of runtime errors, improves refactoring confidence, and makes the codebase more maintainable as the project grows.

### II. Clean Architecture

Code MUST follow clean architecture principles with clear separation of concerns. Business logic MUST be independent of UI frameworks and external dependencies.

- **MUST**: Separate state management (Zustand stores) from UI components
- **MUST**: Keep components pure - no business logic in React components
- **MUST**: Use custom hooks for reusable stateful logic
- **SHOULD**: Organize code by feature/domain, not by file type
- **MUST**: Maintain clear dependency direction: UI → Hooks → Stores → Utilities

**Rationale**: Clean architecture makes code testable, reusable, and easy to refactor. It prevents tight coupling between UI and business logic.

### III. Component-Driven UI

UI MUST be built from small, reusable, composable components following atomic design principles.

- **MUST**: Build UI from atomic components (Button, Badge, Seat, etc.)
- **MUST**: Each component MUST have a single, clear responsibility
- **SHOULD**: Use Lucide React icons consistently (no custom SVG icons)
- **MUST**: Make components reusable through props, not duplication
- **SHOULD**: Keep component files focused - one primary export per file
- **MUST**: Use Tailwind CSS for all styling (no custom CSS unless absolutely necessary)

**Rationale**: Component-driven development creates consistent UI, reduces code duplication, and makes the application easier to maintain and scale.

### IV. State Management with Zustand

Global state MUST be managed using Zustand. Zustand stores provide a simple, performant way to manage application state without the complexity of Redux.

- **MUST**: Create focused stores for specific domains (e.g., `useSeatStore`, `useBookingStore`)
- **MUST**: Keep stores small and focused - split if they grow beyond 5-6 key actions
- **SHOULD**: Use Zustand's devtools middleware for debugging
- **MUST**: Avoid prop drilling - use stores for shared state
- **SHOULD**: Prefer Zustand's shallow comparison for performance optimization

**Rationale**: Zustand provides the right balance of simplicity and power for a Next.js application. It avoids the boilerplate of Redux while providing excellent TypeScript support.

### V. User Experience First

User experience MUST drive technical decisions. The application MUST feel responsive, intuitive, and accessible.

- **MUST**: Provide immediate visual feedback for all user interactions (hover states, selection indicators)
- **SHOULD**: Use optimistic UI updates where appropriate (e.g., instant seat selection)
- **MUST**: Handle loading states gracefully (skeleton screens, progress indicators)
- **SHOULD**: Implement smooth transitions and animations (60fps target)
- **MUST**: Ensure keyboard navigation works for all core functionality
- **SHOULD**: Provide clear error messages with actionable next steps

**Rationale**: Great UX drives user adoption. A booking system must be intuitive and responsive to prevent user frustration and abandoned bookings.

### VI. Performance Awareness

Performance MUST be considered from the start, not added as an afterthought.

- **SHOULD**: Use React.memo() for expensive pure components
- **SHOULD**: Implement virtualization for long lists (if applicable)
- **MUST**: Optimize images (WebP format, lazy loading, responsive sizes)
- **SHOULD**: Use dynamic imports for code splitting
- **MUST**: Keep bundle size under 250KB gzipped (initial load)
- **SHOULD**: Use Next.js 14 App Router optimizations (streaming, partial rendering)

**Rationale**: Performance directly impacts user experience and SEO. A fast-loading booking system reduces bounce rates and improves conversion.

### VII. Mobile-First Responsive Design

The application MUST work seamlessly on all device sizes, from mobile phones to large desktop screens.

- **MUST**: Design for mobile first, then enhance for larger screens
- **MUST**: Test all user flows on mobile viewport (375px width minimum)
- **SHOULD**: Use Tailwind's responsive utilities (`sm:`, `md:`, `lg:`, `xl:`)
- **MUST**: Ensure touch targets are at least 44x44px on mobile
- **SHOULD**: Test on actual devices, not just browser devTools

**Rationale**: Many users will book tickets on mobile devices. A poor mobile experience directly impacts revenue.

## Technology Standards

### Approved Technology Stack

The following technologies are approved for this project:

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5+ with strict mode
- **Styling**: Tailwind CSS 3+
- **Icons**: Lucide React (no other icon libraries)
- **State Management**: Zustand (no Redux, Context API, or other state libraries)
- **Component Library**: Custom components built with Tailwind (no Material UI, Chakra UI, etc.)
- **Form Validation**: React Hook Form (if forms are needed)
- **Data Fetching**: Next.js built-in fetch or native fetch API

### Technology Constraints

- **MUST NOT**: Add new dependencies without justification
- **MUST NOT**: Use alternative icon libraries (FontAwesome, Heroicons as SVG, etc.)
- **MUST NOT**: Replace Zustand with other state management solutions
- **MUST NOT**: Use CSS-in-JS libraries (styled-components, emotion, etc.)
- **MUST NOT**: Migrate away from Next.js 14 App Router

**Rationale**: A constrained, opinionated stack reduces decision fatigue, improves code consistency, and makes onboarding easier.

## Code Quality Standards

### Linting and Formatting

- **MUST**: Use ESLint with Next.js recommended config
- **MUST**: Use Prettier for consistent code formatting
- **MUST**: Configure pre-commit hooks to run linting (husky + lint-staged)
- **SHOULD**: Fix all linting errors before committing

### Code Review Standards

All code changes MUST be reviewed before merging:

- **MUST**: Have at least one reviewer approval
- **MUST**: Pass all automated checks (lint, type check, tests)
- **SHOULD**: Have clear, descriptive pull request descriptions
- **MUST**: Keep PRs small and focused (one feature or bug fix per PR)
- **SHOULD**: Request review from the most knowledgeable team member for the code being changed

### Testing Philosophy

- **SHOULD**: Write unit tests for complex business logic
- **SHOULD**: Write integration tests for critical user flows (seat selection, booking)
- **MUST**: Test on actual devices (mobile and desktop)
- **SHOULD**: Use Playwright for end-to-end testing of critical paths
- **MUST NOT**: sacrifice development speed for 100% test coverage (this is an MVP)

**Rationale**: For an MVP, practical testing provides the best balance of quality and speed. Focus testing on high-value, high-risk areas.

## Development Workflow

### Feature Development

1. **Specification First**: Every feature MUST start with a spec in `/specs/[feature-name]/spec.md`
2. **Planning**: Create an implementation plan using `/specledger.plan`
3. **Task Breakdown**: Generate tasks with `/specledger.tasks`
4. **Implementation**: Build feature following the task list
5. **Testing**: Test the feature manually and with automated tests
6. **Review**: Submit PR for code review
7. **Merge**: Merge after approval and all checks pass

### Branch Strategy

- **main**: Production-ready code only
- **feature/**: Feature branches (e.g., `feature/seat-selection`)
- **fix/**: Bug fix branches (e.g., `fix/seat-availability-bug`)
- **chore/**: Maintenance tasks (e.g., `chore/upgrade-dependencies`)

### Git Commit Conventions

Follow conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring (no functional change)
- `style:` - Code style changes (formatting, etc.)
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples**:
- `feat: add seat selection with price calculation`
- `fix: prevent double-booking of seats`
- `refactor: extract seat logic to custom hook`

## Governance

### Constitution Authority

This constitution is the authoritative source of truth for development practices. If a practice contradicts this constitution, the constitution takes precedence.

### Amendment Process

Constitution amendments require:

1. **Proposal**: Document the proposed change with rationale
2. **Review**: Team review and discussion
3. **Approval**: Majority approval from core contributors
4. **Migration**: Update all dependent templates and documentation
5. **Version Bump**: Increment constitution version (semantic versioning)
6. **Communication**: Announce changes to all contributors

### Compliance

- **MUST**: All code reviews MUST check constitution compliance
- **SHOULD**: Raise violations during review
- **MUST**: Fix or explicitly justify any constitution violations

### Complexity Review

If a feature requires deviating from constitution principles:

1. **MUST**: Document the deviation in the implementation plan
2. **MUST**: Provide clear justification for why the deviation is necessary
3. **MUST**: Get explicit approval before proceeding
4. **SHOULD**: Re-evaluate the principle if deviations become common

**Rationale**: Principles should guide decisions, not constrain them. Exceptions are allowed but must be intentional and justified.

---

**Version**: 1.0.0 | **Ratified**: 2026-01-15 | **Last Amended**: 2026-01-15
