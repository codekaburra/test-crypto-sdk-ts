import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

/**
 * Shared middleware and error handling. Route registration lives in {@link ./index.ts}.
 */
export function createExpressApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan('combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
}

export function applyErrorHandlers(app: Express): void {
  app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }
    console.error(err.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}
