/**
 * API REST mínima — Hábitos Saludables
 * Semana 13 · Programación Móvil · CORHUILA
 *
 *   POST /login     recibe correo y contraseña y devuelve un token (JWT)
 *   GET  /habitos   lista los hábitos            (protegida: exige el token)
 *   POST /habitos   crea un hábito nuevo         (protegida: exige el token)
 *
 * Los datos viven en memoria: al detener el servidor se pierden.
 */

const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PUERTO = 3000;

// Clave con la que se firman los tokens. Si no se define JWT_SECRET, se genera
// una nueva cada vez que arranca el servidor: al reiniciarlo, los tokens
// anteriores dejan de ser válidos.
const SECRETO = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");
const DURACION_TOKEN = "1h";

// Usuario de prueba de la actividad.
const USUARIO = { id: 1, nombre: "Juan José", correo: "juan@habitos.test", contrasena: "Clave123" };

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

// POST /login -> 200 con el token, 400 si faltan datos, 401 si no coinciden.
app.post("/login", (req, res) => {
  const correo = texto(req.body?.correo).toLowerCase();
  const contrasena = texto(req.body?.contrasena);

  if (!correo || !contrasena) {
    return res.status(400).json({ error: "Escribe tu correo y tu contraseña" });
  }
  if (correo !== USUARIO.correo || contrasena !== USUARIO.contrasena) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });
  }

  const token = jwt.sign({ sub: USUARIO.id, nombre: USUARIO.nombre }, SECRETO, {
    expiresIn: DURACION_TOKEN
  });
  res.json({ token });
});

// Protege una ruta: exige "Authorization: Bearer <token>" con un token válido.
// Si falta, es inválido o ya venció, responde 401.
function exigirToken(req, res, next) {
  const [esquema, token] = (req.headers.authorization ?? "").split(" ");

  if (esquema !== "Bearer" || !token) {
    return res.status(401).json({ error: "Falta el token. Inicia sesión" });
  }

  try {
    req.usuario = jwt.verify(token, SECRETO);
    next();
  } catch {
    res.status(401).json({ error: "El token no es válido o ya venció. Inicia sesión de nuevo" });
  }
}

// GET /habitos -> 200 con el arreglo completo.
app.get("/habitos", exigirToken, (req, res) => {
  res.json(habitos);
});

// POST /habitos -> 201 con el hábito creado, o 400 si falta el nombre.
app.post("/habitos", exigirToken, (req, res) => {
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
