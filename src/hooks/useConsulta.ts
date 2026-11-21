import { useEffect, useState } from 'react';

export type Consulta<T> =
  | { estado: 'cargando' }
  | { estado: 'lista'; datos: T }
  | { estado: 'error'; mensaje: string };

export function useConsulta<T>(solicitar: (signal: AbortSignal) => Promise<T>) {
  const [consulta, setConsulta] = useState<Consulta<T>>({ estado: 'cargando' });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    setConsulta({ estado: 'cargando' });

    solicitar(controlador.signal)
      .then((datos) => {
        if (!controlador.signal.aborted) {
          setConsulta({ estado: 'lista', datos });
        }
      })
      .catch((error: unknown) => {
        if (controlador.signal.aborted) return;

        let mensaje = 'No se pudo conectar con la API.';
        if (error instanceof SyntaxError) {
          mensaje = 'La API devolvió una respuesta que no se pudo leer como JSON.';
        } else if (error instanceof Error && !(error instanceof TypeError)) {
          mensaje = error.message;
        }
        setConsulta({ estado: 'error', mensaje });
      });

    return () => controlador.abort();
  }, [solicitar, intento]);

  function reintentar() {
    setIntento((anterior) => anterior + 1);
  }

  return { consulta, reintentar };
}
