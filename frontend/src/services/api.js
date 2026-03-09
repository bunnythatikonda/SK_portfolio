// API Service for Portfolio Backend
const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Helper for API calls
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// Content APIs
export async function getAllContent() {
  return fetchAPI('/api/content/all');
}

export async function getAbout() {
  return fetchAPI('/api/content/about');
}

export async function getEducation() {
  return fetchAPI('/api/content/education');
}

export async function getExperience() {
  return fetchAPI('/api/content/experience');
}

export async function getProjects() {
  return fetchAPI('/api/content/projects');
}

export async function getSkills() {
  return fetchAPI('/api/content/skills');
}

// Visitor tracking
export async function trackVisitor() {
  return fetchAPI('/api/visitors/track', { method: 'POST' });
}

export async function getVisitorStats() {
  return fetchAPI('/api/visitors/stats');
}

// Admin APIs
export async function adminLogin(email, password) {
  return fetchAPI('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function verifyAdmin(token) {
  return fetchAPI('/api/admin/verify', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Content CRUD Operations
export async function updateAbout(token, data) {
  return fetchAPI('/api/content/about', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function saveEducation(token, data) {
  return fetchAPI('/api/content/education', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function deleteEducation(token, id) {
  return fetchAPI(`/api/content/education/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function saveExperience(token, data) {
  return fetchAPI('/api/content/experience', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function deleteExperience(token, id) {
  return fetchAPI(`/api/content/experience/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function saveProject(token, data) {
  return fetchAPI('/api/content/projects', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function deleteProject(token, id) {
  return fetchAPI(`/api/content/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function saveSkill(token, data) {
  return fetchAPI('/api/content/skills', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function deleteSkill(token, id) {
  return fetchAPI(`/api/content/skills/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Certifications APIs
export async function getCertifications() {
  return fetchAPI('/api/content/certifications');
}

export async function saveCertification(token, data) {
  return fetchAPI('/api/content/certifications', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function deleteCertification(token, id) {
  return fetchAPI(`/api/content/certifications/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
