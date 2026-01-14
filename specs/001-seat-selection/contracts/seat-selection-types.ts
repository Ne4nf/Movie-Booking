/**
 * TypeScript Type Definitions for Seat Selection Feature
 *
 * This file defines all TypeScript types and interfaces for the seat selection
 * interface. These types will be used in:
 * - components/seat-selection/*.tsx
 * - lib/stores/useSeatStore.ts
 * - lib/hooks/useSeatSelection.ts
 * - lib/utils/pricing.ts
 * - lib/utils/seat.ts
 *
 * Feature: 001-seat-selection
 * Last Updated: 2026-01-15
 */

// ============================================================================
// Core Seat Types
// ============================================================================

/**
 * Represents the current availability state of a seat
 */
export type SeatState = 'available' | 'selected' | 'occupied'

/**
 * Represents the pricing tier of a seat
 * Standard seats (rows A-D): 50,000 VND
 * VIP seats (rows E-F): 80,000 VND
 */
export type SeatType = 'standard' | 'vip'

/**
 * Row identifiers for the theater layout
 */
export type SeatRow = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

/**
 * Column numbers for the theater layout
 */
export type SeatColumn = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

/**
 * Unique seat identifier in format "{ROW}{COLUMN}"
 * Examples: "A1", "C10", "F5"
 */
export type SeatIdentifier = `${SeatRow}${SeatColumn}`

/**
 * Represents a single theater seat with all its properties
 */
export interface Seat {
  /** Unique seat identifier (e.g., "A1", "F10") */
  id: SeatIdentifier

  /** Row identifier (A-F) */
  row: SeatRow

  /** Column number (1-10) */
  column: SeatColumn

  /** Current availability status */
  state: SeatState

  /** Pricing tier (determines price) */
  type: SeatType

  /** Seat price in VND (50000 for standard, 80000 for VIP) */
  price: number
}

// ============================================================================
// Booking Session Types
// ============================================================================

/**
 * Represents the current user's seat selection session
 * Note: Not persisted in MVP (reset on page refresh)
 */
export interface BookingSession {
  /** Array of selected seat objects */
  selectedSeats: Seat[]

  /** Total price of all selected seats (derived from selectedSeats) */
  totalPrice: number

  /** Number of selected seats (derived from selectedSeats) */
  seatCount: number
}

// ============================================================================
// Movie Data Types (Mock)
// ============================================================================

/**
 * Represents the movie for which seats are being selected
 * Note: Hardcoded mock data for MVP
 */
export interface Movie {
  /** Unique movie identifier */
  id: string

  /** Movie title */
  title: string

  /** Duration in minutes (not displayed in MVP) */
  duration: number
}

// ============================================================================
// Store Types (Zustand)
// ============================================================================

/**
 * Actions available on the seat store
 */
export interface SeatStoreActions {
  /**
   * Toggle seat between available and selected
   * If seat is occupied, no action is taken
   * @param seatId - The seat identifier to toggle
   */
  toggleSeat: (seatId: SeatIdentifier) => void

  /**
   * Add a seat to the selection
   * Only works if seat is available (not occupied or already selected)
   * @param seatId - The seat identifier to select
   */
  selectSeat: (seatId: SeatIdentifier) => void

  /**
   * Remove a seat from the selection
   * Only works if seat is currently selected
   * @param seatId - The seat identifier to deselect
   */
  deselectSeat: (seatId: SeatIdentifier) => void

  /**
   * Deselect all seats (reset session)
   */
  clearSelection: () => void
}

/**
 * Selectors (computed values) available on the seat store
 */
export interface SeatStoreSelectors {
  /**
   * Calculate total price of all selected seats
   * @returns Total price in VND
   */
  getTotalPrice: () => number

  /**
   * Get the number of selected seats
   * @returns Count of selected seats
   */
  getSelectedSeatCount: () => number

  /**
   * Find a seat by its ID
   * @param seatId - The seat identifier to find
   * @returns The seat object or undefined if not found
   */
  getSeatById: (seatId: SeatIdentifier) => Seat | undefined

  /**
   * Get array of selected seat IDs
   * @returns Array of seat identifiers (e.g., ["A1", "C5", "E3"])
   */
  getSelectedSeatIds: () => SeatIdentifier[]
}

/**
 * Complete seat store interface (state + actions + selectors)
 */
export interface SeatStore extends SeatStoreActions, SeatStoreSelectors {
  /** All 60 seats with their current states */
  seats: Seat[]

  /** Array of currently selected seats */
  selectedSeats: Seat[]
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Props for the Seat component
 */
export interface SeatProps {
  /** The seat object to render */
  seat: Seat

  /** Callback when seat is clicked/tapped */
  onSelect: (seatId: SeatIdentifier) => void

  /** Whether the seat is currently focused (keyboard navigation) */
  isFocused?: boolean

  /** ARIA label for screen readers */
  ariaLabel?: string
}

/**
 * Props for the SeatGrid component
 */
export interface SeatGridProps {
  /** Array of all seats to render */
  seats: Seat[]

  /** Callback when a seat is selected/deselected */
  onSeatToggle: (seatId: SeatIdentifier) => void

  /** ID of the currently focused seat (keyboard navigation) */
  focusedSeatId?: SeatIdentifier | null
}

/**
 * Props for the SelectionBar component
 */
export interface SelectionBarProps {
  /** Array of selected seats */
  selectedSeats: Seat[]

  /** Total price of selected seats */
  totalPrice: number

  /** Whether the Book Ticket button should be enabled */
  isBookingEnabled: boolean

  /** Callback when Book Ticket button is clicked */
  onBookTicket: () => void
}

/**
 * Props for the BookingButton component
 */
export interface BookingButtonProps {
  /** Whether the button is enabled */
  enabled: boolean

  /** Total price to display */
  totalPrice: number

  /** Number of selected seats */
  seatCount: number

  /** Callback when button is clicked */
  onClick: () => void

  /** Whether button is in loading state */
  loading?: boolean
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Price mapping by seat type
 */
export const SEAT_PRICES: Record<SeatType, number> = {
  standard: 50000,
  vip: 80000,
} as const

/**
 * Type guard to check if a string is a valid SeatIdentifier
 */
export function isValidSeatIdentifier(id: string): id is SeatIdentifier {
  return /^[A-F][1-9]|10$/.test(id)
}

/**
 * Type guard to check if a seat is in a specific state
 */
export function isSeatInState(seat: Seat, state: SeatState): boolean {
  return seat.state === state
}

/**
 * Type guard to check if a seat is selectable (not occupied)
 */
export function isSeatSelectable(seat: Seat): boolean {
  return seat.state !== 'occupied'
}

// ============================================================================
// Constants
// ============================================================================

/**
 * All row identifiers
 */
export const SEAT_ROWS: SeatRow[] = ['A', 'B', 'C', 'D', 'E', 'F']

/**
 * All column numbers
 */
export const SEAT_COLUMNS: SeatColumn[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/**
 * Mock occupied seats for MVP demonstration
 */
export const OCCUPIED_SEATS: SeatIdentifier[] = [
  'A3',
  'B5',
  'C7',
  'D2',
  'E8',
  'F4',
]

/**
 * Mock movie data for MVP
 */
export const MOCK_MOVIE: Movie = {
  id: 'avengers-001',
  title: 'Avengers',
  duration: 142, // minutes (not displayed in MVP)
}
