# Actividad calificable · Corte 3: App con hardware y conectividad

La app de hábitos (`miApp`, Ionic React con Capacitor) consume su propia API (`api`, Express). Usé como base lo que ya tenía de las semanas 12 y 13.

## 1. Plugin de Capacitor con permisos

Usé `@capacitor/geolocation`. En la lista de hábitos, el botón **Mi ubicación** muestra la latitud y la longitud. Antes de leer la posición, la app revisa el permiso con `checkPermissions()` y, si todavía no está concedido, lo pide con `requestPermissions()`.

- Si el usuario niega el permiso, la app no se bloquea. Muestra un mensaje que explica cómo activarlo en los ajustes del celular.
- Si el GPS falla por otra razón, muestra *"No se pudo obtener la ubicación…"*.
- En Android, los permisos `ACCESS_COARSE_LOCATION` y `ACCESS_FINE_LOCATION` están declarados en `android/app/src/main/AndroidManifest.xml`.

## 2. Login por token, petición protegida, 401 y sin red

- `POST /login` devuelve un token JWT que vence en una hora. En el celular, la app lo guarda cifrado con `capacitor-secure-storage-plugin`. En el navegador se queda solo en memoria.
- `GET /habitos` es la petición protegida: exige `Authorization: Bearer <token>`. El servicio `src/services/api.ts` agrega esa cabecera a cada petición protegida, y ninguna pantalla usa `fetch` directamente.
- **401:** el servicio borra el token y la app vuelve a **Iniciar sesión** con el aviso *"Tu sesión venció o no es válida. Inicia sesión de nuevo."*
- **Sin red:** aparece *"No hay conexión con el servidor. Revisa tu conexión a internet e inténtalo de nuevo."*, sin sacar al usuario de la pantalla.

## 3. UX y prueba unitaria

**Navegación:** Iniciar sesión → lista de hábitos → detalle del hábito, con botón de regreso. Sin sesión no se puede ver la lista.

**Los tres estados**, en la lista y en el detalle:
- **Carga:** un spinner con *"Cargando hábitos…"*.
- **Datos:** la lista o el detalle. Si la lista llega vacía, la app lo dice.
- **Error:** una tarjeta roja con el mensaje. En la lista trae el botón **Reintentar**.

**Prueba unitaria:** `miApp/src/services/api.test.ts` comprueba que, cuando la API responde 401 a una petición protegida, el servicio lanza `SesionInvalidaError`, y que esa petición llevó el token en la cabecera `Authorization`.

```bash
cd miApp
npm install
npm run test.unit -- --run
```

```
 ✓ src/App.test.tsx > renders without crashing
 ✓ src/services/api.test.ts > si la API responde 401 en una petición protegida, lanza SesionInvalidaError

 Test Files  2 passed (2)
      Tests  2 passed (2)
```

`App.test.tsx` ya venía con la plantilla de Ionic. La prueba que agregué es la de `api.test.ts`.

## Cómo correrla

**API:**

```bash
cd api
npm install
npm start
```

Queda en `http://localhost:3000`. Usuario de prueba: `juan@habitos.test` · contraseña `Clave123`.

**App en el navegador:**

```bash
cd miApp
npm install
npm run dev
```

**App en Android:** primero se crea `miApp/.env.local` con `VITE_API_URL=http://<IP-del-PC>:3000`. Después:

```bash
npm run build
npx cap sync android
npx cap run android
```

Para ver el **401**, con la sesión iniciada se reinicia la API y se toca un hábito. Para ver el caso **sin red**, se apaga la API.

## Quality & connectivity

The app uses the Capacitor Geolocation plugin, and it never assumes that the location permission is granted: it calls `checkPermissions()` first and only calls `requestPermissions()` when the permission is still missing. If the user denies the permission, the app keeps working and shows a clear message that explains how to enable it in the phone settings. After a successful login, the API returns a JWT that expires in one hour, and the app stores it in the device's secure storage (Keystore on Android, Keychain on iOS) instead of plain local storage. All requests go through one service, `src/services/api.ts`, which adds the `Authorization: Bearer` header to every protected request, so no screen calls `fetch` directly. When the API answers 401, the service deletes the token and the app sends the user back to the login screen with a message saying that the session expired. When the server cannot be reached, the user sees a "no connection" message instead of a blank screen, and the habit list offers a "Retry" button. Every screen that loads data shows one of three states: a spinner while loading, the data, or an error message. A unit test checks that a 401 response on a protected request raises the session error and that the token was sent in the header.
