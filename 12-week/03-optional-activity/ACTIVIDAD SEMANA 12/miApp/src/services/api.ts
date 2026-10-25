/**
 * Único punto de contacto con la API de hábitos.
 * Las pantallas llaman a estas funciones y nunca a fetch directamente,
 * así la dirección del servidor y el manejo de errores viven en un solo lugar.
 */

const URL_API = 'http://localhost:3000';

export interface Habito {
  id: number;
  nombre: string;
  categoria: string;
  meta: string;
}

export interface NuevoHabito {
  nombre: string;
  categoria: string;
  meta: string;
}

async function pedir(ruta: string, opciones?: RequestInit) {
  let resp: Response;

  try {
    resp = await fetch(`${URL_API}${ruta}`, opciones);
  } catch {
    // fetch solo lanza error cuando no logra conectar con el servidor.
    throw new Error('No se pudo conectar con el servidor. ¿Está encendido?');
  }

  const datos = await resp.json().catch(() => null);

  // Con un 400 o un 500 fetch NO lanza error: para él, recibir respuesta ya es
  // éxito. Por eso hay que revisar resp.ok a mano.
  if (!resp.ok) {
    throw new Error(datos?.error ?? `El servidor respondió ${resp.status}`);
  }

  return datos;
}

/** GET /habitos */
export const listarHabitos = (): Promise<Habito[]> => pedir('/habitos');

/** POST /habitos */
export const crearHabito = (datos: NuevoHabito): Promise<Habito> =>
  pedir('/habitos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
