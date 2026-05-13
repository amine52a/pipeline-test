import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface AiTool {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
  route: string;
  tags: string[];
  badge?: string;
}

@Component({
  selector: 'app-ai-hub',
  templateUrl: './ai-hub.component.html',
  styleUrls: ['./ai-hub.component.scss']
})
export class AiHubComponent {

  tools: AiTool[] = [
    {
      id: 'matching',
      title: 'Smart Matching',
      subtitle: 'Freelancer Discovery',
      description: 'Describe your project and our AI instantly finds the best-matching freelancers using NLP and cosine similarity on thousands of profiles.',
      icon: '🤝',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/ml-matching',
      tags: ['NLP', 'Cosine Similarity', 'TF-IDF'],
      badge: 'Most Popular'
    },
    {
      id: 'prix',
      title: 'Rate Predictor',
      subtitle: 'Hourly Rate Intelligence',
      description: 'Get an AI-powered prediction of the optimal hourly rate for any project based on hours, budget, and duration. Powered by Random Forest, XGBoost & Linear models.',
      icon: '💰',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      route: '/ml-prix',
      tags: ['Random Forest', 'XGBoost', 'Regression'],
      badge: 'New'
    },
    {
      id: 'profil',
      title: 'Profile Optimizer',
      subtitle: 'Career Intelligence',
      description: 'Analyze your freelancer profile with ML clustering and optimization scoring. Get actionable recommendations to stand out and attract better clients.',
      icon: '👤',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      route: '/ml-profil',
      tags: ['K-Means', 'Random Forest', 'Classification'],
    },
    {
      id: 'feasibility',
      title: 'Feasibility Analyzer',
      subtitle: 'Project Risk Assessment',
      description: 'Before committing to a project, let AI evaluate its success probability. Identify risks, get confidence scores, and receive strategic recommendations.',
      icon: '🎯',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      route: '/ml-feasibility',
      tags: ['Risk Analysis', 'Classification', 'Prediction'],
    }
  ];

  hoveredCard: string | null = null;

  constructor(private router: Router) {}

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
