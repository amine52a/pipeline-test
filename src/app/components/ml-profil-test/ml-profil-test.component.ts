import { Component, OnInit } from '@angular/core';
import { MlProfilService } from '../../services/ml-profil.service';

@Component({
  selector: 'app-ml-profil-test',
  templateUrl: './ml-profil-test.component.html',
  styleUrl: './ml-profil-test.component.scss'
})
export class MlProfilTestComponent implements OnInit {
  skills: string = 'JavaScript, React, Node.js, MongoDB';
  experience: number = 3;
  hourlyRate: number = 50;
  completedProjects: number = 15;
  rating: number = 4.5;
  
  loading: boolean = false;
  result: any = null;
  error: string = '';

  constructor(private mlProfilService: MlProfilService) {}

  ngOnInit() {}

  analyzeProfile() {
    if (!this.skills.trim()) {
      this.error = 'Skills are required';
      return;
    }

    if (this.experience < 0 || this.hourlyRate < 0 || this.completedProjects < 0 || this.rating < 0 || this.rating > 5) {
      this.error = 'Please enter valid values';
      return;
    }

    this.loading = true;
    this.error = '';
    this.result = null;

    const request = {
      skills: this.skills,
      experience: this.experience,
      hourly_rate: this.hourlyRate,
      completed_projects: this.completedProjects,
      rating: this.rating
    };

    this.mlProfilService.analyzeProfile(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.result = response;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Failed to analyze profile';
      }
    });
  }

  usePreset(preset: string) {
    switch(preset) {
      case 'beginner':
        this.skills = 'HTML, CSS, JavaScript';
        this.experience = 1;
        this.hourlyRate = 25;
        this.completedProjects = 5;
        this.rating = 4.0;
        break;
      case 'intermediate':
        this.skills = 'JavaScript, React, Node.js, MongoDB, Git';
        this.experience = 3;
        this.hourlyRate = 50;
        this.completedProjects = 15;
        this.rating = 4.5;
        break;
      case 'expert':
        this.skills = 'JavaScript, TypeScript, React, Angular, Node.js, Python, AWS, Docker, Kubernetes';
        this.experience = 7;
        this.hourlyRate = 100;
        this.completedProjects = 50;
        this.rating = 4.9;
        break;
    }
  }

  getProfileLevelClass(): string {
    if (!this.result) return '';
    const score = this.result.profile_score;
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'needs-improvement';
  }
}
