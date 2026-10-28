import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  Eye,
  Calendar,
  AlertTriangle,
  FileText,
  Building,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { AnalysisRecordItem } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';

export const HistoryPage: React.FC = () => {
  const { showToast } = useApp();
  const [records, setRecords] = useState<AnalysisRecordItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecordItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.getHistory(moduleFilter || undefined, searchTerm || undefined);
      setRecords(res.items);
      setTotal(res.total);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch history records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [moduleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;

    try {
      setDeletingId(id);
      await api.deleteHistoryRecord(id);
      showToast('Record deleted.', 'success');
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
      fetchRecords();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete record.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to permanently clear all analysis history records?')) return;
    try {
      await api.clearHistory();
      showToast('All history cleared.', 'success');
      fetchRecords();
    } catch (err: any) {
      showToast(err.message || 'Failed to clear history.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-brand-600" />
            Analysis Records & Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Persisted records across safety inspections, crack diagnostics, property valuations, and master schedules.
          </p>
        </div>

        {total > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition"
          >
            Clear All History
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, project, or keyword..."
            className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <button
            type="submit"
            className="px-3.5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">All Intelligence Modules</option>
            <option value="safety_monitoring">Site Safety Monitoring</option>
            <option value="crack_analysis">Crack Detection & Analysis</option>
            <option value="real_estate_valuation">Real Estate Valuation</option>
            <option value="project_planning">Project Planning</option>
            <option value="daily_site_report">Daily Site Reports</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            <span>Loading historical analysis records...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16 px-4 text-xs text-slate-500">
            No analysis records match your current criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {records.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className="p-4 hover:bg-slate-50/80 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">{rec.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      {rec.module.replace(/_/g, ' ')}
                    </span>
                    {rec.risk_level && <StatusBadge label={rec.risk_level} variant="risk" />}
                    {rec.is_demo && (
                      <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        DEMO
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 line-clamp-1">{rec.summary}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-[11px] text-slate-400 font-mono">
                  <span>{rec.created_at ? rec.created_at.slice(0, 10) : ''}</span>
                  <button
                    type="button"
                    disabled={deletingId === rec.id}
                    onClick={(e) => handleDelete(rec.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord?.title || 'Analysis Record Detail'}
        maxWidth="max-w-3xl"
      >
        {selectedRecord && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-mono text-slate-500">
              <span>Module: {selectedRecord.module}</span>
              <span>Logged: {selectedRecord.created_at}</span>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1">Summary</span>
              <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedRecord.summary}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1">Persisted Structured Data</span>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-80">
                {JSON.stringify(selectedRecord.result_data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
