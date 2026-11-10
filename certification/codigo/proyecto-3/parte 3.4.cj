import std.collection.*
import std.env.*
import std.convert.*
import std.time.*
import std.fs.*
import std.io.*
import std.sort.*

// Registro de transacción:
// (fecha, id máquina, región, hora, id producto, nombre producto,
//  precio unitario, cantidad, monto total, pago exitoso)
type TradeType = (String, Int64, String, String, String, String, Float64, Int64, Float64, Bool)
let rawdata = ArrayList<TradeType>() // datos leídos del CSV

main() {
    let csv_filename = "./smart_retail_sales.csv"
    println("Reading transaction data...")
    let res = readTradeFile(csv_filename)
    if (res && rawdata.size > 0) {
        println("Data read successfully, total number of transaction records: ${rawdata.size}.")
    } else {
        println("Data read failed.")
        return
    }
    while (true) {
        println("========Batch Data Processing System=======")
        println("Main menu: [1] Statistics by administrative region [2] Statistics by product [3] Statistics by month [4] Exit")
        let order = getStdIn().readln() ?? ""
        match (order) {
            // Cada opción es una tubería: filtrar -> agrupar -> ordenar -> imprimir
            case "1" => rawdata |> trade_success_filter |> analysis_by_location |> sortFun |> printResult
            case "2" => rawdata |> trade_success_filter |> analysis_by_good |> sortFun |> printResult
            case "3" => rawdata |> trade_success_filter |> analysis_by_month |> sortFun |> printResult
            case "4" => break
            case _ => println("Command input error, please re-enter!")
        }
    }
    return
}

// (1) Lectura del archivo línea por línea (streaming)
func readTradeFile(filename: String): Bool {
    try (fileStream = File(filename, OpenMode.Read)) {
        let startTime = DateTime.now()
        let reader = StringReader(fileStream)
        if (reader.readln().isNone()) { // encabezado
            return false
        }
        parseLine(reader)
        let usedTime = DateTime.now() - startTime
        println("A total of ${rawdata.size} records were parsed, using ${usedTime} time")
        return true
    } catch (e: Exception) {
        println("Failed to read file: ${e}")
        return false
    }
    return true
}

// (2) Análisis de cada línea y carga en rawdata
func parseLine(reader: StringReader<File>): Unit {
    var line = reader.readln()
    while (line.isSome()) {
        try {
            let lineStr = line.getOrThrow()
            let line_arr = lineStr.split(",")
            if (line_arr.size < 10) {
                throw Exception("Insufficient number of fields")
            }
            let id = safeParseInt64(line_arr[1])
            let price = safeParseFloat64(line_arr[6])
            let num = safeParseInt64(line_arr[7])
            let total = safeParseFloat64(line_arr[8])
            let status = line_arr[9] == "Success"
            rawdata.add((line_arr[0], id, line_arr[2], line_arr[3], line_arr[4], line_arr[5], price, num, total, status))
        } catch (e: Exception) {
            println("Error parsing data row: ${line}, Error: ${e}")
        }
        line = reader.readln()
    }
}

func safeParseInt64(str: String, defaultValue!: Int64 = 0): Int64 {
    try {
        Int64.parse(str)
    } catch (e: Exception) {
        defaultValue
    }
}

func safeParseFloat64(str: String, defaultValue!: Float64 = 0.0): Float64 {
    try {
        Float64.parse(str)
    } catch (e: Exception) {
        defaultValue
    }
}

// (3) Filtra solo las transacciones con pago exitoso (función de orden superior)
let trade_success_filter = filter<TradeType>({ trade => trade[9] })

// (4) Estadística por región: (región, ventas, monto)
let analysis_by_location: (Iterator<TradeType>) -> ArrayList<(String, Int64, Float64)> = { trades =>
    let location_analysis = ArrayList<(String, Int64, Float64)>()
    for (trade in trades) {
        var isExisted = false
        for (i in 0..location_analysis.size) {
            if (location_analysis[i][0] == trade[2]) {
                let location = (location_analysis[i][0], location_analysis[i][1] + trade[7], location_analysis[i][2] + trade[8])
                location_analysis[i] = location
                isExisted = true
                break
            }
        }
        if (!isExisted) { // si no existe, se agrega la región
            location_analysis.add((trade[2], trade[7], trade[8]))
        }
    }
    return location_analysis
}

// (5) Estadística por producto: (producto, ventas, monto)
let analysis_by_good: (Iterator<TradeType>) -> ArrayList<(String, Int64, Float64)> = { trades =>
    let goods_analysis = ArrayList<(String, Int64, Float64)>()
    for (trade in trades) {
        var isExisted = false
        for (i in 0..goods_analysis.size) {
            if (goods_analysis[i][0] == trade[5]) {
                let good = (goods_analysis[i][0], goods_analysis[i][1] + trade[7], goods_analysis[i][2] + trade[8])
                goods_analysis[i] = good
                isExisted = true
                break
            }
        }
        if (!isExisted) { // si no existe, se agrega el producto
            goods_analysis.add((trade[5], trade[7], trade[8]))
        }
    }
    return goods_analysis
}

// (6) Estadística por mes: (mes, ventas, monto)
let analysis_by_month: (Iterator<TradeType>) -> ArrayList<(String, Int64, Float64)> = { trades =>
    let month_analysis = ArrayList<(String, Int64, Float64)>()
    for (trade in trades) {
        let datetime = DateTime.parse(trade[0], "yyyy-MM-dd")
        let month = "${datetime.month.toInteger()}month"
        var isExisted = false
        for (i in 0..month_analysis.size) {
            if (month_analysis[i][0] == month) {
                let m = (month_analysis[i][0], month_analysis[i][1] + trade[7], month_analysis[i][2] + trade[8])
                month_analysis[i] = m
                isExisted = true
                break
            }
        }
        if (!isExisted) { // si no existe, se agrega el mes
            month_analysis.add((month, trade[7], trade[8]))
        }
    }
    return month_analysis
}

// (7) Ordenamiento general: monto total de mayor a menor
let sortFun: (ArrayList<(String, Int64, Float64)>) -> Array<(String, Int64, Float64)> = { analysis_res =>
    var res_arr = analysis_res.toArray()
    sort<(String, Int64, Float64)>(res_arr, by: { rht, lht =>
        if (rht[2] < lht[2]) {
            return Ordering.GT
        } else {
            return Ordering.LT
        }
    }, stable: true, descending: true)
    res_arr
}

// (8) Impresión con gráfico de barras simulado
let printResult: (Array<(String, Int64, Float64)>) -> Unit = { analysis =>
    println("===== Transaction Information Statistics =====")
    for (element in analysis) {
        if (element[0].toRuneArray().size - 1 < 4) {
            print(" " * (4 - element[0].toRuneArray().size + 1))
        }
        println("${element[0]}  Sales:${element[1].format("6")}  Total Transaction Amount:${element[2].format("9.2")} Yuan")
        let length = Int64(element[2] / 30000.0)
        println("█" * length) // simula un gráfico de barras
    }
}
