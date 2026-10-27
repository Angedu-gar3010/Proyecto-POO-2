import Escenario from './scenario.model.js';
import { crearError } from '../../utils/error.http.js';

export async function obtenerEscenariosParaAdministrador(
  _peticion,
  respuesta,
) {
  const escenarios = await Escenario.find()
    .populate('level', 'number name roles')
    .sort({ level: 1, order: 1 });

  respuesta.json({
    success: true,
    scenarios: escenarios,
  });
}

export async function obtenerEscenarioPorId(peticion, respuesta) {
  const escenario = await Escenario.findById(peticion.params.id);

  if (!escenario) throw crearError(404, 'Escenario no encontrado');

  respuesta.json({
    success: true,
    scenario: escenario,
  });
}

export async function crearEscenario(peticion, respuesta) {
  const escenario = await Escenario.create(peticion.body);

  respuesta.status(201).json({
    success: true,
    scenario: escenario,
  });
}

export async function actualizarEscenario(peticion, respuesta) {
  const escenario = await Escenario.findByIdAndUpdate(
    peticion.params.id,
    { $set: peticion.body },
    { new: true, runValidators: true },
  );

  if (!escenario) throw crearError(404, 'Escenario no encontrado');

  respuesta.json({
    success: true,
    scenario: escenario,
  });
}

export async function desactivarEscenario(peticion, respuesta) {
  const escenario = await Escenario.findByIdAndUpdate(
    peticion.params.id,
    { active: false },
    { new: true },
  );

  if (!escenario) throw crearError(404, 'Escenario no encontrado');

  respuesta.json({
    success: true,
    scenario: escenario,
  });
}