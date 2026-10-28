export type RiskLevel = 'low' | 'medium' | 'high' | 'critical' | 'unknown' | 'negligible' | 'minor' | 'moderate' | 'severe' | 'uncertain';

export interface SystemStatus {
  live_ai_ready: boolean;
  configured_text_model: string;
  configured_vision_model: string;
  force_demo_mode: boolean;
  database_connected: boolean;
  storage_type: string;
}

export interface HazardItem {
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location_in_image: string;
  visible_evidence: string;
}

export interface SafetyAnalysisResult {
  module: 'safety_monitoring';
  summary: string;
  visible_elements: string[];
  observations: string[];
  potential_hazards: HazardItem[];
  risk_level: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  recommendations: string[];
  limitations: string[];
  is_demo: boolean;
  timestamp: string;
  saved_record_id?: string;
}

export interface CrackPattern {
  pattern_type: string;
  visual_severity: 'negligible' | 'minor' | 'moderate' | 'severe' | 'uncertain';
  description: string;
  approximate_location: string;
  characteristics: string;
}

export interface CrackAnalysisResult {
  module: 'crack_analysis';
  summary: string;
  building_element: string;
  visual_crack_patterns: CrackPattern[];
  overall_visual_severity: 'negligible' | 'minor' | 'moderate' | 'severe' | 'uncertain';
  possible_causes_hypothesis: string[];
  recommended_actions: string[];
  inspection_disclaimer: string;
  is_demo: boolean;
  timestamp: string;
  saved_record_id?: string;
}

export interface ValuationInput {
  city: string;
  locality: string;
  property_type: string;
  area_sqft: number;
  bedrooms?: number;
  bathrooms?: number;
  property_age_years: number;
  property_condition: string;
  additional_features?: string[];
  notes?: string;
}

export interface ComparableProperty {
  locality: string;
  property_type: string;
  area_sqft: number;
  price_per_sqft: number;
  transaction_type: string;
  source: string;
}

export interface ValuationBreakdown {
  base_rate_per_sqft: number;
  base_value: number;
  age_depreciation_percent: number;
  age_depreciation_amount: number;
  condition_adjustment_percent: number;
  condition_adjustment_amount: number;
  locality_tier_factor: number;
  locality_adjustment_amount: number;
  net_calculated_value: number;
}

export interface ValuationResult {
  module: 'real_estate_valuation';
  currency: string;
  estimated_price_min: number;
  estimated_price_max: number;
  estimated_price_midpoint: number;
  price_per_sqft: number;
  valuation_methodology: string;
  breakdown: ValuationBreakdown;
  inputs_used: Record<string, any>;
  benchmark_comparables: ComparableProperty[];
  confidence_level: 'High' | 'Medium' | 'Moderate' | 'Illustrative';
  limitations_warning: string;
  is_demo: boolean;
  timestamp: string;
  saved_record_id?: string;
}

export interface TaskItem {
  id: string;
  phase: string;
  title: string;
  duration_days: number;
  suggested_start: string;
  suggested_end: string;
  dependencies: string[];
  assigned_trade: string;
  critical_path: boolean;
  deliverables: string;
}

export interface PhaseItem {
  name: string;
  duration_weeks: number;
  description: string;
  key_milestone: string;
  tasks: TaskItem[];
}

export interface ProjectRiskItem {
  risk: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigation_strategy: string;
}

export interface MilestoneItem {
  title: string;
  target_date: string;
  deliverable: string;
}

export interface ProjectPlanResult {
  module: 'project_planning';
  project_name: string;
  project_summary: string;
  total_estimated_days: number;
  phases: PhaseItem[];
  critical_path_summary: string[];
  potential_risks: ProjectRiskItem[];
  milestones: MilestoneItem[];
  preliminary_disclaimer: string;
  is_demo: boolean;
  timestamp: string;
  saved_project_id?: string;
}

export interface SavedProject {
  id: string;
  name: string;
  project_type: string;
  description?: string;
  constraints?: string;
  size: string;
  start_date: string;
  target_date: string;
  budget: string;
  status: string;
  created_at: string;
  phase_count?: number;
  plan_data?: ProjectPlanResult;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface AssistantResponse {
  response_text: string;
  technical_concepts: string[];
  suggested_followups: string[];
  professional_advisory_notice: string;
  is_demo: boolean;
  session_id: string;
}

export interface OperationalAdvisory {
  activity: string;
  status: 'Safe / Normal' | 'Caution / Monitored' | 'Suspended / High Risk';
  reason: string;
  precautions: string[];
}

export interface WeatherAdvisoryResult {
  module: 'weather_advisory';
  location_name: string;
  timestamp: string;
  temperature_c: number;
  temperature_f: number;
  conditions: string;
  wind_speed_kmh: number;
  wind_gusts_kmh: number;
  precipitation_chance_percent: number;
  humidity_percent: number;
  operational_advisories: OperationalAdvisory[];
  high_risk_alerts: string[];
  data_source: string;
  is_demo: boolean;
}

export interface DailyReportInput {
  project_name: string;
  report_date: string;
  workforce_count: number;
  work_completed: string;
  materials_used: string;
  equipment_used: string;
  delays_issues?: string;
  safety_observations?: string;
  planned_work_next_day: string;
}

export interface DailyReportResult {
  module: 'daily_site_report';
  project_name: string;
  report_date: string;
  executive_summary: string;
  manpower_productivity_analysis: string;
  materials_and_equipment_notes: string;
  delay_impact_assessment: string;
  safety_and_compliance_review: string;
  next_day_action_items: string[];
  formatted_markdown_report: string;
  is_demo: boolean;
  saved_report_id?: string;
}

export interface AnalysisRecordItem {
  id: string;
  created_at: string;
  module: string;
  title: string;
  summary: string;
  risk_level?: string;
  is_demo: boolean;
  input_meta: Record<string, any>;
  result_data: Record<string, any>;
}
