import React from 'react';
import { Ticket, User as UserIcon, Shield, LogOut, Sparkles } from 'lucide-react';
import { User, Role } from '../types.ts';

interface NavbarProps {
  currentUser: User | null;
  activeTab: 'events' | 'my-bookings' | 'admin' | 'architecture';
  onNavigate: (tab: 'events' | 'my-bookings' | 'admin' | 'architecture') => void;
  onOpenAuth: () => void;
  onSwitchRole: (role: Role) => void;
  onLogout: () => void;
  activeHoldCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onNavigate,
  onOpenAuth,
  onSwitchRole,
  onLogout,
  activeHoldCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2a2638] bg-[#121116]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Wordmark / Brand */}
        <button
          onClick={() => onNavigate('events')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#FF7F6B] text-white shadow-md shadow-[#8B5CF6]/20">
            <Ticket className="h-5 w-5 rotate-[-15deg] text-white" />
          </div>
          <span className="bg-gradient-to-r from-white via-[#C4B5FD] to-[#FF7F6B] bg-clip-text text-transparent font-extrabold text-xl">
            CampusTix
          </span>
        </button>

        {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#C4B5FD]/80">
          <button
            onClick={() => onNavigate('events')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'events' ? 'text-white font-semibold' : 'hover:text-white'
            }`}
          >
            All Events
          </button>

          <button
            onClick={() => onNavigate('my-bookings')}
            className={`relative transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'my-bookings' ? 'text-white font-semibold' : 'hover:text-white'
            }`}
          >
            My Passes
            {activeHoldCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center text-[10px] font-bold px-1.5 py-0.2 bg-[#FF7F6B] text-slate-950 rounded-sm">
                Hold Active
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'admin' ? 'text-[#FF7F6B] font-semibold' : 'hover:text-white'
            }`}
          >
            <Shield className="h-3.5 w-3.5 text-[#8B5CF6]" />
            Admin Hub
          </button>

          <button
            onClick={() => onNavigate('architecture')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'architecture' ? 'text-white font-semibold' : 'hover:text-white'
            }`}
          >
            System Specs
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-white whitespace-nowrap truncate max-w-[130px]">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-[#C4B5FD] font-mono">
                  {currentUser.role === 'admin' ? 'Dean / Admin' : currentUser.rollNumber || 'Student'}
                </span>
              </div>

              {/* Fast Role Switcher Pill for reviewer convenience */}
              <button
                onClick={() => onSwitchRole(currentUser.role === 'admin' ? 'student' : 'admin')}
                title={`Switch to ${currentUser.role === 'admin' ? 'Student' : 'Admin'} View`}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-[#36304a] bg-[#1a1725] px-2.5 py-1.5 text-xs font-medium text-[#C4B5FD] hover:bg-[#252136] hover:text-white transition-colors"
              >
                <Sparkles className="h-3 w-3 text-[#FF7F6B]" />
                <span>Switch to {currentUser.role === 'admin' ? 'Student' : 'Admin'}</span>
              </button>

              <button
                onClick={onLogout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-[#FF7F6B] transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-lg bg-[#FF7F6B] hover:bg-[#ff6e57] px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden items-center justify-around border-t border-[#2a2638] px-4 py-2 text-xs font-medium text-[#C4B5FD]">
        <button
          onClick={() => onNavigate('events')}
          className={`py-1 ${activeTab === 'events' ? 'text-white font-semibold' : 'text-[#C4B5FD]/70'}`}
        >
          Events
        </button>
        <button
          onClick={() => onNavigate('my-bookings')}
          className={`py-1 ${activeTab === 'my-bookings' ? 'text-white font-semibold' : 'text-[#C4B5FD]/70'}`}
        >
          My Passes
        </button>
        <button
          onClick={() => onNavigate('admin')}
          className={`py-1 ${activeTab === 'admin' ? 'text-[#FF7F6B] font-semibold' : 'text-[#C4B5FD]/70'}`}
        >
          Admin
        </button>
        <button
          onClick={() => onNavigate('architecture')}
          className={`py-1 ${activeTab === 'architecture' ? 'text-white font-semibold' : 'text-[#C4B5FD]/70'}`}
        >
          Specs
        </button>
      </div>
    </header>
  );
};
