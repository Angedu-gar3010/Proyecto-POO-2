import 'dotenv/config';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import Usuario from '../src/user/user.model.js';
import { ROLES } from '../src/user/user.constants.js';
import { protegerContrasena } from '../utils/encrypt.js';

import {
  validarNombre,
  validarUsuario,
  validarContrasena,
} from '../middlewares/validators/auth.validators.js';

async function crearAdministradorInicial() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Falta MONGODB_URI');
  }

  const peticion = {
    body: {
      name: process.env.ADMIN_NOMBRE,
      username: process.env.ADMIN_USUARIO,
      password: process.env.ADMIN_CONTRASENA,
    },
  };

  for (const regla of [
    validarNombre(),
    validarUsuario(),
    validarContrasena('password'),
  ]) {
    await regla.run(peticion);
  }

  if (!validationResult(peticion).isEmpty()) {
    throw new Error(
      'Configura ADMIN_NOMBRE, ADMIN_USUARIO y ADMIN_CONTRASENA con datos válidos.',
    );
  }

  await mongoose.connect(process.env.MONGODB_URI);
  await Usuario.init();

  const existente = await Usuario.findOne({
    username: peticion.body.username,
  });

  if (existente) {
    if (existente.role !== ROLES.ADMIN) {
      throw new Error(
        'Ese usuario ya pertenece a un jugador. Elige otro nombre de usuario.',
      );
    }

    console.log('La cuenta administrativa ya existe. No se modificó.');
    return;
  }

  await Usuario.create({
    name: peticion.body.name,
    username: peticion.body.username,
    password: await protegerContrasena(peticion.body.password),
    role: ROLES.ADMIN,
  });

  console.log('Cuenta administrativa creada.');
}

crearAdministradorInicial()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());