import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  FileCheck2,
  HelpCircle,
  Eye,
  Loader2,
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { CrackAnalysisResult } from '../types';
import { ImageUploadZone } from '../components/ImageUploadZone';
import { RiskIndicator } from '../components/RiskIndicator';
import { StatusBadge } from '../components/StatusBadge';

export const CrackPage: React.FC = () => {
  const { forceDemoMode, showToast } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [buildingElement, setBuildingElement] = useState('Reinforced Concrete Support Beam (B-14)');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CrackAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      showToast('Please select or upload a crack photograph first.', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await api.analyzeCrack(selectedFile, buildingElement, forceDemoMode);
      setResult(data);
      showToast(
        data.is_demo ? 'Crack analysis completed (Demo Mode).' : 'Crack analysis completed with Grok Vision.',
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to analyze crack image.', 'error');
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
            <Search className="w-5 h-5 text-amber-600" />
            Crack Detection and Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            AI-assisted visual crack pattern identification, orientation classification, and non-destructive diagnostic guidance.
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
            <h2 className="text-sm font-semibold text-slate-800">1. Select Crack Photograph</h2>
            
            <ImageUploadZone
              selectedFile={selectedFile}
              onImageSelected={(file) => setSelectedFile(file)}
              onClear={() => {
                setSelectedFile(null);
                setResult(null);
              }}
              sampleImageUrl="/samples/beam_shear_crack.jpg"
              sampleLabel="Load Concrete Beam Shear Crack Photo"
              label="Upload Surface Crack Photograph"
              description="Drop JPEG, PNG, or WebP (max 10MB)"
            />

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Building Element Under Inspection
              </label>
              <select
                value={buildingElement}
                onChange={(e) => setBuildingElement(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
              >
                <option value="Reinforced Concrete Support Beam (B-14)">Reinforced Concrete Support Beam</option>
                <option value="Load-Bearing Brick Masonry Wall">Load-Bearing Brick Masonry Wall</option>
                <option value="Foundation Plinth Slab / Grade Slab">Foundation Plinth Slab / Grade Slab</option>
                <option value="Reinforced Concrete Column Capital">Reinforced Concrete Column Capital</option>
                <option value="Retaining Wall / Basement Shoring">Retaining Wall / Basement Shoring</option>
                <option value="Internal Plastered Partition Wall">Internal Plastered Partition Wall</option>
              </select>
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
                  <span>Evaluating Surface Patterns...</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Analyze Crack Patterns</span>
                </>
              )}
            </button>
          </div>

          {/* Statutory Disclaimer Box */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="font-semibold flex items-center gap-1.5 text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Civil Engineering Advisory</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800/90">
              This module operates as AI-assisted visual crack pattern analysis. Photographic analysis cannot measure internal core depth, rebar tension yielding, or sub-surface cavitation. An on-site certified structural engineer must perform non-destructive pulse velocity and load verification.
            </p>
          </div>
        </div>

        {/* Right Column: Structured Results */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center py-16">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-800">Analyzing Crack Geometry</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Evaluating crack path, 45-degree shear propagation, crazing versus structural displacement, and testing requirements...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Severity Gauge Card */}
              <RiskIndicator
                level={result.overall_visual_severity}
                title="Overall Visual Pattern Severity"
              />

              {/* Summary */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Diagnostic Summary</h3>
                    <div className="text-xs text-brand-600 font-medium">{result.building_element}</div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{result.timestamp}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  {result.summary}
                </p>
              </div>

              {/* Observed Crack Patterns */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-brand-600" />
                  Identified Crack Patterns ({result.visual_crack_patterns?.length || 0})
                </h3>

                <div className="space-y-3">
                  {result.visual_crack_patterns.map((pat, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">{pat.pattern_type}</span>
                        <StatusBadge label={pat.visual_severity} variant="risk" />
                      </div>
                      <p className="text-xs text-slate-600">{pat.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60">
                        <div>
                          <span className="font-semibold text-slate-700">Location: </span>
                          <span className="text-slate-600">{pat.approximate_location}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">Characteristics: </span>
                          <span className="text-slate-600">{pat.characteristics}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hypothesized Causes */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  Structural & Environmental Hypotheses
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {result.possible_causes_hypothesis.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Engineering Actions */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  Recommended Diagnostic & Remediation Steps
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {result.recommended_actions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Structural Engineering Disclaimer */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Required Regulatory Warning: </span>
                  {result.inspection_disclaimer}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <h3 className="text-sm font-semibold text-slate-700 mb-1">No Active Crack Analysis</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select or upload a crack photograph on the left, or click "Load Concrete Beam Shear Crack Photo" to test the automated diagnostic workflow.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
