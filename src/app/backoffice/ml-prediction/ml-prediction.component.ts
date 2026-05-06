import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface PredictionResult {
  success: boolean;
  prediction: {
    will_succeed: boolean;
    success_probability: number;
    failure_probability: number;
    confidence_level: string;
    risk_level: string;
  };
  recommendation: string;
}

interface ModelInfo {
  model_name: string;
  f1_score: number;
  accuracy: number;
  auc: number;
  features: string[];
  total_features: number;
}

@Component({
  selector: 'app-ml-prediction',
  templateUrl: './ml-prediction.component.html',
  styleUrls: ['./ml-prediction.component.scss']
})
export class MlPredictionComponent implements OnInit {
  form!: FormGroup;
  modelInfo: ModelInfo | null = null;
  result: PredictionResult | null = null;
  loading = false;
  modelLoading = false;
  error: string | null = null;
  serviceOffline = false;

  readonly ML_API = 'http://localhost:8085/api/ml';

  complexityOptions = ['low', 'medium', 'high'];
  experienceOptions = ['low', 'medium', 'high'];
  technologyOptions = ['modern', 'legacy', 'mixed'];
  clarityOptions = ['clear', 'moderate', 'unclear'];
  involvementOptions = ['high', 'medium', 'low'];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadModelInfo();
  }

  buildForm(): void {
    this.form = this.fb.group({
      budget:                   [50000,    [Validators.required, Validators.min(0)]],
      team_size:                [5,        [Validators.required, Validators.min(1)]],
      duration_months:          [6,        [Validators.required, Validators.min(1)]],
      complexity:               ['medium', Validators.required],
      client_experience:        ['medium', Validators.required],
      technology_stack:         ['modern', Validators.required],
      team_experience_years:    [5,        [Validators.required, Validators.min(0)]],
      requirements_clarity:     ['clear',  Validators.required],
      stakeholder_involvement:  ['high',   Validators.required],
      risk_factors:             [3,        [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  loadModelInfo(): void {
    this.modelLoading = true;
    this.http.get<ModelInfo>(`${this.ML_API}/model-info`).subscribe({
      next: (info) => {
        this.modelInfo = info;
        this.modelLoading = false;
        this.serviceOffline = false;
      },
      error: () => {
        this.serviceOffline = true;
        this.modelLoading = false;
      }
    });
  }

  predict(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.result = null;

    this.http.post<PredictionResult>(`${this.ML_API}/predict`, this.form.value).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Prediction failed. Is the ML service running on port 8085?';
        this.loading = false;
      }
    });
  }

  reset(): void {
    this.form.reset({
      budget: 50000, team_size: 5, duration_months: 6,
      complexity: 'medium', client_experience: 'medium',
      technology_stack: 'modern', team_experience_years: 5,
      requirements_clarity: 'clear', stakeholder_involvement: 'high',
      risk_factors: 3
    });
    this.result = null;
    this.error = null;
  }

  get prob(): number {
    return this.result?.prediction.success_probability ?? 0;
  }

  get riskColor(): string {
    const r = this.result?.prediction.risk_level;
    if (r === 'LOW')    return '#51cf66';
    if (r === 'MEDIUM') return '#ffd43b';
    if (r === 'HIGH')   return '#ff6b6b';
    return '#868e96';
  }

  get confidenceColor(): string {
    const c = this.result?.prediction.confidence_level;
    if (c === 'Very High') return '#51cf66';
    if (c === 'High')      return '#94d82d';
    if (c === 'Medium')    return '#ffd43b';
    return '#ff6b6b';
  }
}
