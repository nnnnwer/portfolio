import { getProject, listProjects } from '../services/projectsService.js';

export async function getProjects(req, res) {
  const featuredOnly = req.query.featured === 'true';
  const projects = await listProjects({ featuredOnly });
  res.json({ data: projects });
}

export async function getProjectById(req, res) {
  const project = await getProject(req.params.id);
  res.json({ data: project });
}
