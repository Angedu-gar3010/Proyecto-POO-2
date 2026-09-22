import 'dotenv/config';

import { connectDB } from './configs/mongo.js';
import { initServer } from './configs/app.js';

const startApp = async () => {
  try {
    await connectDB();
    await initServer();
  } catch (error) {
    console.error(
      'No se pudo iniciar la aplicación:',
      error.message
    );

    process.exit(1);
  }
};

startApp();