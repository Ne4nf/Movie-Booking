# Research: Seat Selection Interface (MVP)

**Feature**: 001-seat-selection
**Date**: 2026-01-15
**Status**: Complete

## Prior Work

No previous related features or tasks found in the codebase. This is the first feature for the Movie Seat Booking MVP.

## Technology Decisions

### 1. State Management with Zustand

**Decision**: Use Zustand for seat selection state management

**Rationale**:
- **Simplicity**: Zustand provides a minimal API (store, actions, selectors) without Redux's boilerplate
- **TypeScript Support**: Excellent TypeScript inference with strict typing out of the box
- **Performance**: Built-in optimization with shallow comparison to prevent unnecessary re-renders
- **DevTools**: Middleware for Redux DevTools integration for debugging seat state changes
- **No Provider Hell**: Unlike Context API, Zustand doesn't require wrapping components in providers

**Alternatives Considered**:
- **Redux Toolkit**: More boilerplate, overkill for single-feature state management
- **Context API**: Prop drilling issues, performance problems with frequent updates (seat selection/deselection)
- **Jotai/Recoil**: Similar benefits but Zustand has better community traction and documentation

**Best Practices**:
- Keep store focused on single domain (seat selection)
- Use `shallow` comparison for array selectors (selectedSeats array)
- Split store if it grows beyond 5-6 actions (not expected for MVP)
- Enable devtools middleware in development only

### 2. Seat Grid Layout with CSS Grid

**Decision**: Use CSS Grid for seat layout (via Tailwind CSS)

**Rationale**:
- **2D Layout**: CSS Grid is designed for 2-dimensional layouts (rows × columns)
- **Responsive**: Easy to adjust grid columns for different screen sizes with Tailwind's `grid-cols-*`
- **Accessibility**: Grid provides semantic structure for screen readers
- **Performance**: Hardware-accelerated layout, better than absolute positioning

**Alternatives Considered**:
- **Flexbox**: Better for 1D layouts, requires manual row management for 6×10 grid
- **Absolute Positioning**: Not responsive, harder to maintain, poor accessibility
- **Canvas/WebGL**: Overkill, poor accessibility, harder to style with Tailwind

**Best Practices**:
- Use `grid-template-columns: repeat(10, minmax(0, 1fr))` for 10-column layout
- Add gap between seats for visual clarity (Tailwind `gap-2` or `gap-3`)
- Ensure seat squares maintain aspect ratio on mobile (44×44px minimum)
- Use `aspect-square` utility to keep seats square

### 3. Seat State Management

**Decision**: Three-state system (Available/Selected/Occupied) with TypeScript discriminated union

**Rationale**:
- **Type Safety**: Discriminated unions prevent invalid states at compile time
- **Clarity**: Explicit states make code self-documenting
- **Validation**: TypeScript exhaustiveness checking ensures all states handled

**Alternatives Considered**:
- **Boolean flags** (`isSelected`, `isOccupied`): Can have invalid states (both true)
- **Enum strings**: Less type-safe, runtime errors possible
- **Bit flags**: Over-optimization, hard to read

**Best Practices**:
```typescript
type SeatState = 'available' | 'selected' | 'occupied'

interface Seat {
  id: string              // e.g., "A1", "F10"
  row: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  column: number          // 1-10
  state: SeatState
  type: 'standard' | 'vip'
  price: number           // 50000 or 80000
}
```

### 4. Price Calculation Strategy

**Decision**: Calculate price on-demand using memoized selector

**Rationale**:
- **Single Source of Truth**: Price derived from selectedSeats array, no separate total state
- **Consistency**: Cannot have desync between selections and price
- **Performance**: Memoized selector only recalculates when selections change
- **Simplicity**: No need to manage separate price state updates

**Alternatives Considered**:
- **Incremental updates**: Add/subtract on each selection (error-prone, can desync)
- **Web Worker**: Overkill for simple arithmetic of 60 items max
- **Server-side**: Unnecessary for MVP, adds latency

**Best Practices**:
```typescript
// In Zustand store
const totalPrice = useSeatStore(
  useShallow((state) =>
    state.selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
  )
)
```

### 5. Keyboard Navigation

**Decision**: Implement arrow key navigation with Enter/Space to toggle

**Rationale**:
- **Accessibility**: Keyboard users cannot use mouse/touch
- **UX Pattern**: Arrow keys to navigate, Enter/Space to select is standard pattern
- **Screen Reader Support**: Focus management ensures announcements
- **Constitution Compliance**: Constitution requires keyboard navigation (UXR-003)

**Alternatives Considered**:
- **Tab-only navigation**: Requires 60 tab presses to traverse grid (poor UX)
- **Letter+Number shortcuts**: Confusing (e.g., "A" then "1" to select A1)
- **No keyboard support**: Violates constitution and accessibility standards

**Best Practices**:
- Use `useRef` to track focused seat index
- Arrow keys: Up/Down move rows, Left/Right move columns
- Wrap around edges (e.g., Right on column 10 → column 1 same row)
- Enter/Space toggles current seat
- Maintain visual focus indicator (outline/ring)

### 6. Mobile Responsiveness

**Decision**: Mobile-first with responsive breakpoints

**Rationale**:
- **Constitution Compliance**: Constitution requires 375px minimum viewport (MOB-001)
- **Touch Targets**: 44×44px minimum per constitution (MOB-003)
- **Layout**: Scrollable seat grid if needed, fixed bottom bar for visibility

**Alternatives Considered**:
- **Separate mobile view**: Code duplication, maintenance burden
- **Horizontal scrolling**: Poor UX, users miss seats to the right
- **Zoom/pinch**: Not user-friendly, hard to implement

**Best Practices**:
- Mobile-first CSS (write mobile styles first, use `md:`/`lg:` for larger screens)
- Test on actual device (375px width per constitution)
- Ensure seat grid scrolls vertically if needed on small screens
- Keep SelectionBar fixed at bottom (`fixed bottom-0` in Tailwind)
- Add padding below grid to prevent overlap with fixed bar

### 7. Vietnamese Currency Formatting

**Decision**: Use `Intl.NumberFormat` with 'vi-VN' locale

**Rationale**:
- **Built-in**: No external libraries needed
- **Correct**: Handles thousand separators (.), currency formatting
- **Locale-aware**: Respects Vietnamese conventions

**Alternatives Considered**:
- **Manual formatting** (`50000.toString() + ' VND'`): Error-prone, not localized
- **Currency libraries** (currency.js): Unnecessary dependency
- **No formatting** (`50000 VND`): Hard to read, unprofessional

**Best Practices**:
```typescript
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
  // Output: "50.000 ₫" or "50.000 VND"
}
```

### 8. Mock Data Strategy

**Decision**: Hardcoded seat configuration and occupied seats

**Rationale**:
- **MVP Scope**: No backend, no persistence needed
- **Simplicity**: Easy to demonstrate feature without data layer
- **Testability**: Deterministic state for testing

**Alternatives Considered**:
- **Random generation**: Harder to test, non-deterministic
- **JSON file**: Adds file I/O, minimal benefit
- **API mock**: Overkill for MVP, adds complexity

**Best Practices**:
```typescript
// lib/constants/seats.ts
export const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F'] as const
export const SEAT_COLUMNS = Array.from({ length: 10 }, (_, i) => i + 1)
export const OCCUPIED_SEATS = ['A3', 'B5', 'C7', 'D2', 'E8', 'F4'] // Mock data

export const INITIAL_SEATS: Seat[] = SEAT_ROWS.flatMap((row) =>
  SEAT_COLUMNS.map((column) => ({
    id: `${row}${column}`,
    row,
    column,
    state: OCCUPIED_SEATS.includes(`${row}${column}`) ? 'occupied' : 'available',
    type: row >= 'E' ? 'vip' : 'standard',
    price: row >= 'E' ? 80000 : 50000,
  }))
)
```

### 9. Performance Optimization

**Decision**: React.memo for Seat component, shallow comparison for selections

**Rationale**:
- **60 Components**: 60 Seat components can cause cascade re-renders
- **Memoization**: Prevent re-renders of unchanged seats when one seat toggles
- **Shallow Comparison**: Zustand's `shallow` prevents selector re-runs

**Alternatives Considered**:
- **Virtualization**: Overkill for 60 items (react-window benefits start at 100+)
- **Web Workers**: Unnecessary for client-side calculations
- **No optimization**: Potential lag on low-end devices

**Best Practices**:
```typescript
// components/seat-selection/Seat.tsx
export const Seat = React.memo(({ seat, onSelect }: SeatProps) => {
  // ...
}, (prev, next) => prev.seat.state === next.seat.state)

// In store
useShallow((state) => state.selectedSeats)
```

### 10. Color Scheme for Seat States

**Decision**: Gray (Available), Green (Selected), Red (Occupied)

**Rationale**:
- **Standard Convention**: Green = positive action, Red = forbidden, Gray = neutral
- **Accessibility**: High contrast ratios for color blindness
- **Intuitive**: Users immediately understand meaning

**Alternatives Considered**:
- **Blue/Orange/Purple**: Less intuitive, need legend
- **Icons Only**: Not as scannable, harder to see at glance
- **Patterns (stripes/dots)**: Harder to implement, less clean

**Best Practices**:
- Use Tailwind colors: `bg-gray-300` (available), `bg-green-500` (selected), `bg-red-500` (occupied)
- Add hover states: `hover:bg-gray-400` for available seats
- Add focus states: `focus:ring-2 focus:ring-blue-500` for keyboard navigation
- Consider dark mode: Ensure contrast ratios meet WCAG AA (4.5:1 minimum)

## Dependencies

### Required Packages (from Constitution)

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "zustand": "^4.0.0",
  "lucide-react": "^0.300.0"
}
```

### Optional Packages

```json
{
  "clsx": "^2.0.0",           // Conditional class names (or use cn() utility)
  "@radix-ui/react-slot": "^1.0.0"  // For accessible button composition (optional)
}
```

## Open Questions Resolved

All technical clarifications from the plan have been resolved through research:

- ✅ State management approach: Zustand with focused store
- ✅ Grid layout: CSS Grid via Tailwind
- ✅ Seat state: Discriminated union TypeScript types
- ✅ Price calculation: Memoized selector
- ✅ Keyboard navigation: Arrow keys + Enter/Space
- ✅ Mobile responsiveness: Mobile-first with 375px minimum
- ✅ Currency formatting: Intl.NumberFormat with 'vi-VN'
- ✅ Mock data: Hardcoded constants
- ✅ Performance: React.memo + shallow comparison
- ✅ Color scheme: Gray/Green/Red with accessibility considerations

## References

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid)
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Intl.NumberFormat - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
