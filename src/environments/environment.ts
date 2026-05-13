export const environment = {
  production: false,
  apiUrl: 'http://localhost:8091/api',
  paymentsAdminBaseUrl: 'http://localhost:8091/api',
  mlApiUrl: 'http://localhost:8091/api/ml',
  mlServices: {
    matching: 'http://localhost:8091/api/ml/matching',
    prix: 'http://localhost:8091/api/ml/prix',
    profil: 'http://localhost:8091/api/ml/profil',
    feasibility: 'http://localhost:8091/api/ml/feasibility'
  }
};