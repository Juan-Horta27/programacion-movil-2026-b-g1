# Certificación Huawei – Cangjie Programming

## Ficha del curso

| Dato | Valor |
|---|---|
| Nombre completo | Juan José Horta Vanegas |
| Usuario de GitHub | Juan-Horta27 |
| Nombre del curso | Cangjie Programming |
| Enlace del curso | https://e.huawei.com/en/talent/outPage/#/sxz-course/home?courseId=0r474B9ioVs9BqEs6DEDLf44wFs |
| Duración publicada | 56 horas |
| Fecha de inicio | 29/10/2026 |
| Fecha de finalización | 11/11/2026 |
| Nota del examen final | 90 / 100 (aprobado) |

## Proyectos y examen final

| Proyecto | Fecha | Qué hice | Captura | Código |
|---|---|---|---|---|
| Proyecto 1 – Montaje del entorno | 01/11/2026 | Dejé listo el entorno para programar en Cangjie y probé la cadena de compilación con `cjc`. Escribí un "Hello, Cangjie!" y un `main.cj` que imprime un resumen de qué hace un IDE y por qué hace falta un compilador. | [01-proyecto-1.png](evidencias/01-proyecto-1.png) | [codigo/proyecto-1](codigo/proyecto-1) |
| Proyecto 2 – Gestión de archivos de log | 02/11/2026 | Hice tres programas de consola. El primero pide los datos de un campus y los imprime como una línea de log con `SimpleLogger`. El segundo simula datos de control de acceso, parqueadero, cámaras y sala de servidores y los guarda en `log.txt`. El tercero lee ese archivo y muestra solo las líneas del nivel que el administrador elige (trace, debug, info, warn o error). | [02-proyecto-2.png](evidencias/02-proyecto-2.png) | [codigo/proyecto-2](codigo/proyecto-2) |
| Proyecto 3 – Análisis de datos del sistema | 10/11/2026 | Programa de consola para una red de máquinas expendedoras. Primero captura el ID de la máquina y el distrito, luego hay un menú para administrar los dispositivos y por último se analiza el archivo `smart_retail_sales.csv` (ventas por mes y por producto) usando programación funcional. | [03-proyecto-3.png](evidencias/03-proyecto-3.png) | [codigo/proyecto-3](codigo/proyecto-3) |
| Proyecto 4 – Optimización de funciones de negocio | 11/11/2026 | Gestión de dispositivos de una casa inteligente. En 4.1 encapsulé un aire acondicionado con velocidades de ventilador. En 4.2 armé una clase base `Device` con herencia e interfaces para un sensor, un purificador y una báscula. En 4.3 agrupé los dispositivos por habitación con un gestor único y validé las entradas del usuario. | [04-proyecto-4.png](evidencias/04-proyecto-4.png) | [codigo/proyecto-4](codigo/proyecto-4) |
| Examen final | 11/11/2026 | Presenté el examen final del curso en la plataforma de Huawei y lo aprobé con 90 puntos (13 de 15 preguntas cerradas correctas). | [05-examen-final.png](evidencias/05-examen-final.png) | No aplica |

## Cangjie frente a TypeScript y Kotlin

Lo que más me llamó la atención de Cangjie es que se siente muy cercano a Kotlin, pero más estricto. Tiene tipos estáticos con inferencia (`let` y `var`), y en lugar de `null` usa `Option<T>`, así que hay que sacar el valor con `getOrThrow()` o con `match`; en Kotlin eso se resuelve con `?` y en TypeScript con `strictNullChecks`. Con las clases pasa algo parecido a Kotlin: no se puede heredar de una clase a menos que esté marcada como `open` o `abstract`, y las propiedades con `prop` llevan su get y set dentro de la propia clase. TypeScript, en cambio, usa tipos estructurales y es más flexible, pero sus tipos desaparecen al ejecutar. Las excepciones se manejan con `try`, `catch` y `finally` como en los otros dos, sin excepciones comprobadas. Para una app móvil usaría Kotlin si el destino es Android, y Cangjie si el destino es HarmonyOS, que es el sistema para el que Huawei lo está impulsando. TypeScript lo dejaría para apps híbridas, por ejemplo con React Native.
