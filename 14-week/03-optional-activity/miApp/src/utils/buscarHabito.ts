import type { Habito } from '../services/api';

/**
 * Busca un hábito por su id. El id llega como texto porque viene de la ruta
 * (/habitos/:id), así que se convierte a número antes de comparar.
 * Devuelve null si no hay ningún hábito con ese id.
 */
export function buscarHabitoPorId(lista: Habito[], id: string): Habito | null {
  const numero = Number(id);
  return lista.find((h) => h.id === numero) ?? null;
}
