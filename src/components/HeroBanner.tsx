import React from 'react';
import { Search, Sparkles, ArrowRight, Calendar, Users, Ticket, CheckCircle2 } from 'lucide-react';
import { EventCategory } from '../types.ts';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: EventCategory | 'All';
  onSelectCategory: (cat: EventCategory | 'All') => void;
  onExploreClick: () => void;
  totalEventsCount: number;
}

const CATEGORIES: (EventCategory | 'All')[] = [
  'All',
  'Culturals',
  'Symposium',
  'Hackathon',
  'Music Night',
  'Dance Competition',
  'Sports Meet',
  'Workshops',
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onExploreClick,
  totalEventsCount,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2a2638] bg-gradient-to-b from-[#1c1a24] via-[#16141e] to-[#121116] shadow-2xl">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_college_festival_1793106902279.jpg"
          alt="College campus festival night"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-25 mix-blend-luminosity filter saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121116] via-[#121116]/85 to-[#1c1a24]/60" />
      </div>

      {/* Decorative ambient radial glow in rich violet and warm coral */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#8B5CF6]/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-12 -right-32 h-96 w-96 rounded-full bg-[#FF7F6B]/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:px-8 sm:py-16 text-center">
        {/* Natural kicker */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#231f33]/60 px-3.5 py-1 text-xs font-medium text-[#C4B5FD] backdrop-blur-sm mb-4">
          <Sparkles className="h-3.5 w-3.5 text-[#FF7F6B]" />
          <span>Official University Event Reservation Portal · Academic Year 2026</span>
        </div>

        {/* Headline with exact wording requested */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight sm:leading-tight">
          Your Next Big Campus Moment.
        </h1>

        {/* Subtitle with exact wording requested */}
        <p className="mt-4 text-sm sm:text-base text-[#C4B5FD]/90 max-w-2xl mx-auto leading-relaxed">
          Discover exciting campus events, book your tickets, and make memories that last.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center rounded-xl border border-[#342f47] bg-[#191722]/90 p-1.5 shadow-xl shadow-black/40 backdrop-blur-md focus-within:border-[#8B5CF6] focus-within:ring-2 focus-within:ring-[#8B5CF6]/20 transition-all">
            <Search className="ml-3 h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by event title, symposium, venue, or artist..."
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="px-2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
            <button
              onClick={onExploreClick}
              className="flex items-center gap-1.5 rounded-lg bg-[#FF7F6B] hover:bg-[#ff6e57] px-4 py-2 text-xs font-semibold text-slate-950 shadow-md transition-all shrink-0 font-medium"
            >
              <span>Explore</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-950" />
            </button>
          </div>
        </div>

        {/* Functional Category Filter Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 max-w-4xl mx-auto">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30'
                    : 'bg-[#1e1b29]/80 text-[#C4B5FD] hover:bg-[#282438] hover:text-white border border-[#2a2638]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Key Quantitative Proof Metrics */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#2a2638] max-w-3xl mx-auto text-left">
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">{totalEventsCount}</div>
            <div className="text-xs text-[#C4B5FD]/70">Campus Events</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#FF7F6B] tabular-nums">10 Min</div>
            <div className="text-xs text-[#C4B5FD]/70">Atomic Seat Hold</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#8B5CF6] tabular-nums">100%</div>
            <div className="text-xs text-[#C4B5FD]/70">Verified QR Tickets</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">₹0 - ₹499</div>
            <div className="text-xs text-[#C4B5FD]/70">Subsidized Tiers</div>
          </div>
        </div>
      </div>
    </div>
  );
};
