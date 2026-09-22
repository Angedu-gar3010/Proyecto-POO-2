import Scenario from './scenario.model.js';

const toPlayerScenario = (scenarioDocument) => {
  const scenario = scenarioDocument.toObject();
  delete scenario.isFraud;
  delete scenario.explanation;
  delete scenario.recommendation;
  scenario.signals = scenario.signals.map(({ _id, text }) => ({ _id, text }));
  return scenario;
};

export const getScenariosByLevel = async (req, res) => {
  try {
    const scenarios = await Scenario.find({ level: req.params.levelId, active: true })
      .sort({ order: 1 })
      .populate('level', 'number name');
    return res.status(200).json({
      success: true,
      scenarios: scenarios.map(toPlayerScenario)
    });
  } catch (error) {
    console.error('Error al consultar escenarios:', error);
    return res.status(500).json({ success: false, message: 'Error interno al consultar escenarios' });
  }
};

export const getScenarioById = async (req, res) => {
  try {
    const scenario = await Scenario.findOne({ _id: req.params.id, active: true })
      .populate('level', 'number name');
    if (!scenario) return res.status(404).json({ success: false, message: 'Escenario no encontrado' });
    return res.status(200).json({ success: true, scenario: toPlayerScenario(scenario) });
  } catch (error) {
    console.error('Error al consultar escenario:', error);
    return res.status(500).json({ success: false, message: 'Error interno al consultar el escenario' });
  }
};

export const getScenariosForAdmin = async (_req, res) => {
  try {
    const scenarios = await Scenario.find().sort({ level: 1, order: 1 }).populate('level', 'number name');
    return res.status(200).json({ success: true, scenarios });
  } catch (error) {
    console.error('Error al consultar escenarios:', error);
    return res.status(500).json({ success: false, message: 'Error interno al consultar escenarios' });
  }
};

export const createScenario = async (req, res) => {
  try {
    const scenario = await Scenario.create(req.body);
    return res.status(201).json({ success: true, message: 'Escenario creado correctamente', scenario });
  } catch (error) {
    console.error('Error al crear escenario:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe un escenario con ese orden en el nivel' });
    return res.status(500).json({ success: false, message: 'Error interno al crear el escenario' });
  }
};

export const updateScenario = async (req, res) => {
  try {
    const scenario = await Scenario.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!scenario) return res.status(404).json({ success: false, message: 'Escenario no encontrado' });
    return res.status(200).json({ success: true, message: 'Escenario actualizado correctamente', scenario });
  } catch (error) {
    console.error('Error al actualizar escenario:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe un escenario con ese orden en el nivel' });
    return res.status(500).json({ success: false, message: 'Error interno al actualizar el escenario' });
  }
};

export const deactivateScenario = async (req, res) => {
  try {
    const scenario = await Scenario.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!scenario) return res.status(404).json({ success: false, message: 'Escenario no encontrado' });
    return res.status(200).json({ success: true, message: 'Escenario desactivado correctamente', scenario });
  } catch (error) {
    console.error('Error al desactivar escenario:', error);
    return res.status(500).json({ success: false, message: 'Error interno al desactivar el escenario' });
  }
};
