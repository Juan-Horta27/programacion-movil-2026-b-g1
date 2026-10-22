# 08 · Prueba de usabilidad con dos personas

Hice la prueba el 21 de octubre de 2026 con la versión de la app que ya tiene el formulario de Nuevo hábito (CP6) y el detalle de un hábito (CP7), corriendo en el navegador con `npm run web`.

## Quiénes participaron

| | Quién | Dispositivo |
| --- | --- | --- |
| P1 | Mi profesor de música, que trabaja conmigo | Mi computador, la app en el navegador |
| P2 | Mi mamá | Mi computador, la app en el navegador |

Ninguno de los dos conocía la app antes de la prueba.

## Las tres tareas

Se las leí una sola vez y con estas mismas palabras:

1. **Crear un hábito:** "Quieres empezar a comer más fruta. Crea ese hábito en la app; lo vas a medir en porciones."
2. **Consultar el detalle:** "Averigua cuál ha sido tu mejor racha caminando."
3. **Registrar el avance:** "Anoche dormiste 7 horas. Déjalo anotado en la app."

## Cómo la hice

- A cada persona le expliqué que iba a hacer una pequeña prueba de la aplicación y le expliqué las tareas.
- Les pedí que las hicieran por su cuenta y no les dije nada mientras las hacían.
- Al final tomé algunos datos y les agradecí.
- No corté a nadie a los 3 minutos: varias tareas pasaron de ese tiempo porque los dejé seguir hasta que terminaron o dejaron de intentar.
- Conté como error entrar a una pantalla que no servía para la tarea o hacer algo que no llevaba al resultado.

## Resultados

| Persona | Tarea | ¿La logró? | Tiempo | Errores y lo que hizo | Lo que dijo |
| --- | --- | --- | --- | --- | --- |
| P1 | 1. Crear hábito | Sí | 7:31 | Entró a dos páginas que no eran. Intentó hacer un registro en vez de crear un hábito. Revisó todo Inicio y leyó todas las páginas hasta llegar a Hábitos. Al crearlo se equivocó varias veces al elegir la categoría. | "¿Dónde está?", "no encuentro el menú de hábitos" |
| P1 | 2. Mejor racha | No | 4:21 | Hizo el intento y entró a las pantallas, pero no supo hacerlo. | Preguntó en qué parte se hace el registro y dónde se mira lo de las 7 horas de sueño |
| P1 | 3. Registrar sueño | No | 5:34 | Hizo el intento y entró a las pantallas, pero no supo hacerlo. | (igual que arriba) |
| P2 | 1. Crear hábito | Sí | 2:11 | Se quedó mucho tiempo en Inicio intentando hacer clic en las gráficas. Entró a Hábitos y creó el hábito. | "No la encuentro", "¿en qué parte es?", "está muy escondida" |
| P2 | 2. Mejor racha | No | 2:56 | Llegó a la pantalla, pero no hizo clic en la opción que le habría permitido terminar la tarea. | — |
| P2 | 3. Registrar sueño | A medias | 4:11 | Escribió que había dormido 7 horas, pero no guardó el registro. | — |

De las seis tareas, dos se completaron (la tarea 1 de cada persona) y una quedó a medias.

## Los tres problemas más importantes

**1. Crear un hábito no se encuentra a la primera.** Las dos personas dijeron que no encontraban dónde. El botón para crearlo es un "+" sin texto arriba a la derecha en Hábitos. Mi mamá lo llamó "muy escondido" y gastó casi todo su tiempo en Inicio intentando tocar las gráficas, que no hacen nada al tocarlas. Mi profesor leyó todas las pantallas hasta llegar a Hábitos.

**2. Registrar el avance no se termina.** En la tarea 3 nadie lo logró del todo. Mi profesor no encontró dónde se hacía y mi mamá llegó hasta escribir las 7 horas pero no guardó el registro. No sé todavía si no vio el botón Guardar o pensó que ya estaba guardado.

**3. Eliminar no da ninguna señal.** Mi profesor dijo que había eliminado dos registros por error y no le salió ninguna pregunta de confirmación. Después lo comprobé yo en el navegador: al tocar Eliminar en Hábitos, y también la ✕ en Registros, no aparece ninguna pregunta, no sale ningún mensaje y la lista no cambia. La pregunta de confirmación que usan esos botones es del sistema del celular y en el navegador no se muestra. Además, un hábito que ya tiene registros no se puede borrar, así que aunque la pregunta saliera, el usuario no sabría por qué no se borró. No logré reproducir que se borraran registros, así que no puedo explicar eso; lo que sí confirmé es que estos botones no dicen nada.

## Otras observaciones

- Mi profesor no pudo escribir en el campo Descripción del formulario, que le apareció deshabilitado. Cuando lo revisé después en mi computador sí me dejó escribir, así que no logré reproducirlo y no lo cuento entre los tres problemas.
- Mi profesor se equivocó varias veces al elegir la categoría de un hábito.
