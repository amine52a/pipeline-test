import { Component, OnInit } from '@angular/core';
import { MlPrixService } from '../../services/ml-prix.service';

@Component({
  selector: 'app-ml-prix-test',
  templateUrl: './ml-prix-test.component.html',
  styleUrl: './ml-prix-test.component.scss'
})
export class MlPrixTestComponent implements OnInit {
  totalHours: number = 120;
  totalPaid: number = 5000;
  projectDurationDays: number = 30;
  selectedModel: string = 'random_forest';
  
  loading: boolean = false;
  result: any = null;
  error: string = '';
  
  availableModels: string[] = ['random_forest', 'xgboost', 'linear'];

  constructor(private mlPrixService: MlPrixService) {}

  ngOnInit() {
    this.loadAvailableModels();
  }

  loadAvailableModels() {
    this.mlPrixService.getAvailableModels().subscribe({
      next: (response) => {
        this.availableModels = response.available_models;
      },
      error: (err) => {
        console.error('Failed to load models:', err);
      }
    });
  }

  predictRate() {
    if (this.totalHours <= 0 || this.totalPaid <= 0 || this.projectDurationDays <= 0) {
      this.error = 'All values must be greater than 0';
      return;
    }

    this.loading = true;
    this.error = '';
    this.result = null;

    const request = {
      total_hours: this.totalHours,
      total_paid: this.totalPaid,
      project_duration_days: this.projectDurationDays,
      model: this.selectedModel
    };

    this.mlPrixService.predictHourlyRate(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.result = response;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Failed to predict hourly rate';
      }
    });
  }

  usePreset(preset: string) {
    switch(preset) {
      case 'junior':
        this.totalHours = 160;
        this.totalPaid = 4000;
        this.projectDurationDays = 30;
        break;
      case 'mid':
        this.totalHours = 120;
        this.totalPaid = 6000;
        this.projectDurationDays = 30;
        break;
      case 'senior':
        this.totalHours = 80;
        this.totalPaid = 8000;
        this.projectDurationDays = 20;
        break;
    }
  }
}
