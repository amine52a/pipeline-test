import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ProjectFeasibilityInput,
  FeasibilityPredictionResponse,
  BatchFeasibilityInput,
  BatchPredictionResponse,
  ModelInfo,
  HealthResponse
} from '../models/ml-models';

@Injectable({
  providedIn: 'root'
})
export class MlFeasibilityService {
  private apiUrl = environment.mlServices.feasibility;

  constructor(private http: HttpClient) {}

  /**
   * Predict project feasibility/success probability
   * @param project Project parameters
   * @returns Observable of feasibility prediction
   */
  predictFeasibility(project: ProjectFeasibilityInput): Observable<FeasibilityPredictionResponse> {
    return this.http.post<FeasibilityPredictionResponse>(
      `${this.apiUrl}/api/ml/predict`,
      project
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Predict feasibility for multiple projects
   * @param projects Array of project parameters
   * @returns Observable of batch predictions
   */
  batchPredictFeasibility(projects: ProjectFeasibilityInput[]): Observable<BatchPredictionResponse> {
    const payload: BatchFeasibilityInput = { projects };
    
    return this.http.post<BatchPredictionResponse>(
      `${this.apiUrl}/api/ml/batch-predict`,
      payload
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get ML model information
   */
  getModelInfo(): Observable<ModelInfo> {
    return this.http.get<ModelInfo>(`${this.apiUrl}/api/ml/model-info`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get list of features used by the model
   */
  getFeatures(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/ml/features`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Check service health
   */
  checkHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.apiUrl}/health`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get Prometheus metrics
   */
  getMetrics(): Observable<string> {
    return this.http.get(`${this.apiUrl}/metrics`, { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('ML Feasibility Service Error:', error);
    return throwError(() => new Error(error.error?.detail || error.error?.error || 'An error occurred'));
  }
}
