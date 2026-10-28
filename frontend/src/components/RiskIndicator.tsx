import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskIndicatorProps {
  level: 'low' | 'medium' | 'high' | 'critical' | 'unknown' | 'negligible' | 'minor' | 'moderate' | 'severe' | 'uncertain';
  title?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ level, title }) => {
  const norm = level.toLowerCase();

  let percent = 20;
  let label = 'Low Risk';
  let badgeColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let barColor = 'bg-emerald-500';
  let Icon = ShieldCheck;

  if (norm.includes('critical') || norm.includes('severe')) {
    percent = 100;
    label = 'Critical Risk';
    badgeColor = 'text-rose-700 bg-rose-50 border-rose-200';
    barColor = 'bg-rose-600';
    Icon = ShieldAlert;
  } else if (norm.includes('high') || norm.includes('moderate')) {
    percent = 75;
    label = norm.includes('moderate') ? 'Moderate Severity' : 'High Risk';
    badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
    Icon = AlertTriangle;
  } else if (norm.includes('medium') || norm.includes('minor')) {
    percent = 45;
    label = norm.includes('minor') ? 'Minor Severity' : 'Medium Risk';
    badgeColor = 'text-yellow-800 bg-yellow-50 border-yellow-200';
    barColor = 'bg-yellow-500';
    Icon = AlertTriangle;
  } else if (norm.includes('negligible') || norm.includes('low')) {
    percent = 15;
    label = norm.includes('negligible') ? 'Negligible Concern' : 'Low Risk';
    badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    barColor = 'bg-emerald-500';
    Icon = ShieldCheck;
  } else {
    percent = 30;
    label = 'Uncertain / Pending';
    badgeColor = 'text-slate-700 bg-slate-50 border-slate-200';
    barColor = 'bg-slate-400';
    Icon = AlertTriangle;
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title || 'Risk Level Assessment'}
        </span>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
          <Icon className="w-3.5 h-3.5" />
          {label}
        </div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium uppercase tracking-wider">
        <span>Low / Minor</span>
        <span>Medium</span>
        <span>High</span>
        <span>Critical</span>
      </div>
    </div>
  );
};
