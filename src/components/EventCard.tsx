import React from 'react';
import { Calendar, Clock, MapPin, Users, Ticket, ArrowRight } from 'lucide-react';
import { CampusEvent } from '../types.ts';

interface EventCardProps {
  event: CampusEvent;
  onSelectEvent: (event: CampusEvent) => void;
  onReserveClick: (event: CampusEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelectEvent,
  onReserveClick,
}) => {
  // Lowest price calculation
  const lowestPrice = event.tiers.length > 0 ? Math.min(...event.tiers.map((t) => t.price)) : 0;
  const isFree = lowestPrice === 0;

  // Format date nicely: e.g. "Sat, Nov 14, 2026"
  const formattedDate = new Date(event.date + 'T12:00:00Z').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const percentOccupied = Math.round(
    ((event.totalCapacity - event.availableSeats) / event.totalCapacity) * 100
  );

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#2b273b] bg-[#171520] transition-all duration-300 hover:border-[#8B5CF6]/60 hover:shadow-xl hover:shadow-[#8B5CF6]/10">
      {/* Event Media Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={event.image}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171520] via-transparent to-black/40" />

        {/* Clean price display overlay */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-[#121116]/90 px-2.5 py-1 backdrop-blur-md border border-[#38334b]">
          <span className="font-mono text-xs font-bold text-white tabular-nums">
            {isFree ? 'Free Pass' : `From ₹${lowestPrice}`}
          </span>
        </div>

        {/* Category kicker */}
        <div className="absolute top-3 left-3 rounded bg-[#121116]/90 px-2.5 py-0.5 text-[11px] font-semibold text-[#C4B5FD] border border-[#8B5CF6]/30 backdrop-blur-md">
          {event.category}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Unboxed Metadata with · separator */}
        <div className="flex items-center gap-2 text-xs text-[#C4B5FD]/70">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-[#FF7F6B]" />
            <span>{formattedDate}</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1 font-mono tabular-nums">
            <Clock className="h-3 w-3 text-[#8B5CF6]" />
            <span>{event.startTime}</span>
          </span>
        </div>

        {/* Event Title */}
        <h3
          onClick={() => onSelectEvent(event)}
          className="mt-2.5 text-base sm:text-lg font-bold text-white hover:text-[#C4B5FD] cursor-pointer transition-colors line-clamp-1"
        >
          {event.title}
        </h3>

        {/* Tagline / Brief */}
        <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {event.tagline || event.description}
        </p>

        {/* Venue Info */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 truncate">
          <MapPin className="h-3.5 w-3.5 text-[#FF7F6B] shrink-0" />
          <span className="truncate">{event.venue}</span>
        </div>

        {/* Capacity / Availability Progress Bar */}
        <div className="mt-4 pt-3 border-t border-[#262233]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-[11px]">
              <Users className="h-3 w-3 text-[#8B5CF6]" />
              <span>Available Seats</span>
            </span>
            <span className="font-mono text-xs font-semibold text-white tabular-nums">
              {event.availableSeats} / {event.totalCapacity}
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#262233]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                event.availableSeats < 20
                  ? 'bg-red-500'
                  : event.availableSeats < 60
                  ? 'bg-[#FF7F6B]'
                  : 'bg-gradient-to-r from-[#8B5CF6] to-[#FF7F6B]'
              }`}
              style={{ width: `${Math.min(100, Math.max(8, percentOccupied))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-[#262233] bg-[#121116] px-5 py-3">
        <button
          onClick={() => onSelectEvent(event)}
          className="text-xs font-medium text-[#C4B5FD] hover:text-white transition-colors"
        >
          Event Agenda
        </button>

        <button
          onClick={() => onReserveClick(event)}
          disabled={event.availableSeats === 0}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            event.availableSeats === 0
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-[#FF7F6B] text-slate-950 hover:bg-[#ff6e57] shadow-sm font-semibold'
          }`}
        >
          <Ticket className="h-3.5 w-3.5 text-slate-950" />
          <span>{event.availableSeats === 0 ? 'Housefull' : 'Book Tickets'}</span>
          {event.availableSeats > 0 && <ArrowRight className="h-3 w-3 text-slate-950" />}
        </button>
      </div>
    </div>
  );
};
