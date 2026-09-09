const API_BASE = '/api';

// Helper to handle responses consistently
async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

function post(url: string, data: any) {
  return fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

export const api = {
  // Schemes
  getSchemes: () => fetch(`${API_BASE}/schemes`).then(handleResponse),

  // Recommendations
  getRecommendations: (profile: any) => post('/recommendation', profile),

  // Calculator
  calculateEMI: (data: any) => post('/calculator/emi', data),
  analyzeHealth: (data: any) => post('/calculator/health', data),
  whatIfSimulate: (data: any) => post('/calculator/whatif', data),

  // Partners
  getPartners: (data: any) => post('/partners/recommend', data),
  getAllPartners: () => fetch(`${API_BASE}/partners`).then(handleResponse),

  // AI
  extractIntent: (data: any) => post('/ai/extract-intent', data),
  explainScheme: (data: any) => post('/ai/explain', data),

  // Documents
  checkDocuments: (data: any) => post('/documents/readiness', data),
  analyzeDocument: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return fetch(`${API_BASE}/documents/analyze`, {
      method: 'POST',
      body: fd,
    }).then(handleResponse);
  },

  // Project Report
  generateReport: (data: any) => post('/project-report/generate', data),
  downloadReportPDF: (data: any) =>
    fetch(`${API_BASE}/project-report/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.blob()),

  // Admin
  getAnalytics: () => fetch(`${API_BASE}/admin/analytics`).then(handleResponse),
};
