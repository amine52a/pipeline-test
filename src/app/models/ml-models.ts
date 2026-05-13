// ============================================
// ML Service Models & Interfaces
// ============================================

// ──────────────────────────────────────────
// 1. MATCHING SERVICE
// ──────────────────────────────────────────
export interface MatchingRequest {
  description: string;
}

export interface MatchingResult {
  person_id: number;
  profile: string;
  score: number;
}

export interface MatchingResponse {
  results?: MatchingResult[];
  error?: string;
}

// ──────────────────────────────────────────
// 2. PRIX (PRICING) SERVICE
// ──────────────────────────────────────────
export interface PrixPredictRequest {
  total_hours: number;
  total_paid: number;
  project_duration_days: number;
  model?: 'random_forest' | 'xgboost' | 'linear';
}

export interface PrixPredictResponse {
  hourly_rate: number;
  currency: string;
}

export interface PrixOptimalRequest {
  job_title: string;
}

export interface PrixOptimalResponse {
  job_title: string;
  median_hourly_rate: number;
  sample_count: number;
  currency: string;
}

export interface PrixModelsResponse {
  available_models: string[];
}

// ──────────────────────────────────────────
// 3. PROFIL (PROFILE) SERVICE
// ──────────────────────────────────────────
export interface FreelancerProfile {
  years_experience: number;
  skills_count: number;
  has_certifications: 0 | 1;
  has_obsolete_skill: 0 | 1;
  experience_level: string;
  industry: string;
  job_type: string;
  job_title: string;
  profile_completeness_score: number;
}

export interface ProfileOptimizationResponse {
  profile_optimized: number;
  label: string;
  confidence: number;
  proba_optimized: number;
  proba_not_optimized: number;
}

export interface ClusterResponse {
  cluster: number;
  cluster_label: string;
  recommendation: string;
}

export interface FullAnalysisResponse {
  optimization: ProfileOptimizationResponse;
  clustering: ClusterResponse;
  summary: string;
}

// ──────────────────────────────────────────
// 4. FEASIBILITY SERVICE
// ──────────────────────────────────────────
export interface ProjectFeasibilityInput {
  budget: number;
  team_size: number;
  duration_months: number;
  industry: string;
  project_type: string;
  client_experience: 'Beginner' | 'Intermediate' | 'Experienced';
  team_experience_years: number;
  previous_projects: number;
  technology_stack: string;
  risk_score: number;
}

export interface PredictionResult {
  will_succeed: boolean;
  label: string;
  success_probability: number;
  failure_probability: number;
  confidence_level: string;
  risk_level: string;
}

export interface FeasibilityPredictionResponse {
  success: boolean;
  prediction: PredictionResult;
  recommendation: string;
  model_used: string;
  input_features: ProjectFeasibilityInput;
}

export interface BatchFeasibilityInput {
  projects: ProjectFeasibilityInput[];
}

export interface BatchPredictionResponse {
  success: boolean;
  total_projects: number;
  predictions: Array<{
    project_index: number;
    will_succeed?: boolean;
    label?: string;
    success_probability?: number;
    confidence_level?: string;
    risk_level?: string;
    error?: string;
  }>;
}

export interface ModelInfo {
  model_name: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
  };
  features: string[];
  total_features: number;
  classes: string[];
}

// ──────────────────────────────────────────
// COMMON TYPES
// ──────────────────────────────────────────
export interface HealthResponse {
  status: string;
  service?: string;
  model_loaded?: boolean;
  models_loaded?: boolean;
}

export interface ErrorResponse {
  error: string;
  detail?: string;
}
