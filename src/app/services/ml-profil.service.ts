import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  FreelancerProfile,
  ProfileOptimizationResponse,
  ClusterResponse,
  FullAnalysisResponse,
  HealthResponse
} from '../models/ml-models';

@Injectable({
  providedIn: 'root'
})
export class MlProfilService {
  private apiUrl = environment.mlServices.profil;

  constructor(private http: HttpClient) {}

  /**
   * Predict if a freelancer profile is optimized
   * @param profile Freelancer profile data
   * @returns Observable of optimization prediction
   */
  predictProfileOptimization(profile: FreelancerProfile): Observable<ProfileOptimizationResponse> {
    return this.http.post<ProfileOptimizationResponse>(
      `${this.apiUrl}/predict/profile-optimization`,
      profile
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Predict which cluster a profile belongs to
   * @param profile Freelancer profile data
   * @returns Observable of cluster prediction
   */
  predictCluster(profile: FreelancerProfile): Observable<ClusterResponse> {
    return this.http.post<ClusterResponse>(
      `${this.apiUrl}/predict/cluster`,
      profile
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get full analysis (optimization + clustering)
   * @param profile Freelancer profile data
   * @returns Observable of complete analysis
   */
  getFullAnalysis(profile: FreelancerProfile): Observable<FullAnalysisResponse> {
    return this.http.post<FullAnalysisResponse>(
      `${this.apiUrl}/predict/full-analysis`,
      profile
    ).pipe(
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
   * Debug endpoint
   */
  debug(): Observable<any> {
    return this.http.get(`${this.apiUrl}/debug`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('ML Profil Service Error:', error);
    return throwError(() => new Error(error.error?.detail || error.error?.error || 'An error occurred'));
  }
}
