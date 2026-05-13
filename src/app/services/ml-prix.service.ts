import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  PrixPredictRequest,
  PrixPredictResponse,
  PrixOptimalResponse,
  PrixModelsResponse,
  HealthResponse
} from '../models/ml-models';

@Injectable({
  providedIn: 'root'
})
export class MlPrixService {
  private apiUrl = environment.mlServices.prix;

  constructor(private http: HttpClient) {}

  /**
   * Predict optimal hourly rate based on project parameters
   * @param request Project parameters
   * @returns Observable of predicted hourly rate
   */
  predictHourlyRate(request: PrixPredictRequest): Observable<PrixPredictResponse> {
    return this.http.post<PrixPredictResponse>(`${this.apiUrl}/predict`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get median hourly rate for a specific job title
   * @param jobTitle Job title to query
   * @returns Observable of optimal pricing data
   */
  getOptimalPriceByJobTitle(jobTitle: string): Observable<PrixOptimalResponse> {
    return this.http.get<PrixOptimalResponse>(`${this.apiUrl}/prix-optimal/${encodeURIComponent(jobTitle)}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get list of available ML models
   */
  getAvailableModels(): Observable<PrixModelsResponse> {
    return this.http.get<PrixModelsResponse>(`${this.apiUrl}/models`)
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
   * Get service root info
   */
  getServiceInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('ML Prix Service Error:', error);
    return throwError(() => new Error(error.error?.detail || error.error?.error || 'An error occurred'));
  }
}
