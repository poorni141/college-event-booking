import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Clock,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Lock,
  ArrowRight,
  AlertTriangle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { BookingHold, CampusEvent, User } from '../types.ts';

interface CheckoutModalProps {
  hold: BookingHold | null;
  event: CampusEvent | null;
  currentUser: User;
  onConfirm: (paymentMethod: 'upi' | 'card' | 'free', reference: string) => Promise<boolean>;
  onCancelHold: (holdId: string) => void;
  onHoldExpired: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  hold,
  event,
  currentUser,
  onConfirm,
  onCancelHold,
  onHoldExpired,
}) => {
  if (!hold || !event) return null;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>(
    hold.totalAmount === 0 ? 'upi' : 'upi'
  );
  const [upiId, setUpiId] = useState(`${currentUser.rollNumber?.toLowerCase() || 'student'}@okhdfcbank`);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('420');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState<number>(Math.max(0, hold.expiresAt - Date.now()));

  // 10-Minute Hold Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, hold.expiresAt - Date.now());
      setTimeLeftMs(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        onHoldExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [hold.expiresAt, onHoldExpired]);

  // Format mm:ss
  const totalSeconds = Math.floor(timeLeftMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalDurationMs = 10 * 60 * 1000;
  const percentLeft = Math.round((timeLeftMs / totalDurationMs) * 100);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    // Simulate payment authorization network latency (1.2s)
    await new Promise((r) => setTimeout(r, 1200));

    const method = hold.totalAmount === 0 ? 'free' : paymentMethod;
    const ref =
      method === 'upi'
        ? `UPI-${Math.floor(10000000 + Math.random() * 90000000)}`
        : `CARD-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const success = await onConfirm(method, ref);
    setIsProcessing(false);

    if (success) {
      // Trigger festive confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#38bdf8', '#fbbf24'],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-indigo-900/70 bg-[#0b0e24] shadow-2xl my-6">
        {/* Top 10-Minute Hold Status Strip */}
        <div
          className={`flex items-center justify-between px-6 py-3 border-b text-xs transition-colors ${
            minutes < 2
              ? 'bg-red-950/70 border-red-900/60 text-red-200'
              : 'bg-[#12163b] border-indigo-950/80 text-purple-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 ${minutes < 2 ? 'text-red-400 animate-pulse' : 'text-purple-400'}`} />
            <span className="font-semibold">
              Seats Held Exclusively for You:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold tabular-nums">
              {formattedTime}
            </span>
            <span className="text-[10px] text-slate-400">(Auto-release on expiry)</span>
          </div>
        </div>

        {/* Progress line */}
        <div className="h-1 w-full bg-slate-800">
          <div
            className={`h-full transition-all duration-1000 ${
              minutes < 2 ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'
            }`}
            style={{ width: `${percentLeft}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-950/80 px-6 py-4 bg-[#080a16]">
          <div>
            <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
              Student Ticket Reservation Checkout
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
              {event.title}
            </h3>
          </div>
          <button
            onClick={() => onCancelHold(hold.holdId)}
            className="rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cancel and release seats"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmitPayment} className="p-6 space-y-5 max-h-[calc(85vh-12rem)] overflow-y-auto">
          {/* Reservation Summary Card */}
          <div className="rounded-xl border border-indigo-950 bg-[#101438] p-4 text-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-900/60">
              <span className="text-slate-400">Student Attendee:</span>
              <span className="font-semibold text-white">
                {currentUser.name} ({currentUser.rollNumber || 'Student'})
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-indigo-900/60">
              <span className="text-slate-400">Locked Seats:</span>
              <span className="font-mono font-bold text-purple-300">
                {hold.seatNumbers.join(', ')} ({hold.ticketCount} {hold.ticketCount === 1 ? 'seat' : 'seats'})
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-indigo-900/60">
              <span className="text-slate-400">Event Venue & Timing:</span>
              <span className="text-slate-300 text-right">
                {event.venue} · {event.date} at {event.startTime}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-semibold text-white">Total Amount Due:</span>
              <span className="font-mono text-base font-extrabold text-white tabular-nums">
                {hold.totalAmount === 0 ? 'Free Pass' : `₹${hold.totalAmount}`}
              </span>
            </div>
          </div>

          {/* Payment Method Selector (Demo Mode) */}
          {hold.totalAmount > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Payment Mode (Demo Sandbox)
                </label>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  No Real Charges
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-semibold transition-all border ${
                    paymentMethod === 'upi'
                      ? 'border-purple-500 bg-purple-950/40 text-white ring-1 ring-purple-500'
                      : 'border-indigo-950 bg-[#121636] text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="h-4 w-4 text-purple-400" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-semibold transition-all border ${
                    paymentMethod === 'card'
                      ? 'border-purple-500 bg-purple-950/40 text-white ring-1 ring-purple-500'
                      : 'border-indigo-950 bg-[#121636] text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="h-4 w-4 text-indigo-400" />
                  <span>Debit / Credit Card</span>
                </button>
              </div>

              {/* UPI Tab */}
              {paymentMethod === 'upi' && (
                <div className="rounded-xl border border-indigo-950/80 bg-[#0e1230] p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold text-white">Instant UPI Auto-Verification</span>
                    <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800/60">
                      GPay / PhonePe / Paytm / BHIM
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Enter Student VPA / UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@oksbi"
                      className="w-full rounded-lg border border-indigo-900/60 bg-[#151a42] px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="rounded-lg bg-indigo-950/30 p-2.5 text-[11px] text-slate-400 flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-purple-400 shrink-0" />
                    <span>Demo mode automatically verifies transaction upon clicking submit.</span>
                  </div>
                </div>
              )}

              {/* Card Tab */}
              {paymentMethod === 'card' && (
                <div className="rounded-xl border border-indigo-950/80 bg-[#0e1230] p-4 space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Card Number (Demo Pre-filled)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full rounded-lg border border-indigo-900/60 bg-[#151a42] px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                      />
                      <CreditCard className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full rounded-lg border border-indigo-900/60 bg-[#151a42] px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        className="w-full rounded-lg border border-indigo-900/60 bg-[#151a42] px-3 py-2 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4 text-xs text-emerald-300 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-semibold text-white">Free Sponsored Student Event</div>
                <div>No payment required. Click below to lock seats and issue entry ticket.</div>
              </div>
            </div>
          )}

          {/* Sandbox Notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <Lock className="h-3.5 w-3.5 text-slate-500" />
            <span>Encrypted with collegiate event ticketing authentication standard.</span>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-indigo-950/80">
            <button
              type="button"
              onClick={() => onCancelHold(hold.holdId)}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              Release Seats
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-950/50 hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authorizing Ticket Pass...</span>
                </>
              ) : (
                <>
                  <span>
                    {hold.totalAmount === 0 ? 'Claim Free Ticket' : `Pay ₹${hold.totalAmount} & Get QR Pass`}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
