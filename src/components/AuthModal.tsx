import React, { useState } from 'react';
import { X, UserCheck, Shield, GraduationCap, Lock, ArrowRight } from 'lucide-react';
import { Role } from '../types.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
  onRegister: (data: {
    name: string;
    email: string;
    rollNumber?: string;
    department?: string;
    role?: Role;
  }) => void;
  onQuickDemo: (role: Role) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onQuickDemo,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [password, setPassword] = useState('password123');

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setValidationError('Please enter a valid student university email address.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'login') {
      onLogin(email);
    } else {
      if (!name || name.trim().length < 2) {
        setValidationError('Please enter your full legal student name (minimum 2 characters).');
        return;
      }
      onRegister({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        rollNumber: rollNumber.trim() || `CS-2026-${Math.floor(100 + Math.random() * 900)}`,
        department,
        role: 'student',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-indigo-900/70 bg-[#0c0f28] shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-950 px-6 py-4 bg-[#080a18]">
          <div>
            <h3 className="text-base font-bold text-white">
              {mode === 'login' ? 'Sign in to CampusTix' : 'Register Student Account'}
            </h3>
            <p className="text-[11px] text-slate-400">
              Access your college passes, reservation holds, and QR tickets
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick 1-Click Demo Profiles Strip */}
        <div className="bg-[#12163b] p-4 border-b border-indigo-950/80">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-purple-300 mb-2.5">
            Instant 1-Click Demo Access
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onQuickDemo('student');
                onClose();
              }}
              className="flex items-center gap-2 rounded-lg border border-indigo-800/80 bg-[#161b47] p-2.5 text-left text-xs font-medium text-white hover:border-purple-500 hover:bg-purple-950/40 transition-all shadow-sm"
            >
              <div className="h-7 w-7 rounded-full bg-purple-600/80 flex items-center justify-center text-white shrink-0">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="truncate">
                <div className="font-semibold text-white truncate">Alex Rivera</div>
                <div className="text-[10px] text-purple-300">Student Demo</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onQuickDemo('admin');
                onClose();
              }}
              className="flex items-center gap-2 rounded-lg border border-indigo-800/80 bg-[#161b47] p-2.5 text-left text-xs font-medium text-white hover:border-purple-500 hover:bg-purple-950/40 transition-all shadow-sm"
            >
              <div className="h-7 w-7 rounded-full bg-indigo-600/80 flex items-center justify-center text-white shrink-0">
                <Shield className="h-4 w-4" />
              </div>
              <div className="truncate">
                <div className="font-semibold text-white truncate">Prof. Vance</div>
                <div className="text-[10px] text-indigo-300">Dean / Admin</div>
              </div>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {validationError && (
            <div className="rounded-lg border border-red-900/60 bg-red-950/40 p-2.5 text-xs text-red-300">
              {validationError}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Full Student Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Hayes"
                className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">University Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@campustix.edu"
              className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Roll Number</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="CS-2026-088"
                  className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Engineering"
                  className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-indigo-900 bg-[#12163b] px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 font-semibold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all"
          >
            <span>{mode === 'login' ? 'Sign In to CampusTix' : 'Create Student Profile'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          {/* Toggle Login/Register */}
          <div className="pt-2 text-center text-[11px] text-slate-400">
            {mode === 'login' ? (
              <span>
                New to CampusTix?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-purple-400 font-semibold hover:underline"
                >
                  Create Student Account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-purple-400 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
