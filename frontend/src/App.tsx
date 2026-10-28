import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { Modal } from './components/Modal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SafetyPage } from './pages/SafetyPage';
import { CrackPage } from './pages/CrackPage';
import { ValuationPage } from './pages/ValuationPage';
import { PlanningPage } from './pages/PlanningPage';
import { AssistantPage } from './pages/AssistantPage';
import { WeatherReportPage } from './pages/WeatherReportPage';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

import {
  ShieldAlert,
  Search,
  Building,
  Calendar,
  Bot,
  CloudSun,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const App: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showDemoGuide, setShowDemoGuide] = useState(false);
  const navigate = useNavigate();

  const demoSteps = [
    {
      num: 1,
      title: 'Safety Hazard Monitoring',
      desc: 'Test computer vision on an active construction site. Click "Load Scaffolding Site Sample Photo" and run the inspection.',
      path: '/safety',
      icon: ShieldAlert,
      badge: 'Vision AI'
    },
    {
      num: 2,
      title: 'Surface Crack Diagnostics',
      desc: 'Evaluate 45° diagonal shear fracture on a concrete beam with civil engineering cautions.',
      path: '/cracks',
      icon: Search,
      badge: 'Vision AI'
    },
    {
      num: 3,
      title: 'Real Estate Valuation',
      desc: 'Explore transparent Depreciated Replacement Cost (DRC) equations with benchmark market comps.',
      path: '/valuation',
      icon: Building,
      badge: 'Algorithmic'
    },
    {
      num: 4,
      title: 'Project Planning & CPM',
      desc: 'Generate a 5-phase execution master schedule with critical path tasks and visual Gantt timeline.',
      path: '/planning',
      icon: Calendar,
      badge: 'Gantt & CPM'
    },
    {
      num: 5,
      title: 'AI Engineering Assistant',
      desc: 'Ask about concrete curing times (ASTM C31) or OSHA scaffolding requirements.',
      path: '/assistant',
      icon: Bot,
      badge: 'Conversational'
    },
    {
      num: 6,
      title: 'Weather & Daily Shift Logs',
      desc: 'Check crane lifting and concrete heat advisories, then generate a structured shift report.',
      path: '/weather-reports',
      icon: CloudSun,
      badge: 'Meteorological'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        onOpenDemoGuide={() => setShowDemoGuide(true)}
      />

      <div className="flex flex-1">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Routes>
            <Route path="/welcome" element={<LandingPage />} />
            <Route path="/" element={<DashboardPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/cracks" element={<CrackPage />} />
            <Route path="/valuation" element={<ValuationPage />} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/weather-reports" element={<WeatherReportPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      <ToastContainer />

      {/* Guided Tour Demo Flow Modal */}
      <Modal
        isOpen={showDemoGuide}
        onClose={() => setShowDemoGuide(false)}
        title="MCIP Evaluator & Interview Guided Demo Walkthrough"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Follow this 5-step guided trajectory designed for college Skill Wallet evaluators, recruiters, and placement interviewers to explore every multimodal capability of the platform.
          </p>

          <div className="space-y-3">
            {demoSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  onClick={() => {
                    navigate(step.path);
                    setShowDemoGuide(false);
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-brand-50/60 hover:border-brand-400 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-brand-700 transition">
                          {step.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-white border border-slate-200 text-slate-600">
                          {step.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              All sample images and calculations run deterministically in Demo Mode without requiring an active external API key.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;
