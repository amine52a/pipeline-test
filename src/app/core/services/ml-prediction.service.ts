import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MLPredictionRequest {
  budget: number;
  team_size: number;
  duration_months: number;
  complexity?: string;
  client_experience?: string;
  technology_stack?: string;
  team_experience_years?: number;
  requirements_clarity?: string;
  stakeholder_involvement?: string;
  risk_factors?: number;
  [key: string]: any;
}

export interface MLPredictionResponse {
  success: boolean;
  prediction: {
    will_succeed: boolean;
    success_probability: number;
    failure_probability: number;
    confidence_level: string;
    risk_level: string;
  };
  recommendation: string;
  input_features: any;
}

export interface ModelInfo {
  model_name: string;
  f1_score: number;
  accuracy: number;
  auc: number;
  features: string[];
  total_features: number;
}

export interface BatchPredictionRequest {
  projects: MLPredictionRequest[];
}

export interface BatchPredictionResponse {
  success: boolean;
  total_projects: number;
  predictions: Array<{
    project_index: number;
    will_succeed: boolean;
    success_probability: number;
    risk_level: string;
    error?: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class MlPredictionService {
  private apiUrl = `http://localhost:8085/api/ml`;

  constructor(private http: HttpClient) {}

  /**
   * Get ML model information
   */
  getModelInfo(): Observable<ModelInfo> {
    return this.http.get<ModelInfo>(`${this.apiUrl}/model-info`);
  }

  /**
   * Predict single project feasibility
   */
  predictProject(projectData: MLPredictionRequest): Observable<MLPredictionResponse> {
    return this.http.post<MLPredictionResponse>(`${this.apiUrl}/predict`, projectData);
  }

  /**
   * Predict multiple projects at once
   */
  batchPredict(projects: MLPredictionRequest[]): Observable<BatchPredictionResponse> {
    return this.http.post<BatchPredictionResponse>(`${this.apiUrl}/batch-predict`, {
      projects
    });
  }

  /**
   * Get list of required features
   */
  getRequiredFeatures(): Observable<{ features: string[]; total: number }> {
    return this.http.get<{ features: string[]; total: number }>(`${this.apiUrl}/features`);
  }

  /**
   * Check if ML service is healthy
   */
  checkHealth(): Observable<any> {
    return this.http.get(`http://localhost:8085/health`);
  }
}
