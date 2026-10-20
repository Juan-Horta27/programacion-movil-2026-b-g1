// El backend todavia no esta conectado: esta funcion simula su espera y su falla
// para poder ver los estados de carga y error de las listas.
// EXPO_PUBLIC_RETRASO_MS cambia la espera; EXPO_PUBLIC_SIMULAR_FALLA=1 fuerza el error.
const RETRASO_MS = Number(process.env.EXPO_PUBLIC_RETRASO_MS ?? 800);

export async function simularPeticion(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, RETRASO_MS));
  if (process.env.EXPO_PUBLIC_SIMULAR_FALLA === '1') {
    throw new Error('Fallo simulado de la peticion');
  }
}
