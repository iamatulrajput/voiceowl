import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import routes from './routes';

const app: Application = express();

// Enable CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', routes);

// Handle 404 errors
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;

