import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Search,
  Building,
  CalendarDays,
  Bot,
  CloudSun,
  History,
  Info,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/safety', label: 'Safety Monitoring', icon: ShieldAlert, badge: 'Vision' },
    { to: '/cracks', label: 'Crack Analysis', icon: Search, badge: 'Vision' },
    { to: '/valuation', label: 'Real Estate Valuation', icon: Building },
    { to: '/planning', label: 'Project Planning', icon: CalendarDays },
    { to: '/assistant', label: 'AI Construction Assistant', icon: Bot },
    { to: '/weather-reports', label: 'Weather & Site Reports', icon: CloudSun },
    { to: '/history', label: 'Analysis History', icon: History },
    { to: '/about', label: 'About & System Arch', icon: Info },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 w-64 select-none">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Intelligence Modules
        </div>
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1 text-slate-400 hover:text-white rounded"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded bg-brand-500/20 text-brand-300 border border-brand-400/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Portfolio Info Footer in Sidebar */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Skill Wallet Portfolio</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed mb-2">
          FutureSkills Prime Vibe Coding individual capstone project.
        </p>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>v1.0.0</span>
          <span>FastAPI + xAI</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 flex">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
