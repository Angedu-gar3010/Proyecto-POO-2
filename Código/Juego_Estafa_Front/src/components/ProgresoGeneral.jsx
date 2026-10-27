export default function ProgresoGeneral({
  completados,
  total,
}) {
  return (
    <div className="progreso-general">
      <strong>Progreso general</strong>

      <progress
        value={completados}
        max={Math.max(total, 1)}
        aria-label="Niveles completados"
      />

      <span>
        {completados} de {total} niveles completados
      </span>
    </div>
  );
}