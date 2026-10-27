import React from 'react';
import { Ticket, ArrowLeft } from 'lucide-react';

interface NotFoundViewProps {
  onReturnHome: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onReturnHome }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="h-16 w-16 rounded-2xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400 mb-5">
        <Ticket className="h-8 w-8 rotate-12" />
      </div>
      <span className="font-mono text-sm text-purple-400 font-bold uppercase tracking-wider mb-2">
        Error 404
      </span>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
        Event or Page Not Found
      </h2>
      <p className="mt-2 text-xs text-slate-400 max-w-md">
        The requested campus event or reservation page does not exist or may have been concluded.
      </p>
      <button
        onClick={onReturnHome}
        className="mt-6 flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Return to Campus Events Schedule</span>
      </button>
    </div>
  );
};
