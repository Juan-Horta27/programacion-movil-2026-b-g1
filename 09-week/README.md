# Hábitos Saludables — App Ionic React + API

**Programación Móvil · Corte 2 · 2026-B**
Juan José Horta Vanegas — Ingeniería de Sistemas · CORHUILA

## Pruebas de la API

| Petición | Cuerpo | Respuesta |
|---|---|---|
| `GET /habitos` | — | `200` con el arreglo de hábitos |
| `POST /habitos` | `{ "nombre": "Meditar", "categoria": "Meditación", "meta": "10 minutos" }` | `201` con el hábito creado y su `id` |
| `POST /habitos` | `{ "categoria": "Ejercicio" }` | `400` con `{ "error": "El nombre es obligatorio" }` |

![Pruebas de la API](captura-api.png)

## Architecture

The backend is a minimal Express REST API that manages a single entity, the healthy habit, and keeps its data in memory. It exposes two endpoints: `GET /habitos` returns the whole list as a JSON array with status 200, and `POST /habitos` takes a JSON body with `nombre`, `categoria` and `meta` and answers 201 with the created habit, or 400 with an error message when `nombre` is missing. The Ionic React app never calls `fetch` from a screen: every request goes through one service module, `src/services/api.ts`, which holds the server URL and turns any failure into an `Error` with a readable message. That service checks `resp.ok` by hand, because `fetch` only rejects when the server cannot be reached and treats a 400 or 500 response as a success. Both screens keep their data in `useState`: the list screen stores the habits, the three form fields and an error message, and the detail screen stores the selected habit and its own error message. The list screen calls `GET /habitos` when it mounts and, after a successful `POST /habitos`, appends the habit returned by the server to its state, so the list updates without a second request. Tapping a habit navigates to `/habitos/:id`, where the detail screen reads the id with `useParams` and finds the habit in the response of `GET /habitos`, so the API needs no extra endpoint and the screen still works after a page reload. Because the app runs on port 8100 and the API on port 3000, the server enables CORS, otherwise the browser would block every request.
