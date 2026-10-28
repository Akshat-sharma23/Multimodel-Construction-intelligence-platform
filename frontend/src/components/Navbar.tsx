import React from 'react';
import { HardHat, Sparkles, Database, Menu, PlayCircle, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  onOpenDemoGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar, onOpenDemoGuide }) => {
  const { status, forceDemoMode, setForceDemoMode } = useApp();

  const isLiveReady = status?.live_ai_ready && !forceDemoMode;

  return (
    <header className="h-16 bg-navy-900 border-b border-slate-800 text-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-blue-700 flex items-center justify-center shadow-inner">
            <HardHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              <span>MCIP</span>
              <span className="hidden sm:inline text-xs font-normal text-slate-400">|</span>
              <span className="hidden sm:inline text-xs font-semibold text-brand-300 uppercase tracking-wider">
                Construction Intelligence
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              Multimodal Engineering Decision-Support
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Guided Demo Button */}
        {onOpenDemoGuide && (
          <button
            onClick={onOpenDemoGuide}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5 text-brand-400" />
            <span>Tour Demo Flow</span>
          </button>
        )}

        {/* Live Grok AI vs Demo Mode Toggle & Status */}
        <div className="flex items-center bg-slate-950/80 rounded-xl p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setForceDemoMode(!forceDemoMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              isLiveReady
                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 shadow-sm'
                : 'bg-amber-950/60 text-amber-300 border border-amber-700/60 shadow-sm'
            }`}
            title="Click to toggle Demo Mode force state"
          >
            {isLiveReady ? (
              <>
                <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden xs:inline">Live Grok:</span>
                <span className="font-mono text-[11px] font-bold text-emerald-200">
                  {status?.configured_text_model || 'Online'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold">DEMO MODE</span>
                <span className="hidden md:inline text-[10px] text-amber-400/80">(Deterministic)</span>
              </>
            )}
          </button>
        </div>

        {/* Database indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg text-[11px] text-slate-300 border border-slate-700">
          <Database className="w-3 h-3 text-brand-400" />
          <span>{status?.storage_type || 'SQLite'}</span>
        </div>
      </div>
    </header>
  );
};
