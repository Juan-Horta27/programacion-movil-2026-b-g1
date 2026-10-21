// Reglas del formulario "Nuevo habito". Salen del modelo Habito (types/index.ts):
// nombre, unidadMedida y categoriaHabitoId son obligatorios; descripcion es opcional.
export interface CamposHabito {
  nombre: string;
  unidadMedida: string;
  categoriaId: number | null;
}

export type ErroresHabito = Partial<Record<keyof CamposHabito, string>>;

export function validarHabito(campos: CamposHabito): ErroresHabito {
  const errores: ErroresHabito = {};
  if (!campos.nombre.trim()) errores.nombre = 'Escribe el nombre del habito';
  if (campos.categoriaId === null) errores.categoriaId = 'Elige una categoria';
  if (!campos.unidadMedida.trim()) {
    errores.unidadMedida = 'Indica como lo mides: vasos, minutos, horas...';
  }
  return errores;
}
