import React, { useState } from 'react';
import {
  CloudSun,
  FileText,
  Thermometer,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Send,
  Loader2,
  Download,
  Copy,
  Sparkles,
  Building
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import {
  WeatherAdvisoryResult,
  DailyReportInput,
  DailyReportResult
} from '../types';
import { StatusBadge } from '../components/StatusBadge';

export const WeatherReportPage: React.FC = () => {
  const { forceDemoMode, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'weather' | 'daily_report'>('weather');

  // Weather state
  const [location, setLocation] = useState('New York');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherAdvisoryResult | null>(null);

  // Daily report state
  const [reportLoading, setReportLoading] = useState(false);
  const [reportResult, setReportResult] = useState<DailyReportResult | null>(null);
  const [reportForm, setReportForm] = useState<DailyReportInput>({
    project_name: 'Metro Tower Commercial Complex',
    report_date: new Date().toISOString().slice(0, 10),
    workforce_count: 52,
    work_completed: 'Casted 8 RCC columns on Level 4 Grid B-D. TMT rebar tying completed for main beam span B-14. Installed 420m of PVC electrical conduit in partition walls.',
    materials_used: '28 m3 M35 ready-mix concrete, 3.8 metric tons Fe500D TMT rebar, 420m electrical conduit, 60 bags Portland cement.',
    equipment_used: '1x Tower Crane (Potain MCT 85), 1x Concrete Boom Pump (Schwing Stetter), 2x High-Frequency Needle Vibrators.',
    delays_issues: 'Transit concrete mixer delayed by 35 minutes during morning peak hour municipal traffic. Contained within shift buffer without critical path slippage.',
    safety_observations: 'Toolbox talk on concrete pouring slips and fall-protection conducted at 07:30. 100% hard hat and high-vis vest compliance verified. Zero recordable incidents.',
    planned_work_next_day: 'Stripping of column formwork shutters; commence scaffolding erection and bottom shuttering for Level 4 suspended slab Grid A-F.'
  });

  const handleFetchWeather = async (locName?: string) => {
    const loc = locName || location;
    if (!loc.trim()) return;

    try {
      setWeatherLoading(true);
      const data = await api.getWeatherAdvisory(loc);
      setWeatherData(data);
      showToast(`Retrieved meteorological advisory for ${data.location_name}.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch weather advisory.', 'error');
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setReportLoading(true);
      const data = await api.generateDailyReport(reportForm, forceDemoMode);
      setReportResult(data);
      showToast(
        data.is_demo ? 'Daily site report generated (Demo Mode).' : 'Daily site report compiled successfully.',
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to generate daily report.', 'error');
    } finally {
      setReportLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!reportResult?.formatted_markdown_report) return;
    navigator.clipboard.writeText(reportResult.formatted_markdown_report);
    showToast('Report copied to clipboard!', 'info');
  };

  const handleDownloadReport = () => {
    if (!reportResult?.formatted_markdown_report) return;
    const blob = new Blob([reportResult.formatted_markdown_report], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-site-report-${reportResult.project_name.toLowerCase().replace(/\s+/g, '-')}-${reportResult.report_date}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report downloaded as Markdown document.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-cyan-600" />
            Weather-Aware Advisory & Daily Site Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time meteorological operational risk matrix for site activities and AI-assisted daily shift logging.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('weather')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'weather'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span>Weather Advisory</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('daily_report')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'daily_report'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Daily Site Report</span>
          </button>
        </div>
      </div>

      {activeTab === 'weather' ? (
        /* TAB 1: Weather-Aware Advisory */
        <div className="space-y-6">
          {/* Search Bar & City Shortcuts */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchWeather()}
                placeholder="Enter city or site location (e.g. New York, London, Bengaluru, Dubai, Austin)"
                className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <button
                type="button"
                disabled={weatherLoading}
                onClick={() => handleFetchWeather()}
                className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition shadow flex items-center gap-1.5 shrink-0"
              >
                {weatherLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudSun className="w-3.5 h-3.5" />}
                <span>Fetch Weather</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
              <span className="font-medium text-slate-600">Quick Cities:</span>
              {['New York', 'London', 'Bengaluru', 'Dubai', 'Austin'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setLocation(city);
                    handleFetchWeather(city);
                  }}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {weatherData ? (
            <div className="space-y-5">
              {/* Weather Hero Card */}
              <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-navy-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      Current Meteorological Snapshot
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">{weatherData.location_name}</h2>
                    <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                      <span>{weatherData.conditions}</span>
                      <span>&bull;</span>
                      <span className="font-mono text-slate-400">{weatherData.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-4">
                    <div>
                      <span className="text-4xl font-extrabold font-mono text-cyan-300">
                        {weatherData.temperature_c}°C
                      </span>
                      <span className="text-xs text-slate-400 ml-1">({weatherData.temperature_f}°F)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">WIND SPEED</span>
                      <span className="font-mono font-bold">{weatherData.wind_speed_kmh} km/h</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">GUST SPEEDS</span>
                      <span className="font-mono font-bold">{weatherData.wind_gusts_kmh} km/h</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">RAIN PROBABILITY</span>
                      <span className="font-mono font-bold">{weatherData.precipitation_chance_percent}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-slate-400 text-[10px] block">RELATIVE HUMIDITY</span>
                      <span className="font-mono font-bold">{weatherData.humidity_percent}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* High Risk Alerts if any */}
              {weatherData.high_risk_alerts && weatherData.high_risk_alerts.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Site Operation Alert</span>
                  </div>
                  {weatherData.high_risk_alerts.map((alert, i) => (
                    <div key={i} className="leading-relaxed">&bull; {alert}</div>
                  ))}
                </div>
              )}

              {/* Operational Activity Matrix */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Construction Operational Feasibility Matrix</h3>
                  <span className="text-[11px] text-slate-500 font-mono">Source: {weatherData.data_source}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {weatherData.operational_advisories.map((adv, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900">{adv.activity}</span>
                        <StatusBadge label={adv.status} variant="risk" />
                      </div>
                      <p className="text-xs text-slate-600">{adv.reason}</p>
                      {adv.precautions && adv.precautions.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-1 text-slate-500">
                          <span className="font-semibold text-slate-700">Recommended Site Precautions:</span>
                          {adv.precautions.map((p, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className="text-slate-400">&bull;</span>
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <CloudSun className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <h3 className="text-sm font-semibold text-slate-700 mb-1">Check Weather Feasibility</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Enter a city above or select one of the quick city buttons to evaluate crane wind limits, concrete heat rules, and precipitation thresholds.
              </p>
              <button
                type="button"
                onClick={() => handleFetchWeather('New York')}
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition"
              >
                Load New York Forecast
              </button>
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: Daily Site Report Assistance */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleGenerateReport} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">
                Shift Log Parameters
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={reportForm.project_name}
                    onChange={(e) => setReportForm({ ...reportForm, project_name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={reportForm.report_date}
                    onChange={(e) => setReportForm({ ...reportForm, report_date: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Total Workforce Count (Personnel)</label>
                <input
                  type="number"
                  required
                  min={0}
                  max={5000}
                  value={reportForm.workforce_count}
                  onChange={(e) => setReportForm({ ...reportForm, workforce_count: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Work Completed Today</label>
                <textarea
                  required
                  rows={2}
                  value={reportForm.work_completed}
                  onChange={(e) => setReportForm({ ...reportForm, work_completed: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Materials Used</label>
                  <textarea
                    required
                    rows={2}
                    value={reportForm.materials_used}
                    onChange={(e) => setReportForm({ ...reportForm, materials_used: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Heavy Machinery Deployed</label>
                  <textarea
                    required
                    rows={2}
                    value={reportForm.equipment_used}
                    onChange={(e) => setReportForm({ ...reportForm, equipment_used: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Delays & Site Bottlenecks</label>
                <input
                  type="text"
                  value={reportForm.delays_issues || ''}
                  onChange={(e) => setReportForm({ ...reportForm, delays_issues: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Safety & Compliance Observations</label>
                <input
                  type="text"
                  value={reportForm.safety_observations || ''}
                  onChange={(e) => setReportForm({ ...reportForm, safety_observations: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Planned Objectives for Tomorrow</label>
                <textarea
                  required
                  rows={2}
                  value={reportForm.planned_work_next_day}
                  onChange={(e) => setReportForm({ ...reportForm, planned_work_next_day: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={reportLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow flex items-center justify-center gap-2"
              >
                {reportLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Compiling Authoritative Shift Report...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Generate Executive Daily Report</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Generated Report */}
          <div className="lg:col-span-7">
            {reportLoading ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center py-16">
                <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-800">Synthesizing Daily Site Report</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Aggregating labor productivity, concrete curing logs, delay impacts, and contractor action items...
                </p>
              </div>
            ) : reportResult ? (
              <div className="space-y-4">
                {/* Executive Summary Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{reportResult.project_name}</h3>
                      <div className="text-xs font-mono text-slate-500">Date: {reportResult.report_date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyReport}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition"
                        title="Copy Markdown"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadReport}
                        className="px-2.5 py-1 rounded bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-medium flex items-center gap-1 transition"
                        title="Download Markdown Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                    {reportResult.executive_summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <span className="font-semibold text-slate-700 block mb-1">Manpower & Productivity</span>
                      <p className="text-slate-600">{reportResult.manpower_productivity_analysis}</p>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <span className="font-semibold text-slate-700 block mb-1">Delay Impact Review</span>
                      <p className="text-slate-600">{reportResult.delay_impact_assessment}</p>
                    </div>
                  </div>
                </div>

                {/* Formatted Markdown Report View */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Full Formatted Shift Document Preview
                    </h4>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
                    {reportResult.formatted_markdown_report}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <h3 className="text-sm font-semibold text-slate-700 mb-1">No Daily Report Compiled</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Enter your shift notes on the left and click "Generate Executive Daily Report" to produce an audit-ready site document.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
