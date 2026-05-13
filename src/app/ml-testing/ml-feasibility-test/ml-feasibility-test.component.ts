import { Component } from '@angular/core';
import { MlFeasibilityService } from '../../services/ml-feasibility.service';

@Component({
  selector: 'app-ml-feasibility-test',
  templateUrl: './ml-feasibility-test.component.html',
  styleUrls: ['./ml-feasibility-test.component.scss']
})
export class MlFeasibilityTestComponent {
  project = {
    budget: 75000,
    team_size: 6,
    duration_months: 8,
    industry: 'Technology',
    project_type: 'Web Development',
    client_experience: 'Experienced',
    team_experience_years: 4.5,
    previous_projects: 12,
    technology_stack: 'React/Node',
    risk_score: 3.2
  };

  clientExperienceLevels = ['Beginner', 'Intermediate', 'Experienced'];
  
  loading: boolean = false;
  result: any = null;
  error: string = '';

  constructor(private mlFeasibilityService: MlFeasibilityService) {}

  predictFeasibility() {
    this.loading = true;
    this.error = '';
    this.result = null;

    this.mlFeasibilityService.predictFeasibility(this.project).subscribe({
      next: (response) => {
        this.loading = false;
        this.result = response;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Failed to predict feasibility';
      }
    });
  }

  usePreset(preset: string) {
    switch(preset) {
      case 'high-success':
        this.project = {
          budget: 100000,
          team_size: 8,
          duration_months: 6,
          industry: 'Technology',
          project_type: 'Web Development',
          client_experience: 'Experienced',
          team_experience_years: 7.0,
          previous_projects: 25,
          technology_stack: 'React/Node',
          risk_score: 2.0
        };
        break;
      case 'high-risk':
        this.project = {
          budget: 5000,
          team_size: 1,
          duration_months: 2,
          industry: 'Retail',
          project_type: 'Mobile App',
          client_experience: 'Beginner',
          team_experience_years: 0.5,
          previous_projects: 0,
          technology_stack: 'Flutter',
          risk_score: 9.5
        };
        break;
    }
  }

  getRiskColor(level: string): string {
    switch(level) {
      case 'LOW': return '#10b981';
      case 'MEDIUM': return '#f59e0b';
      case 'HIGH': return '#ef4444';
      default: return '#6b7280';
    }
  }
}
