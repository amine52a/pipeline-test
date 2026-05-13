import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MatchingRequest,
  MatchingResponse,
  HealthResponse
} from '../models/ml-models';

@Injectable({
  providedIn: 'root'
})
export class MlMatchingService {
  private apiUrl = environment.mlServices.matching;

  constructor(private http: HttpClient) {}

  /**
   * Find matching freelancers based on project description
   * @param description Project description text
   * @returns Observable of matching results
   */
  findMatches(description: string): Observable<MatchingResponse> {
    const payload: MatchingRequest = { description };
    
    return this.http.post<MatchingResponse>(`${this.apiUrl}/matching`, payload)
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

  private handleError(error: any) {
    console.error('ML Matching Service Error:', error);
    return throwError(() => new Error(error.error?.error || 'An error occurred'));
  }
}
