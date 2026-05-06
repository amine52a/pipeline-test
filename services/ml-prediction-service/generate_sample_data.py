"""
Generate sample project feasibility dataset for testing
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

# Number of samples
n_samples = 1000

print("🔄 Generating sample dataset...")

# Generate features — use np.random.* (not np.* directly)
data = {
    'project_id': [f'PRJ{str(i).zfill(4)}' for i in range(1, n_samples + 1)],
    'budget':                 np.random.randint(10000, 200000, n_samples),
    'team_size':              np.random.randint(2, 20, n_samples),
    'duration_months':        np.random.randint(1, 24, n_samples),
    'complexity':             np.random.choice(['low', 'medium', 'high'], n_samples),
    'client_experience':      np.random.choice(['low', 'medium', 'high'], n_samples),
    'technology_stack':       np.random.choice(['modern', 'legacy', 'mixed'], n_samples),
    'team_experience_years':  np.random.randint(1, 15, n_samples),
    'requirements_clarity':   np.random.choice(['clear', 'moderate', 'unclear'], n_samples),
    'stakeholder_involvement': np.random.choice(['high', 'medium', 'low'], n_samples),
    'risk_factors':           np.random.randint(0, 10, n_samples),
    'created_at': [
        (datetime.now() - timedelta(days=int(np.random.randint(1, 365)))).strftime('%Y-%m-%d')
        for _ in range(n_samples)
    ]
}

# Create DataFrame
df = pd.DataFrame(data)

# Generate target variable
success_prob = (
    (df['budget'] / 200000) * 0.3 +
    (df['team_size'] / 20) * 0.2 +
    (df['team_experience_years'] / 15) * 0.2 +
    (df['complexity'] == 'low').astype(int) * 0.15 +
    (df['requirements_clarity'] == 'clear').astype(int) * 0.15
)

success_prob += np.random.normal(0, 0.1, n_samples)
success_prob = np.clip(success_prob, 0, 1)
df['project_success'] = (success_prob > 0.5).astype(int)

df.to_csv('project_feasibility_dataset.csv', index=False)

print(f"✅ Generated {n_samples} samples")
print(f"   Success rate: {df['project_success'].mean()*100:.1f}%")
print(f"   Saved to: project_feasibility_dataset.csv")
print("\n✅ Dataset ready for training!")
