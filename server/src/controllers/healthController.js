import { checkDatabase } from '../services/healthService.js';

export function getHealth(req, res) {
  res.json({
    data: {
      status: 'ok',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
}

export async function getDatabaseHealth(req, res) {
  const db = await checkDatabase();
  res.status(db.ok ? 200 : 503).json({
    data: { status: db.ok ? 'ok' : 'unavailable', latencyMs: db.latencyMs },
  });
}
