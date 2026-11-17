import { useState } from 'react';

import ConsultaAdministrativa from '../components/admin/ConsultaAdministrativa.jsx';
import PaginaAdminNiveles from './admin/PaginaAdminNiveles.jsx';
import PaginaAdminEscenarios from './admin/PaginaAdminEscenarios.jsx';
import PaginaAdminUsuarios from './admin/PaginaAdminUsuarios.jsx';

const etiquetasResumen = {
  jugadores: 'Jugadores',
  niveles: 'Niveles',
  escenarios: 'Escenarios',
  completados: 'Progresos completados',
};

export default function PaginaAdministracion({
  nivelInicialId = null,
}) {
  const [seccion, establecerSeccion] = useState('niveles');
  const [nivelId, establecerNivelId] = useState(nivelInicialId);
  const [revision, establecerRevision] = useState(0);

  function actualizarResumen() {
    establecerRevision((actual) => actual + 1);
  }

  function mostrarNiveles() {
    establecerSeccion('niveles');
    establecerNivelId(null);
  }

  return (
    <div className="administracion">
      <header className="titulo-pagina">
        <h1>Administración</h1>

        <p>
          Gestiona el contenido y consulta el avance de los jugadores.
        </p>
      </header>

      <ConsultaAdministrativa
        key={revision}
        ruta="/admin/resumen"
      >
        {({ resumen }) => (
          <div className="resumen-admin">
            {Object.entries(etiquetasResumen).map(
              ([clave, etiqueta]) => (
                <div key={clave}>
                  <strong>{resumen[clave]}</strong>
                  <span>{etiqueta}</span>
                </div>
              ),
            )}
          </div>
        )}
      </ConsultaAdministrativa>

      <nav
        className="pestanas-admin"
        aria-label="Secciones administrativas"
      >
        <button
          type="button"
          aria-pressed={seccion === 'niveles'}
          onClick={mostrarNiveles}
        >
          Niveles y escenarios
        </button>

        <button
          type="button"
          aria-pressed={seccion === 'usuarios'}
          onClick={() => establecerSeccion('usuarios')}
        >
          Usuarios y progreso
        </button>
      </nav>

      {seccion === 'usuarios' ? (
        <PaginaAdminUsuarios
          alCambiar={actualizarResumen}
        />
      ) : nivelId ? (
        <PaginaAdminEscenarios
          key={nivelId}
          nivelId={nivelId}
          alCambiar={actualizarResumen}
          alVolver={mostrarNiveles}
        />
      ) : (
        <PaginaAdminNiveles
          alCambiar={actualizarResumen}
          alVerEscenarios={establecerNivelId}
        />
      )}
    </div>
  );
}