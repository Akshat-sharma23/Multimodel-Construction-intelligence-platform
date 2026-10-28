import {
  SystemStatus,
  SafetyAnalysisResult,
  CrackAnalysisResult,
  ValuationInput,
  ValuationResult,
  ProjectPlanResult,
  SavedProject,
  ChatMessage,
  AssistantResponse,
  WeatherAdvisoryResult,
  DailyReportInput,
  DailyReportResult,
  AnalysisRecordItem
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '') + '/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = `Request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) {
        if (typeof errJson.detail === 'string') {
          errorDetail = errJson.detail;
        } else if (Array.isArray(errJson.detail)) {
          errorDetail = errJson.detail.map((e: any) => `${e.loc?.join('.') || 'field'}: ${e.msg}`).join(', ');
        }
      }
    } catch {
      // fallback to status text
      errorDetail = res.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  async getStatus(): Promise<SystemStatus> {
    const res = await fetch(`${API_BASE_URL}/status`);
    return handleResponse<SystemStatus>(res);
  },

  async analyzeSafety(file: File, siteDescription?: string, forceDemo: boolean = false): Promise<SafetyAnalysisResult> {
    const formData = new FormData();
    formData.append('image', file);
    if (siteDescription) {
      formData.append('site_description', siteDescription);
    }
    if (forceDemo) {
      formData.append('force_demo', 'true');
    }
    const res = await fetch(`${API_BASE_URL}/safety/analyze`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<SafetyAnalysisResult>(res);
  },

  async analyzeCrack(file: File, buildingElement?: string, forceDemo: boolean = false): Promise<CrackAnalysisResult> {
    const formData = new FormData();
    formData.append('image', file);
    if (buildingElement) {
      formData.append('building_element', buildingElement);
    }
    if (forceDemo) {
      formData.append('force_demo', 'true');
    }
    const res = await fetch(`${API_BASE_URL}/cracks/analyze`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<CrackAnalysisResult>(res);
  },

  async estimateValuation(input: ValuationInput, forceDemo: boolean = false): Promise<ValuationResult> {
    const res = await fetch(`${API_BASE_URL}/valuation/estimate?force_demo=${forceDemo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<ValuationResult>(res);
  },

  async generateProjectPlan(data: any, forceDemo: boolean = false): Promise<ProjectPlanResult> {
    const res = await fetch(`${API_BASE_URL}/planning/generate?force_demo=${forceDemo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ProjectPlanResult>(res);
  },

  async getProjects(search?: string): Promise<{ total: number; items: SavedProject[] }> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`${API_BASE_URL}/projects${query}`);
    return handleResponse<{ total: number; items: SavedProject[] }>(res);
  },

  async getProject(id: string): Promise<SavedProject> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`);
    return handleResponse<SavedProject>(res);
  },

  async saveProject(data: any): Promise<{ id: string; name: string; message: string }> {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ id: string; name: string; message: string }>(res);
  },

  async deleteProject(id: string): Promise<{ success: boolean; id: string; message: string }> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean; id: string; message: string }>(res);
  },

  async chatAssistant(message: string, history?: ChatMessage[], forceDemo: boolean = false): Promise<AssistantResponse> {
    const res = await fetch(`${API_BASE_URL}/assistant/chat?force_demo=${forceDemo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    return handleResponse<AssistantResponse>(res);
  },

  async getWeatherAdvisory(location: string): Promise<WeatherAdvisoryResult> {
    const res = await fetch(`${API_BASE_URL}/weather/advisory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location }),
    });
    return handleResponse<WeatherAdvisoryResult>(res);
  },

  async generateDailyReport(input: DailyReportInput, forceDemo: boolean = false): Promise<DailyReportResult> {
    const res = await fetch(`${API_BASE_URL}/reports/generate?force_demo=${forceDemo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<DailyReportResult>(res);
  },

  async getDailyReports(): Promise<{ total: number; items: any[] }> {
    const res = await fetch(`${API_BASE_URL}/reports`);
    return handleResponse<{ total: number; items: any[] }>(res);
  },

  async deleteDailyReport(id: string): Promise<{ success: boolean; id: string; message: string }> {
    const res = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean; id: string; message: string }>(res);
  },

  async getHistory(module?: string, search?: string): Promise<{ total: number; items: AnalysisRecordItem[] }> {
    const params = new URLSearchParams();
    if (module) params.append('module', module);
    if (search) params.append('search', search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/history${qs}`);
    return handleResponse<{ total: number; items: AnalysisRecordItem[] }>(res);
  },

  async deleteHistoryRecord(id: string): Promise<{ success: boolean; id: string; message: string }> {
    const res = await fetch(`${API_BASE_URL}/history/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean; id: string; message: string }>(res);
  },

  async clearHistory(): Promise<{ success: boolean; id: string; message: string }> {
    const res = await fetch(`${API_BASE_URL}/history?confirm=true`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean; id: string; message: string }>(res);
  }
};
