import { Component } from '@angular/core';
import { MlProfilService } from '../../services/ml-profil.service';
import { FreelancerProfile, FullAnalysisResponse } from '../../models/ml-models';

@Component({
  selector: 'app-ml-profil',
  templateUrl: './ml-profil.component.html',
  styleUrls: ['./ml-profil.component.scss']
})
export class MlProfilComponent {

  // Valid values from the trained model
  experienceLevels = ['Associate', 'Director', 'Entry level', 'Executive', 'Mid-Senior level'];
  jobTypes = ['Contract', 'Freelance', 'Full-time', 'Internship', 'Part-time'];
  jobTitles = [
    'AI Engineer', 'Backend Developer', 'Blockchain Developer', 'Business Analyst',
    'Cloud Architect', 'Computer Vision Engineer', 'Cybersecurity Analyst',
    'Data Analyst', 'Data Engineer', 'Data Scientist', 'DevOps Engineer',
    'Frontend Developer', 'Full Stack Developer', 'Machine Learning Engineer',
    'Mobile Developer', 'NLP Engineer', 'Product Manager', 'Project Manager',
    'Software Engineer', 'UX Designer'
  ];
  industries = [
    'Consulting', 'E-commerce', 'Education', 'Energy', 'Finance', 'Gaming',
    'Government', 'Healthcare', 'Manufacturing', 'Media', 'Non-profit',
    'Real Estate', 'Retail', 'Technology', 'Telecommunications'
  ];

  // Form fields
  yearsExperience: number = 3;
  skillsCount: number = 8;
  hasCertifications: 0 | 1 = 1;
  hasObsoleteSkill: 0 | 1 = 0;
  experienceLevel = 'Mid-Senior level';
  industry = 'Technology';
  jobType = 'Freelance';
  jobTitle = 'Full Stack Developer';
  profileCompletenessScore: number = 75;

  loading = false;
  result: FullAnalysisResponse | null = null;
  error = '';

  constructor(private mlProfilService: MlProfilService) {}

  analyzeProfile() {
    this.loading = true;
    this.error = '';
    this.result = null;

    const request: FreelancerProfile = {
      years_experience: this.yearsExperience,
      skills_count: this.skillsCount,
      has_certifications: this.hasCertifications,
      has_obsolete_skill: this.hasObsoleteSkill,
      experience_level: this.experienceLevel as any,
      industry: this.industry,
      job_type: this.jobType as any,
      job_title: this.jobTitle,
      profile_completeness_score: this.profileCompletenessScore
    };

    this.mlProfilService.getFullAnalysis(request).subscribe({
      next: (response: FullAnalysisResponse) => {
        this.loading = false;
        this.result = response;
      },
      error: (err: Error) => {
        this.loading = false;
        this.error = err.message || 'Failed to analyze profile';
      }
    });
  }

  usePreset(preset: string) {
    switch (preset) {
      case 'beginner':
        this.yearsExperience = 1;
        this.skillsCount = 4;
        this.hasCertifications = 0;
        this.hasObsoleteSkill = 0;
        this.experienceLevel = 'Entry level';
        this.industry = 'Technology';
        this.jobType = 'Internship';
        this.jobTitle = 'Frontend Developer';
        this.profileCompletenessScore = 50;
        break;
      case 'intermediate':
        this.yearsExperience = 4;
        this.skillsCount = 10;
        this.hasCertifications = 1;
        this.hasObsoleteSkill = 0;
        this.experienceLevel = 'Associate';
        this.industry = 'Technology';
        this.jobType = 'Freelance';
        this.jobTitle = 'Full Stack Developer';
        this.profileCompletenessScore = 75;
        break;
      case 'expert':
        this.yearsExperience = 10;
        this.skillsCount = 18;
        this.hasCertifications = 1;
        this.hasObsoleteSkill = 0;
        this.experienceLevel = 'Director';
        this.industry = 'Finance';
        this.jobType = 'Contract';
        this.jobTitle = 'Cloud Architect';
        this.profileCompletenessScore = 95;
        break;
    }
  }

  getOptimizationClass(): string {
    if (!this.result) return '';
    return this.result.optimization.profile_optimized === 1 ? 'optimized' : 'not-optimized';
  }
}
