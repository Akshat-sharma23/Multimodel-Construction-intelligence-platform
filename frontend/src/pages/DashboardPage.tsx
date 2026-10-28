import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Building,
  Calendar,
  Bot,
  CloudSun,
  History,
  ArrowRight,
  TrendingUp,
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PlayCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { AnalysisRecordItem } from '../types';
import { StatusBadge } from '../components/StatusBadge';

export const DashboardPage: React.FC = () => {
  const { status, forceDemoMode } = useApp();
  const [recentRecords, setRecentRecords] = useState<AnalysisRecordItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getHistory(undefined, undefined);
        setRecentRecords(res.items.slice(0, 6));
      } catch (err) {
        console.warn('Failed to load recent activity:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const isLive = status?.live_ai_ready && !forceDemoMode;

  return (
    <div className="space-y-6">
      {/* Top Banner & Status */}
      <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 rounded-2xl p-6 text-white border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Multimodal Decision Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Multimodal Construction Intelligence Platform
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Welcome to MCIP. Perform visual hazard inspections, detect structural crack patterns, compute asset valuations, plan project phases, and check weather-aware site advisories.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Cpu className="w-3.5 h-3.5 text-brand-400" />
              <span>AI Engine:</span>
              <span className="font-mono font-bold text-white">
                {isLive ? status?.configured_text_model : 'Calibrated Demo Engine'}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mode:</span>
              <span className="font-bold text-emerald-300">
                {isLive ? 'Live Grok AI Mode' : 'Verified Deterministic Demo Mode'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
            Intelligence Modules
          </h2>
          <span className="text-xs text-slate-500">6 Specialized Engineering Tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/safety"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-brand-500/60 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <StatusBadge label="Vision AI" variant="neutral" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              Safety Monitoring
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Detect active scaffold deficiencies, trailing cables, and PPE compliance with strict photographic evidence.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
              <span>Launch Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/cracks"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-brand-500/60 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <StatusBadge label="Vision AI" variant="neutral" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              Crack Detection & Analysis
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Analyze surface crack geometry, diagonal shear, and shrinkage patterns with forensic non-destructive test recommendations.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
              <span>Launch Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/valuation"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-brand-500/60 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <Building className="w-5 h-5" />
              </div>
              <StatusBadge label="Algorithmic" variant="neutral" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              Real Estate Valuation
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Transparent depreciated replacement cost calculations with benchmark sales comps and age depreciation schedules.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
              <span>Launch Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/planning"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-brand-500/60 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <StatusBadge label="Gantt & CPM" variant="neutral" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              Construction Project Planning
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Generate 5-phase master schedules, task dependencies, critical path highlights, and risk mitigation strategies.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
              <span>Launch Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/assistant"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-brand-500/60 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <StatusBadge label="Conversational" variant="neutral" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              AI Construction Assistant
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Consult on civil engineering methods, concrete curing, OSHA standards, and generate structured draft site reports.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
              <span>Launch Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/weather-reports"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-brand-500/60 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 group-hover:scale-105 transition-transform">
                <CloudSun className="w-5 h-5" />
              </div>
              <StatusBadge label="Meteorological" variant="neutral" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              Weather & Daily Site Logs
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Weather-aware operational advisories for crane lifts and concrete pours, with structured daily shift report generator.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
              <span>Launch Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Guided Walkthrough Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              College Evaluator & Interview Guided Demo Flow
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Explore pre-loaded high-resolution sample photographs and calibrated deterministic workflows without needing an external API key.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/safety"
            className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Test Safety Flow
          </Link>
          <Link
            to="/cracks"
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors"
          >
            Test Crack Flow
          </Link>
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-semibold text-slate-900">Recent Analysis Records</h3>
          </div>
          <Link to="/history" className="text-xs font-medium text-brand-600 hover:underline">
            View All History &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading analysis history...</div>
        ) : recentRecords.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No analysis records logged yet. Run a safety inspection or project plan to see persistent history.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentRecords.map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-800">{rec.title}</div>
                  <div className="text-[11px] text-slate-500 truncate max-w-md mt-0.5">
                    {rec.summary}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rec.risk_level && (
                    <StatusBadge label={rec.risk_level} variant="risk" />
                  )}
                  {rec.is_demo && (
                    <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      DEMO DATA
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
