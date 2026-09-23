/**
 * Funciones que hablan con la API de partituras.
 * Única capa que conoce la URL del servidor: las pantallas llaman a estas
 * funciones y nunca a fetch directamente.
 */

const URL_API = 'http://localhost:3000';

export interface Partitura {
  id: number;
  titulo: string;
  instrumento: string;
  compases: number;
}

export interface NuevaPartitura {
  titulo: string;
  instrumento?: string;
  compases?: number;
}

/**
 * fetch NO lanza error cuando el servidor responde 400, 404 o 500:
 * para fetch, recibir una respuesta ya es un éxito. Solo falla si no
 * hubo conexión. Por eso hay que revisar resp.ok a mano.
 */
async function leerRespuesta(resp: Response) {
  const datos = await resp.json().catch(() => null);

  if (!resp.ok) {
    const mensaje = datos?.error ?? `El servidor respondió ${resp.status}`;
    throw new Error(mensaje);
  }

  return datos;
}

/** GET /partituras — devuelve la lista completa. */
export async function listarPartituras(): Promise<Partitura[]> {
  try {
    const resp = await fetch(`${URL_API}/partituras`);
    return await leerRespuesta(resp);
  } catch (error) {
    // Si no hay servidor encendido, fetch lanza TypeError sin mensaje útil.
    if (error instanceof TypeError) {
      throw new Error('No se pudo conectar con el servidor. ¿Está encendido?');
    }
    throw error;
  }
}

/** POST /partituras — crea una partitura y devuelve la que guardó el servidor. */
export async function crearPartitura(datos: NuevaPartitura): Promise<Partitura> {
  try {
    const resp = await fetch(`${URL_API}/partituras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    return await leerRespuesta(resp);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('No se pudo conectar con el servidor. ¿Está encendido?');
    }
    throw error;
  }
}
