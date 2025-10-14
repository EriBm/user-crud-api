import express, { Application, Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger/swagger.config';

export const createApp = (routes: Router): Application => {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS simple
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

  // Log de rutas para debug
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Users API Documentation',
  }));

  // Swagger JSON
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use('/api', routes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  return app;
};