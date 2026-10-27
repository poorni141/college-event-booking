import React, { useState } from 'react';
import { X, ShieldAlert, Check, Clock, Info, ArrowRight } from 'lucide-react';
import { CampusEvent, Seat, TicketTier } from '../types.ts';

interface SeatSelectionModalProps {
  event: CampusEvent | null;
  onClose: () => void;
  onHoldSeats: (eventId: string, tierId: string, seatNumbers: string[]) => void;
  error?: string | null;
}

export const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({
  event,
  onClose,
  onHoldSeats,
  error,
}) => {
  if (!event) return null;

  const [selectedTierId, setSelectedTierId] = useState<string>(
    event.tiers[0]?.id || 'tier-general'
  );
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedTier = event.tiers.find((t) => t.id === selectedTierId) || event.tiers[0];

  // Group seats by row (A, B, C, D, E, F)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsByRow: Record<string, Seat[]> = {};
  rows.forEach((r) => {
    seatsByRow[r] = event.seats.filter((s) => s.row === r);
  });

  const autoSelectSeats = (count: number) => {
    setLocalError(null);
    const available = event.seats.filter((s) => s.status === 'available');
    if (available.length < count) {
      setLocalError(`Only ${available.length} seats currently available for this event.`);
      return;
    }
    const picked = available.slice(0, count).map((s) => s.seatNumber);
    setSelectedSeatNumbers(picked);
  };

  const toggleSeat = (seat: Seat) => {
    setLocalError(null);
    if (seat.status !== 'available') return;

    if (selectedSeatNumbers.includes(seat.seatNumber)) {
      setSelectedSeatNumbers(selectedSeatNumbers.filter((num) => num !== seat.seatNumber));
    } else {
      if (selectedSeatNumbers.length >= 4) {
        setLocalError('Maximum 4 seats allowed per collegiate student reservation.');
        return;
      }
      setSelectedSeatNumbers([...selectedSeatNumbers, seat.seatNumber]);
    }
  };

  const handleHold = () => {
    if (selectedSeatNumbers.length === 0) {
      setLocalError('Please select at least 1 seat on the auditorium map.');
      return;
    }
    onHoldSeats(event.id, selectedTierId, selectedSeatNumbers);
  };

  const totalAmount = (selectedTier?.price || 0) * selectedSeatNumbers.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-indigo-900/60 bg-[#0c0f24] shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-950/80 px-6 py-4 bg-[#090b17]">
          <div>
            <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
              {event.category} · Seat Allocation Map
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
              {event.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-12rem)] overflow-y-auto">
          {/* Tier Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Ticket Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {event.tiers.map((tier) => {
                const isSelected = tier.id === selectedTierId;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`flex items-start justify-between rounded-xl p-3 text-left transition-all border ${
                      isSelected
                        ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500'
                        : 'border-indigo-950 bg-[#111538] hover:border-indigo-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white text-xs">{tier.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{tier.description}</div>
                    </div>
                    <div className="font-mono font-bold text-sm text-purple-300 tabular-nums shrink-0 ml-2">
                      {tier.price === 0 ? 'Free' : `₹${tier.price}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ticket Quantity Quick Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Ticket Quantity
              </label>
              <span className="text-[11px] text-slate-400">
                Limit: 4 tickets per student
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((qty) => {
                const isSelected = selectedSeatNumbers.length === qty;
                return (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => autoSelectSeats(qty)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-900/40'
                        : 'border-indigo-950 bg-[#12163b] text-slate-300 hover:border-indigo-800 hover:text-white'
                    }`}
                  >
                    {qty} {qty === 1 ? 'Ticket' : 'Tickets'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Seating Layout */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Auditorium Seating Matrix
              </span>
              <span className="text-[11px] text-slate-400">
                Selected: <strong className="text-purple-300 font-mono tabular-nums">{selectedSeatNumbers.length}</strong> / 4 max
              </span>
            </div>

            {/* Stage Graphic */}
            <div className="mb-6 flex flex-col items-center">
              <div className="w-3/4 h-2.5 rounded-full bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 shadow-md shadow-purple-500/30" />
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mt-1.5">
                Front Stage / Performance Deck
              </div>
            </div>

            {/* Grid of Seats */}
            <div className="space-y-2.5 max-w-lg mx-auto bg-[#0a0d1f] p-4 rounded-xl border border-indigo-950">
              {rows.map((rowName) => {
                const rowSeats = seatsByRow[rowName] || [];
                return (
                  <div key={rowName} className="flex items-center justify-center gap-2">
                    <span className="w-5 text-right font-mono text-xs font-bold text-slate-500">
                      {rowName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {rowSeats.map((seat) => {
                        const isSelected = selectedSeatNumbers.includes(seat.seatNumber);
                        const isBooked = seat.status === 'booked';
                        const isHeld = seat.status === 'held';
                        const isAvailable = seat.status === 'available';

                        return (
                          <button
                            key={seat.id}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => toggleSeat(seat)}
                            title={
                              isBooked
                                ? `Seat ${seat.seatNumber} (Booked)`
                                : isHeld
                                ? `Seat ${seat.seatNumber} (Under 10-Min Hold)`
                                : `Seat ${seat.seatNumber} (Available)`
                            }
                            className={`h-8 w-8 rounded-lg text-[10px] font-mono font-semibold transition-all flex items-center justify-center ${
                              isSelected
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50 scale-105 border border-purple-400 ring-2 ring-purple-400/30'
                                : isBooked
                                ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-900 line-through'
                                : isHeld
                                ? 'bg-amber-950/60 text-amber-500/70 border border-amber-900/40 cursor-not-allowed'
                                : 'bg-[#151a3a] text-slate-300 hover:bg-purple-900/60 hover:text-white border border-indigo-900/60 hover:border-purple-500/50'
                            }`}
                          >
                            {isSelected ? <Check className="h-3.5 w-3.5" /> : seat.seatNumber}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 mt-4">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-[#151a3a] border border-indigo-900" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-purple-600" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-amber-950/60 border border-amber-900" />
                <span>Held (10m Lock)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-slate-900 line-through text-slate-600 text-[9px] flex items-center justify-center">
                  ✕
                </div>
                <span>Booked</span>
              </div>
            </div>
          </div>

          {/* 10-Minute Hold Guarantee Alert */}
          <div className="flex items-start gap-2.5 rounded-xl border border-indigo-950 bg-[#101438] p-3 text-xs text-slate-300">
            <Clock className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">10-Minute Atomic Hold Guarantee: </span>
              Once you proceed, your chosen seats will be locked exclusively for you for 10 minutes, preventing duplicate reservations and overselling.
            </div>
          </div>

          {/* Errors */}
          {(localError || error) && (
            <div className="rounded-lg border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-300 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
              <span>{localError || error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-indigo-950/80 bg-[#090b17] px-6 py-4">
          <div>
            <div className="text-xs text-slate-400">
              {selectedSeatNumbers.length > 0 ? (
                <span>
                  Seats: <strong className="text-white font-mono">{selectedSeatNumbers.join(', ')}</strong>
                </span>
              ) : (
                <span>No seats selected</span>
              )}
            </div>
            <div className="text-base font-bold text-white font-mono tabular-nums">
              Total: {totalAmount === 0 ? 'Free' : `₹${totalAmount}`}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleHold}
              disabled={selectedSeatNumbers.length === 0}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold text-white transition-all shadow-md ${
                selectedSeatNumbers.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-950/50'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Hold Seats (10m)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
