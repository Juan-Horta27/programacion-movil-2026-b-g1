/**
 * Único punto de contacto con la API de hábitos.
 * Las pantallas llaman a estas funciones y nunca a fetch directamente,
 * así la dirección del servidor, el token y el manejo de errores viven en un solo lugar.
 */
import { Capacitor } from '@capacitor/core';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

// En el celular, localhost es el propio celular: ahí se usa la IP del PC (ver README).
const URL_API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const CLAVE_TOKEN = 'token';

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

/** Error 401: no hay token, o el servidor lo rechazó por inválido o vencido. */
export class SesionInvalidaError extends Error {}

// ---------- Token ----------
// En Android y iOS el token se guarda cifrado (Keystore / Keychain) con
// capacitor-secure-storage-plugin. En el navegador ese plugin solo usa
// localStorage sin cifrar, así que ahí el token vive únicamente en memoria.

let tokenEnMemoria: string | null = null;
const EN_CELULAR = Capacitor.isNativePlatform();

async function guardarToken(token: string): Promise<void> {
  if (EN_CELULAR) await SecureStoragePlugin.set({ key: CLAVE_TOKEN, value: token });
  else tokenEnMemoria = token;
}

async function leerToken(): Promise<string | null> {
  if (!EN_CELULAR) return tokenEnMemoria;
  try {
    return (await SecureStoragePlugin.get({ key: CLAVE_TOKEN })).value;
  } catch {
    return null; // el plugin rechaza la promesa cuando la clave no existe
  }
}

async function borrarToken(): Promise<void> {
  tokenEnMemoria = null;
  if (EN_CELULAR) await SecureStoragePlugin.remove({ key: CLAVE_TOKEN }).catch(() => undefined);
}

// ---------- Peticiones ----------

async function pedir(ruta: string, opciones: RequestInit = {}, protegida = true) {
  const cabeceras = new Headers(opciones.headers);

  if (protegida) {
    const token = await leerToken();
    if (!token) throw new SesionInvalidaError('Inicia sesión para ver tus hábitos.');
    cabeceras.set('Authorization', `Bearer ${token}`);
  }

  let resp: Response;
  try {
    resp = await fetch(`${URL_API}${ruta}`, { ...opciones, headers: cabeceras });
  } catch {
    // fetch solo lanza error cuando no logra conectar: sin internet o servidor apagado.
    throw new Error('No hay conexión con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.');
  }

  const datos = await resp.json().catch(() => null);

  // 401 en una ruta protegida: el token ya no sirve, se borra y hay que volver a entrar.
  if (resp.status === 401 && protegida) {
    await borrarToken();
    throw new SesionInvalidaError('Tu sesión venció o no es válida. Inicia sesión de nuevo.');
  }

  // Con un 400, 401 o 500 fetch NO lanza error: para él, recibir respuesta ya es
  // éxito. Por eso hay que revisar resp.ok a mano.
  if (!resp.ok) {
    throw new Error(datos?.error ?? `El servidor respondió ${resp.status}`);
  }

  return datos;
}

/** POST /login: pide el token y lo guarda de forma segura. */
export async function iniciarSesion(correo: string, contrasena: string): Promise<void> {
  const { token } = await pedir(
    '/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    },
    false
  );
  await guardarToken(token);
}

/** GET /habitos (protegida) */
export const listarHabitos = (): Promise<Habito[]> => pedir('/habitos');

/** POST /habitos (protegida) */
export const crearHabito = (datos: NuevoHabito): Promise<Habito> =>
  pedir('/habitos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
