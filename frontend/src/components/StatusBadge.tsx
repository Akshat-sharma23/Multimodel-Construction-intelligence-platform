import React from 'react';

interface StatusBadgeProps {
  label: string;
  variant?: 'risk' | 'status' | 'mode' | 'neutral';
  level?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  level,
  className = ''
}) => {
  const normalized = (level || label).toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (variant === 'risk') {
    if (normalized.includes('critical') || normalized.includes('severe')) {
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
    } else if (normalized.includes('high') || normalized.includes('moderate')) {
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
    } else if (normalized.includes('medium') || normalized.includes('caution')) {
      colorClasses = 'bg-yellow-50 text-yellow-800 border-yellow-200';
    } else if (normalized.includes('low') || normalized.includes('minor') || normalized.includes('negligible') || normalized.includes('safe')) {
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
    } else {
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
    }
  } else if (variant === 'mode') {
    if (normalized.includes('live')) {
      colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    } else {
      colorClasses = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    }
  } else if (variant === 'status') {
    if (normalized.includes('active') || normalized.includes('completed')) {
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
    } else {
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border uppercase tracking-wider ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
};
