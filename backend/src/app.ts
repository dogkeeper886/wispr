import express from 'express';
import routes from './routes';
import { securityHeaders, requestLogger } from './middleware/security';
import { rateLimiter } from './middleware/rate-limiter';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

const app = express();

// Security middleware
app.use(securityHeaders);

// Trust proxy for rate limiting behind nginx
app.set('trust proxy', 1);

// Request parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// Routes
app.use(routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
