# Taller semana 11 · UX/UI aplicado a Healthy Habits Tracker

<!-- CONFIG-START -->
- FULL_NAME: Juan José Horta Vanegas
- GITHUB_USER: Juan-Horta27
- TEAM: Healthy Habits Tracker
- DOCS_REPO: https://github.com/code-corhuila/habits-tracker-docs
- CODE_REPO: https://github.com/code-corhuila/healthy-habits-tracker
- BASELINE: team app (React Native + Expo SDK 57), copia sin cambios de healthy-habits-tracker, rama main, commit 8a9966f
- REFLECTION_DOC: https://docs.google.com/document/d/1ndjzBIgDyMyiZcDGTc3vTg145CoPrki_UX1Z7iylmMQ/edit?usp=sharing
- MY_SCREENS:
<!-- CONFIG-END -->

## Línea base

`app/` es la app del equipo tal como está en el repositorio de código. Está hecha en React Native con Expo, no en Ionic, así que en este taller los componentes de Ionic que nombra la guía se reemplazan por sus equivalentes de React Native: filas esqueleto en lugar de `IonSkeletonText`, `RefreshControl` en lugar de `IonRefresher` y Jest con React Native Testing Library en lugar de Vitest.

Para abrirla en el navegador, después de la línea base se agregaron las dependencias web de Expo (`react-dom`, `react-native-web` y `@expo/metro-runtime`) en un commit aparte.

```bash
cd app
npm install
npm run web    # navegador (equivale a npm run dev)
npm start      # Expo Go en el celular
```
