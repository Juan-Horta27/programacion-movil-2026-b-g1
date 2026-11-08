import { afterEach, expect, test, vi } from 'vitest';
import { iniciarSesion, listarHabitos, SesionInvalidaError } from './api';

afterEach(() => {
  vi.unstubAllGlobals();
});

test('si la API responde 401 en una petición protegida, lanza SesionInvalidaError', async () => {
  // El login devuelve un token y luego GET /habitos responde 401 (token vencido).
  const respuestas = [
    new Response(JSON.stringify({ token: 'token-de-prueba' }), { status: 200 }),
    new Response(JSON.stringify({ error: 'El token no es válido o ya venció' }), { status: 401 })
  ];
  const fetchFalso = vi.fn<(url: string, opciones: RequestInit) => Promise<Response>>(
    async () => respuestas.shift()!
  );
  vi.stubGlobal('fetch', fetchFalso);

  await iniciarSesion('juan@habitos.test', 'Clave123');
  await expect(listarHabitos()).rejects.toBeInstanceOf(SesionInvalidaError);

  // La petición protegida llevó el token en la cabecera Authorization.
  const cabeceras = fetchFalso.mock.calls[1][1].headers as Headers;
  expect(cabeceras.get('Authorization')).toBe('Bearer token-de-prueba');
});
