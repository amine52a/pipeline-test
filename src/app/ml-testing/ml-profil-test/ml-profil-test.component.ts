import { Component } from '@angular/core';
import { MlProfilService } from '../../services/ml-profil.service';

@Component({
  selector: 'app-ml-profil-test',
  templateUrl: './ml-profil-test.component.html',
  styleUrls: ['./ml-profil-test.component.scss']
})
export class MlProfilTestComponent {
  profile = {
    years_experience: 5.0,
    skills_count: 12,
    has_certifications: 1,
    has_obsolete_skill: 0,
    experience_level: 'Mid-Senior level',
    industry: 'Technology',
    job_type: 'Full-time',
    job_title: 'Data Scientist',
    profile_completeness_score: 88.0
  };

  experienceLevels = ['Entry level', 'Associate', 'Mid-Senior level', 'Director', 'Executive'];
  jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  
  loading: boolean = false;
  result: any = null;
  error: string = '';

  constructor(private mlProfilService: MlProfilService) {}

  analyzeProfile() {
    this.loading = true;
    this.error = '';
    this.result = null;

    this.mlProfilService.getFullAnalysis(this.profile).subscribe({
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
      case 'junior':
        this.profile = {
          years_experience: 1.5,
          skills_count: 5,
          has_certifications: 0,
          has_obsolete_skill: 0,
          experience_level: 'Entry level',
          industry: 'Technology',
          job_type: 'Full-time',
          job_title: 'Junior Developer',
          profile_completeness_score: 60.0
        };
        break;
      case 'expert':
        this.profile = {
          years_experience: 10.0,
          skills_count: 20,
          has_certifications: 1,
          has_obsolete_skill: 0,
          experience_level: 'Director',
          industry: 'Technology',
          job_type: 'Full-time',
          job_title: 'Senior Architect',
          profile_completeness_score: 95.0
        };
        break;
    }
  }
}
