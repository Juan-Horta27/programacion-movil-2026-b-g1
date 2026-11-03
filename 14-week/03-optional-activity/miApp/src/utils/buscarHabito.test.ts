import { buscarHabitoPorId } from './buscarHabito';

const lista = [
  { id: 1, nombre: 'Beber agua', categoria: 'Hidratación', meta: '8 vasos al día' },
  { id: 2, nombre: 'Caminar', categoria: 'Ejercicio', meta: '30 minutos' }
];

describe('buscarHabitoPorId', () => {
  test('encuentra el hábito aunque el id de la ruta llegue como texto', () => {
    expect(buscarHabitoPorId(lista, '2')).toEqual(lista[1]);
  });

  test('devuelve null si el id no existe o no es un número', () => {
    expect(buscarHabitoPorId(lista, '99')).toBeNull();
    expect(buscarHabitoPorId(lista, 'abc')).toBeNull();
  });
});
