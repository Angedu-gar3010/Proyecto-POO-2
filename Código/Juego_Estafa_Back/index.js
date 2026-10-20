import 'dotenv/config';

import { conectarBaseDeDatos } from './configs/mongo.js';
import { iniciarServidor } from './configs/app.js';

const iniciarAplicacion = async () => {
  try {
    await conectarBaseDeDatos();
    await iniciarServidor();
  } catch (error) {
    console.error(
      'No se pudo iniciar la aplicación:',
      error.message
    );

    process.exit(1);
  }
};

iniciarAplicacion();