# Quickstart: Seat Selection Interface (MVP)

**Feature**: 001-seat-selection
**Last Updated**: 2026-01-15

This guide will help you quickly set up and run the Seat Selection Interface feature locally.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)
- (Optional) Mobile device or browser responsive mode for testing

## Setup Instructions

### 1. Install Dependencies

If this is a new project, initialize it:

```bash
# Create Next.js project (if not already created)
npx create-next-app@latest movie-booking --typescript --tailwind --app
cd movie-booking

# Install additional dependencies
npm install zustand lucide-react
```

For existing projects, just install dependencies:

```bash
npm install zustand lucide-react
```

### 2. Copy Type Definitions

Copy the type definitions from contracts to your project:

```bash
# Create types directory
mkdir -p types

# Copy type definitions
cp specs/001-seat-selection/contracts/seat-selection-types.ts types/seat.ts
```

### 3. Create Folder Structure

```bash
# Create component directories
mkdir -p components/ui
mkdir -p components/seat-selection

# Create library directories
mkdir -p lib/stores
mkdir -p lib/hooks
mkdir -p lib/utils
mkdir -p lib/constants

# Create app route
mkdir -p app/seat-selection
```

### 4. Configure TypeScript

Ensure `tsconfig.json` has strict mode enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Development Workflow

### Step 1: Create Constants

Create `lib/constants/seats.ts`:

```typescript
import { SEAT_ROWS, SEAT_COLUMNS, OCCUPIED_SEATS, SEAT_PRICES } from '@/types/seat'

export { SEAT_ROWS, SEAT_COLUMNS, OCCUPIED_SEATS, SEAT_PRICES }
```

### Step 2: Create Zustand Store

Create `lib/stores/useSeatStore.ts`:

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Seat, SeatStore, SeatIdentifier, SEAT_PRICES, OCCUPIED_SEATS } from '@/types/seat'

// Initial seats creation
const createInitialSeats = (): Seat[] => {
  return ['A', 'B', 'C', 'D', 'E', 'F' as const].flatMap((row) =>
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((column) => {
      const id: SeatIdentifier = `${row}${column}` as SeatIdentifier
      const type = row >= 'E' ? 'vip' : 'standard'
      const price = SEAT_PRICES[type]
      const state = OCCUPIED_SEATS.includes(id) ? 'occupied' : 'available'

      return { id, row: row as any, column, state, type, price }
    })
  )
}

export const useSeatStore = create<SeatStore>()(
  devtools(
    (set, get) => ({
      // State
      seats: createInitialSeats(),
      selectedSeats: [],

      // Actions
      toggleSeat: (seatId) => {
        const seat = get().seats.find((s) => s.id === seatId)
        if (!seat || seat.state === 'occupied') return

        set((state) => {
          const isSelected = state.selectedSeats.some((s) => s.id === seatId)

          if (isSelected) {
            // Deselect
            return {
              seats: state.seats.map((s) =>
                s.id === seatId ? { ...s, state: 'available' as const } : s
              ),
              selectedSeats: state.selectedSeats.filter((s) => s.id !== seatId),
            }
          } else {
            // Select
            return {
              seats: state.seats.map((s) =>
                s.id === seatId ? { ...s, state: 'selected' as const } : s
              ),
              selectedSeats: [...state.selectedSeats, { ...seat, state: 'selected' as const }],
            }
          }
        })
      },

      selectSeat: (seatId) => {
        const seat = get().seats.find((s) => s.id === seatId)
        if (!seat || seat.state !== 'available') return

        set((state) => ({
          seats: state.seats.map((s) =>
            s.id === seatId ? { ...s, state: 'selected' as const } : s
          ),
          selectedSeats: [...state.selectedSeats, { ...seat, state: 'selected' as const }],
        }))
      },

      deselectSeat: (seatId) => {
        set((state) => ({
          seats: state.seats.map((s) =>
            s.id === seatId ? { ...s, state: 'available' as const } : s
          ),
          selectedSeats: state.selectedSeats.filter((s) => s.id !== seatId),
        }))
      },

      clearSelection: () => {
        set((state) => ({
          seats: state.seats.map((s) =>
            s.state === 'selected' ? { ...s, state: 'available' as const } : s
          ),
          selectedSeats: [],
        }))
      },

      // Selectors
      getTotalPrice: () => {
        return get().selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
      },

      getSelectedSeatCount: () => {
        return get().selectedSeats.length
      },

      getSeatById: (seatId) => {
        return get().seats.find((s) => s.id === seatId)
      },

      getSelectedSeatIds: () => {
        return get().selectedSeats.map((s) => s.id)
      },
    }),
    { name: 'SeatStore' }
  )
)
```

### Step 5: Create Utility Functions

Create `lib/utils/currency.ts`:

```typescript
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
```

### Step 6: Create Components

Create atomic UI components (examples):

**`components/ui/Button.tsx`**:
```typescript
export const Button = ({ children, disabled, onClick }: any) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
  >
    {children}
  </button>
)
```

**`components/seat-selection/Seat.tsx`**:
```typescript
import { Seat as SeatType } from '@/types/seat'

interface SeatProps {
  seat: SeatType
  onSelect: (id: string) => void
}

export const Seat = ({ seat, onSelect }: SeatProps) => {
  const getColor = () => {
    if (seat.state === 'occupied') return 'bg-red-500 cursor-not-allowed'
    if (seat.state === 'selected') return 'bg-green-500'
    return 'bg-gray-300 hover:bg-gray-400 cursor-pointer'
  }

  return (
    <button
      onClick={() => onSelect(seat.id)}
      disabled={seat.state === 'occupied'}
      className={`
        w-10 h-10 sm:w-12 sm:h-12
        ${getColor()}
        rounded
        transition-colors
        focus:ring-2 focus:ring-blue-500
      `}
      aria-label={`Seat ${seat.id}, ${seat.state}`}
    >
      {seat.id}
    </button>
  )
}
```

### Step 7: Create Page

Create `app/seat-selection/page.tsx`:

```typescript
'use client'

import { useSeatStore } from '@/lib/stores/useSeatStore'
import { Seat } from '@/components/seat-selection/Seat'
import { formatPrice } from '@/lib/utils/currency'

export default function SeatSelectionPage() {
  const { seats, selectedSeats, toggleSeat, getTotalPrice } = useSeatStore()

  const totalPrice = getTotalPrice()
  const selectedSeatIds = selectedSeats.map((s) => s.id).sort().join(', ')

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Avengers - Select Seats</h1>

      {/* Screen visual */}
      <div className="mb-8">
        <div className="w-3/4 h-2 bg-blue-500 mx-auto rounded-full" />
        <p className="text-center text-sm text-gray-600 mt-2">Screen</p>
      </div>

      {/* Seat grid */}
      <div className="grid grid-cols-10 gap-2 max-w-4xl mx-auto mb-24">
        {seats.map((seat) => (
          <Seat key={seat.id} seat={seat} onSelect={toggleSeat} />
        ))}
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Selected: {selectedSeatIds || 'None'}</p>
            <p className="text-xl font-bold">{formatPrice(totalPrice)}</p>
          </div>
          <button
            disabled={selectedSeats.length === 0}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          >
            Book Ticket
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Step 8: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/seat-selection` to see the seat selection interface.

## Testing Checklist

### Manual Testing

- [ ] Page loads without errors
- [ ] All 60 seats displayed (6 rows × 10 columns)
- [ ] Occupied seats (red) cannot be selected
- [ ] Available seats (gray) turn green when clicked
- [ ] Selected seats turn back to gray when clicked again
- [ ] Bottom bar shows selected seat IDs
- [ ] Total price updates correctly
- [ ] Book button disabled when no seats selected
- [ ] Book button enabled when seats selected
- [ ] Price is correct (Standard: 50,000 VND, VIP: 80,000 VND)

### Mobile Testing

- [ ] Test on mobile viewport (375px width)
- [ ] Touch targets are at least 44×44px
- [ ] Seat grid is scrollable if needed
- [ ] Bottom bar remains visible
- [ ] Seats can be selected/deselected with touch

### Keyboard Navigation

- [ ] Tab key navigates to seats
- [ ] Enter/Space toggles seat selection
- [ ] Focus indicator is visible
- [ ] Arrow keys navigate between seats (if implemented)

### Performance

- [ ] Page loads in under 2 seconds
- [ ] Seat selection updates within 100ms
- [ ] No lag when selecting multiple seats
- [ ] Smooth transitions (60fps)

## Troubleshooting

### Issue: TypeScript errors

**Solution**: Ensure `tsconfig.json` has `strict: true` and paths configured correctly.

### Issue: Seats not selectable

**Solution**: Check that `'use client'` is at the top of the page file (Zustand requires client-side rendering).

### Issue: Price calculation incorrect

**Solution**: Verify that `getTotalPrice()` selector is called correctly and that seat prices match seat types.

### Issue: Mobile layout broken

**Solution**: Check Tailwind responsive classes and ensure viewport meta tag is set in `app/layout.tsx`.

## Next Steps

After verifying the basic functionality:

1. Run `/specledger.tasks` to generate detailed task list
2. Implement remaining components (SeatLegend, Screen visual)
3. Add keyboard navigation with arrow keys
4. Implement loading states for Book button
5. Add transitions and animations
6. Test on actual mobile devices
7. (Optional) Add Playwright end-to-end tests

## Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
