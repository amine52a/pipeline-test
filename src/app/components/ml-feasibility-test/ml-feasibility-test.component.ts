import { Component, OnInit } from '@angular/core';
import { MlFeasibilityService } from '../../services/ml-feasibility.service';

@Component({
  selector: 'app-ml-feasibility-test',
  templateUrl: './ml-feasibility-test.component.html',
  styleUrl: './ml-feasibility-test.component.scss'
})
export class MlFeasibilityTestComponent implements OnInit {
  projectDescription: string = 'Build a mobile app for food delivery with real-time tracking';
  budget: number = 50000;
  timeline: number = 90;
  teamSize: number = 5;
  complexity: string = 'medium';
  
  loading: boolean = false;
  result: any = null;
  error: string = '';
  
  complexityLevels: string[] = ['low', 'medium', 'high'];

  constructor(private mlFeasibilityService: MlFeasibilityService) {}

  ngOnInit() {}

  analyzeFeasibility() {
    if (!this.projectDescription.trim()) {
      this.error = 'Project description is required';
      return;
    }

    if (this.budget <= 0 || this.timeline <= 0 || this.teamSize <= 0) {
      this.error = 'All numeric values must be greater than 0';
      return;
    }

    this.loading = true;
    this.error = '';
    this.result = null;

    const request = {
      project_description: this.projectDescription,
      budget: this.budget,
      timeline: this.timeline,
      team_size: this.teamSize,
      complexity: this.complexity
    };

    this.mlFeasibilityService.analyzeFeasibility(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.result = response;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Failed to analyze feasibility';
      }
    });
  }

  usePreset(preset: string) {
    switch(preset) {
      case 'small':
        this.projectDescription = 'Simple landing page with contact form';
        this.budget = 5000;
        this.timeline = 14;
        this.teamSize = 2;
        this.complexity = 'low';
        break;
      case 'medium':
        this.projectDescription = 'E-commerce platform with payment integration';
        this.budget = 50000;
        this.timeline = 90;
        this.teamSize = 5;
        this.complexity = 'medium';
        break;
      case 'large':
        this.projectDescription = 'Enterprise SaaS platform with AI features and multi-tenant architecture';
        this.budget = 200000;
        this.timeline = 180;
        this.teamSize = 15;
        this.complexity = 'high';
        break;
    }
  }

  getFeasibilityClass(): string {
    if (!this.result) return '';
    const score = this.result.feasibility_score;
    if (score >= 80) return 'highly-feasible';
    if (score >= 60) return 'feasible';
    if (score >= 40) return 'challenging';
    return 'risky';
  }

  getFeasibilityLabel(): string {
    if (!this.result) return '';
    const score = this.result.feasibility_score;
    if (score >= 80) return 'Highly Feasible';
    if (score >= 60) return 'Feasible';
    if (score >= 40) return 'Challenging';
    return 'High Risk';
  }
}
