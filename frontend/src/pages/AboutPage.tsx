import React from 'react';
import {
  Info,
  Layers,
  ShieldCheck,
  Cpu,
  Database,
  Code2,
  ExternalLink,
  Sparkles,
  Server,
  Terminal,
  FileCheck2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Individual Capstone Portfolio Project</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Multimodal Construction Intelligence Platform (MCIP)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Developed for the college Skill Wallet / FutureSkills Prime Vibe Coding course. Built for professional resume showcase, GitHub source publication, and live cloud demonstration.
        </p>
      </div>

      {/* Project Vision & Architecture Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Modern Frontend</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            React 18 with TypeScript, Vite bundler, Tailwind CSS design system, Lucide icons, accessible forms, loading skeletons, and interactive Gantt schedules.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Python FastAPI Backend</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            FastAPI REST API with strict Pydantic v2 request/response validation schemas, SQLAlchemy ORM with SQLite local & PostgreSQL cloud compatibility.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">xAI Grok Integration</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Multimodal image understanding and reasoning using OpenAI-compatible xAI endpoints (<code className="text-emerald-700 font-mono">https://api.x.ai/v1</code>) with zero frontend key leakage.
          </p>
        </div>
      </div>

      {/* Engineering Disclaimers & Integrity */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-brand-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Statutory Engineering Caution & Ethical AI Guardrails</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-1 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="font-semibold text-white">Visual Evidence Isolation</div>
            <p className="text-slate-400">
              MCIP explicitly distinguishes visible evidence from uncertainty. It never assumes a site is safe simply because no hazard was captured in an image, nor does it falsely claim workers lack PPE without visual proof.
            </p>
          </div>
          <div className="space-y-1 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="font-semibold text-white">Non-Destructive Crack Guidance</div>
            <p className="text-slate-400">
              Photographic crack analysis is treated strictly as decision-support. The platform emphasizes that internal depth, rebar yield, and core strength require ultrasonic testing and licensed structural engineer sign-off.
            </p>
          </div>
          <div className="space-y-1 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="font-semibold text-white">Transparent Real Estate Math</div>
            <p className="text-slate-400">
              MCIP forbids generative LLMs from inventing unverified market prices. Valuations use transparent depreciated replacement cost (DRC) equations and benchmark comparable registry data.
            </p>
          </div>
          <div className="space-y-1 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="font-semibold text-white">CPM Planning Disclaimer</div>
            <p className="text-slate-400">
              Synthesized project schedules, task sequences, and critical path items are baseline estimates. Durations must be validated against regional building codes and trade subcontractor commitments.
            </p>
          </div>
        </div>
      </div>

      {/* Deployment & Environment Setup */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-brand-600" />
          Environment & Deployment Architecture
        </h3>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Backend Configuration (.env)</span>
            <code className="text-slate-600 font-mono text-[11px] block leading-relaxed whitespace-pre-wrap">
              XAI_API_KEY=your_xai_api_key_here<br/>
              GROK_MODEL=grok-2-1212<br/>
              GROK_VISION_MODEL=grok-2-vision-1212<br/>
              AI_DEMO_MODE=false<br/>
              DATABASE_URL=sqlite:///./construction.db
            </code>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Production Cloud Hosting</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Frontend deployed to <strong>Vercel</strong> as static SPA with fast global CDN. Backend deployed to <strong>Render</strong> using Python Uvicorn service with managed PostgreSQL database.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Testing & QA Rigor</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Backend test suite with <strong>18 unit & integration tests in Pytest</strong> covering health, CORS, image validation, date checks, valuation math, and deterministic demo modes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
