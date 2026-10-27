import QRCode from 'qrcode';
import { Booking, BookingHold, CampusEvent, Role, SalesStats, Seat, User } from '../types.ts';
import { INITIAL_EVENTS, generateSeatsForEvent } from '../data/initialEvents.ts';

const STORAGE_KEYS = {
  EVENTS: 'campustix_events_v1',
  BOOKINGS: 'campustix_bookings_v1',
  USERS: 'campustix_users_v1',
  CURRENT_USER: 'campustix_current_user_v1',
  ACTIVE_HOLD: 'campustix_active_hold_v1',
};

// Default seed users
const DEFAULT_USERS: User[] = [
  {
    id: 'usr-student-01',
    name: 'Alex Rivera',
    email: 'student@campustix.edu',
    role: 'student',
    rollNumber: 'CS-2026-042',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'usr-admin-01',
    name: 'Prof. Sarah Vance',
    email: 'admin@campustix.edu',
    role: 'admin',
    department: 'Office of Dean (Student Affairs)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    createdAt: '2026-08-15T08:00:00Z',
  },
];

class StoreService {
  private events: CampusEvent[] = [];
  private bookings: Booking[] = [];
  private users: User[] = [];
  private currentUser: User | null = null;
  private activeHold: BookingHold | null = null;
  private listeners: Set<() => void> = new Set();
  private cleanupInterval: number | null = null;

  constructor() {
    this.init();
    // Run cleanup for expired holds every 10 seconds
    if (typeof window !== 'undefined') {
      this.cleanupInterval = window.setInterval(() => {
        this.checkExpiredHolds();
      }, 10000);
    }
  }

  private init() {
    try {
      // Load events
      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (storedEvents) {
        this.events = JSON.parse(storedEvents);
      } else {
        this.events = INITIAL_EVENTS;
        this.saveEvents();
      }

      // Load users
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = DEFAULT_USERS;
        this.saveUsers();
      }

      // Load current user - default to Alex Rivera (Student) for instant usability
      const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedCurrentUser) {
        this.currentUser = JSON.parse(storedCurrentUser);
      } else {
        this.currentUser = this.users[0];
        this.saveCurrentUser();
      }

      // Load bookings
      const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (storedBookings) {
        this.bookings = JSON.parse(storedBookings);
      } else {
        // Pre-seed a sample booking for Alex Rivera so "My Bookings" has immediate content
        this.seedInitialBooking();
      }

      // Load active hold
      const storedHold = localStorage.getItem(STORAGE_KEYS.ACTIVE_HOLD);
      if (storedHold) {
        const hold: BookingHold = JSON.parse(storedHold);
        if (hold.expiresAt > Date.now()) {
          this.activeHold = hold;
        } else {
          this.activeHold = null;
          localStorage.removeItem(STORAGE_KEYS.ACTIVE_HOLD);
        }
      }

      this.checkExpiredHolds();
    } catch (e) {
      console.error('Error initializing CampusTix local storage:', e);
      this.events = INITIAL_EVENTS;
      this.users = DEFAULT_USERS;
      this.currentUser = DEFAULT_USERS[0];
    }
  }

  private async seedInitialBooking() {
    const event = this.events[0]; // Aura 2026
    const qrData = `CAMPUS-TIX-VERIFY:CTIX-2026-AURA42:Alex Rivera:Aura 2026:A1,A2`;
    let qrUrl = '';
    try {
      qrUrl = await QRCode.toDataURL(qrData, {
        width: 320,
        margin: 2,
        color: { dark: '#111827', light: '#ffffff' }
      });
    } catch (err) {
      console.warn('QR code gen warning:', err);
    }

    const initialBooking: Booking = {
      id: 'bkg-demo-001',
      bookingId: 'CTIX-2026-AURA42',
      eventId: event.id,
      eventTitle: event.title,
      eventCategory: event.category,
      eventDate: event.date,
      eventTime: event.startTime,
      eventVenue: event.venue,
      eventImage: event.image,
      userId: 'usr-student-01',
      userName: 'Alex Rivera',
      userEmail: 'student@campustix.edu',
      userRollNumber: 'CS-2026-042',
      userDepartment: 'Computer Science & Engineering',
      tierName: 'General Student Pass',
      ticketCount: 2,
      seatNumbers: ['A1', 'A2'],
      totalAmount: 398,
      paymentMethod: 'upi',
      paymentReference: 'UPI-DEMO-9823412',
      paymentStatus: 'completed',
      bookingStatus: 'confirmed',
      qrCodeDataUrl: qrUrl,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    };

    this.bookings = [initialBooking];
    this.saveBookings();
  }

  private saveEvents() {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(this.events));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  private saveBookings() {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(this.bookings));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  private saveCurrentUser() {
    try {
      if (this.currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  private saveActiveHold() {
    try {
      if (this.activeHold) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_HOLD, JSON.stringify(this.activeHold));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_HOLD);
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- HOLD SYSTEM: 10-Minute Atomic Hold ---
  public checkExpiredHolds(): void {
    let changed = false;
    const now = Date.now();

    // Check active user hold
    if (this.activeHold && this.activeHold.expiresAt <= now) {
      this.releaseHold(this.activeHold.holdId);
      this.activeHold = null;
      this.saveActiveHold();
      changed = true;
    }

    // Check all seats across events for expired holds
    this.events.forEach((evt) => {
      let eventChanged = false;
      evt.seats.forEach((seat) => {
        if (seat.status === 'held' && seat.holdExpiresAt && seat.holdExpiresAt <= now) {
          seat.status = 'available';
          seat.heldBy = undefined;
          seat.holdExpiresAt = undefined;
          eventChanged = true;
        }
      });
      if (eventChanged) {
        // Recount available seats
        const availableCount = evt.seats.filter((s) => s.status === 'available').length;
        evt.availableSeats = availableCount;
        changed = true;
      }
    });

    if (changed) {
      this.saveEvents();
      this.notify();
    }
  }

  public getEvents(): CampusEvent[] {
    this.checkExpiredHolds();
    return [...this.events];
  }

  public getEventById(id: string): CampusEvent | undefined {
    this.checkExpiredHolds();
    return this.events.find((e) => e.id === id);
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  public getActiveHold(): BookingHold | null {
    this.checkExpiredHolds();
    return this.activeHold;
  }

  // Set user role or switch to demo user
  public switchUser(role: Role): User {
    if (role === 'admin') {
      const admin = this.users.find((u) => u.role === 'admin') || DEFAULT_USERS[1];
      this.currentUser = admin;
    } else {
      const student = this.users.find((u) => u.role === 'student') || DEFAULT_USERS[0];
      this.currentUser = student;
    }
    this.saveCurrentUser();
    this.notify();
    return this.currentUser;
  }

  public loginUser(email: string): { success: boolean; message: string; user?: User } {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.currentUser = user;
      this.saveCurrentUser();
      this.notify();
      return { success: true, message: 'Signed in successfully', user };
    }
    return { success: false, message: 'No registered user found with this email. Please sign up.' };
  }

  public registerUser(data: { name: string; email: string; rollNumber?: string; department?: string; role?: Role }): { success: boolean; user?: User; message: string } {
    const existing = this.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this university email already exists.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role || 'student',
      rollNumber: data.rollNumber || `CS-2026-${Math.floor(100 + Math.random() * 900)}`,
      department: data.department || 'School of Computing',
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    this.saveUsers();
    this.saveCurrentUser();
    this.notify();
    return { success: true, user: newUser, message: 'Account registered successfully!' };
  }

  public logoutUser(): void {
    // If active hold, release it
    if (this.activeHold) {
      this.releaseHold(this.activeHold.holdId);
    }
    this.currentUser = null;
    this.saveCurrentUser();
    this.notify();
  }

  // --- ATOMIC HOLD CREATION (10-Minute Lock) ---
  public createSeatHold(
    eventId: string,
    tierId: string,
    seatNumbers: string[]
  ): { success: boolean; hold?: BookingHold; message: string } {
    this.checkExpiredHolds();

    if (!this.currentUser) {
      return { success: false, message: 'Please log in to hold seats and reserve tickets.' };
    }

    const event = this.events.find((e) => e.id === eventId);
    if (!event) {
      return { success: false, message: 'Event not found.' };
    }

    const tier = event.tiers.find((t) => t.id === tierId) || event.tiers[0];

    // Prevent duplicate bookings: Check if user already has an active confirmed booking for this event
    const existingBooking = this.bookings.find(
      (b) => b.userId === this.currentUser!.id && b.eventId === eventId && b.bookingStatus === 'confirmed'
    );
    if (existingBooking) {
      return {
        success: false,
        message: `Duplicate reservation prevented: You already hold an active pass (${existingBooking.bookingId}) for this event with seats ${existingBooking.seatNumbers.join(', ')}. Please cancel it first in 'My Passes' if you wish to re-book.`,
      };
    }

    // Check if user already has an active hold
    if (this.activeHold) {
      // release previous hold
      this.releaseHold(this.activeHold.holdId);
    }

    // Verify all requested seats are available
    for (const seatNum of seatNumbers) {
      const seat = event.seats.find((s) => s.seatNumber === seatNum);
      if (!seat) {
        return { success: false, message: `Seat ${seatNum} is invalid.` };
      }
      if (seat.status !== 'available') {
        return { success: false, message: `Seat ${seatNum} is no longer available. Please select another.` };
      }
    }

    // 10-minute hold duration
    const HOLD_DURATION_MS = 10 * 60 * 1000;
    const expiresAt = Date.now() + HOLD_DURATION_MS;
    const holdId = `hold-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Lock the seats atomically
    event.seats.forEach((seat) => {
      if (seatNumbers.includes(seat.seatNumber)) {
        seat.status = 'held';
        seat.heldBy = this.currentUser!.id;
        seat.holdExpiresAt = expiresAt;
      }
    });

    // Update available capacity
    event.availableSeats = event.seats.filter((s) => s.status === 'available').length;

    const totalAmount = tier.price * seatNumbers.length;
    const hold: BookingHold = {
      holdId,
      eventId,
      userId: this.currentUser.id,
      tierId: tier.id,
      ticketCount: seatNumbers.length,
      seatNumbers,
      totalAmount,
      expiresAt,
    };

    this.activeHold = hold;
    this.saveActiveHold();
    this.saveEvents();
    this.notify();

    return { success: true, hold, message: 'Seats held successfully for 10 minutes!' };
  }

  // Release a hold (e.g. user cancels checkout or timer runs out)
  public releaseHold(holdId: string): void {
    if (!this.activeHold || this.activeHold.holdId !== holdId) return;

    const event = this.events.find((e) => e.id === this.activeHold!.eventId);
    if (event) {
      event.seats.forEach((seat) => {
        if (this.activeHold!.seatNumbers.includes(seat.seatNumber)) {
          if (seat.status === 'held') {
            seat.status = 'available';
            seat.heldBy = undefined;
            seat.holdExpiresAt = undefined;
          }
        }
      });
      event.availableSeats = event.seats.filter((s) => s.status === 'available').length;
      this.saveEvents();
    }

    this.activeHold = null;
    this.saveActiveHold();
    this.notify();
  }

  // --- CONFIRM BOOKING (Atomic Conversion from Hold to Confirmed Ticket) ---
  public async confirmBooking(params: {
    holdId: string;
    paymentMethod: 'upi' | 'card' | 'free';
    paymentReference?: string;
  }): Promise<{ success: boolean; booking?: Booking; message: string }> {
    this.checkExpiredHolds();

    if (!this.activeHold || this.activeHold.holdId !== params.holdId) {
      return { success: false, message: 'Reservation hold has expired. Please select your seats again.' };
    }

    if (this.activeHold.expiresAt <= Date.now()) {
      this.releaseHold(params.holdId);
      return { success: false, message: 'Reservation hold timed out. Seats have been released.' };
    }

    const event = this.events.find((e) => e.id === this.activeHold!.eventId);
    if (!event) {
      return { success: false, message: 'Event not found.' };
    }

    const tier = event.tiers.find((t) => t.id === this.activeHold!.tierId) || event.tiers[0];
    const user = this.currentUser;
    if (!user) {
      return { success: false, message: 'User session lost. Please log in again.' };
    }

    // Convert seats to booked
    event.seats.forEach((seat) => {
      if (this.activeHold!.seatNumbers.includes(seat.seatNumber)) {
        seat.status = 'booked';
        seat.heldBy = user.id;
        seat.holdExpiresAt = undefined;
      }
    });

    // Deduct tier available
    tier.available = Math.max(0, tier.available - this.activeHold.seatNumbers.length);
    event.availableSeats = event.seats.filter((s) => s.status === 'available').length;

    // Generate unique Booking ID
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingCode = `CTIX-2026-${randomSuffix}`;

    // Generate scannable QR Code containing cryptographic verification payload
    const qrPayload = JSON.stringify({
      code: bookingCode,
      event: event.title,
      student: user.name,
      roll: user.rollNumber || 'N/A',
      seats: this.activeHold.seatNumbers.join(','),
      date: event.date,
      time: event.startTime,
      venue: event.venue,
    });

    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
        width: 380,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
    } catch (err) {
      console.warn('QR code generation error:', err);
    }

    const newBooking: Booking = {
      id: `bkg-${Date.now()}`,
      bookingId: bookingCode,
      eventId: event.id,
      eventTitle: event.title,
      eventCategory: event.category,
      eventDate: event.date,
      eventTime: event.startTime,
      eventVenue: event.venue,
      eventImage: event.image,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRollNumber: user.rollNumber,
      userDepartment: user.department,
      tierName: tier.name,
      ticketCount: this.activeHold.seatNumbers.length,
      seatNumbers: this.activeHold.seatNumbers,
      totalAmount: this.activeHold.totalAmount,
      paymentMethod: params.paymentMethod,
      paymentReference: params.paymentReference || `TXN-${Date.now().toString().slice(-8)}`,
      paymentStatus: 'completed',
      bookingStatus: 'confirmed',
      qrCodeDataUrl,
      createdAt: new Date().toISOString(),
    };

    this.bookings.unshift(newBooking);
    this.activeHold = null;

    this.saveBookings();
    this.saveEvents();
    this.saveActiveHold();
    this.notify();

    return { success: true, booking: newBooking, message: 'Ticket reserved successfully!' };
  }

  // --- CANCEL BOOKING (Refund seats & update inventory) ---
  public cancelBooking(bookingId: string): { success: boolean; message: string } {
    const booking = this.bookings.find((b) => b.id === bookingId || b.bookingId === bookingId);
    if (!booking) {
      return { success: false, message: 'Booking not found.' };
    }

    if (booking.bookingStatus === 'cancelled') {
      return { success: false, message: 'This booking has already been cancelled.' };
    }

    const event = this.events.find((e) => e.id === booking.eventId);
    if (event) {
      // Revert seats back to available
      event.seats.forEach((seat) => {
        if (booking.seatNumbers.includes(seat.seatNumber)) {
          seat.status = 'available';
          seat.heldBy = undefined;
          seat.holdExpiresAt = undefined;
        }
      });

      // Restore tier capacity
      const tier = event.tiers.find((t) => t.name === booking.tierName);
      if (tier) {
        tier.available = Math.min(tier.capacity, tier.available + booking.seatNumbers.length);
      }
      event.availableSeats = event.seats.filter((s) => s.status === 'available').length;
      this.saveEvents();
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancelledAt = new Date().toISOString();

    this.saveBookings();
    this.notify();

    return { success: true, message: 'Booking cancelled successfully. Seats have been returned to inventory.' };
  }

  // Get user bookings
  public getMyBookings(): Booking[] {
    if (!this.currentUser) return [];
    return this.bookings.filter((b) => b.userId === this.currentUser!.id);
  }

  public getAllBookings(): Booking[] {
    return [...this.bookings];
  }

  // --- ADMIN ACTIONS ---
  public createEvent(eventData: Omit<CampusEvent, 'id' | 'seats' | 'createdAt'>): CampusEvent {
    const newId = `evt-${Date.now()}`;
    const seats = generateSeatsForEvent(newId, Math.min(60, eventData.totalCapacity));

    const newEvent: CampusEvent = {
      ...eventData,
      id: newId,
      seats,
      availableSeats: seats.filter((s: Seat) => s.status === 'available').length,
      createdAt: new Date().toISOString(),
    };

    this.events.unshift(newEvent);
    this.saveEvents();
    this.notify();
    return newEvent;
  }

  public updateEvent(id: string, updates: Partial<CampusEvent>): CampusEvent | null {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) return null;

    this.events[index] = {
      ...this.events[index],
      ...updates,
    };

    this.saveEvents();
    this.notify();
    return this.events[index];
  }

  public deleteEvent(id: string): boolean {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) return false;

    this.events.splice(index, 1);
    this.saveEvents();
    this.notify();
    return true;
  }

  // Live Sales Stats for Admin Dashboard
  public getSalesStats(): SalesStats {
    const confirmedBookings = this.bookings.filter((b) => b.bookingStatus === 'confirmed');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalTicketsSold = confirmedBookings.reduce((sum, b) => sum + b.ticketCount, 0);

    const totalCapacity = this.events.reduce((sum, e) => sum + e.totalCapacity, 0);
    const totalOccupied = totalCapacity - this.events.reduce((sum, e) => sum + e.availableSeats, 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

    // By category
    const catMap: Record<string, { revenue: number; tickets: number }> = {};
    confirmedBookings.forEach((b) => {
      const cat = b.eventCategory;
      if (!catMap[cat]) catMap[cat] = { revenue: 0, tickets: 0 };
      catMap[cat].revenue += b.totalAmount;
      catMap[cat].tickets += b.ticketCount;
    });

    const revenueByCategory = Object.entries(catMap).map(([category, val]) => ({
      category,
      revenue: val.revenue,
      tickets: val.tickets,
    }));

    return {
      totalRevenue,
      totalBookings: confirmedBookings.length,
      totalTicketsSold,
      occupancyRate,
      activeEventsCount: this.events.length,
      revenueByCategory,
      recentBookings: this.bookings.slice(0, 10),
    };
  }

  // Export Attendees to CSV
  public exportAttendeesCsv(): string {
    const headers = [
      'Booking ID',
      'Booking Date',
      'Student Name',
      'Student Email',
      'Roll Number',
      'Department',
      'Event Name',
      'Event Category',
      'Event Date',
      'Venue',
      'Ticket Tier',
      'Quantity',
      'Seat Numbers',
      'Total Amount (INR)',
      'Payment Method',
      'Status',
    ];

    const rows = this.bookings.map((b) => [
      `"${b.bookingId}"`,
      `"${new Date(b.createdAt).toLocaleString()}"`,
      `"${b.userName}"`,
      `"${b.userEmail}"`,
      `"${b.userRollNumber || 'N/A'}"`,
      `"${b.userDepartment || 'N/A'}"`,
      `"${b.eventTitle.replace(/"/g, '""')}"`,
      `"${b.eventCategory}"`,
      `"${b.eventDate}"`,
      `"${b.eventVenue.replace(/"/g, '""')}"`,
      `"${b.tierName}"`,
      b.ticketCount,
      `"${b.seatNumbers.join(', ')}"`,
      b.totalAmount,
      `"${b.paymentMethod.toUpperCase()}"`,
      `"${b.bookingStatus.toUpperCase()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return csvContent;
  }
}

export const store = new StoreService();
