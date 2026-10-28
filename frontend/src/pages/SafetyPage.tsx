import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Eye,
  Loader2,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { SafetyAnalysisResult } from '../types';
import { ImageUploadZone } from '../components/ImageUploadZone';
import { RiskIndicator } from '../components/RiskIndicator';
import { StatusBadge } from '../components/StatusBadge';

export const SafetyPage: React.FC = () => {
  const { forceDemoMode, showToast } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [siteDescription, setSiteDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SafetyAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      showToast('Please select or upload an image first.', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await api.analyzeSafety(selectedFile, siteDescription, forceDemoMode);
      setResult(data);
      showToast(
        data.is_demo ? 'Safety analysis completed (Demo Mode).' : 'Safety analysis completed with Grok Vision.',
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to analyze safety image.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Construction Site Safety Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual hazard assessment, edge protection verification, and PPE compliance with strict photographic evidence isolation.
          </p>
        </div>
        {result?.is_demo && (
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
            DEMO DATA RESPONSE
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-slate-800">1. Select Site Photograph</h2>
            
            <ImageUploadZone
              selectedFile={selectedFile}
              onImageSelected={(file) => setSelectedFile(file)}
              onClear={() => {
                setSelectedFile(null);
                setResult(null);
              }}
              sampleImageUrl="/samples/site_safety_scaffold.jpg"
              sampleLabel="Load Scaffolding Site Sample Photo"
              label="Upload Active Construction Photo"
              description="Drop JPEG, PNG, or WebP (max 10MB)"
            />

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Optional Site Context or Specific Query
              </label>
              <textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="e.g. Inspect perimeter scaffolding on Level 3, check guardrail mid-rail compliance and floor cable hazards..."
                className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                rows={3}
              />
            </div>

            <button
              type="button"
              disabled={!selectedFile || loading}
              onClick={handleAnalyze}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Visual Hazards...</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Run Safety Inspection</span>
                </>
              )}
            </button>
          </div>

          {/* Engineering Protocol Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand-600" />
              <span>Inspection Protocol</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              The AI model is instructed to distinguish visible evidence from inference. It will never assume a worker lacks PPE unless visually undeniable, nor assume an entire site is safe simply because no hazard was captured in this frame.
            </p>
          </div>
        </div>

        {/* Right Column: Structured Results */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center py-16">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-800">Processing Visual Inspection</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Evaluating edge protection, machinery clearance, trailing cables, and worker PPE compliance against safety standards...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Risk Gauge Card */}
              <RiskIndicator level={result.risk_level} title="Overall Site Risk Classification" />

              {/* Factual Summary */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Visual Inspection Summary</h3>
                  <span className="text-[11px] font-mono text-slate-400">{result.timestamp}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  {result.summary}
                </p>

                {/* Recognized Elements */}
                {result.visible_elements && result.visible_elements.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                      Recognized Site Assets & Infrastructure
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.visible_elements.map((el, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Potential Hazards */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Identified Potential Hazards ({result.potential_hazards?.length || 0})
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {result.potential_hazards.map((hz, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">{hz.description}</span>
                        <StatusBadge label={hz.severity} variant="risk" />
                      </div>
                      <div className="text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-700">Location in Image: </span>
                        {hz.location_in_image}
                      </div>
                      <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200/60">
                        <span className="font-semibold text-slate-700">Visible Evidence: </span>
                        {hz.visible_evidence}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations & Actionable Precautions */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Recommended Precautions & Engineering Actions
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explicit Visual Limitations */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 text-slate-700">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  Analysis Limitations & Visual Blindspots
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-500">
                  {result.limitations.map((lim, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-400">&bull;</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <h3 className="text-sm font-semibold text-slate-700 mb-1">No Active Safety Analysis</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select or upload a construction site photo on the left, or click "Load Scaffolding Site Sample Photo" to test the automated inspection workflow.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
