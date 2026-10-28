import React from 'react';
import { Link } from 'react-router-dom';
import {
  HardHat,
  ShieldCheck,
  Search,
  Building,
  Calendar,
  Bot,
  CloudSun,
  ArrowRight,
  CheckCircle,
  FileText,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Banner */}
      <div className="bg-brand-950/80 border-b border-brand-900/60 py-2 px-4 text-center text-xs text-brand-300">
        <span className="font-semibold text-white">Skill Wallet & FutureSkills Prime Capstone</span>: Multimodal Construction Intelligence Platform (MCIP)
      </div>

      {/* Hero Section */}
      <div className="flex-1 max-w-6xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-brand-400 mb-6">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Multimodal Decision Support Powered by xAI Grok</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight mb-6">
          Engineering-Grade Intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-300">Modern Construction</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed">
          A unified decision-support platform combining visual computer intelligence, transparent property valuations, critical-path project scheduling, and meteorological risk mitigation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-600/30 transition-all text-sm"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-all text-sm"
          >
            <span>Technical Architecture</span>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left w-full mt-8">
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-brand-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Site Safety Monitoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Upload active site photographs to detect potential fall hazards, guardrail deficiencies, and PPE compliance with strict visual evidence isolation.
            </p>
            <Link to="/safety" className="text-xs text-brand-400 font-medium hover:underline inline-flex items-center gap-1">
              Explore Module <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-brand-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Visual Crack Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Identify surface shear, shrinkage, and flexural crack patterns on concrete and masonry, accompanied by non-destructive testing recommendations.
            </p>
            <Link to="/cracks" className="text-xs text-amber-400 font-medium hover:underline inline-flex items-center gap-1">
              Explore Module <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-brand-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Real Estate Valuation</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Mathematical depreciated replacement cost engine with verifiable comparables and transparent age/condition depreciation curves.
            </p>
            <Link to="/valuation" className="text-xs text-emerald-400 font-medium hover:underline inline-flex items-center gap-1">
              Explore Module <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-brand-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Project Planning & CPM</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Generate 5-phase execution master plans with Gantt-style schedule visualization, critical path tasks, and trade risk mitigation.
            </p>
            <Link to="/planning" className="text-xs text-purple-400 font-medium hover:underline inline-flex items-center gap-1">
              Explore Module <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-brand-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">AI Construction Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Conversational civil engineering assistant for concrete mix designs, curing requirements, ASTM/IS standards, and daily site reporting.
            </p>
            <Link to="/assistant" className="text-xs text-cyan-400 font-medium hover:underline inline-flex items-center gap-1">
              Explore Module <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-brand-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4">
              <CloudSun className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Weather & Site Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Weather-aware operational advisories for crane lifting, concrete pouring, and excavation combined with automated daily shift reports.
            </p>
            <Link to="/weather-reports" className="text-xs text-orange-400 font-medium hover:underline inline-flex items-center gap-1">
              Explore Module <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Engineering Integrity Banner */}
        <div className="mt-16 p-4 rounded-xl bg-slate-800/40 border border-slate-800 max-w-2xl text-xs text-slate-400 flex items-start gap-3 text-left">
          <CheckCircle className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">Strict Engineering Caution Protocol:</span> MCIP explicitly separates visible photographic evidence from structural hypotheses. AI-assisted outputs are structured for preliminary decision support and do not replace licensed structural engineering certifications or certified bank appraisals.
          </div>
        </div>
      </div>
    </div>
  );
};
