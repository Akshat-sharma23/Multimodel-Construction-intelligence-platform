import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  FolderOpen,
  Loader2,
  Trash2,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { ProjectPlanResult, SavedProject } from '../types';
import { TimelineChart } from '../components/TimelineChart';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';

export const PlanningPage: React.FC = () => {
  const { forceDemoMode, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProjectPlanResult | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    project_name: 'Skyline Commercial Fit-Out',
    project_type: 'Commercial Office Fit-Out',
    project_description: 'Full interior fit-out and MEP commissioning for a 5-story corporate headquarters including open workspaces, executive suites, and cafeteria.',
    project_size: '65,000 sq ft across 5 floors',
    start_date: '2026-11-01',
    target_completion_date: '2027-05-01',
    estimated_budget: '$3.8 Million',
    constraints_and_requirements: 'Strict municipal noise limits during business hours; LEED Silver certification targets.'
  });

  const fetchSaved = async () => {
    try {
      const res = await api.getProjects();
      setSavedProjects(res.items);
    } catch (err) {
      console.warn('Failed to fetch saved projects:', err);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.target_completion_date <= form.start_date) {
      showToast('Target completion date must be strictly after the start date.', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await api.generateProjectPlan(form, forceDemoMode);
      setResult(data);
      showToast(
        data.is_demo ? 'Project plan generated (Demo Mode).' : 'Project plan generated with Grok AI.',
        'success'
      );
      fetchSaved();
    } catch (err: any) {
      showToast(err.message || 'Failed to generate project plan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSaved = async (projId: string) => {
    try {
      const proj = await api.getProject(projId);
      if (proj && proj.plan_data) {
        setResult(proj.plan_data as ProjectPlanResult);
        setForm({
          project_name: proj.name,
          project_type: proj.project_type,
          project_description: proj.description || '',
          project_size: proj.size,
          start_date: proj.start_date,
          target_completion_date: proj.target_date,
          estimated_budget: proj.budget,
          constraints_and_requirements: proj.constraints || ''
        });
        setShowSavedModal(false);
        showToast(`Loaded saved project '${proj.name}'.`, 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load project details.', 'error');
    }
  };

  const handleDeleteSaved = async (projId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDeletingId(projId);
      await api.deleteProject(projId);
      showToast('Project deleted successfully.', 'success');
      fetchSaved();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete project.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const loadPreset = (presetType: 'commercial' | 'residential' | 'warehouse') => {
    if (presetType === 'commercial') {
      setForm({
        project_name: 'Skyline Commercial Fit-Out',
        project_type: 'Commercial Office Fit-Out',
        project_description: 'Full interior fit-out and MEP commissioning for a 5-story corporate headquarters including open workspaces, executive suites, and cafeteria.',
        project_size: '65,000 sq ft across 5 floors',
        start_date: '2026-11-01',
        target_completion_date: '2027-05-01',
        estimated_budget: '$3.8 Million',
        constraints_and_requirements: 'Strict municipal noise limits during business hours; LEED Silver certification targets.'
      });
    } else if (presetType === 'residential') {
      setForm({
        project_name: 'Palm Meadows Residential Enclave',
        project_type: 'Multi-Family Residential Complex',
        project_description: 'Turnkey civil construction of 24 premium townhouse villas with shared subterranean clubhouse, stormwater retention, and solar grid tie-in.',
        project_size: '120,000 sq ft total built area',
        start_date: '2026-11-15',
        target_completion_date: '2027-08-30',
        estimated_budget: '$8.2 Million',
        constraints_and_requirements: 'Monsoon season precipitation between June and July; phased homeowner occupancy clearances.'
      });
    } else if (presetType === 'warehouse') {
      setForm({
        project_name: 'Apex Automated Logistics Facility',
        project_type: 'Industrial Logistics Warehouse',
        project_description: 'Erection of high-bay pre-engineered steel structure with 32 loading docks, super-flat FM2 tolerance flooring, and ESFR fire suppression.',
        project_size: '250,000 sq ft on 12-acre parcel',
        start_date: '2026-12-01',
        target_completion_date: '2027-06-15',
        estimated_budget: '$14.0 Million',
        constraints_and_requirements: 'Zero tolerance slab deflection for automated robotic AGV navigation; heavy 40-ton axle pavement.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600" />
            Construction Project Planning & CPM Scheduling
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Critical Path Method (CPM) master schedules, sequential trade handoffs, and proactive project risk mitigation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSavedModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
          >
            <FolderOpen className="w-4 h-4 text-brand-600" />
            <span>Saved Projects ({savedProjects.length})</span>
          </button>
          {result?.is_demo && (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
              DEMO DATA RESPONSE
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleGenerate} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-semibold text-slate-800">Project Parameters</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span>Presets:</span>
                <button type="button" onClick={() => loadPreset('commercial')} className="text-brand-600 hover:underline font-medium">
                  Office
                </button>
                <span>&bull;</span>
                <button type="button" onClick={() => loadPreset('residential')} className="text-brand-600 hover:underline font-medium">
                  Villas
                </button>
                <span>&bull;</span>
                <button type="button" onClick={() => loadPreset('warehouse')} className="text-brand-600 hover:underline font-medium">
                  Logistics
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Project Name</label>
              <input
                type="text"
                required
                value={form.project_name}
                onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Project Type</label>
                <input
                  type="text"
                  required
                  value={form.project_type}
                  onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Estimated Size / Scope</label>
                <input
                  type="text"
                  required
                  value={form.project_size}
                  onChange={(e) => setForm({ ...form, project_size: e.target.value })}
                  placeholder="e.g. 50,000 sq ft, 5 stories"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Kick-off Start Date</label>
                <input
                  type="date"
                  required
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Completion Date</label>
                <input
                  type="date"
                  required
                  value={form.target_completion_date}
                  onChange={(e) => setForm({ ...form, target_completion_date: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Project Description & Scope</label>
              <textarea
                required
                value={form.project_description}
                onChange={(e) => setForm({ ...form, project_description: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Budget (Optional)</label>
                <input
                  type="text"
                  value={form.estimated_budget}
                  onChange={(e) => setForm({ ...form, estimated_budget: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Site Constraints</label>
                <input
                  type="text"
                  value={form.constraints_and_requirements}
                  onChange={(e) => setForm({ ...form, constraints_and_requirements: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Master Schedule & CPM...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Generate Master Project Plan</span>
                </>
              )}
            </button>
          </form>

          {/* Planning Principles Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand-600" />
              <span>CPM Scheduling Principle</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Tasks flagged with Critical Path (CP) have zero float; any delay in these tasks directly extends the project handover date. Review durations with trade contractors before baselining contracts.
            </p>
          </div>
        </div>

        {/* Right Column: Results & Interactive Timeline */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center py-16">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-800">Synthesizing Critical Path Schedule</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Calculating sequential trade dependencies, MEP rough-in durations, and municipal inspection float...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-5">
              {/* Summary Banner */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{result.project_name}</h2>
                    <span className="text-xs font-mono text-brand-600 font-medium">
                      Estimated Duration: {result.total_estimated_days} Calendar Days
                    </span>
                  </div>
                  {result.saved_project_id && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <Bookmark className="w-3 h-3" /> Auto-Saved to DB
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  {result.project_summary}
                </p>
              </div>

              {/* Gantt Timeline Visualizer */}
              <TimelineChart phases={result.phases} totalDays={result.total_estimated_days} />

              {/* Critical Path Highlights */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Critical Path Sequence
                </h3>
                <div className="space-y-2">
                  {result.critical_path_summary.map((cp, i) => (
                    <div key={i} className="p-3 rounded-lg bg-rose-50/50 border border-rose-200/80 text-xs font-mono text-slate-800">
                      {cp}
                    </div>
                  ))}
                </div>
              </div>

              {/* Potential Risks & Mitigations */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Identified Project Risks & Mitigation Strategies
                </h3>
                <div className="space-y-3">
                  {result.potential_risks.map((risk, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">{risk.risk}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-500">Prob: {risk.probability}</span>
                          <StatusBadge label={risk.impact} variant="risk" />
                        </div>
                      </div>
                      <div className="text-slate-600 bg-white p-2.5 rounded border border-slate-200/60">
                        <span className="font-semibold text-slate-700">Mitigation: </span>
                        {risk.mitigation_strategy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Milestone Target Deliverables
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.milestones.map((m, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                      <div className="font-bold text-slate-900">{m.title}</div>
                      <div className="text-[11px] font-mono text-brand-600 font-semibold mt-0.5">{m.target_date}</div>
                      <div className="text-slate-500 mt-1">{m.deliverable}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimers */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="font-bold">Preliminary Schedule Disclaimer: </span>
                {result.preliminary_disclaimer}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <h3 className="text-sm font-semibold text-slate-700 mb-1">No Project Plan Generated</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill in the project scope on the left, or click a preset (Office, Villas, Logistics) to generate a multi-phase schedule.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Saved Projects Modal */}
      <Modal
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        title="Saved Construction Projects"
      >
        <div className="space-y-3">
          {savedProjects.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No saved projects found in local storage.
            </div>
          ) : (
            savedProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => handleLoadSaved(p.id)}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-brand-500/50 cursor-pointer transition flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {p.project_type} &bull; {p.size} &bull; {p.start_date} to {p.target_date}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={deletingId === p.id}
                    onClick={(e) => handleDeleteSaved(p.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-brand-600" />
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};
