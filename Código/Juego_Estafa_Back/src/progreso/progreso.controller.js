import Escenario from '../scenario/scenario.model.js';
import Progreso from './progreso.model.js';

import {
  buscarNivelPermitido,
  obtenerPuntos,
} from '../level/level.controller.js';

import { crearError } from '../../utils/error.http.js';
import {
  calificarRespuesta,
  mostrarAvance,
} from './progreso.utils.js';

async function validarAcceso(peticion) {
  const nivel = await buscarNivelPermitido(
    peticion.params.id,
    peticion.user,
  );

  const puntos = await obtenerPuntos(peticion.user.id);

  if (puntos < nivel.requiredScore) {
    throw crearError(
      403,
      'Todavía no tienes los puntos necesarios para este nivel',
    );
  }

  return nivel;
}

export async function iniciarNivel(peticion, respuesta) {
  const nivel = await validarAcceso(peticion);

  const filtro = {
    usuario: peticion.user.id,
    nivel: nivel._id,
  };

  let progreso = await Progreso.findOne(filtro);

  if (!progreso) {
    const escenarios = await Escenario.find({
      level: nivel._id,
      active: true,
    }).sort({ order: 1 }).lean();

    if (!escenarios.length) {
      throw crearError(409, 'Este nivel todavía no tiene escenarios');
    }

    try {
      progreso = await Progreso.create({
        ...filtro,
        escenarios,
      });
    } catch (error) {
      if (error.code !== 11000) throw error;

      // Otra solicitud pudo iniciar el mismo nivel simultáneamente.
      progreso = await Progreso.findOne(filtro);
    }
  }

  respuesta.json({
    success: true,
    avance: mostrarAvance(progreso),
  });
}

function construirResultado(escenario, registro) {
  return {
    correcta: registro.correcta,
    puntos: registro.puntos,
    explicacion: escenario.explanation,
    recomendacion: escenario.recommendation,
    esFraude: escenario.isFraud,
    senalesCorrectas: escenario.signals
      .filter((senal) => senal.isCorrect)
      .map((senal) => senal.text),
  };
}

export async function responderEscenario(peticion, respuesta) {
  await validarAcceso(peticion);

  const progreso = await Progreso.findOne({
    usuario: peticion.user.id,
    nivel: peticion.params.id,
  });

  if (!progreso) {
    throw crearError(409, 'Primero debes iniciar el nivel');
  }

  const { escenarioId, esFraude, senales } = peticion.body;

  const escenario = progreso.escenarios.find(
    (registro) => String(registro._id) === escenarioId,
  );

  if (!escenario) {
    throw crearError(400, 'El escenario no pertenece a este nivel');
  }

  const anterior = progreso.respuestas.find(
    (registro) => String(registro.escenario) === escenarioId,
  );

  if (anterior) {
    return respuesta.json({
      success: true,
      resultado: construirResultado(escenario, anterior),
    });
  }

  const siguiente = progreso.escenarios[progreso.respuestas.length];

  if (String(siguiente?._id) !== escenarioId) {
    throw crearError(409, 'Debes responder los escenarios en orden');
  }

  const permitidas = new Set(
    escenario.signals.map((senal) => String(senal._id)),
  );

  if (senales.some((id) => !permitidas.has(id))) {
    throw crearError(
      400,
      'Hay señales que no pertenecen al escenario',
    );
  }

  const registro = {
    escenario: escenarioId,
    esFraude,
    senales,
    ...calificarRespuesta(escenario, esFraude, senales),
  };

  const actualizado = await Progreso.findOneAndUpdate(
    {
      _id: progreso._id,
      __v: progreso.__v,
      'respuestas.escenario': { $ne: escenarioId },
    },
    {
      $push: { respuestas: registro },
      $inc: { __v: 1 },
    },
    { new: true, runValidators: true },
  );

  if (!actualizado) {
    const vigente = await Progreso.findById(progreso._id);

    const guardada = vigente?.respuestas.find(
      (registro) => String(registro.escenario) === escenarioId,
    );

    if (guardada) {
      return respuesta.json({
        success: true,
        resultado: construirResultado(escenario, guardada),
      });
    }

    throw crearError(
      409,
      'Tu progreso cambió. Vuelve a cargar el nivel.',
    );
  }

  return respuesta.json({
    success: true,
    resultado: construirResultado(escenario, registro),
  });
}