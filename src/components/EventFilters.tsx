import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { EventCategory } from '../types.ts';

interface EventFiltersProps {
  selectedCategory: EventCategory | 'All';
  onSelectCategory: (cat: EventCategory | 'All') => void;
  sortBy: 'date' | 'price' | 'seats';
  onSortChange: (sort: 'date' | 'price' | 'seats') => void;
  filteredCount: number;
  totalCount: number;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-indigo-950/60">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-purple-400" />
        <span className="text-sm font-semibold text-white">Upcoming Campus Schedule</span>
        <span className="text-xs text-slate-400 font-mono">
          ({filteredCount} of {totalCount} events)
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
          <span>Sort by:</span>
        </div>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'date' | 'price' | 'seats')}
          className="rounded-lg border border-indigo-950/80 bg-[#101432] px-3 py-1.5 text-xs font-medium text-slate-200 focus:border-purple-500 focus:outline-none"
        >
          <option value="date">Date (Earliest First)</option>
          <option value="price">Price (Low to High)</option>
          <option value="seats">Available Seats</option>
        </select>
      </div>
    </div>
  );
};
