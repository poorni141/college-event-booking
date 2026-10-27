import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Download,
  DollarSign,
  Ticket,
  Users,
  Percent,
  Edit2,
  Trash2,
  Search,
  Calendar,
  Clock,
  MapPin,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Booking, CampusEvent, EventCategory, SalesStats, TicketTier, User } from '../types.ts';

interface AdminDashboardProps {
  stats: SalesStats;
  events: CampusEvent[];
  bookings: Booking[];
  users: User[];
  onCreateEvent: (eventData: Omit<CampusEvent, 'id' | 'seats' | 'createdAt'>) => void;
  onUpdateEvent: (id: string, updates: Partial<CampusEvent>) => void;
  onDeleteEvent: (id: string) => void;
  onExportCsv: () => void;
}

const CATEGORIES: EventCategory[] = [
  'Culturals',
  'Symposium',
  'Hackathon',
  'Music Night',
  'Dance Competition',
  'Sports Meet',
  'Workshops',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  events,
  bookings,
  users,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onExportCsv,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'events' | 'attendees' | 'users'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CampusEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<CampusEvent | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<EventCategory>('Culturals');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState('2026-11-25');
  const [formStartTime, setFormStartTime] = useState('18:00');
  const [formEndTime, setFormEndTime] = useState('21:00');
  const [formVenue, setFormVenue] = useState('');
  const [formCapacity, setFormCapacity] = useState(250);
  const [formPrice, setFormPrice] = useState(150);
  const [formOrganizer, setFormOrganizer] = useState('Student Affairs Council');

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormTitle('');
    setFormCategory('Culturals');
    setFormTagline('');
    setFormDescription('');
    setFormDate('2026-11-25');
    setFormStartTime('18:00');
    setFormEndTime('21:00');
    setFormVenue('Campus Auditorium');
    setFormCapacity(200);
    setFormPrice(150);
    setFormOrganizer('Student Affairs Council');
    setShowEventModal(true);
  };

  const openEditModal = (event: CampusEvent) => {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormCategory(event.category);
    setFormTagline(event.tagline || '');
    setFormDescription(event.description);
    setFormDate(event.date);
    setFormStartTime(event.startTime);
    setFormEndTime(event.endTime);
    setFormVenue(event.venue);
    setFormCapacity(event.totalCapacity);
    setFormPrice(event.tiers[0]?.price || 0);
    setFormOrganizer(event.organizer);
    setShowEventModal(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formVenue) return;

    const tiers: TicketTier[] = [
      {
        id: 'tier-general',
        name: 'General Admission',
        price: Number(formPrice),
        capacity: Number(formCapacity),
        available: Number(formCapacity),
        description: 'Standard event access',
        perks: ['Event entry', 'Attendee badge'],
      },
    ];

    if (editingEvent) {
      onUpdateEvent(editingEvent.id, {
        title: formTitle,
        category: formCategory,
        tagline: formTagline,
        description: formDescription,
        date: formDate,
        startTime: formStartTime,
        endTime: formEndTime,
        venue: formVenue,
        totalCapacity: Number(formCapacity),
        organizer: formOrganizer,
      });
    } else {
      onCreateEvent({
        title: formTitle,
        category: formCategory,
        tagline: formTagline || 'Collegiate event organized on campus',
        description: formDescription || 'Join us for this exciting university event.',
        date: formDate,
        startTime: formStartTime,
        endTime: formEndTime,
        venue: formVenue,
        locationDetails: 'Main Campus Grounds',
        totalCapacity: Number(formCapacity),
        availableSeats: Number(formCapacity),
        image: '/src/assets/images/hero_college_festival_1793106902279.jpg',
        organizer: formOrganizer,
        featured: false,
        status: 'upcoming',
        tiers,
      });
    }

    setShowEventModal(false);
  };

  // Filtered Attendees list
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.bookingId.toLowerCase().includes(q) ||
      b.userName.toLowerCase().includes(q) ||
      (b.userRollNumber && b.userRollNumber.toLowerCase().includes(q)) ||
      b.eventTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-950/70">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Shield className="h-4 w-4" />
            <span>Collegiate Dean & Event Operations Console</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Event Management & Attendee Directory
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-800 bg-[#12163b] px-3.5 py-2 text-xs font-semibold text-purple-200 hover:bg-indigo-900 hover:text-white transition-colors shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-purple-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-indigo-950/80 bg-[#0d1028] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Sales Revenue</span>
            <DollarSign className="h-4 w-4 text-purple-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white tabular-nums">
            ₹{stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all confirmed student passes</div>
        </div>

        <div className="rounded-xl border border-indigo-950/80 bg-[#0d1028] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Passes Issued</span>
            <Ticket className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white tabular-nums">
            {stats.totalTicketsSold}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{stats.totalBookings} unique transactions</div>
        </div>

        <div className="rounded-xl border border-indigo-950/80 bg-[#0d1028] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Auditorium Occupancy</span>
            <Percent className="h-4 w-4 text-pink-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white tabular-nums">
            {stats.occupancyRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Capacity utilization rate</div>
        </div>

        <div className="rounded-xl border border-indigo-950/80 bg-[#0d1028] p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Campus Events</span>
            <Calendar className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white tabular-nums">
            {stats.activeEventsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Listed on student portal</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-indigo-950/70 pb-2">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'overview'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Overview & Category Stats
        </button>
        <button
          onClick={() => setActiveSubTab('events')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'events'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Manage Events ({events.length})
        </button>
        <button
          onClick={() => setActiveSubTab('attendees')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'attendees'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Attendee Registry ({bookings.length})
        </button>
      </div>

      {/* SUBTAB 1: Overview & Category Breakdown */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Category Table */}
          <div className="rounded-xl border border-indigo-950/80 bg-[#0d1028] p-5">
            <h3 className="text-sm font-bold text-white mb-4">Ticket Sales by Event Category</h3>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => {
                const item = stats.revenueByCategory.find((c) => c.category === cat) || {
                  category: cat,
                  revenue: 0,
                  tickets: 0,
                };
                const maxRev = Math.max(1, ...stats.revenueByCategory.map((c) => c.revenue));
                const pct = Math.round((item.revenue / maxRev) * 100);

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{cat}</span>
                      <span className="font-mono text-slate-300 tabular-nums">
                        ₹{item.revenue.toLocaleString()} · {item.tickets} tickets
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Recent Registrations Stream */}
          <div className="rounded-xl border border-indigo-950/80 bg-[#0d1028] p-5">
            <h3 className="text-sm font-bold text-white mb-4">Recent Student Reservations</h3>
            <div className="space-y-2.5">
              {bookings.slice(0, 5).map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-indigo-950 bg-[#101438] text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{b.userName}</div>
                    <div className="text-[11px] text-slate-400">
                      {b.eventTitle} · <span className="font-mono">{b.seatNumbers.join(', ')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-purple-300">
                      {b.totalAmount === 0 ? 'Free' : `₹${b.totalAmount}`}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.bookingId}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Events List */}
      {activeSubTab === 'events' && (
        <div className="rounded-xl border border-indigo-950/80 bg-[#0d1028] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-indigo-950 bg-[#080a18] uppercase text-[10px] text-slate-400 font-semibold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Event Title & Category</th>
                  <th className="px-5 py-3.5">Date & Venue</th>
                  <th className="px-5 py-3.5">Capacity & Remaining</th>
                  <th className="px-5 py-3.5">Pass Price</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/60">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-[#111538]/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white text-sm">{evt.title}</div>
                      <div className="text-slate-400 text-[11px]">{evt.category} · {evt.organizer}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-slate-200">{evt.date} at {evt.startTime}</div>
                      <div className="text-slate-400 text-[11px]">{evt.venue}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-white tabular-nums">
                        {evt.availableSeats} / {evt.totalCapacity}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {Math.round(((evt.totalCapacity - evt.availableSeats) / evt.totalCapacity) * 100)}% Booked
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-semibold text-purple-300 tabular-nums">
                      {evt.tiers[0]?.price === 0 ? 'Free' : `₹${evt.tiers[0]?.price}`}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(evt)}
                          className="p-1.5 rounded-lg border border-indigo-900 bg-indigo-950/40 text-slate-300 hover:text-white hover:bg-indigo-900 transition-colors"
                          title="Edit Event"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingEvent(evt)}
                          className="p-1.5 rounded-lg border border-red-900/40 bg-red-950/20 text-red-400 hover:bg-red-900/40 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Attendees Registry */}
      {activeSubTab === 'attendees' && (
        <div className="rounded-xl border border-indigo-950/80 bg-[#0d1028] overflow-hidden space-y-4 p-5">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student, roll no, or booking ID..."
                className="w-full rounded-lg border border-indigo-900/60 bg-[#12163b] pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download CSV Attendee Roster</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-indigo-950 bg-[#080a18] uppercase text-[10px] text-slate-400 font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Roll Number</th>
                  <th className="px-4 py-3">Event Title</th>
                  <th className="px-4 py-3">Seats</th>
                  <th className="px-4 py-3">Paid Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/60">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#111538]/50">
                    <td className="px-4 py-3 font-mono font-bold text-purple-300">{b.bookingId}</td>
                    <td className="px-4 py-3 font-semibold text-white">{b.userName}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{b.userRollNumber || 'N/A'}</td>
                    <td className="px-4 py-3 max-w-[180px] truncate">{b.eventTitle}</td>
                    <td className="px-4 py-3 font-mono text-white">{b.seatNumbers.join(', ')}</td>
                    <td className="px-4 py-3 font-mono tabular-nums text-white">
                      {b.totalAmount === 0 ? 'Free' : `₹${b.totalAmount}`}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {b.bookingStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-indigo-900/70 bg-[#0b0e26] shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-indigo-950 px-6 py-4 bg-[#080a18]">
              <h3 className="text-base font-bold text-white">
                {editingEvent ? 'Edit College Event' : 'Create New College Event'}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-4 max-h-[calc(85vh-10rem)] overflow-y-auto text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Event Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Aura 2026: Annual Cultural Fest"
                  className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as EventCategory)}
                    className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Venue</label>
                  <input
                    type="text"
                    required
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    placeholder="e.g. Main Auditorium"
                    className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">End Time</label>
                  <input
                    type="time"
                    required
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Total Capacity</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={2000}
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Pass Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    placeholder="0 for free"
                    className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Short Tagline</label>
                <input
                  type="text"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="Catchy 1-sentence overview"
                  className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Event Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Full agenda, rules, guest performers..."
                  className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Organizer Name</label>
                <input
                  type="text"
                  value={formOrganizer}
                  onChange={(e) => setFormOrganizer(e.target.value)}
                  className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-950">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 font-semibold text-white shadow-md hover:from-purple-500 hover:to-indigo-500"
                >
                  {editingEvent ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Event Confirmation Modal */}
      {deletingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-900/60 bg-[#101229] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Delete College Event?</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Are you sure you want to delete <strong className="text-white font-semibold">"{deletingEvent.title}"</strong>? This will remove the event from student portal and release all allocations.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingEvent(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteEvent(deletingEvent.id);
                  setDeletingEvent(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 shadow-md"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
