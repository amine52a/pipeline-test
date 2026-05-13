import { Component } from '@angular/core';
import { MlMatchingService } from '../../services/ml-matching.service';

@Component({
  selector: 'app-ml-matching-test',
  templateUrl: './ml-matching-test.component.html',
  styleUrl: './ml-matching-test.component.scss'
})
export class MlMatchingTestComponent {
  description: string = '';
  loading: boolean = false;
  results: any[] = [];
  error: string = '';

  exampleDescriptions = [
    'Python developer with machine learning and data science experience',
    'Full stack developer with React and Node.js expertise',
    'Mobile app developer with Flutter and React Native skills',
    'DevOps engineer with AWS and Docker experience',
    'UI/UX designer with Figma and Adobe XD skills'
  ];

  constructor(private mlMatchingService: MlMatchingService) {}

  useExample(example: string) {
    this.description = example;
  }

  findMatches() {
    if (!this.description.trim()) {
      this.error = 'Please enter a project description';
      return;
    }

    this.loading = true;
    this.error = '';
    this.results = [];

    this.mlMatchingService.findMatches(this.description).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.results) {
          this.results = response.results;
        } else if (response.error) {
          this.error = response.error;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Failed to fetch matches';
      }
    });
  }

  getScoreColor(score: number): string {
    if (score >= 0.7) return '#10b981';
    if (score >= 0.5) return '#f59e0b';
    return '#ef4444';
  }

  getScorePercentage(score: number): number {
    return Math.round(score * 100);
  }
}
