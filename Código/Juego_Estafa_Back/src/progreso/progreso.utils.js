export function resumirProgreso(progreso) {
  const respuestas = progreso?.respuestas || [];
  const total = progreso?.escenarios.length || 0;

  const correctas = respuestas.filter(
    (respuesta) => respuesta.correcta,
  ).length;

  const completado = total > 0 && respuestas.length === total;
  const proporcion = total ? correctas / total : 0;

  return {
    respondidas: respuestas.length,
    total,
    correctas,
    completado,

    puntos: respuestas.reduce(
      (suma, respuesta) => suma + respuesta.puntos,
      0,
    ),

    estrellas: !completado
      ? 0
      : proporcion === 1
        ? 3
        : proporcion >= 0.66
          ? 2
          : proporcion > 0
            ? 1
            : 0,
  };
}

export function calificarRespuesta(
  escenario,
  esFraude,
  seleccionadas,
) {
  const esperadas = escenario.signals
    .filter((senal) => senal.isCorrect)
    .map((senal) => String(senal._id));

  const unica = new Set(seleccionadas);

  const correcta =
    esFraude === escenario.isFraud &&
    unica.size === esperadas.length &&
    esperadas.every((id) => unica.has(id));

  return {
    correcta,
    puntos: correcta ? escenario.points : 0,
  };
}

export function mostrarEscenario(escenario) {
  if (!escenario) return null;

  return {
    id: String(escenario._id),
    titulo: escenario.title,
    tipo: escenario.type,
    contenido: escenario.content,
    senales: escenario.signals.map((senal) => ({
      id: String(senal._id),
      texto: senal.text,
    })),
  };
}

export function mostrarAvance(progreso) {
  return {
    ...resumirProgreso(progreso),
    escenario: mostrarEscenario(
      progreso.escenarios[progreso.respuestas.length],
    ),
  };
}