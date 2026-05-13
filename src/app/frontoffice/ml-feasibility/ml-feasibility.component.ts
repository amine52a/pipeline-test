import { Component } from '@angular/core';
import { MlFeasibilityService } from '../../services/ml-feasibility.service';
import { ProjectFeasibilityInput, FeasibilityPredictionResponse } from '../../models/ml-models';

@Component({
  selector: 'app-ml-feasibility',
  templateUrl: './ml-feasibility.component.html',
  styleUrls: ['./ml-feasibility.component.scss']
})
export class MlFeasibilityComponent {
  budget: number = 50000;
  teamSize: number = 5;
  durationMonths: number = 6;
  industry: string = 'Technology';
  projectType: string = 'Web Application';
  clientExperience: 'Beginner' | 'Intermediate' | 'Experienced' = 'Intermediate';
  teamExperienceYears: number = 3;
  previousProjects: number = 10;
  technologyStack: string = 'React, Node.js, MongoDB';
  riskScore: number = 3;

  loading: boolean = false;
  result: FeasibilityPredictionResponse | null = null;
  error: string = '';

  clientExperienceLevels: Array<'Beginner' | 'Intermediate' | 'Experienced'> = ['Beginner', 'Intermediate', 'Experienced'];

  constructor(private mlFeasibilityService: MlFeasibilityService) {}

  analyzeFeasibility() {
    this.loading = true;
    this.error = '';
    this.result = null;

    const request: ProjectFeasibilityInput = {
      budget: this.budget,
      team_size: this.teamSize,
      duration_months: this.durationMonths,
      industry: this.industry,
      project_type: this.projectType,
      client_experience: this.clientExperience,
      team_experience_years: this.teamExperienceYears,
      previous_projects: this.previousProjects,
      technology_stack: this.technologyStack,
      risk_score: this.riskScore
    };

    this.mlFeasibilityService.predictFeasibility(request).subscribe({
      next: (response: FeasibilityPredictionResponse) => {
        this.loading = false;
        this.result = response;
      },
      error: (err: Error) => {
        this.loading = false;
        this.error = err.message || 'Failed to analyze feasibility';
      }
    });
  }

  usePreset(preset: string) {
    switch (preset) {
      case 'small':
        this.budget = 5000;
        this.teamSize = 2;
        this.durationMonths = 2;
        this.industry = 'Technology';
        this.projectType = 'Landing Page';
        this.clientExperience = 'Beginner';
        this.teamExperienceYears = 1;
        this.previousProjects = 3;
        this.technologyStack = 'HTML, CSS, JavaScript';
        this.riskScore = 2;
        break;
      case 'medium':
        this.budget = 50000;
        this.teamSize = 5;
        this.durationMonths = 6;
        this.industry = 'E-commerce';
        this.projectType = 'Web Application';
        this.clientExperience = 'Intermediate';
        this.teamExperienceYears = 3;
        this.previousProjects = 10;
        this.technologyStack = 'React, Node.js, MongoDB';
        this.riskScore = 3;
        break;
      case 'large':
        this.budget = 200000;
        this.teamSize = 15;
        this.durationMonths = 18;
        this.industry = 'Finance';
        this.projectType = 'Enterprise SaaS';
        this.clientExperience = 'Experienced';
        this.teamExperienceYears = 7;
        this.previousProjects = 30;
        this.technologyStack = 'Angular, Java Spring, PostgreSQL, AWS';
        this.riskScore = 6;
        break;
    }
  }

  getResultClass(): string {
    if (!this.result) return '';
    const prob = this.result.prediction.success_probability;
    if (prob >= 75) return 'highly-feasible';
    if (prob >= 50) return 'feasible';
    if (prob >= 25) return 'challenging';
    return 'risky';
  }

  getResultLabel(): string {
    if (!this.result) return '';
    const prob = this.result.prediction.success_probability;
    if (prob >= 75) return 'Highly Likely to Succeed';
    if (prob >= 50) return 'Likely to Succeed';
    if (prob >= 25) return 'Challenging';
    return 'High Risk';
  }
}
