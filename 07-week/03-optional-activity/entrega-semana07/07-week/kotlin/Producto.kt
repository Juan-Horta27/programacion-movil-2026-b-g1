/**
 * Semana 7 · Programación Móvil
 * Clase Producto con validación y manejo de nulos.
 *
 * Juan José Horta Vanegas — Ingeniería de Sistemas · CORHUILA
 */

class Producto(
    val nombre: String,          // val: el nombre no cambia después de crearlo
    val precio: Double,          // val: el precio tampoco
    val descripcion: String? = null   // String? : puede venir o no venir
) {

    /**
     * El bloque init se ejecuta al crear el objeto.
     * Si alguna condición no se cumple, el objeto nunca llega a existir.
     */
    init {
        require(nombre.isNotBlank()) {
            "El nombre del producto no puede estar vacío"
        }
        require(precio >= 0) {
            "El precio no puede ser negativo (se recibió: $precio)"
        }
    }

    /**
     * Llamada segura (?.) más operador Elvis (?:):
     * si descripcion es null, usa el texto de reemplazo en lugar de fallar.
     */
    fun resumen(): String {
        val detalle = descripcion ?: "sin descripción"
        return "$nombre | COP $precio | $detalle"
    }

    /**
     * Devuelve Int? porque si no hay descripción, no hay longitud que devolver.
     * El ?. evita el NullPointerException.
     */
    fun largoDescripcion(): Int? = descripcion?.length

    fun tieneDescripcion(): Boolean = descripcion != null
}


fun main() {

    println("=== Productos válidos ===")

    val guitarra = Producto(
        nombre = "Guitarra acústica",
        precio = 850000.0,
        descripcion = "Cuerdas de nylon, tapa en cedro"
    )

    val baquetas = Producto(
        nombre = "Baquetas 5A",
        precio = 45000.0
    )   // sin descripción: el parámetro queda en null

    val muestra = Producto(
        nombre = "Partitura de prueba",
        precio = 0.0,
        descripcion = "Material gratuito"
    )   // precio 0 es válido porque la regla es precio >= 0

    println(guitarra.resumen())
    println(baquetas.resumen())
    println(muestra.resumen())

    println()
    println("=== Manejo de nulos ===")
    println("Largo de la descripción de la guitarra: ${guitarra.largoDescripcion()}")
    println("Largo de la descripción de las baquetas: ${baquetas.largoDescripcion()}")
    println("¿Las baquetas tienen descripción? ${baquetas.tieneDescripcion()}")

    println()
    println("=== Validación: casos que fallan ===")

    try {
        Producto(nombre = "Metrónomo", precio = -15000.0)
    } catch (e: IllegalArgumentException) {
        println("Rechazado -> ${e.message}")
    }

    try {
        Producto(nombre = "   ", precio = 20000.0)
    } catch (e: IllegalArgumentException) {
        println("Rechazado -> ${e.message}")
    }
}
