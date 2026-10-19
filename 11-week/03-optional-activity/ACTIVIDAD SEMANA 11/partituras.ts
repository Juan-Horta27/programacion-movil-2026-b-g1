// Datos de la Biblioteca de ScoreSound.
// La app todavía no tiene backend, así que la carga se simula con una espera.
// Para ver cada estado de la pantalla, cambia MODO por 'datos', 'vacio' o 'error'.

export interface Partitura {
  id: number;
  titulo: string;
  compositor: string;
  instrumento: string;
  tempo: number;
}

type Modo = 'datos' | 'vacio' | 'error';

export const MODO = 'datos' as Modo;

const PARTITURAS: Partitura[] = [
  { id: 1, titulo: 'Para Elisa', compositor: 'L. v. Beethoven', instrumento: 'Piano', tempo: 72 },
  { id: 2, titulo: 'Canon en Re', compositor: 'J. Pachelbel', instrumento: 'Violín', tempo: 60 },
  { id: 3, titulo: 'Minueto en Sol', compositor: 'C. Petzold', instrumento: 'Piano', tempo: 100 },
  { id: 4, titulo: 'Himno de la alegría', compositor: 'L. v. Beethoven', instrumento: 'Flauta', tempo: 90 },
];

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function cargarPartituras(): Promise<Partitura[]> {
  await esperar(1200);
  if (MODO === 'error') {
    throw new Error('No se pudo cargar la biblioteca.');
  }
  return MODO === 'vacio' ? [] : PARTITURAS;
}

export async function cargarPartitura(id: number): Promise<Partitura | undefined> {
  const partituras = await cargarPartituras();
  return partituras.find((partitura) => partitura.id === id);
}
