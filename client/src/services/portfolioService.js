import { api, unwrap } from './api';

export const getProfile = (signal) => api.get('/profile', { signal }).then(unwrap);

export const getSkills = (signal) => api.get('/skills', { signal }).then(unwrap);

export const getProjects = (signal, { featured = false } = {}) =>
  api.get('/projects', { signal, params: featured ? { featured: true } : undefined }).then(unwrap);

export const getProject = (id, signal) =>
  api.get(`/projects/${encodeURIComponent(id)}`, { signal }).then(unwrap);

export const getEducation = (signal) => api.get('/education', { signal }).then(unwrap);

export const getExperience = (signal) => api.get('/experience', { signal }).then(unwrap);
