import { getActiveProfile } from '../services/profileService.js';

export async function getProfile(req, res) {
  const profile = await getActiveProfile();
  res.json({ data: profile });
}
