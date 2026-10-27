export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  rollNumber?: string;
  department?: string;
  avatar?: string;
  createdAt: string;
}

export type EventCategory =
  | 'Culturals'
  | 'Symposium'
  | 'Hackathon'
  | 'Music Night'
  | 'Dance Competition'
  | 'Sports Meet'
  | 'Workshops';

export interface TicketTier {
  id: string;
  name: string;
  price: number; // in INR / credits (e.g., 0 for free or 250, 499)
  capacity: number;
  available: number;
  description: string;
  perks: string[];
}

export interface Seat {
  id: string;
  seatNumber: string; // e.g. "A1", "C7"
  row: string;
  tierId: string;
  status: 'available' | 'held' | 'booked';
  heldBy?: string;
  holdExpiresAt?: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: EventCategory;
  tagline: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  venue: string;
  locationDetails: string;
  totalCapacity: number;
  availableSeats: number;
  image: string;
  organizer: string;
  organizerContact?: string;
  rules?: string[];
  schedule?: { time: string; title: string; description: string }[];
  tiers: TicketTier[];
  seats: Seat[];
  featured?: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BookingHold {
  holdId: string;
  eventId: string;
  userId: string;
  tierId: string;
  ticketCount: number;
  seatNumbers: string[];
  totalAmount: number;
  expiresAt: number; // timestamp in ms (10 minutes)
}

export interface Booking {
  id: string;
  bookingId: string; // e.g. CTIX-2026-X89K2
  eventId: string;
  eventTitle: string;
  eventCategory: EventCategory;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRollNumber?: string;
  userDepartment?: string;
  tierName: string;
  ticketCount: number;
  seatNumbers: string[];
  totalAmount: number;
  paymentMethod: 'upi' | 'card' | 'free';
  paymentReference?: string;
  paymentStatus: 'completed' | 'refunded';
  bookingStatus: 'confirmed' | 'cancelled';
  qrCodeDataUrl?: string;
  createdAt: string;
  cancelledAt?: string;
}

export interface SalesStats {
  totalRevenue: number;
  totalBookings: number;
  totalTicketsSold: number;
  occupancyRate: number;
  activeEventsCount: number;
  revenueByCategory: { category: string; revenue: number; tickets: number }[];
  recentBookings: Booking[];
}
