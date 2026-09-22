import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/user/user.routes.js';
import levelRoutes from '../src/level/level.routes.js';
import scenarioRoutes from '../src/scenario/scenario.routes.js';
import { limiter } from '../middlewares/rate.limit.js';

const configureMiddlewares = (app) => {
  app.use(helmet());
  app.use(cors());

  app.use(express.json({
    limit: '1mb'
  }));

  app.use(express.urlencoded({
    extended: true,
    limit: '1mb'
  }));

  app.use(limiter);

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }
};

const configureRoutes = (app) => {
  app.get('/api/v1/health', (_req, res) => {
    return res.status(200).json({
      success: true,
      message: 'Servidor funcionando'
    });
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/levels', levelRoutes);
  app.use('/api/v1/scenarios', scenarioRoutes);

  app.use((req, res) => {
    return res.status(404).json({
      success: false,
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
  });
};

export const createApp = () => {
  const app = express();

  configureMiddlewares(app);
  configureRoutes(app);

  return app;
};

export const initServer = async () => {
  const app = createApp();
  const port = Number(process.env.PORT) || 3000;

  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Servidor ejecutándose en el puerto ${port}`);
      resolve(server);
    });

    server.on('error', reject);
  });
};
