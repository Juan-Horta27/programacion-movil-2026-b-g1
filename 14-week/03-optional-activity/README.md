# Actividad Semana 14 · Optimización y pruebas

Trabajé sobre la app de hábitos de la semana 13 (`miApp`) y su API (`api`, sin cambios).

## 1. Optimización: lista de hábitos y su detalle

**Pantalla elegida:** la lista de hábitos (`Habitos.tsx`) y el detalle que se abre al tocar un hábito (`DetalleHabito.tsx`).

**Problema (llamadas repetidas).** Al revisar la pestaña *Network* vi que, después de cargar la lista, cada vez que se abría un hábito y se volvía, la app pedía otra vez `GET /habitos` **hasta 4 veces**. Los datos eran los mismos. Había dos causas:

- Las dos pantallas cargaban sus datos en un `useEffect` que dependía de `navigate`. `useNavigate` entrega una función nueva cada vez que cambia la ruta, así que la carga se repetía al ir al detalle y al volver.
- El detalle no tenía cómo pedir un solo hábito (la API solo tiene `GET /habitos`), así que traía la lista completa solo para buscar uno.

**Qué cambié.**

- En las dos pantallas, `navigate` se guarda en una ref (`useRef`). Así la lista se carga una sola vez al abrir la pantalla, y el detalle solo vuelve a cargar si cambia el `id`.
- `services/api.ts` guarda en memoria la última lista que devolvió `GET /habitos`. La nueva función `obtenerHabito(id)` busca ahí el hábito, y solo pide la lista al servidor si no lo encuentra, por ejemplo si se abre el enlace directo. Al crear un hábito, este se agrega a esa lista. Cuando la sesión se cierra por un 401, la lista se borra junto con el token.
- La búsqueda por id quedó en una función aparte, `utils/buscarHabito.ts`, que es la que se prueba en el punto 2.

**Medición antes/después.** El recorrido fue: iniciar sesión, abrir los 3 hábitos uno por uno y volver a la lista cada vez. Usé la versión compilada (`npm run build` y `npm run preview`), porque en modo `dev` React ejecuta los efectos dos veces a propósito y eso cambia los números. Conté las peticiones a `/habitos` en la pestaña *Network* y medí el tiempo desde que se toca el hábito hasta que aparece su nombre en el detalle. Hice cada caso 3 veces. La prueba con latencia simula una red móvil lenta: 300 ms por petición, configurados en *Network → Throttling*.

| | Antes | Después |
|---|---|---|
| Peticiones `GET /habitos` en el recorrido | 12 a 13 | **1** |
| Peticiones al abrir un hábito y volver | hasta 4 | **0** |
| Datos descargados de `/habitos` en el recorrido | 2760 a 2990 B | **230 B** |
| Tiempo hasta ver el detalle (red local) | ~99 ms | **~77 ms** |
| Tiempo hasta ver el detalle (red con 300 ms de latencia) | ~879 ms | **~69 ms** |

Antes, con red lenta, el detalle quedaba casi un segundo en blanco esperando la lista. Ahora aparece de inmediato, porque los datos ya están en memoria. Lo único que se pide al servidor es la carga inicial de la lista.

Como el detalle ya no consulta la API, para ver el aviso del 401 (que antes salía al tocar un hábito) ahora hay que reiniciar la API e intentar **agregar** un hábito.

## 2. Pruebas unitarias

Las pruebas están en `miApp/src/utils/buscarHabito.test.ts` y prueban la función `buscarHabitoPorId(lista, id)`. Esta función recibe el `id` como texto, porque así llega desde la ruta `/habitos/:id`, y devuelve el hábito, o `null` si no existe.

1. **Encuentra el hábito aunque el id de la ruta llegue como texto:** con `'2'` devuelve el hábito con `id: 2`.
2. **Devuelve null si el id no existe o no es un número:** con `'99'` y con `'abc'` devuelve `null`.

Se corren con Vitest, que ya venía configurado en el proyecto:

```bash
cd miApp
npm install
npm run test.unit -- --run
```

Resultado:

```
 ✓ src/App.test.tsx > renders without crashing 60ms
 ✓ src/utils/buscarHabito.test.ts > buscarHabitoPorId > encuentra el hábito aunque el id de la ruta llegue como texto 2ms
 ✓ src/utils/buscarHabito.test.ts > buscarHabitoPorId > devuelve null si el id no existe o no es un número 1ms

 Test Files  2 passed (2)
      Tests  3 passed (3)
```

Las dos pruebas nuevas pasan. La tercera (`App.test.tsx`) ya venía con la plantilla de Ionic.

## Cómo correrla

**API:** `cd api`, `npm install`, `npm start`. Queda en `http://localhost:3000`. Usuario de prueba: `juan@habitos.test` · contraseña `Clave123`.

**App:** `cd miApp`, `npm install`, `npm run dev`. Para repetir la medición, usar `npm run build` y `npm run preview`.
