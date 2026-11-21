import { useCallback, useState } from 'react';
import { colones } from '../formato';
import { useConsulta } from '../hooks/useConsulta';
import { consultarPaquete, listarPaquetes } from '../servicios/villaPenas';
import { PanelConsulta } from './PanelConsulta';

function DetallePaquete({ id }: { id: number }) {
  const solicitar = useCallback((signal: AbortSignal) => consultarPaquete(id, signal), [id]);
  const { consulta, reintentar } = useConsulta(solicitar);

  return (
    <article className="detalle" aria-label="Detalle del paquete">
      <PanelConsulta consulta={consulta} reintentar={reintentar} mensajeCarga="Cargando detalle…">
        {(paquete) => {
          const servicios = [...paquete.paquetesServicios].sort((a, b) => a.orden - b.orden);

          return (
            <>
              <div className="detalle-titulo">
                <h3>{paquete.nombre}</h3>
                <strong className="precio-detalle">{colones(paquete.precioColones)}</strong>
              </div>
              {paquete.descripcion && <p className="descripcion">{paquete.descripcion}</p>}
              <h4>Servicios incluidos</h4>
              {servicios.length === 0 ? (
                <p className="estado" role="status">No hay servicios listados para este paquete.</p>
              ) : (
                <ul className="servicios">
                  {servicios.map(({ id: servicioId, servicio }) => (
                    <li key={servicioId}>
                      <strong>{servicio.nombre}</strong>
                      {servicio.descripcion && <p>{servicio.descripcion}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </>
          );
        }}
      </PanelConsulta>
    </article>
  );
}

export function Paquetes() {
  const { consulta, reintentar } = useConsulta(listarPaquetes);
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);

  return (
    <section className="seccion" id="paquetes" aria-labelledby="titulo-paquetes">
      <h2 id="titulo-paquetes">Paquetes</h2>
      <PanelConsulta consulta={consulta} reintentar={reintentar} mensajeCarga="Cargando paquetes…">
        {(paquetes) => {
          const seleccionado = paquetes.find(({ id }) => id === idSeleccionado) ?? paquetes[0];
          if (!seleccionado) {
            return <p className="estado" role="status">No hay paquetes disponibles.</p>;
          }

          return (
            <div className="catalogo-paquetes">
              <ul className="lista-paquetes" aria-label="Seleccioná un paquete">
                {paquetes.map((paquete) => (
                  <li key={paquete.id}>
                    <button
                      className="opcion-paquete"
                      type="button"
                      aria-pressed={paquete.id === seleccionado.id}
                      onClick={() => setIdSeleccionado(paquete.id)}
                    >
                      <span>
                        <strong>{paquete.nombre}</strong>
                        <span className="precio-paquete">{colones(paquete.precioColones)}</span>
                      </span>
                      <span className="flecha" aria-hidden="true">→</span>
                    </button>
                  </li>
                ))}
              </ul>
              <DetallePaquete key={seleccionado.id} id={seleccionado.id} />
            </div>
          );
        }}
      </PanelConsulta>
    </section>
  );
}
