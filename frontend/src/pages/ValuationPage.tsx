import React, { useState } from 'react';
import {
  Building,
  DollarSign,
  Calculator,
  ShieldAlert,
  Loader2,
  Table,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { ValuationInput, ValuationResult } from '../types';
import { StatusBadge } from '../components/StatusBadge';

export const ValuationPage: React.FC = () => {
  const { forceDemoMode, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValuationResult | null>(null);

  const [form, setForm] = useState<ValuationInput>({
    city: 'Austin',
    locality: 'South Congress District',
    property_type: 'Apartment / Flat',
    area_sqft: 1450,
    bedrooms: 3,
    bathrooms: 2,
    property_age_years: 5,
    property_condition: 'Good / Well Maintained',
    additional_features: ['Covered Parking', 'High Floor', 'Balcony'],
    notes: 'Standard residential condominium with community amenities.'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.area_sqft <= 50) {
      showToast('Area must be greater than 50 sq ft.', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await api.estimateValuation(form, forceDemoMode);
      setResult(data);
      showToast(
        data.is_demo ? 'Valuation estimate computed (Demo Mode).' : 'Valuation estimate computed successfully.',
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to estimate property valuation.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSamplePreset = (presetCity: string) => {
    if (presetCity === 'Austin') {
      setForm({
        city: 'Austin',
        locality: 'South Congress District',
        property_type: 'Apartment / Flat',
        area_sqft: 1450,
        bedrooms: 3,
        bathrooms: 2,
        property_age_years: 5,
        property_condition: 'Good / Well Maintained',
        additional_features: ['Covered Parking', 'High Floor', 'Balcony'],
        notes: 'Standard residential condominium with community amenities.'
      });
    } else if (presetCity === 'Bengaluru') {
      setForm({
        city: 'Bengaluru',
        locality: 'Indiranagar 100ft Road',
        property_type: 'Independent House / Villa',
        area_sqft: 3200,
        bedrooms: 4,
        bathrooms: 4,
        property_age_years: 8,
        property_condition: 'Excellent',
        additional_features: ['Private Garden', 'Corner Plot', 'Covered Parking'],
        notes: 'Residential villa in prime tech corridor.'
      });
    } else if (presetCity === 'London') {
      setForm({
        city: 'London',
        locality: 'Canary Wharf',
        property_type: 'Commercial Office',
        area_sqft: 5000,
        bedrooms: 0,
        bathrooms: 4,
        property_age_years: 6,
        property_condition: 'Brand New / Under Construction',
        additional_features: ['HVAC Centralized', 'LEED Gold Certified', 'Dedicated Elevator'],
        notes: 'Grade-A corporate office plate.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            Transparent Real Estate Valuation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic Depreciated Replacement Cost (DRC) model grounded in benchmark comparables, building age, and condition adjustments.
          </p>
        </div>
        {result?.is_demo && (
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
            DEMO DATA RESPONSE
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-semibold text-slate-800">Property Parameters</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span>Presets:</span>
                <button
                  type="button"
                  onClick={() => loadSamplePreset('Austin')}
                  className="text-brand-600 hover:underline font-medium"
                >
                  Austin
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={() => loadSamplePreset('Bengaluru')}
                  className="text-brand-600 hover:underline font-medium"
                >
                  Bengaluru
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={() => loadSamplePreset('London')}
                  className="text-brand-600 hover:underline font-medium"
                >
                  London
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Austin, Mumbai, London"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Locality / Sector</label>
                <input
                  type="text"
                  required
                  value={form.locality}
                  onChange={(e) => setForm({ ...form, locality: e.target.value })}
                  placeholder="e.g. South Congress, Bandra West"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Property Type</label>
                <select
                  value={form.property_type}
                  onChange={(e) => setForm({ ...form, property_type: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                >
                  <option value="Apartment / Flat">Apartment / Flat</option>
                  <option value="Independent House / Villa">Independent House / Villa</option>
                  <option value="Commercial Office">Commercial Office</option>
                  <option value="Retail Store">Retail Store</option>
                  <option value="Industrial Warehouse">Industrial Warehouse</option>
                  <option value="Plot / Land">Plot / Land</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Built-Up Area (Sq Ft)</label>
                <input
                  type="number"
                  required
                  min={51}
                  max={500000}
                  value={form.area_sqft}
                  onChange={(e) => setForm({ ...form, area_sqft: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={form.bedrooms ?? 0}
                  onChange={(e) => setForm({ ...form, bedrooms: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={form.bathrooms ?? 0}
                  onChange={(e) => setForm({ ...form, bathrooms: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Age (Years)</label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={form.property_age_years}
                  onChange={(e) => setForm({ ...form, property_age_years: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Property Condition</label>
              <select
                value={form.property_condition}
                onChange={(e) => setForm({ ...form, property_condition: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
              >
                <option value="Brand New / Under Construction">Brand New / Under Construction (+8%)</option>
                <option value="Excellent">Excellent (+5%)</option>
                <option value="Good / Well Maintained">Good / Well Maintained (0%)</option>
                <option value="Fair / Needs Minor Work">Fair / Needs Minor Work (-8%)</option>
                <option value="Poor / Major Renovation Required">Poor / Major Renovation Required (-22%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Zoning & Feature Notes</label>
              <textarea
                value={form.notes || ''}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Amenities, parking, floor level, view..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                rows={2}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Transparent Valuation...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  <span>Calculate Valuation Estimate</span>
                </>
              )}
            </button>
          </form>

          {/* Methodology Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Table className="w-4 h-4 text-emerald-600" />
              <span>Transparent Formula Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              MCIP strictly forbids LLMs from hallucinating market prices as unverified facts. All valuations use explicit replacement cost math, age depreciation curves, and verified benchmark comps.
            </p>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center py-16">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-800">Calculating Asset Valuation</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Applying regional base rates, age depreciation curves, and commercial efficiency factors...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Valuation Midpoint Hero Card */}
              <div className="bg-gradient-to-br from-slate-900 to-navy-950 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="uppercase tracking-wider font-semibold text-slate-400">
                    Estimated Asset Valuation Range
                  </span>
                  <StatusBadge label={`${result.confidence_level} Confidence`} variant="neutral" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                    ${result.estimated_price_midpoint.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    (${result.price_per_sqft.toLocaleString()} / sq ft)
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800 text-slate-300 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">LOWER BOUND (-7%)</span>
                    <span>${result.estimated_price_min.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">UPPER BOUND (+7%)</span>
                    <span>${result.estimated_price_max.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>

              {/* Transparent Calculation Breakdown Table */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-brand-600" />
                  Valuation Breakdown & Math Formula
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Calculation Component</th>
                        <th className="py-2.5 px-3 font-semibold">Adjustment Rate</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Impact ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          Base Replacement Value ({form.area_sqft} sqft @ ${result.breakdown.base_rate_per_sqft}/sqft)
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">Baseline</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                          ${result.breakdown.base_value.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          Structural Age Depreciation ({form.property_age_years} yrs @ 1.2%/yr)
                        </td>
                        <td className="py-2.5 px-3 text-rose-600 flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>-{result.breakdown.age_depreciation_percent}%</span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-rose-600">
                          -${result.breakdown.age_depreciation_amount.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          Asset Condition Adjustment ({form.property_condition})
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {result.breakdown.condition_adjustment_percent >= 0 ? '+' : ''}
                          {result.breakdown.condition_adjustment_percent}%
                        </td>
                        <td className={`py-2.5 px-3 text-right ${result.breakdown.condition_adjustment_amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {result.breakdown.condition_adjustment_amount >= 0 ? '+' : ''}$
                          {result.breakdown.condition_adjustment_amount.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          Locality Infrastructure Tier Premium
                        </td>
                        <td className="py-2.5 px-3 text-emerald-600 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+4.0%</span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-600">
                          +${result.breakdown.locality_adjustment_amount.toLocaleString()}
                        </td>
                      </tr>
                      <tr className="bg-slate-50/80 font-bold">
                        <td className="py-3 px-3 text-slate-900">Net Calculated Market Midpoint</td>
                        <td className="py-3 px-3 text-slate-700">Final</td>
                        <td className="py-3 px-3 text-right text-brand-700 text-sm">
                          ${result.breakdown.net_calculated_value.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Benchmark Comparables Table */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  Benchmark Comparable Properties
                </h3>
                <div className="space-y-2">
                  {result.benchmark_comparables.map((comp, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-semibold text-slate-800">{comp.locality}</div>
                        <div className="text-[11px] text-slate-500">
                          {comp.property_type} &bull; {comp.area_sqft} sqft &bull; <span className="italic">{comp.source}</span>
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-slate-700">
                        ${comp.price_per_sqft}/sqft
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory Warning */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Valuation Disclaimer: </span>
                  {result.limitations_warning}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <Building className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <h3 className="text-sm font-semibold text-slate-700 mb-1">No Valuation Computed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill in the property details on the left, or select a city preset (Austin, Bengaluru, London) to test the calculation engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
