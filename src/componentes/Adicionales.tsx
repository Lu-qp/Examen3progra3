import { useState } from 'react';
import { colones } from '../formato';
import { useConsulta } from '../hooks/useConsulta';
import { BASE_API, listarAdicionales } from '../servicios/villaPenas';
import type { OpcionAdicional, ProductoAdicional } from '../tipos';
import { PanelConsulta } from './PanelConsulta';

interface GrupoAdicional {
  producto: ProductoAdicional;
  opciones: OpcionAdicional[];
}

function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es-CR').trim();
}

function agruparAdicionales(opciones: OpcionAdicional[], busqueda: string) {
  const grupos = new Map<number, GrupoAdicional>();
  const filtro = normalizar(busqueda);

  for (const opcion of opciones) {
    const producto = opcion.productoAdicional;
    if (!normalizar(`${producto.nombre} ${opcion.nombre}`).includes(filtro)) continue;

    const grupo = grupos.get(opcion.productoAdicionalId);
    if (grupo) {
      grupo.opciones.push(opcion);
    } else {
      grupos.set(opcion.productoAdicionalId, { producto, opciones: [opcion] });
    }
  }

  return grupos;
}

function TarjetaAdicional({ producto, opciones }: GrupoAdicional) {
  const [imagenFallida, setImagenFallida] = useState(false);
  const imagen = producto.imagenUrl && !imagenFallida
    ? new URL(producto.imagenUrl, BASE_API).href
    : null;

  return (
    <article className="tarjeta-adicional">
      {imagen && (
        <img
          src={imagen}
          alt=""
          width="640"
          height="360"
          loading="lazy"
          onError={() => setImagenFallida(true)}
        />
      )}
      <div className="tarjeta-interior">
        <h3>{producto.nombre}</h3>
        {producto.descripcion && <p className="descripcion">{producto.descripcion}</p>}
        <ul className="opciones-adicionales">
          {opciones.map((opcion) => (
            <li key={opcion.id}>
              <span>{opcion.nombre}</span>
              <strong>{colones(opcion.precioVentaColones)}</strong>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Adicionales() {
  const { consulta, reintentar } = useConsulta(listarAdicionales);
  const [busqueda, setBusqueda] = useState('');

  return (
    <section className="seccion" id="adicionales" aria-labelledby="titulo-adicionales">
      <div className="encabezado-adicionales">
        <h2 id="titulo-adicionales">Productos adicionales</h2>
        {consulta.estado === 'lista' && consulta.datos.length > 0 && (
          <label className="busqueda">
            <span>Buscar adicionales</span>
            <input
              type="search"
              placeholder="Ej. palomitas"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </label>
        )}
      </div>
      <PanelConsulta consulta={consulta} reintentar={reintentar} mensajeCarga="Cargando adicionales…">
        {(opciones) => {
          const grupos = agruparAdicionales(opciones, busqueda);
          if (grupos.size === 0) {
            return (
              <p className="estado" role="status">
                {opciones.length === 0
                  ? 'No hay productos adicionales disponibles.'
                  : 'No encontramos adicionales con esa búsqueda.'}
              </p>
            );
          }

          return (
            <div className="catalogo-adicionales">
              {Array.from(grupos, ([id, grupo]) => <TarjetaAdicional key={id} {...grupo} />)}
            </div>
          );
        }}
      </PanelConsulta>
    </section>
  );
}
