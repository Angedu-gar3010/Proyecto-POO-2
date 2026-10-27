import Nivel from './level.model.js';
import Escenario from '../scenario/scenario.model.js';
import Progreso from '../progreso/progreso.model.js';
import { ROLES } from '../user/user.constants.js';
import { crearError } from '../../utils/error.http.js';
import { resumirProgreso } from '../progreso/progreso.utils.js';

export async function obtenerPuntos(usuario) {
  const progresos = await Progreso.find({ usuario }).lean();

  return progresos.reduce(
    (suma, progreso) => suma + resumirProgreso(progreso).puntos,
    0,
  );
}

export async function buscarNivelPermitido(id, usuario) {
  const nivel = await Nivel.findOne({
    _id: id,
    active: true,
  });

  if (!nivel) throw crearError(404, 'Nivel no encontrado');

  if (
    usuario.role !== ROLES.ADMIN &&
    !nivel.roles.includes(usuario.role)
  ) {
    throw crearError(403, 'Este nivel no corresponde a tu rol');
  }

  return nivel;
}

export async function obtenerNiveles(peticion, respuesta) {
  const administrador = peticion.user.role === ROLES.ADMIN;

  const niveles = await Nivel.find(
    administrador
      ? { active: true }
      : { active: true, roles: peticion.user.role },
  ).sort({ number: 1 }).lean();

  const progresos = await Progreso.find({
    usuario: peticion.user.id,
  }).lean();

  const puntosTotales = progresos.reduce(
    (suma, progreso) => suma + resumirProgreso(progreso).puntos,
    0,
  );

  const cantidades = await Escenario.aggregate([
    {
      $match: {
        active: true,
        level: { $in: niveles.map((nivel) => nivel._id) },
      },
    },
    {
      $group: {
        _id: '$level',
        total: { $sum: 1 },
      },
    },
  ]);

  const resultado = niveles.map((nivel) => {
    const progreso = progresos.find(
      (registro) => String(registro.nivel) === String(nivel._id),
    );

    const resumen = resumirProgreso(progreso);

    const total = progreso
      ? resumen.total
      : cantidades.find(
        (registro) => String(registro._id) === String(nivel._id),
      )?.total || 0;

    const estado = resumen.completado
      ? 'completado'
      : puntosTotales < nivel.requiredScore
        ? 'bloqueado'
        : progreso
          ? 'en_progreso'
          : 'disponible';

    return {
      id: nivel._id,
      numero: nivel.number,
      nombre: nivel.name,
      descripcion: nivel.description,
      roles: nivel.roles || [],
      puntosRequeridos: nivel.requiredScore,
      ...resumen,
      total,
      estado,
    };
  });

  respuesta.json({
    success: true,
    niveles: resultado,
    puntosTotales,
  });
}

export async function obtenerNivelPorId(peticion, respuesta) {
  const nivel = await buscarNivelPermitido(
    peticion.params.id,
    peticion.user,
  );

  respuesta.json({ success: true, level: nivel });
}

export async function crearNivel(peticion, respuesta) {
  const nivel = await Nivel.create(peticion.body);
  respuesta.status(201).json({ success: true, level: nivel });
}

export async function actualizarNivel(peticion, respuesta) {
  const nivel = await Nivel.findByIdAndUpdate(
    peticion.params.id,
    { $set: peticion.body },
    { new: true, runValidators: true },
  );

  if (!nivel) throw crearError(404, 'Nivel no encontrado');

  respuesta.json({ success: true, level: nivel });
}

export async function desactivarNivel(peticion, respuesta) {
  const nivel = await Nivel.findByIdAndUpdate(
    peticion.params.id,
    { active: false },
    { new: true },
  );

  if (!nivel) throw crearError(404, 'Nivel no encontrado');

  respuesta.json({ success: true, level: nivel });
}