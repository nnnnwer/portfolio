import { listExperience } from '../services/experienceService.js';

export async function getExperience(req, res) {
  const experience = await listExperience();
  res.json({ data: experience });
}
