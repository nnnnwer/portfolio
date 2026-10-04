import { listSkills } from '../services/skillsService.js';

export async function getSkills(req, res) {
  const skills = await listSkills();
  res.json({ data: skills });
}
