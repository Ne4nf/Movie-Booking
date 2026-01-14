# Data Model: Seat Selection Interface (MVP)

**Feature**: 001-seat-selection
**Date**: 2026-01-15
**Status**: Complete

## Entity Definitions

### Seat

Represents a single theater seat with its state, type, and pricing.

**Fields**:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `id` | `string` | Unique seat identifier (e.g., "A1", "F10") | Format: `{ROW}{COLUMN}` |
| `row` | `'A' \| 'B' \| 'C' \| 'D' \| 'E' \| 'F'` | Row identifier | One of 6 rows |
| `column` | `number` | Column number (1-10) | Range: 1-10 |
| `state` | `SeatState` | Current availability status | One of: available, selected, occupied |
| `type` | `SeatType` | Pricing tier | One of: standard, vip |
| `price` | `number` | Seat price in VND | 50000 (standard) or 80000 (vip) |

**Validation Rules**:
- `id` must match pattern: /^[A-F][1-9]|10$/ (e.g., "A1", "C10", "F5")
- `row` determines `type`: rows A-D = standard, rows E-F = VIP
- `price` must match `type`: standard = 50000, vip = 80000
- `state` transitions: `available ↔ selected` (bidirectional), `occupied` (terminal state)

**State Transition Diagram**:

```
    ┌─────────────┐
    │  Available  │◄─────┐
    └─────────────┘      │
          │  (user)      │ (user)
          │ click        │ click
          ▼              │
    ┌─────────────┐      │
    │   Selected  │──────┘
    └─────────────┘

    ┌─────────────┐
    │  Occupied   │ (terminal - no transitions out)
    └─────────────┘
```

### Booking Session

Represents the current user's seat selection session (not persisted in MVP).

**Fields**:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `selectedSeats` | `Seat[]` | Array of selected seat objects | Max 60 seats |
| `totalPrice` | `number` | Calculated total price | Read-only, derived from selectedSeats |
| `seatCount` | `number` | Number of selected seats | Read-only, derived from selectedSeats |

**Validation Rules**:
- `selectedSeats` cannot contain duplicate seat IDs
- `selectedSeats` cannot contain seats with `state: 'occupied'`
- `totalPrice` = sum of all `selectedSeats[i].price`
- `seatCount` = `selectedSeats.length`

**Derived Fields** (computed, not stored):
- `totalPrice`: `selectedSeats.reduce((sum, seat) => sum + seat.price, 0)`
- `seatCount`: `selectedSeats.length`

### Movie (Mock Data)

Represents the movie for which seats are being selected (hardcoded for MVP).

**Fields**:

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `id` | `string` | Movie identifier | "avengers-001" (mock) |
| `title` | `string` | Movie title | "Avengers" (mock) |
| `duration` | `number` | Duration in minutes | 142 (mock, not displayed) |

**Note**: This is mock data for MVP. No movie selection or search functionality.

## Type Definitions

### SeatState

```typescript
type SeatState = 'available' | 'selected' | 'occupied'
```

**Possible Values**:
- `available`: Seat can be selected (gray)
- `selected`: Seat is currently selected by user (green)
- `occupied`: Seat is already booked (red, non-interactive)

### SeatType

```typescript
type SeatType = 'standard' | 'vip'
```

**Possible Values**:
- `standard`: Regular pricing (rows A-D, 50,000 VND)
- `vip`: Premium pricing (rows E-F, 80,000 VND)

**Price Mapping**:
```typescript
const SEAT_PRICES: Record<SeatType, number> = {
  standard: 50000,
  vip: 80000,
}
```

### SeatIdentifier

```typescript
type SeatIdentifier = `${SeatRow}${SeatColumn}`
```

Where:
- `SeatRow = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'`
- `SeatColumn = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10`

**Examples**: "A1", "C10", "F5", "E3"

## Relationships

### Seat → Booking Session

**Relationship Type**: Composition

- A `BookingSession` contains zero or more `Seat` objects
- `BookingSession.selectedSeats` is an array of `Seat` references
- When a `Seat` is selected, it's added to `BookingSession.selectedSeats`
- When a `Seat` is deselected, it's removed from `BookingSession.selectedSeats`

**Constraints**:
- No duplicate seats in `BookingSession.selectedSeats`
- `BookingSession` cannot contain occupied seats
- Max 60 seats per booking session

### Seat → SeatType

**Relationship Type**: Attribute

- Each `Seat` has exactly one `SeatType`
- `SeatType` is determined by `Seat.row`
- Rows A-D = standard, Rows E-F = VIP

**Logic**:
```typescript
const getSeatType = (row: SeatRow): SeatType => {
  return row >= 'E' ? 'vip' : 'standard'
}
```

## Store Schema (Zustand)

### useSeatStore

```typescript
interface SeatStore {
  // State
  seats: Seat[]                    // All 60 seats with current states
  selectedSeats: Seat[]            // Array of selected seats

  // Actions
  toggleSeat: (seatId: string) => void
  selectSeat: (seatId: string) => void
  deselectSeat: (seatId: string) => void
  clearSelection: () => void

  // Selectors (computed)
  getTotalPrice: () => number
  getSelectedSeatCount: () => number
  getSeatById: (seatId: string) => Seat | undefined
  getSelectedSeatIds: () => string[]
}
```

**Action Definitions**:

- `toggleSeat(seatId)`: Toggle seat between available and selected (if not occupied)
- `selectSeat(seatId)`: Add seat to selectedSeats (if available)
- `deselectSeat(seatId)`: Remove seat from selectedSeats
- `clearSelection()`: Deselect all seats (reset to available)

**Selector Definitions**:

- `getTotalPrice()`: Returns sum of selected seat prices
- `getSelectedSeatCount()`: Returns number of selected seats
- `getSeatById(seatId)`: Returns seat object or undefined
- `getSelectedSeatIds()`: Returns array of selected seat IDs (e.g., ["A1", "C5", "E3"])

## Data Initialization

### Initial Seat Configuration

```typescript
const SEAT_ROWS: SeatRow[] = ['A', 'B', 'C', 'D', 'E', 'F']
const SEAT_COLUMNS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const OCCUPIED_SEATS: SeatIdentifier[] = ['A3', 'B5', 'C7', 'D2', 'E8', 'F4'] // Mock

const createInitialSeats = (): Seat[] => {
  return SEAT_ROWS.flatMap((row) =>
    SEAT_COLUMNS.map((column) => {
      const id: SeatIdentifier = `${row}${column}`
      const type: SeatType = row >= 'E' ? 'vip' : 'standard'
      const price: number = SEAT_PRICES[type]
      const state: SeatState = OCCUPIED_SEATS.includes(id) ? 'occupied' : 'available'

      return { id, row, column, state, type, price }
    })
  )
}
```

**Output**: Array of 60 `Seat` objects

## Validation Summary

### Business Rules

1. **Occupied Seats**: Cannot be selected, clicking has no effect
2. **Selection Limit**: No maximum (can select all available seats)
3. **Deselection**: Selected seats can be deselected by clicking again
4. **Price Accuracy**: Total price must equal sum of selected seat prices
5. **Uniqueness**: Cannot select the same seat twice

### Data Integrity

- All seats have unique IDs
- Seat IDs follow format: `{ROW}{COLUMN}` (e.g., "A1", "F10")
- Seat prices match seat type (standard: 50000, vip: 80000)
- No seats in invalid states (only: available, selected, occupied)

### Example Scenarios

**Scenario 1: Select Standard Seat**
- Initial: Seat A1 is `available`
- Action: User clicks A1
- Result: A1 state = `selected`, added to `selectedSeats`, `totalPrice` += 50000

**Scenario 2: Select VIP Seat**
- Initial: Seat E1 is `available`
- Action: User clicks E1
- Result: E1 state = `selected`, added to `selectedSeats`, `totalPrice` += 80000

**Scenario 3: Try to Select Occupied Seat**
- Initial: Seat A3 is `occupied` (mock data)
- Action: User clicks A3
- Result: No change, A3 remains `occupied`, not added to `selectedSeats`

**Scenario 4: Deselect Seat**
- Initial: Seat A1 is `selected`
- Action: User clicks A1 again
- Result: A1 state = `available`, removed from `selectedSeats`, `totalPrice` -= 50000

**Scenario 5: Mixed Selection**
- Selected: A1 (standard), C5 (standard), E3 (vip)
- Result: `selectedSeats.length` = 3, `totalPrice` = 50000 + 50000 + 80000 = 180000
