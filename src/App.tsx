import React, { useState, useEffect } from 'react';
import { store } from './services/store.ts';
import { Booking, BookingHold, CampusEvent, EventCategory, Role, SalesStats, User } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { EventFilters } from './components/EventFilters.tsx';
import { EventCard } from './components/EventCard.tsx';
import { EventDetailModal } from './components/EventDetailModal.tsx';
import { SeatSelectionModal } from './components/SeatSelectionModal.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { TicketPassModal } from './components/TicketPassModal.tsx';
import { MyBookingsView } from './components/MyBookingsView.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ArchitectureModal } from './components/ArchitectureModal.tsx';
import { NotFoundView } from './components/NotFoundView.tsx';
import { Clock, Shield, Sparkles, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export default function App() {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeHold, setActiveHold] = useState<BookingHold | null>(null);
  const [salesStats, setSalesStats] = useState<SalesStats>({
    totalRevenue: 0,
    totalBookings: 0,
    totalTicketsSold: 0,
    occupancyRate: 0,
    activeEventsCount: 0,
    revenueByCategory: [],
    recentBookings: [],
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'events' | 'my-bookings' | 'admin' | 'architecture'>('events');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'seats'>('date');

  // Modals
  const [detailEvent, setDetailEvent] = useState<CampusEvent | null>(null);
  const [seatSelectEvent, setSeatSelectEvent] = useState<CampusEvent | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [viewingPass, setViewingPass] = useState<Booking | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [seatHoldError, setSeatHoldError] = useState<string | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Sync with store
  const syncFromStore = () => {
    setEvents(store.getEvents());
    setCurrentUser(store.getCurrentUser());
    setMyBookings(store.getMyBookings());
    setAllBookings(store.getAllBookings());
    setAllUsers(store.getAllUsers());
    setActiveHold(store.getActiveHold());
    setSalesStats(store.getSalesStats());
  };

  useEffect(() => {
    syncFromStore();
    const unsubscribe = store.subscribe(() => {
      syncFromStore();
    });
    return () => unsubscribe();
  }, []);

  // Filter and Sort Events
  const filteredEvents = events.filter((evt) => {
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      evt.title.toLowerCase().includes(q) ||
      evt.category.toLowerCase().includes(q) ||
      evt.venue.toLowerCase().includes(q) ||
      evt.description.toLowerCase().includes(q) ||
      evt.organizer.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  filteredEvents.sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === 'price') {
      const minA = Math.min(...a.tiers.map((t) => t.price));
      const minB = Math.min(...b.tiers.map((t) => t.price));
      return minA - minB;
    }
    if (sortBy === 'seats') {
      return b.availableSeats - a.availableSeats;
    }
    return 0;
  });

  // Action handlers
  const handleHoldSeats = (eventId: string, tierId: string, seatNumbers: string[]) => {
    setSeatHoldError(null);
    const result = store.createSeatHold(eventId, tierId, seatNumbers);
    if (result.success && result.hold) {
      setSeatSelectEvent(null);
      setShowCheckout(true);
      showToast('10-Minute Reservation Hold Active. Complete checkout to confirm.', 'info');
    } else {
      setSeatHoldError(result.message);
    }
  };

  const handleConfirmPayment = async (
    paymentMethod: 'upi' | 'card' | 'free',
    reference: string
  ): Promise<boolean> => {
    if (!activeHold) return false;

    const result = await store.confirmBooking({
      holdId: activeHold.holdId,
      paymentMethod,
      paymentReference: reference,
    });

    if (result.success && result.booking) {
      setShowCheckout(false);
      setViewingPass(result.booking);
      showToast(`Booking ${result.booking.bookingId} confirmed! QR Pass generated.`, 'success');
      return true;
    } else {
      showToast(result.message, 'error');
      return false;
    }
  };

  const handleCancelHold = (holdId: string) => {
    store.releaseHold(holdId);
    setShowCheckout(false);
    showToast('Reservation hold released. Seats are now available for other students.', 'info');
  };

  const handleHoldExpired = () => {
    setShowCheckout(false);
    showToast('10-Minute Hold Expired. Seats have been returned to event inventory.', 'error');
  };

  const handleCancelBooking = (bookingId: string) => {
    const res = store.cancelBooking(bookingId);
    if (res.success) {
      showToast('Booking cancelled. Reserved seats have been refunded to inventory.', 'info');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleExportCsv = () => {
    const csvData = store.exportAttendeesCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `campustix_attendees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendee roster CSV downloaded successfully.', 'success');
  };

  // Find hold event
  const currentHoldEvent = activeHold ? events.find((e) => e.id === activeHold.eventId) || null : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#121116] text-[#f4f2f8] selection:bg-[#FF7F6B] selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 rounded-xl border border-[#342f47] bg-[#1a1725] px-4 py-3 text-xs text-white shadow-2xl shadow-black/60 animate-in fade-in slide-in-from-top-4">
          {toast.type === 'success' && <CheckCircle className="h-4 w-4 text-[#FF7F6B] shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />}
          {toast.type === 'info' && <Clock className="h-4 w-4 text-[#8B5CF6] shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Floating 10-Minute Hold Reminder Banner (if hold is active and modal is closed) */}
      {activeHold && !showCheckout && (
        <div className="sticky top-16 z-30 bg-[#1c1926] border-b border-[#36304a] px-4 py-2.5 backdrop-blur-md">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-xs text-white">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#FF7F6B] animate-spin" />
              <span>
                You have active reserved seats locked for <strong className="font-mono text-[#FF7F6B]">{activeHold.seatNumbers.join(', ')}</strong> ({currentHoldEvent?.title}).
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCheckout(true)}
                className="rounded-lg bg-[#FF7F6B] hover:bg-[#ff6e57] px-3 py-1 font-semibold text-slate-950 text-xs shadow-sm flex items-center gap-1 transition-all"
              >
                <span>Complete Checkout</span>
                <ArrowRight className="h-3 w-3 text-slate-950" />
              </button>
              <button
                onClick={() => handleCancelHold(activeHold.holdId)}
                className="text-[#C4B5FD] hover:text-white underline text-[11px]"
              >
                Release Seats
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onNavigate={(tab) => {
          if (tab === 'architecture') {
            setIsArchOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSwitchRole={(role: Role) => {
          store.switchUser(role);
          showToast(`Switched active session to ${role === 'admin' ? 'Admin' : 'Student'} profile.`, 'info');
        }}
        onLogout={() => {
          store.logoutUser();
          showToast('Signed out of CampusTix.', 'info');
        }}
        activeHoldCount={activeHold ? 1 : 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: Events Schedule & Booking */}
        {activeTab === 'events' && (
          <>
            <HeroBanner
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onExploreClick={() => {
                const el = document.getElementById('events-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              totalEventsCount={events.length}
            />

            <div id="events-grid" className="pt-2">
              <EventFilters
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filteredCount={filteredEvents.length}
                totalCount={events.length}
              />

              {filteredEvents.length === 0 ? (
                <div className="rounded-2xl border border-indigo-950/80 bg-[#0c0f26] p-12 text-center my-6">
                  <p className="text-sm text-slate-300">
                    No campus events found matching "{searchQuery}" in {selectedCategory}.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 text-xs font-semibold text-purple-400 hover:underline"
                  >
                    Clear search filters
                  </button>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((evt) => (
                    <EventCard
                      key={evt.id}
                      event={evt}
                      onSelectEvent={(e) => setDetailEvent(e)}
                      onReserveClick={(e) => {
                        setSeatSelectEvent(e);
                        setSeatHoldError(null);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: My Bookings & QR Passes */}
        {activeTab === 'my-bookings' && (
          <MyBookingsView
            bookings={myBookings}
            onViewTicket={(b) => setViewingPass(b)}
            onCancelBooking={handleCancelBooking}
            onBrowseEvents={() => setActiveTab('events')}
          />
        )}

        {/* TAB 3: Admin Console & Operations */}
        {activeTab === 'admin' && (
          <AdminDashboard
            stats={salesStats}
            events={events}
            bookings={allBookings}
            users={allUsers}
            onCreateEvent={(data) => {
              store.createEvent(data);
              showToast('New campus event published successfully!', 'success');
            }}
            onUpdateEvent={(id, updates) => {
              store.updateEvent(id, updates);
              showToast('Event details updated successfully.', 'success');
            }}
            onDeleteEvent={(id) => {
              store.deleteEvent(id);
              showToast('Event removed from registry.', 'info');
            }}
            onExportCsv={handleExportCsv}
          />
        )}
      </main>

      {/* Modals */}
      <EventDetailModal
        event={detailEvent}
        onClose={() => setDetailEvent(null)}
        onReserve={(e) => {
          setSeatSelectEvent(e);
          setSeatHoldError(null);
        }}
      />

      <SeatSelectionModal
        event={seatSelectEvent}
        onClose={() => setSeatSelectEvent(null)}
        onHoldSeats={handleHoldSeats}
        error={seatHoldError}
      />

      {showCheckout && activeHold && currentHoldEvent && currentUser && (
        <CheckoutModal
          hold={activeHold}
          event={currentHoldEvent}
          currentUser={currentUser}
          onConfirm={handleConfirmPayment}
          onCancelHold={handleCancelHold}
          onHoldExpired={handleHoldExpired}
        />
      )}

      <TicketPassModal
        booking={viewingPass}
        onClose={() => setViewingPass(null)}
        onViewMyBookings={() => {
          setViewingPass(null);
          setActiveTab('my-bookings');
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(email) => {
          const res = store.loginUser(email);
          if (res.success) {
            showToast(res.message, 'success');
          } else {
            showToast(res.message, 'error');
          }
        }}
        onRegister={(data) => {
          const res = store.registerUser(data);
          if (res.success) {
            showToast(res.message, 'success');
          } else {
            showToast(res.message, 'error');
          }
        }}
        onQuickDemo={(role) => {
          store.switchUser(role);
          showToast(`Signed in as ${role === 'admin' ? 'Prof. Sarah Vance (Dean)' : 'Alex Rivera (Student)'}`, 'success');
        }}
      />

      <ArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-indigo-950/70 bg-[#080a16] py-8 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">CampusTix</span>
            <span>· Academic Year 2026 Inter-Collegiate Ticketing & Reservations</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#C4B5FD]/70">
            <button
              onClick={() => setIsArchOpen(true)}
              className="hover:text-[#FF7F6B] transition-colors"
            >
              Postgres / Prisma Architecture
            </button>
            <span>·</span>
            <span>10-Minute Atomic Hold Locks</span>
            <span>·</span>
            <span>Ready for GitHub & Public Cloud Run</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
