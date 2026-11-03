# Actividad Semana 13 · Autenticación con token y conectividad

Trabajé sobre la app de hábitos (`miApp`, la misma de la semana 12) y su API de la semana 9 (`api`). Les agregué el inicio de sesión con token.

## Qué hice

**1. Login y token guardado de forma segura.** La API tiene un endpoint nuevo, `POST /login`. Recibe el correo y la contraseña y, si coinciden, devuelve un token JWT que vence en una hora. En la app, la pantalla **Iniciar sesión** (`miApp/src/pages/Login.tsx`) lo pide. El servicio lo guarda con `capacitor-secure-storage-plugin`, que en Android lo cifra con el Keystore y en iOS lo guarda en el Keychain. En el navegador ese plugin solo usaría `localStorage` sin cifrar, así que ahí el token se queda únicamente en memoria.

**2. Petición protegida.** `GET /habitos` (y también `POST /habitos`) ahora exige la cabecera `Authorization: Bearer <token>`. El servicio la agrega en cada petición protegida. Sin token, o con un token que no sirve, la API responde 401.

**3. 401 y falta de red.**
- Si la API responde **401** (token inválido o vencido), el servicio borra el token y la app vuelve a **Iniciar sesión** con el aviso *"Tu sesión venció o no es válida. Inicia sesión de nuevo."* Si se abre la lista sin haber iniciado sesión, el aviso es *"Inicia sesión para ver tus hábitos."*
- Si no hay conexión con el servidor, aparece *"No hay conexión con el servidor. Revisa tu conexión a internet e inténtalo de nuevo."* No saca de la pantalla, así que se puede volver a intentar.
- En el login, unas credenciales incorrectas muestran *"Correo o contraseña incorrectos"*.

**4. Servicio centralizado.** Todo el acceso a la API está en `miApp/src/services/api.ts`: la dirección del servidor, guardar y leer el token, la cabecera `Authorization`, y el manejo del 401 y de la falta de red. Las pantallas solo llaman a `iniciarSesion`, `listarHabitos` y `crearHabito`, y ninguna usa `fetch`.

## Cómo correrla

**API**

```bash
cd api
npm install
npm start
```

Queda en `http://localhost:3000`. Usuario de prueba: `juan@habitos.test` · contraseña `Clave123`.

**App en el navegador**

```bash
cd miApp
npm install
npm run dev
```

**App en el celular (Android)**

En el celular, `localhost` es el propio celular, así que hay que poner la IP del PC (la que muestra `ipconfig`, misma red Wi-Fi). Se crea el archivo `miApp/.env.local` con:

```
VITE_API_URL=http://<IP-del-PC>:3000
```

y luego:

```bash
npm run build
npx cap sync android
npx cap run android
```

En `capacitor.config.ts` dejé `androidScheme: 'http'` y `cleartext: true`. Sin eso, el WebView de Android bloquea las peticiones a la API, porque esta corre en el PC por HTTP y no por HTTPS.

## Cómo ver el 401 y la falta de red

- **401:** con la sesión iniciada, se reinicia la API (`Ctrl + C` y `npm start`). Al arrancar genera una clave nueva para firmar tokens, así que el token anterior deja de servir. Al tocar un hábito, la app vuelve al login con el aviso.
- **Sin red:** se apaga la API (o se quita la red) y se intenta entrar o agregar un hábito.
