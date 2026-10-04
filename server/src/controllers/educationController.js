import { listEducation } from '../services/educationService.js';

export async function getEducation(req, res) {
  const education = await listEducation();
  res.json({ data: education });
}
