export const environment = {
  production: true,
  apiUrl: 'https://pipeline-test1.onrender.com/api',
  paymentsAdminBaseUrl: 'https://pipeline-test1.onrender.com/api',
  // ML services not deployed yet — pointing to backend as fallback
  mlApiUrl: 'https://pipeline-test1.onrender.com/api/ml',
  mlServices: {
    matching: 'https://pipeline-test1.onrender.com/api/ml/matching',
    prix: 'https://pipeline-test1.onrender.com/api/ml/prix',
    profil: 'https://pipeline-test1.onrender.com/api/ml/profil',
    feasibility: 'https://pipeline-test1.onrender.com/api/ml/feasibility'
  }
};
