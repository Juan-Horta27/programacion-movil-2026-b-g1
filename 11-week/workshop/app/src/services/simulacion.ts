// El backend todavia no esta conectado: esta funcion simula su espera y su falla
// para poder ver los estados de carga y error de las listas.
// EXPO_PUBLIC_RETRASO_MS cambia la espera; EXPO_PUBLIC_SIMULAR_FALLA=1 fuerza el error de las listas
// y EXPO_PUBLIC_FALLA_GUARDADO=1 el error al guardar un formulario.
const RETRASO_MS = Number(process.env.EXPO_PUBLIC_RETRASO_MS ?? 800);

export const FALLA_GUARDADO = process.env.EXPO_PUBLIC_FALLA_GUARDADO === '1';

export async function simularPeticion(
  fallar = process.env.EXPO_PUBLIC_SIMULAR_FALLA === '1',
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, RETRASO_MS));
  if (fallar) {
    throw new Error('Fallo simulado de la peticion');
  }
}
