import type { ReactNode } from 'react';
import type { Consulta } from '../hooks/useConsulta';

interface Props<T> {
  consulta: Consulta<T>;
  mensajeCarga: string;
  reintentar: () => void;
  children: (datos: T) => ReactNode;
}

export function PanelConsulta<T>({ consulta, mensajeCarga, reintentar, children }: Props<T>) {
  if (consulta.estado === 'cargando') {
    return <p className="estado" role="status">{mensajeCarga}</p>;
  }

  if (consulta.estado === 'error') {
    return (
      <div className="estado estado-error" role="alert">
        <p>{consulta.mensaje}</p>
        <button className="boton" type="button" onClick={reintentar}>Reintentar</button>
      </div>
    );
  }

  return children(consulta.datos);
}
