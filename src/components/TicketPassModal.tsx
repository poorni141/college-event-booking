import React from 'react';
import { X, Printer, Download, CheckCircle2, Calendar, Clock, MapPin, Ticket, ShieldCheck } from 'lucide-react';
import { Booking } from '../types.ts';

interface TicketPassModalProps {
  booking: Booking | null;
  onClose: () => void;
  onViewMyBookings: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  booking,
  onClose,
  onViewMyBookings,
}) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(booking.eventDate + 'T12:00:00Z').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-indigo-900/80 bg-[#0a0d1f] shadow-2xl my-6">
        {/* Top Control Bar (Hidden during print) */}
        <div className="no-print flex items-center justify-between border-b border-indigo-950/80 px-6 py-3.5 bg-[#080a18]">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Ticket Confirmed & Verified</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-950 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-indigo-900 hover:text-white transition-colors border border-indigo-800/60"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Area */}
        <div id="printable-ticket" className="p-6 sm:p-8">
          <div className="ticket-dark-invert relative overflow-hidden rounded-2xl border border-indigo-900/80 bg-gradient-to-br from-[#111434] via-[#0d1028] to-[#090b1c] p-6 shadow-xl">
            {/* Ticket Header */}
            <div className="flex items-start justify-between border-b border-indigo-900/60 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-6 rounded bg-purple-600 flex items-center justify-center text-white">
                    <Ticket className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-extrabold tracking-tight text-white text-base">CampusTix Entry Pass</span>
                </div>
                <div className="ticket-muted-invert text-xs text-purple-300 font-mono">
                  {booking.eventCategory} · Academic Year 2026
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Booking Reference</div>
                <div className="font-mono text-sm sm:text-base font-bold text-white tabular-nums tracking-wide">
                  {booking.bookingId}
                </div>
              </div>
            </div>

            {/* Main Pass Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 items-center">
              {/* Event Info Column */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="ticket-text-invert text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
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
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                    <span>{booking.eventVenue}</span>
                  </div>
                </div>

                {/* Attendee Details */}
                <div className="ticket-dark-invert grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-indigo-950 bg-[#090b1e] p-3 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Attendee</div>
                    <div className="ticket-text-invert font-semibold text-white truncate">{booking.userName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Roll Number</div>
                    <div className="ticket-text-invert font-mono font-semibold text-white">{booking.userRollNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Reserved Seats</div>
                    <div className="ticket-text-invert font-mono font-bold text-purple-300">
                      {booking.seatNumbers.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Pass Tier: <strong className="text-white">{booking.tierName}</strong></span>
                  <span className="font-mono tabular-nums">
                    Paid: <strong className="text-white">{booking.totalAmount === 0 ? 'Free' : `₹${booking.totalAmount}`}</strong> ({booking.paymentMethod.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* QR Code Column */}
              <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-indigo-900/60 pt-4 md:pt-0 md:pl-6 text-center">
                {booking.qrCodeDataUrl ? (
                  <div className="rounded-xl bg-white p-2.5 shadow-md">
                    <img
                      src={booking.qrCodeDataUrl}
                      alt={`QR Pass for ${booking.bookingId}`}
                      className="h-36 w-36 object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-36 w-36 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                    QR Code
                  </div>
                )}
                <div className="ticket-text-invert font-mono text-[11px] font-bold text-slate-300 mt-2">
                  SCAN AT GATE ENTRY
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>Tamper-proof crypto payload</span>
                </div>
              </div>
            </div>

            {/* Ticket Perforation Tear Line */}
            <div className="relative py-2">
              <div className="border-t-2 border-dashed border-indigo-900/80" />
              <div className="absolute -left-9 -top-2.5 h-5 w-5 rounded-full bg-[#0a0d1f]" />
              <div className="absolute -right-9 -top-2.5 h-5 w-5 rounded-full bg-[#0a0d1f]" />
            </div>

            {/* Ticket Footer Notes */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-slate-400">
              <div>Valid University Photo ID required along with this digital or printed pass.</div>
              <div className="font-mono text-slate-400">ID: {booking.id.slice(-8)}</div>
            </div>
          </div>
        </div>

        {/* Action Controls (Hidden during print) */}
        <div className="no-print flex items-center justify-between border-t border-indigo-950/80 bg-[#080a18] px-6 py-4">
          <button
            onClick={onViewMyBookings}
            className="text-xs text-purple-300 hover:text-white transition-colors"
          >
            Go to My Passes Tab →
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-950 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-900 transition-all border border-indigo-800/80"
            >
              <Printer className="h-4 w-4" />
              <span>Print Ticket</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
