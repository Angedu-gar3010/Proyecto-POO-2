import { useState } from 'react';
import CampoAdministracion from './CampoAdministracion.jsx';
import { guardarEscenario } from '../../services/administracion.js';

const tipos = [
  'EMAIL',
  'MENSAJE',
  'RED_SOCIAL',
  'SITIO_WEB',
  'ENLACE',
  'ARCHIVO',
];

const camposContenido = [
  ['sender', 'Remitente', 120],
  ['recipient', 'Destinatario', 120],
  ['subject', 'Asunto', 180],
  ['url', 'Enlace de ejemplo', 500],
  ['fileName', 'Nombre del archivo', 180],
  ['imageUrl', 'Dirección de imagen', 1000],
];

export default function FormularioEscenario({
  nivel,
  escenario,
  alGuardar,
  alCancelar,
}) {
  const [senales, establecerSenales] = useState(() => (
    escenario?.signals || [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
    ]
  ).map((senal) => ({
    ...senal,
    clave: crypto.randomUUID(),
  })));

  const [enviando, establecerEnviando] = useState(false);
  const [error, establecerError] = useState('');

  function modificarSenal(clave, cambios) {
    establecerSenales((actuales) => actuales.map((senal) => (
      senal.clave === clave
        ? { ...senal, ...cambios }
        : senal
    )));
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();

    if (enviando) return;

    const campos = new FormData(evento.currentTarget);

    const contenido = {
      message: campos.get('mensaje').trim(),
    };

    for (const [nombre] of camposContenido) {
      contenido[nombre] = campos.get(nombre).trim();
    }

    establecerEnviando(true);
    establecerError('');

    try {
      await guardarEscenario({
        title: campos.get('titulo').trim(),
        description: campos.get('descripcion').trim(),
        type: campos.get('tipo'),
        level: nivel._id,
        order: Number(campos.get('orden')),
        content: contenido,
        isFraud: campos.get('clasificacion') === 'fraude',

        signals: senales.map((senal) => ({
          ...(senal._id ? { _id: senal._id } : {}),
          text: senal.text.trim(),
          isCorrect: senal.isCorrect,
        })),

        explanation: campos.get('explicacion').trim(),
        recommendation: campos.get('recomendacion').trim(),
        points: Number(campos.get('puntos')),
        active: campos.has('activo'),
      }, escenario?._id);

      alGuardar();
    } catch (fallo) {
      establecerError(fallo.message);
    } finally {
      establecerEnviando(false);
    }
  }

  return (
    <form className="formulario-admin" onSubmit={enviarFormulario}>
      <h2>
        {escenario?._id ? 'Editar escenario' : 'Crear escenario'}
      </h2>

      <p>Nivel: <strong>{nivel.name}</strong></p>

      <p className="detalle-nivel">
        Los cambios se aplican a quienes inicien después. Los progresos
        ya iniciados conservan sus preguntas.
      </p>

      <fieldset disabled={enviando}>
        <CampoAdministracion
          etiqueta="Título"
          name="titulo"
          minLength={2}
          maxLength={120}
          defaultValue={escenario?.title || ''}
          required
        />

        <CampoAdministracion
          etiqueta="Descripción"
          name="descripcion"
          multilinea
          minLength={10}
          maxLength={500}
          defaultValue={escenario?.description || ''}
          required
        />

        <div className="columnas-admin">
          <label className="campo-admin">
            Tipo
            <select
              name="tipo"
              defaultValue={escenario?.type || 'MENSAJE'}
            >
              {tipos.map((tipo) => (
                <option key={tipo}>{tipo}</option>
              ))}
            </select>
          </label>

          <CampoAdministracion
            etiqueta="Orden dentro del nivel (único)"
            type="number"
            name="orden"
            min="1"
            step="1"
            defaultValue={escenario?.order ?? ''}
            required
          />

          <CampoAdministracion
            etiqueta="Puntos por respuesta correcta"
            type="number"
            name="puntos"
            min="0"
            step="1"
            defaultValue={escenario?.points ?? 10}
            required
          />

          <label className="campo-admin">
            Clasificación correcta
            <select
              name="clasificacion"
              defaultValue={
                escenario?.isFraud === false ? 'seguro' : 'fraude'
              }
            >
              <option value="fraude">Fraudulento</option>
              <option value="seguro">Seguro</option>
            </select>
          </label>
        </div>

        <CampoAdministracion
          etiqueta="Mensaje que analizará el jugador"
          name="mensaje"
          multilinea
          maxLength={5000}
          defaultValue={escenario?.content?.message || ''}
          required
        />

        <details>
          <summary>Campos opcionales del contenido</summary>

          <div className="columnas-admin">
            {camposContenido.map(([nombre, etiqueta, limite]) => (
              <CampoAdministracion
                key={nombre}
                etiqueta={etiqueta}
                name={nombre}
                maxLength={limite}
                defaultValue={escenario?.content?.[nombre] || ''}
              />
            ))}
          </div>
        </details>

        <fieldset className="senales-admin">
          <legend>Opciones de señales de alerta</legend>

          {senales.map((senal) => (
            <div key={senal.clave} className="fila-senal">
              <CampoAdministracion
                etiqueta="Texto de la opción"
                value={senal.text}
                maxLength={250}
                required
                onChange={(evento) => modificarSenal(
                  senal.clave,
                  { text: evento.target.value },
                )}
              />

              <label className="casilla-admin">
                <input
                  type="checkbox"
                  checked={senal.isCorrect}
                  onChange={(evento) => modificarSenal(
                    senal.clave,
                    { isCorrect: evento.target.checked },
                  )}
                />
                Es correcta
              </label>

              <button
                type="button"
                className="enlace-juego"
                disabled={senales.length <= 1}
                onClick={() => establecerSenales((actuales) => (
                  actuales.filter(
                    (actual) => actual.clave !== senal.clave,
                  )
                ))}
              >
                Quitar
              </button>
            </div>
          ))}

          <button
            type="button"
            className="boton-juego boton-juego--secundario"
            disabled={senales.length >= 50}
            onClick={() => establecerSenales((actuales) => [
              ...actuales,
              {
                clave: crypto.randomUUID(),
                text: '',
                isCorrect: false,
              },
            ])}
          >
            Agregar señal
          </button>
        </fieldset>

        <CampoAdministracion
          etiqueta="Explicación de la respuesta"
          name="explicacion"
          multilinea
          minLength={10}
          maxLength={2000}
          defaultValue={escenario?.explanation || ''}
          required
        />

        <CampoAdministracion
          etiqueta="Recomendación"
          name="recomendacion"
          multilinea
          minLength={10}
          maxLength={2000}
          defaultValue={escenario?.recommendation || ''}
          required
        />

        <label className="casilla-admin">
          <input
            type="checkbox"
            name="activo"
            defaultChecked={escenario?.active ?? true}
          />
          Escenario activo
        </label>

        <div className="acciones-admin">
          <button className="boton-juego">
            {enviando ? 'Guardando…' : 'Guardar escenario'}
          </button>

          <button
            type="button"
            className="enlace-juego"
            onClick={alCancelar}
          >
            Cancelar
          </button>
        </div>
      </fieldset>

      {error && (
        <p className="error-juego" role="alert">{error}</p>
      )}
    </form>
  );
}