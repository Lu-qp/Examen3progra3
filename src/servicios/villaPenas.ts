import type { DetallePaquete, OpcionAdicional, Paquete } from '../tipos';

export const BASE_API = 'https://villa-penas-production.up.railway.app';

async function obtenerJson<T>(ruta: string, signal: AbortSignal): Promise<T> {
  const respuesta = await fetch(BASE_API + ruta, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'omit',
    signal,
  });

  if (!respuesta.ok) {
    throw new Error(`La API devolvió HTTP ${respuesta.status}.`);
  }

  return respuesta.json() as Promise<T>;
}

async function obtenerLista<T>(ruta: string, signal: AbortSignal): Promise<T[]> {
  const datos = await obtenerJson<T[]>(ruta, signal);
  if (!Array.isArray(datos)) {
    throw new Error('La API devolvió un formato de lista inesperado.');
  }
  return datos;
}

export function listarPaquetes(signal: AbortSignal) {
  return obtenerLista<Paquete>('/public/paquetes', signal);
}

export async function consultarPaquete(id: number, signal: AbortSignal) {
  const datos = await obtenerJson<DetallePaquete>(`/public/paquetes/${id}`, signal);
  if (datos?.id !== id || !Array.isArray(datos.paquetesServicios)) {
    throw new Error('La API devolvió un detalle de paquete inesperado.');
  }
  return datos;
}

export function listarAdicionales(signal: AbortSignal) {
  return obtenerLista<OpcionAdicional>('/public/opciones-productos-adicionales', signal);
}
