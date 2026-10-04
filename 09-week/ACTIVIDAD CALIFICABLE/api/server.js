/**
 * API REST mínima — Hábitos Saludables
 * Corte 2 · Programación Móvil · CORHUILA
 *
 * Una entidad (hábito) con dos endpoints:
 *   GET  /habitos   lista todos los hábitos
 *   POST /habitos   crea un hábito nuevo
 *
 * Los datos viven en memoria: al detener el servidor se pierden.
 */

const express = require("express");
const cors = require("cors");

const app = express();
const PUERTO = 3000;

// La app corre en el puerto 8100 y esta API en el 3000. Para el navegador son
// sitios distintos y bloquea la petición salvo que el servidor la autorice.
app.use(cors());

// Convierte el cuerpo JSON de la petición en un objeto disponible en req.body.
app.use(express.json());

let habitos = [
  { id: 1, nombre: "Beber agua", categoria: "Hidratación", meta: "8 vasos al día" },
  { id: 2, nombre: "Caminar", categoria: "Ejercicio", meta: "30 minutos" },
  { id: 3, nombre: "Dormir temprano", categoria: "Sueño", meta: "7 horas" }
];

let siguienteId = habitos.length + 1;

// Devuelve el texto recortado, o cadena vacía si el valor no es un texto.
const texto = (valor) => (typeof valor === "string" ? valor.trim() : "");

// GET /habitos -> 200 con el arreglo completo.
app.get("/habitos", (req, res) => {
  res.json(habitos);
});

// POST /habitos -> 201 con el hábito creado, o 400 si falta el nombre.
app.post("/habitos", (req, res) => {
  const nombre = texto(req.body?.nombre);

  if (!nombre) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  const nuevo = {
    id: siguienteId++,
    nombre,
    categoria: texto(req.body?.categoria),
    meta: texto(req.body?.meta)
  };

  habitos.push(nuevo);
  res.status(201).json(nuevo);
});

app.listen(PUERTO, () => {
  console.log(`API de hábitos escuchando en http://localhost:${PUERTO}`);
});
