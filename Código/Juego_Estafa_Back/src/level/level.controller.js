import Level from './level.model.js';

export const getLevels = async (_req, res) => {
  try {
    const levels = await Level.find({ active: true }).sort({ number: 1 });
    return res.status(200).json({ success: true, levels });
  } catch (error) {
    console.error('Error al consultar niveles:', error);
    return res.status(500).json({ success: false, message: 'Error interno al consultar los niveles' });
  }
};

export const getLevelById = async (req, res) => {
  try {
    const level = await Level.findOne({ _id: req.params.id, active: true });
    if (!level) return res.status(404).json({ success: false, message: 'Nivel no encontrado' });
    return res.status(200).json({ success: true, level });
  } catch (error) {
    console.error('Error al consultar nivel:', error);
    return res.status(500).json({ success: false, message: 'Error interno al consultar el nivel' });
  }
};

export const createLevel = async (req, res) => {
  try {
    const level = await Level.create(req.body);
    return res.status(201).json({ success: true, message: 'Nivel creado correctamente', level });
  } catch (error) {
    console.error('Error al crear nivel:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe un nivel con ese número' });
    return res.status(500).json({ success: false, message: 'Error interno al crear el nivel' });
  }
};

export const updateLevel = async (req, res) => {
  try {
    const level = await Level.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!level) return res.status(404).json({ success: false, message: 'Nivel no encontrado' });
    return res.status(200).json({ success: true, message: 'Nivel actualizado correctamente', level });
  } catch (error) {
    console.error('Error al actualizar nivel:', error);
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'Ya existe un nivel con ese número' });
    return res.status(500).json({ success: false, message: 'Error interno al actualizar el nivel' });
  }
};

export const deactivateLevel = async (req, res) => {
  try {
    const level = await Level.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!level) return res.status(404).json({ success: false, message: 'Nivel no encontrado' });
    return res.status(200).json({ success: true, message: 'Nivel desactivado correctamente', level });
  } catch (error) {
    console.error('Error al desactivar nivel:', error);
    return res.status(500).json({ success: false, message: 'Error interno al desactivar el nivel' });
  }
};
