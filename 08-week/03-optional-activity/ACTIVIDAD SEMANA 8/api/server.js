/**
 * API REST de partituras — ScoreSound
 * Semana 8 · Programación Móvil · CORHUILA
 *
 * Los datos viven en memoria: al detener el servidor se pierden.
 * Para esta práctica es suficiente; en el proyecto real irían a una base de datos.
 */

const express = require("express");
const cors = require("cors");

const app = express();
const PUERTO = 3000;

// Permite que la app (puerto 8100) le hable a esta API (puerto 3000).
app.use(cors());

// Convierte el cuerpo JSON de las peticiones en un objeto usable en req.body.
app.use(express.json());

let partituras = [
  { id: 1, titulo: "Cielito lindo", instrumento: "Guitarra", compases: 32 },
  { id: 2, titulo: "Estudio en La menor", instrumento: "Guitarra", compases: 48 },
  { id: 3, titulo: "Patrón de bolero", instrumento: "Congas", compases: 16 }
];

// El siguiente id no se calcula con la longitud de la lista: si se borra
// un elemento, dos partituras terminarían con el mismo id.
let siguienteId = partituras.length + 1;

/* ---------------------------------------------------------------- GET */

// Devuelve todas las partituras.
app.get("/partituras", (req, res) => {
  res.json(partituras);
});

// Devuelve una sola. Si no existe, responde 404.
app.get("/partituras/:id", (req, res) => {
  const partitura = partituras.find((p) => p.id === Number(req.params.id));

  if (!partitura) {
    return res.status(404).json({ error: "No existe una partitura con ese id" });
  }

  res.json(partitura);
});

/* --------------------------------------------------------------- POST */

app.post("/partituras", (req, res) => {
  const { titulo, instrumento, compases } = req.body;

  // Validación: sin título no se crea nada. Responde 400 (culpa del cliente).
  if (!titulo || titulo.trim() === "") {
    return res.status(400).json({ error: "El título es obligatorio" });
  }

  if (compases !== undefined && (isNaN(compases) || compases <= 0)) {
    return res.status(400).json({ error: "Los compases deben ser un número mayor que cero" });
  }

  const nueva = {
    id: siguienteId++,
    titulo: titulo.trim(),
    instrumento: instrumento?.trim() || "Sin definir",
    compases: compases ?? 0
  };

  partituras.push(nueva);

  // 201 significa "creado". Se devuelve el objeto con el id que asignó el servidor.
  res.status(201).json(nueva);
});

/* -------------------------------------------------------------- Otros */

// Cualquier ruta que no exista responde 404 en JSON, no en HTML.
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PUERTO, () => {
  console.log(`API de partituras escuchando en http://localhost:${PUERTO}`);
});
