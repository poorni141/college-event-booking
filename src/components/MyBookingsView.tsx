import React, { useState } from 'react';
import { Ticket, Calendar, Clock, MapPin, QrCode, Trash2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Booking } from '../types.ts';

interface MyBookingsViewProps {
  bookings: Booking[];
  onViewTicket: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onBrowseEvents: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onViewTicket,
  onCancelBooking,
  onBrowseEvents,
}) => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'confirmed') return b.bookingStatus === 'confirmed';
    if (filter === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  const confirmCancel = (id: string) => {
    onCancelBooking(id);
    setCancellingBookingId(null);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-950/70">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            My Event Passes & Reservations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your verified entry passes, download QR tickets, or manage seat cancellations.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[#101435] rounded-lg border border-indigo-950">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              filter === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              filter === 'confirmed'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active ({bookings.filter((b) => b.bookingStatus === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              filter === 'cancelled'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cancelled ({bookings.filter((b) => b.bookingStatus === 'cancelled').length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-indigo-950/80 bg-[#0c0f26] p-12 text-center max-w-lg mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-950/50 text-purple-400 mb-4 border border-purple-800/40">
            <Ticket className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-white">No tickets in this section</h3>
          <p className="mt-1.5 text-xs text-slate-400">
            You don't have any {filter !== 'all' ? filter : ''} bookings yet. Explore current campus events and reserve your seats with instant holds.
          </p>
          <button
            onClick={onBrowseEvents}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all"
          >
            <span>Browse Upcoming Events</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((booking) => {
            const isCancelled = booking.bookingStatus === 'cancelled';
            const formattedDate = new Date(booking.eventDate + 'T12:00:00Z').toLocaleDateString(
              'en-US',
              {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }
            );

            return (
              <div
                key={booking.id}
                className={`relative flex flex-col md:flex-row items-stretch justify-between rounded-xl border transition-all overflow-hidden ${
                  isCancelled
                    ? 'border-slate-800/80 bg-[#0a0c1a] opacity-75'
                    : 'border-indigo-950/80 bg-[#0d1029] hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-950/10'
                }`}
              >
                {/* Event Thumbnail */}
                <div className="relative md:w-56 h-36 md:h-auto overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={booking.eventImage}
                    alt={booking.eventTitle}
                    referrerPolicy="no-referrer"
                    className={`h-full w-full object-cover ${isCancelled ? 'grayscale' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0d1029] via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono font-bold text-white uppercase backdrop-blur-sm">
                    {booking.eventCategory}
                  </div>
                </div>

                {/* Details Column */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-purple-300">
                        {booking.bookingId}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          isCancelled
                            ? 'bg-red-950/60 text-red-400 border border-red-900/40'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-900/40'
                        }`}
                      >
                        {isCancelled ? 'Cancelled & Refunded' : 'Confirmed Pass'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-1">
                      {booking.eventTitle}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-purple-400" />
                        <span>{formattedDate}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{booking.eventTime}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-pink-400" />
                        <span>{booking.eventVenue}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-indigo-950/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                    <div>
                      Seats: <strong className="text-white font-mono">{booking.seatNumbers.join(', ')}</strong> ({booking.ticketCount} {booking.ticketCount === 1 ? 'ticket' : 'tickets'}) · Tier: <span className="text-purple-300 font-medium">{booking.tierName}</span>
                    </div>
                    <div className="font-mono tabular-nums text-white">
                      Paid: <strong className="text-white">{booking.totalAmount === 0 ? 'Free' : `₹${booking.totalAmount}`}</strong> ({booking.paymentMethod.toUpperCase()})
                    </div>
                  </div>
                </div>

                {/* Actions & QR Thumbnail */}
                <div className="flex md:flex-col items-center justify-between gap-3 border-t md:border-t-0 md:border-l border-indigo-950/80 bg-[#090b1c] p-4 md:w-48 shrink-0">
                  {booking.qrCodeDataUrl && !isCancelled ? (
                    <div
                      onClick={() => onViewTicket(booking)}
                      className="cursor-pointer group flex flex-col items-center"
                      title="Click to view full pass"
                    >
                      <div className="h-20 w-20 rounded-lg bg-white p-1 shadow-sm transition-transform group-hover:scale-105">
                        <img
                          src={booking.qrCodeDataUrl}
                          alt="QR Code"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] text-purple-300 mt-1 font-mono">View QR Pass</span>
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] text-slate-500">
                      {isCancelled ? 'Void' : 'No QR'}
                    </div>
                  )}

                  <div className="flex items-center md:flex-col gap-2 w-full">
                    {!isCancelled ? (
                      <>
                        <button
                          onClick={() => onViewTicket(booking)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors shadow-sm"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          <span>View Pass</span>
                        </button>

                        <button
                          onClick={() => setCancellingBookingId(booking.id)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-red-900/60 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-900/40 hover:text-red-200 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Cancel</span>
                        </button>
                      </>
                    ) : (
                      <div className="text-[11px] text-slate-500 text-center font-mono">
                        Seats Restored
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-900/60 bg-[#101229] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-base font-bold text-white">Cancel Event Reservation?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Cancelling will release your reserved seats back to the college event inventory immediately. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
              >
                Keep Reservation
              </button>
              <button
                onClick={() => confirmCancel(cancellingBookingId)}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 shadow-md"
              >
                Yes, Cancel & Release Seats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
