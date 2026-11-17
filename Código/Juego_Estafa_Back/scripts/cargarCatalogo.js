import 'dotenv/config';
import mongoose from 'mongoose';

import Nivel from '../src/level/level.model.js';
import Escenario from '../src/scenario/scenario.model.js';
import Progreso from '../src/progreso/progreso.model.js';

import {
  catalogoNiveles,
  construirEscenarios,
} from '../data/catalogoNiveles.js';

async function cargarCatalogo() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Falta configurar MONGODB_URI');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  await Promise.all([
    Nivel.init(),
    Escenario.init(),
    Progreso.init(),
  ]);

  let siguienteNumero =
    (await Nivel.findOne().sort({ number: -1 }))?.number || 0;

  for (const [rol, entradas] of Object.entries(catalogoNiveles)) {
    if (entradas.length !== 15) {
      throw new Error(`El catálogo de ${rol} debe tener 15 niveles`);
    }

    for (const [indice, entrada] of entradas.entries()) {
      const codigoSemilla =
        `${rol.toLowerCase()}-${String(indice + 1).padStart(2, '0')}`;

      let nivel = await Nivel.findOne({ codigoSemilla });

      if (!nivel && indice === 0) {
        const antiguos = await Nivel.find({
          name: entrada[0],
          roles: rol,
          codigoSemilla: { $exists: false },
        });

        if (antiguos.length > 1) {
          throw new Error(
            `Hay niveles iniciales duplicados para ${rol}`,
          );
        }

        if (antiguos.length === 1) {
          nivel = antiguos[0];
          nivel.codigoSemilla = codigoSemilla;
          await nivel.save();
        }
      }

      if (!nivel) {
        nivel = await Nivel.create({
          codigoSemilla,
          number: ++siguienteNumero,
          name: entrada[0],
          description: `Aprende a reconocer riesgos y verificar solicitudes: ${entrada[0].toLowerCase()}.`,
          requiredScore: 0,
          roles: [rol],
          active: true,
        });
      }

      const escenarios = construirEscenarios(entrada, indice);

      for (const escenario of escenarios) {
        // Conserva escenarios existentes y cambios del administrador.
        await Escenario.updateOne(
          {
            level: nivel._id,
            order: escenario.order,
          },
          {
            $setOnInsert: {
              ...escenario,
              level: nivel._id,
            },
          },
          {
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          },
        );
      }
    }
  }

  console.log(
    'Catálogo preparado: 15 niveles por rol. Se conservan contenido existente y progreso.',
  );
}

cargarCatalogo()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());