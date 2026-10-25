# Actividad Semana 12 · Integra cámara o GPS con Capacitor

**Plugin elegido:** Geolocalización (`@capacitor/geolocation`), en la app de hábitos (`miApp`).

## Qué hice

En la pantalla **Hábitos** agregué una tarjeta con el botón **Mi ubicación**. Al tocarlo la app obtiene la posición del dispositivo y muestra la **latitud** y la **longitud**.

El código está en `miApp/src/pages/Habitos.tsx`, en la función `obtenerUbicacion`.

## Permisos

- **Android:** en `miApp/android/app/src/main/AndroidManifest.xml` declaré `ACCESS_COARSE_LOCATION` y `ACCESS_FINE_LOCATION`.
- **En la app:** antes de pedir la ubicación reviso el permiso con `Geolocation.checkPermissions()`. Si todavía no está concedido, lo pido con `Geolocation.requestPermissions()`.

## Si el usuario niega el permiso

La app no se rompe ni se queda en blanco. Muestra este mensaje en la misma tarjeta:

> No diste permiso de ubicación, así que no puedo mostrarla. Puedes activarlo en los ajustes del celular (Aplicaciones > miApp > Permisos).

Si el permiso está concedido pero falla el GPS (por ejemplo, está apagado), se muestra otro mensaje que pide revisar el permiso y el GPS. El usuario puede volver a tocar el botón cuando quiera.

## Cómo correrla

```bash
cd miApp
npm install
npm run build
npx cap sync android
npx cap run android
```

## Prueba en dispositivo real

Probé la app en un celular real, un **Samsung SM-S906E**, conectado por USB y con la depuración USB activada. Lo instalé con `npx cap run android` el 25 de octubre de 2026.

| Qué probé | Captura |
| --- | --- |
| Al tocar **Mi ubicación** aparece la ventana que pide el permiso | `capturas/01-permiso.jpg` |
| Permiso concedido: se muestran la latitud y la longitud | `capturas/02-concedido.jpg` |
| Permiso negado: se muestra el mensaje | `capturas/03-negado.jpg` |

Lo que vi:

- Con el permiso concedido la app mostró latitud 2.93674 y longitud -75.25823.
- Después desinstalé la app y la volví a instalar para que pidiera el permiso otra vez. Ahí elegí **No permitir** y la app mostró el mensaje explicando cómo activarlo, sin cerrarse ni quedarse en blanco.
- La captura del permiso concedido tiene una hora anterior a las otras dos (12:40 contra 12:41 y 12:42) porque la tomé en la primera instalación, antes de reinstalar.
- En las capturas se ve un cuadro rojo de error de conexión con el servidor. Es de la lista de hábitos, que busca la API en `localhost:3000`, y no tiene que ver con la ubicación.
