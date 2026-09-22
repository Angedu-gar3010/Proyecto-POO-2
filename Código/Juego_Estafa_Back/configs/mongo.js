import mongoose from 'mongoose';


mongoose.connection.on('connecting', () => {
  console.log('MongoDB | Intentando conectar');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB | Conectado');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB | Reconectado');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB | Desconectado');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB | Error:', error.message);
});

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('La variable MONGODB_URI no está configurada');
  }

  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000
    });

    console.log('MongoDB | Base de datos lista');
  } catch (error) {
    console.error('MongoDB | Nombre:', error.name);
    console.error('MongoDB | Mensaje:', error.message);
    console.error('MongoDB | Causa:', error.cause);

    console.dir(error.reason, {
        depth: null,
        colors: true
    });

    throw error;
}
};