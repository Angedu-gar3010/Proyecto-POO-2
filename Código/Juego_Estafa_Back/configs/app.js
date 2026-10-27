import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import rutasAutenticacion from '../src/auth/auth.routes.js';
import rutasUsuario from '../src/user/user.routes.js';
import rutasNivel from '../src/level/level.routes.js';
import rutasEscenario from '../src/scenario/scenario.routes.js';
import { limitadorSolicitudes } from '../middlewares/rate.limit.js';

export function crearAplicacion() {
  const aplicacion = express();

  aplicacion.use(helmet());
  aplicacion.use(cors());
  aplicacion.use(express.json({ limit: '1mb' }));
  aplicacion.use(limitadorSolicitudes);

  if (process.env.NODE_ENV !== 'production') {
    aplicacion.use(morgan('dev'));
  }

  aplicacion.get('/api/v1/health', (_peticion, respuesta) => {
    respuesta.json({
      success: true,
      message: 'Servidor funcionando',
    });
  });

  aplicacion.use('/api/v1/auth', rutasAutenticacion);
  aplicacion.use('/api/v1/users', rutasUsuario);
  aplicacion.use('/api/v1/levels', rutasNivel);
  aplicacion.use('/api/v1/scenarios', rutasEscenario);

  aplicacion.use((_peticion, respuesta) => {
    respuesta.status(404).json({
      success: false,
      message: 'Ruta no encontrada',
    });
  });

  aplicacion.use((error, _peticion, respuesta, siguiente) => {
    if (respuesta.headersSent) return siguiente(error);

    let estado = error.estado || 500;
    let mensaje = error.message;

    if (error.code === 11000) {
      estado = 409;
      mensaje = 'Ya existe un registro con esos datos únicos.';
    } else if (
      error.name === 'ValidationError' ||
      error.name === 'CastError'
    ) {
      estado = 400;
      mensaje = 'Los datos enviados no cumplen las validaciones del modelo.';
    } else if (error.type === 'entity.parse.failed') {
      estado = 400;
      mensaje = 'El cuerpo de la solicitud debe ser JSON válido.';
    } else if (error.type === 'entity.too.large') {
      estado = 413;
      mensaje = 'La solicitud supera el tamaño permitido.';
    }

    if (estado >= 500) {
      console.error(error);
      mensaje = 'Ocurrió un error interno. Inténtalo nuevamente.';
    }

    return respuesta.status(estado).json({
      success: false,
      message: mensaje,
    });
  });

  return aplicacion;
}

export function iniciarServidor() {
  if (!process.env.SECRET_KEY) {
    throw new Error('Falta configurar SECRET_KEY');
  }

  const aplicacion = crearAplicacion();
  const puerto = Number(process.env.PORT) || 3000;

  return new Promise((resolver, rechazar) => {
    const servidor = aplicacion.listen(puerto, () => {
      console.log(`Servidor ejecutándose en el puerto ${puerto}`);
      resolver(servidor);
    });

    servidor.on('error', rechazar);
  });
}