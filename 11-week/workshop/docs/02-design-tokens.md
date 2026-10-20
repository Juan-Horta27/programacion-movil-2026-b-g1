# 02 · Navegación y tokens de diseño

## Patrón de navegación

Healthy Habits Tracker tiene **cinco secciones principales**: Inicio, Hábitos, Metas, Registros e Historial. El usuario pasa entre ellas varias veces en una misma sesión (revisa sus hábitos, mira la meta, registra el avance y ve el historial), así que el patrón que corresponde es **pestañas inferiores**. Cinco es el máximo recomendado para pestañas, y las cinco son secciones de uso frecuente, así que ninguna se mueve a un menú lateral.

Lo que no es una sección se maneja con **pila**: Login → Registro, Login → Pestañas, y **Nuevo registro** se abre encima como modal y se cierra para volver a donde estaba el usuario.

En React Native esto ya está implementado con `@react-navigation/bottom-tabs` (`src/navigation/TabNavigator.tsx`) y `@react-navigation/native-stack` (`src/navigation/AppNavigator.tsx`). Se conserva el patrón y las rutas reales; los cambios de este checkpoint están en los tokens.

## Tokens

Los tokens están en `app/src/constants/theme.ts`, que cumple el papel de `variables.css` en una app de React Native.

| Token | Valor | Uso |
| --- | --- | --- |
| `tokens.primary` | #2DD4BF (teal) | Acción principal, pestaña activa |
| `tokens.secondary` | #58A6FF (blue) | Acentos secundarios |
| `tokens.success` | #3FB950 (green) | Estado activo, éxito |
| `tokens.error` | #F85149 (red) | Errores y acciones destructivas |
| `tokens.background` | #0D1117 | Fondo de las pantallas |
| `tokens.surface` | #161B22 | Fondo de tarjetas y barra de pestañas |
| `fontSize` | 11 · 13 · 15 · 18 · 22 · 28 | xs · sm · md · lg · xl · xxl |
| `spacing` | 4 · 8 · 12 · 16 · 24 · 32 | xs · sm · md · lg · xl · xxl |

**Cambio:** el color `subtle` pasó de #484F58 a **#848D97**. Con el valor anterior el texto daba 2,28:1 sobre el fondo y 2,09:1 sobre las tarjetas (hallazgo 3 de la auditoría).

## Contraste de cada par texto / fondo

Calculado con la fórmula de luminancia relativa de WCAG 2.x, la misma que usa el verificador de contraste de WebAIM. Mínimo exigido: 4,5:1.

| Texto | Fondo | Contraste | ¿Cumple? |
| --- | --- | --- | --- |
| `text` #E6EDF3 | `background` #0D1117 | 16,02:1 | Sí |
| `text` #E6EDF3 | `surface` #161B22 | 14,64:1 | Sí |
| `textMuted` #8B949E | `background` #0D1117 | 6,15:1 | Sí |
| `textMuted` #8B949E | `surface` #161B22 | 5,62:1 | Sí |
| `subtle` #848D97 (nuevo) | `background` #0D1117 | 5,62:1 | Sí |
| `subtle` #848D97 (nuevo) | `surface` #161B22 | 5,14:1 | Sí |
| `subtle` #484F58 (anterior) | `surface` #161B22 | 2,09:1 | No |
| `primary` #2DD4BF | `background` #0D1117 | 10,17:1 | Sí |
| `background` #0D1117 sobre botón `primary` | #2DD4BF | 10,17:1 | Sí |
| `success` #3FB950 | `surface` #161B22 | 6,81:1 | Sí |
| `error` #F85149 | `surface` #161B22 | 5,16:1 | Sí |
| `secondary` #58A6FF | `surface` #161B22 | 6,85:1 | Sí |
