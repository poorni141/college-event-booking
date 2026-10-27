import React from 'react';
import { X, Database, Server, ShieldCheck, Clock, QrCode, Cpu, Code2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-indigo-900/70 bg-[#0c0f29] shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-950 px-6 py-4 bg-[#080a18]">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">
              CampusTix System Architecture & Technical Specifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-8rem)] overflow-y-auto text-xs text-slate-300">
          {/* Tech Stack Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-indigo-950 bg-[#111438] p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Server className="h-4 w-4" />
                <span>Frontend & Client</span>
              </div>
              <p className="text-[11px] text-slate-400">
                React 19, TypeScript, Tailwind CSS v4, Lucide icons, Motion, Canvas-Confetti, and client-side QR renderer.
              </p>
            </div>

            <div className="rounded-xl border border-indigo-950 bg-[#111438] p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Code2 className="h-4 w-4" />
                <span>Backend API</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Node.js Express REST API (<code className="text-purple-300">server.ts</code>), SHA-256 password hashing, atomic hold manager, CSV streamer.
              </p>
            </div>

            <div className="rounded-xl border border-indigo-950 bg-[#111438] p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-pink-400 font-bold">
                <Database className="h-4 w-4" />
                <span>Database & ORM</span>
              </div>
              <p className="text-[11px] text-slate-400">
                PostgreSQL schema with Prisma ORM (<code className="text-purple-300">prisma/schema.prisma</code>), migrations, seed scripts, and resilient browser sync.
              </p>
            </div>
          </div>

          {/* 10-Minute Hold Mechanism */}
          <div className="rounded-xl border border-purple-900/50 bg-purple-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Clock className="h-4 w-4 text-purple-400" />
              <span>Atomic 10-Minute Hold & Concurrency Control</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              To prevent overselling and race-condition double bookings during peak campus festival rushes, CampusTix employs a two-phase reservation protocol:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] pl-1">
              <li>
                <strong>Phase 1 (Lock):</strong> When a student selects seats, an atomic lock transaction marks the requested seats as <code className="text-amber-300">HELD</code> and sets a 10-minute expiry timestamp (<code className="font-mono">Date.now() + 600,000ms</code>).
              </li>
              <li>
                <strong>Phase 2 (Confirm / Release):</strong> If checkout completes within 10 minutes, seats are permanently marked <code className="text-emerald-300">BOOKED</code> and a verified QR entry pass is generated. If the timer expires or the user cancels, seats are automatically unlocked back to <code className="text-purple-300">AVAILABLE</code>.
              </li>
            </ol>
          </div>

          {/* Fallback Engine & Real Backend Requirements Matrix */}
          <div className="rounded-xl border border-indigo-950 bg-[#101438] p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Preview Mode Capabilities vs. Real Backend Requirements</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              To guarantee seamless testing in this preview sandbox, CampusTix provides a working local persistence engine that strictly mirrors the Prisma schema. Here is the exact breakdown:
            </p>

            <div className="overflow-x-auto rounded-lg border border-indigo-950/80 mt-2">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="bg-[#080a18] text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="px-3 py-2">Capability</th>
                    <th className="px-3 py-2">Preview Sandbox (Active)</th>
                    <th className="px-3 py-2">Requires Real Backend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/60 font-sans">
                  <tr>
                    <td className="px-3 py-2 font-medium text-white">Student Registration & Auth</td>
                    <td className="px-3 py-2 text-emerald-400">Functional (Local & Demo Accounts)</td>
                    <td className="px-3 py-2 text-slate-400">PostgreSQL Users table + bcrypt + JWT</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-white">Event CRUD & Browsing</td>
                    <td className="px-3 py-2 text-emerald-400">Functional (Full CRUD + LocalStorage)</td>
                    <td className="px-3 py-2 text-slate-400">PostgreSQL Events & Tiers relations</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-white">10-Min Atomic Seat Locks</td>
                    <td className="px-3 py-2 text-emerald-400">Functional (In-session auto-release timer)</td>
                    <td className="px-3 py-2 text-slate-400">Redis distributed locks / DB row locks</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-white">Duplicate Booking Prevention</td>
                    <td className="px-3 py-2 text-emerald-400">Functional (Guards against duplicate passes)</td>
                    <td className="px-3 py-2 text-slate-400">Database UNIQUE constraints & ACID rollbacks</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-white">QR Code Generation & Print</td>
                    <td className="px-3 py-2 text-emerald-400">Functional (Real scannable crypto payload)</td>
                    <td className="px-3 py-2 text-slate-400">Physical gate laser scanner API integration</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-white">Attendee Roster CSV Export</td>
                    <td className="px-3 py-2 text-emerald-400">Functional (Direct browser CSV download)</td>
                    <td className="px-3 py-2 text-slate-400">Server stream pipeline for massive rosters</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-white">Cross-Device Concurrency</td>
                    <td className="px-3 py-2 text-amber-400">Single Browser / Tab Scope</td>
                    <td className="px-3 py-2 text-purple-300">Requires central PostgreSQL & WebSockets</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-white">Real Payment Gateway</td>
                    <td className="px-3 py-2 text-amber-400">Simulated (Demo Sandbox UPI/Card)</td>
                    <td className="px-3 py-2 text-purple-300">Requires Razorpay/Stripe live webhook secret</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* QR Pass Security */}
          <div className="rounded-xl border border-indigo-950 bg-[#101438] p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <QrCode className="h-4 w-4 text-indigo-400" />
              <span>Cryptographic QR Passes & Boarding-Pass Layout</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every booking generates a unique Booking ID (e.g., <code className="font-mono text-purple-300">CTIX-2026-X89K2</code>) paired with a high-density QR code rendered via the QR engine containing the attendee name, roll number, seat matrix, and event timestamp for physical gate scanning.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-indigo-950 bg-[#080a18] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
          >
            Close System Specs
          </button>
        </div>
      </div>
    </div>
  );
};
