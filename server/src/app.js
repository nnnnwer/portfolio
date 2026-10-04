import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { corsOptions } from './config/cors.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import apiRoutes from './routes/index.js';

const app = express();

app.disable('x-powered-by');
// Render (and most hosts) put one proxy in front of the app. Trusting exactly
// that many hops lets rate limiting use the real client IP safely.
app.set('trust proxy', env.trustProxy);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '16kb' }));

app.get('/', (req, res) => {
  res.json({
    data: {
      name: 'Owen Thilakoun portfolio API',
      health: '/api/health',
    },
  });
});

app.use('/api', apiLimiter, apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
