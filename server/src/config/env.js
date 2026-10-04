import dotenv from 'dotenv';

dotenv.config();

const REQUIRED = ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SECRET_KEY'];

const missing = REQUIRED.filter((key) => !process.env[key]?.trim());
if (missing.length > 0) {
  console.error(
    `[config] Missing required environment variables: ${missing.join(', ')}.\n` +
      '         Copy server/.env.example to server/.env and fill in your Supabase values.',
  );
  process.exit(1);
}

const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY.trim();
const secretKey = process.env.SUPABASE_SECRET_KEY.trim();

if (publishableKey.startsWith('sb_secret_')) {
  console.error(
    '[config] SUPABASE_PUBLISHABLE_KEY contains a secret key (sb_secret_...). ' +
      'Use the publishable key (sb_publishable_...) so Row Level Security applies to public reads.',
  );
  process.exit(1);
}

if (publishableKey === secretKey) {
  console.error('[config] SUPABASE_PUBLISHABLE_KEY and SUPABASE_SECRET_KEY must be different keys.');
  process.exit(1);
}

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, '');

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: toPositiveInt(process.env.PORT, 5000),
  supabaseUrl: process.env.SUPABASE_URL.trim(),
  supabasePublishableKey: publishableKey,
  supabaseSecretKey: secretKey,
  clientOrigins: (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean),
  trustProxy: toPositiveInt(process.env.TRUST_PROXY, 1),
  contactRateLimitMax: toPositiveInt(process.env.CONTACT_RATE_LIMIT_MAX, 5),
  contactRateLimitWindowMs:
    toPositiveInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MINUTES, 15) * 60 * 1000,
});
