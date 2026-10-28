import React from 'react';
import { PhaseItem } from '../types';
import { Calendar, AlertCircle } from 'lucide-react';

interface TimelineChartProps {
  phases: PhaseItem[];
  totalDays: number;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ phases, totalDays }) => {
  if (!phases || phases.length === 0) return null;

  const totalWeeks = Math.max(1, Math.round(totalDays / 7));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            Project Master Schedule Timeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Phase duration breakdown & critical path task progression ({totalDays} Estimated Total Days / ~{totalWeeks} Weeks)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-3 h-3 rounded bg-brand-500 inline-block" />
            <span>Standard Phase</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
            <span>Critical Path Task</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {phases.map((phase, idx) => {
          const phasePercent = Math.min(100, Math.max(12, Math.round((phase.duration_weeks / totalWeeks) * 100)));

          return (
            <div key={idx} className="bg-slate-50/70 rounded-lg p-3 border border-slate-200/80">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="font-semibold text-slate-800">{phase.name}</span>
                <span className="text-slate-500 font-mono font-medium">
                  {phase.duration_weeks} Weeks ({phase.tasks?.length || 0} tasks)
                </span>
              </div>

              {/* Phase progress visual bar */}
              <div className="w-full bg-slate-200/80 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="bg-brand-600 h-3 rounded-full transition-all"
                  style={{ width: `${phasePercent}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-500 italic mb-2">
                Milestone: <span className="font-medium text-slate-700">{phase.key_milestone}</span>
              </div>

              {/* Tasks within Phase */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/50">
                {phase.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-2 rounded-md border text-xs flex flex-col justify-between ${
                      task.critical_path
                        ? 'bg-rose-50/60 border-rose-200 text-slate-800'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-semibold text-[11px] leading-tight">
                        <span className="font-mono text-slate-500 mr-1">[{task.id}]</span>
                        {task.title}
                      </span>
                      {task.critical_path && (
                        <span className="shrink-0 inline-flex items-center gap-0.5 px-1 py-0.2 text-[9px] font-bold text-rose-700 bg-rose-100 rounded">
                          <AlertCircle className="w-2.5 h-2.5" /> CP
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>{task.duration_days}d ({task.suggested_start.slice(5)} to {task.suggested_end.slice(5)})</span>
                      <span className="truncate max-w-[90px]">{task.assigned_trade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
