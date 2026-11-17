import Usuario from '../user/user.model.js';
import Nivel from '../level/level.model.js';
import Escenario from '../scenario/scenario.model.js';
import Progreso from '../progreso/progreso.model.js';
import { ROLES_JUGADOR } from '../user/user.constants.js';
import { resumirProgreso } from '../progreso/progreso.utils.js';
import { crearError } from '../../utils/error.http.js';

export async function obtenerResumenAdministrativo(
  _peticion,
  respuesta,
) {
  const [jugadores, niveles, escenarios, completados] = await Promise.all([
    Usuario.countDocuments({
      role: { $in: ROLES_JUGADOR },
    }),
    Nivel.countDocuments(),
    Escenario.countDocuments(),
    Progreso.countDocuments({
      $expr: {
        $and: [
          { $gt: [{ $size: '$escenarios' }, 0] },
          {
            $eq: [
              { $size: '$respuestas' },
              { $size: '$escenarios' },
            ],
          },
        ],
      },
    }),
  ]);

  respuesta.json({
    success: true,
    resumen: { jugadores, niveles, escenarios, completados },
  });
}

export async function listarNivelesAdministrativos(
  _peticion,
  respuesta,
) {
  const niveles = await Nivel.find()
    .sort({ number: 1 })
    .lean();

  respuesta.json({ success: true, niveles });
}

export async function listarEscenariosAdministrativos(
  peticion,
  respuesta,
) {
  const nivel = await Nivel.findById(peticion.params.id).lean();

  if (!nivel) throw crearError(404, 'Nivel no encontrado');

  const escenarios = await Escenario.find({
    level: nivel._id,
  }).sort({ order: 1 }).lean();

  respuesta.json({
    success: true,
    nivel,
    escenarios,
  });
}

export async function listarUsuarios(peticion, respuesta) {
  const pagina = Number(peticion.query.pagina || 1);
  const buscar = (peticion.query.buscar || '').trim();
  const rol = peticion.query.rol || '';
  const filtro = {};

  if (rol) filtro.role = rol;

  if (buscar) {
    const literal = buscar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    filtro.$or = ['name', 'username'].map((campo) => ({
      [campo]: {
        $regex: literal,
        $options: 'i',
      },
    }));
  }

  const limite = 20;

  const [usuarios, total] = await Promise.all([
    Usuario.find(filtro)
      .select('name username role status createdAt')
      .sort({ createdAt: -1, _id: -1 })
      .skip((pagina - 1) * limite)
      .limit(limite)
      .lean(),

    Usuario.countDocuments(filtro),
  ]);

  respuesta.json({
    success: true,
    usuarios,
    total,
    pagina,
    paginas: Math.max(1, Math.ceil(total / limite)),
  });
}

export async function cambiarEstadoUsuario(peticion, respuesta) {
  const usuario = await Usuario.findOneAndUpdate(
    {
      _id: peticion.params.id,
      role: { $in: ROLES_JUGADOR },
    },
    {
      $set: { status: peticion.body.activo },
      $inc: { tokenVersion: 1 },
    },
    { new: true, runValidators: true },
  ).select('name username role status');

  if (!usuario) {
    throw crearError(
      404,
      'Jugador no encontrado. Las cuentas administrativas no se modifican aquí.',
    );
  }

  respuesta.json({ success: true, usuario });
}

export async function consultarProgresoUsuario(peticion, respuesta) {
  const usuario = await Usuario.findById(peticion.params.id)
    .select('name username role')
    .lean();

  if (!usuario) throw crearError(404, 'Usuario no encontrado');

  const registros = await Progreso.find({
    usuario: usuario._id,
  })
    .select('nivel escenarios._id respuestas updatedAt')
    .populate('nivel', 'number name active')
    .sort({ updatedAt: -1 })
    .lean();

  const progresos = registros.map((registro) => ({
    id: registro._id,
    nivel: registro.nivel,
    ...resumirProgreso(registro),
    actualizado: registro.updatedAt,
  }));

  respuesta.json({
    success: true,
    usuario,
    progresos,
  });
}