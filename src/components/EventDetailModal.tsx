import React from 'react';
import { X, Calendar, Clock, MapPin, User, ShieldCheck, Ticket, CheckCircle2, ArrowRight } from 'lucide-react';
import { CampusEvent } from '../types.ts';

interface EventDetailModalProps {
  event: CampusEvent | null;
  onClose: () => void;
  onReserve: (event: CampusEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onReserve,
}) => {
  if (!event) return null;

  const formattedDate = new Date(event.date + 'T12:00:00Z').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-indigo-900/60 bg-[#0c0f24] shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2 text-slate-300 hover:text-white hover:bg-black/80 backdrop-blur-md transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Header with Media */}
        <div className="relative h-64 w-full overflow-hidden bg-slate-900">
          <img
            src={event.image}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f24] via-[#0c0f24]/50 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block rounded bg-purple-600/90 px-2.5 py-0.5 text-xs font-semibold text-white uppercase tracking-wider mb-2">
              {event.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-16rem)] overflow-y-auto">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-indigo-950 bg-[#111536] p-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Date</div>
                <div className="font-semibold text-white">{formattedDate}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Timing</div>
                <div className="font-semibold text-white font-mono tabular-nums">
                  {event.startTime} - {event.endTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-pink-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Venue</div>
                <div className="font-semibold text-white truncate">{event.venue}</div>
              </div>
            </div>
          </div>

          {/* About Event */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
              About This Event
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {event.description}
            </p>
            {event.locationDetails && (
              <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-slate-500" />
                <span>Location Landmark: {event.locationDetails}</span>
              </p>
            )}
          </div>

          {/* Schedule / Agenda */}
          {event.schedule && event.schedule.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
                Event Schedule & Highlights
              </h4>
              <div className="space-y-2.5">
                {event.schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-indigo-950/60 bg-[#0e122b] p-3 text-xs"
                  >
                    <span className="font-mono font-bold text-purple-300 shrink-0 pt-0.5">
                      {item.time}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-slate-400 mt-0.5">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ticket Tiers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
              Available Pass Categories
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="rounded-xl border border-indigo-950 bg-[#121636] p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white text-sm">{tier.name}</span>
                      <span className="font-mono font-bold text-sm text-purple-300 tabular-nums">
                        {tier.price === 0 ? 'Free' : `₹${tier.price}`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{tier.description}</p>
                    <div className="space-y-1">
                      {tier.perks.map((perk, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules & Guidelines */}
          {event.rules && event.rules.length > 0 && (
            <div className="rounded-xl border border-amber-900/30 bg-amber-950/15 p-4 text-xs">
              <h4 className="font-semibold text-amber-300 flex items-center gap-1.5 mb-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>Entry Guidelines & Code of Conduct</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                {event.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Organizer Info */}
          <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-indigo-950/70">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-purple-400" />
              <span>Organized by: <strong className="text-slate-200">{event.organizer}</strong></span>
            </span>
            {event.organizerContact && (
              <span className="text-slate-500 font-mono">{event.organizerContact}</span>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-indigo-900/60 bg-[#090b17] px-6 py-4">
          <div>
            <div className="text-xs text-slate-400">Inventory Status</div>
            <div className="text-sm font-semibold text-white">
              {event.availableSeats > 0 ? (
                <span className="text-emerald-400 font-mono tabular-nums">{event.availableSeats} seats left</span>
              ) : (
                <span className="text-red-400">Sold out</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onReserve(event);
              }}
              disabled={event.availableSeats === 0}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all ${
                event.availableSeats === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-950/50'
              }`}
            >
              <Ticket className="h-4 w-4" />
              <span>Book Tickets</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
