import std.collection.*
import std.env.*
import std.convert.*
import std.time.*
import std.fs.*
import std.io.*
import std.sort.*

// Alias que representa cada registro de transacción:
// (fecha, id máquina, región, hora, id producto, nombre producto,
//  precio unitario, cantidad, monto total, pago exitoso)
type TradeType = (String, Int64, String, String, String, String, Float64, Int64, Float64, Bool)
let rawdata = ArrayList<TradeType>() // datos sin limpiar
let trades = ArrayList<TradeType>() // datos limpios

main() {
    let csv_filename = "./smart_retail_sales.csv" // ruta del archivo
    let res = readTradeFile(csv_filename)
    if (res) {
        println("Data read successfully, number of records read: ${rawdata.size}.")
    } else {
        println("Data read failed.")
        return
    }
    while (true) {
        println("=======Batch Data Processing System=======")
        println("Function menu: [1] Data Display [2] Data Cleaning [3] Data Statistics (by Region) [4] Exit")
        let order = getStdIn().readln() ?? ""
        match (order) {
            case "1" => showSomeData() // muestra algunos registros
            case "2" => FilterByPayStatus() // limpieza de datos
            case "3" => analysis_by_location() // estadística por región
            case "4" => break // salir
            case _ => println("Command input error, please re-enter!")
        }
    }
    return
}

func readTradeFile(filename: String): Bool {
    try (fileStream = File(filename, OpenMode.Read)) {
        println("Reading file...")
        let bytes = File.readFrom(filename)
        let startTime = DateTime.now()
        // Analiza cada campo de la transacción línea por línea
        let count = parseLine(bytes)
        let stopTime = DateTime.now()
        let usedTime = stopTime - startTime
        println("--Parsed ${count} records in total, time used: ${usedTime}")
        return true
    } catch (e: Exception) {
        println("Failed to read file: ${e}")
        return false
    }
    return true
}

func parseLine(bytes: Array<Byte>): Int64 {
    let byteArrayStream = ByteBuffer()
    byteArrayStream.write(bytes)
    let stringReader = StringReader(byteArrayStream)
    if (stringReader.readln().isNone()) { // lee la línea de encabezado
        return 0
    }
    var count = 0 // contador de registros
    var line = stringReader.readln()
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
            count++
            rawdata.add((line_arr[0], id, line_arr[2], line_arr[3], line_arr[4], line_arr[5], price, num, total, status))
        } catch (e: Exception) {
            println("Error parsing data row: ${line}, Error: ${e}")
        }
        line = stringReader.readln()
    }
    return count
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

func showSomeData() {
    println("Transaction Date\tID\tRegion\tTransaction Timestamp\tProduct ID\tProduct Name\tUnit Price\tQuantity\tTotal Amount\tPayment Status")
    for (i in 0..5) {
        println("${rawdata[i][0]}\t${rawdata[i][1]}\t${rawdata[i][2]}\t${rawdata[i][3]}\t${rawdata[i][4]}\t${rawdata[i][5].padStart(15)}\t${rawdata[i][6].format(".2")}\t${rawdata[i][7]}\t${rawdata[i][8].format(".2")}\t${rawdata[i][9]}")
    }
}

func FilterByPayStatus() {
    trades.clear() // evita duplicar registros si se limpia más de una vez
    var count = 0
    var success_count = 0 // pagos exitosos
    var failed_count = 0 // pagos fallidos
    for (data in rawdata) {
        count++
        if (data[9]) {
            success_count++
            trades.add(data) // guarda los pagos exitosos en trades
        } else {
            failed_count++
        }
    }
    println("Total transactions: ${count} Successful: ${success_count} Failed: ${failed_count}")
}

func analysis_by_location() {
    if (trades.size == 0) {
        println("Please perform data cleaning first\n")
        return
    }
    let location_analysis = trades_analysis_by_amount() // suma de ventas por región
    // Orden descendente por monto total
    sort<(String, Int64, Float64)>(location_analysis, by: {a, b => a[2].compare(b[2])}, stable: true, descending: true)
    println("=====Transaction Information by Region=====")
    for (location in location_analysis) {
        print("${location[0]} Sales:${location[1].format("6")} Total Amount:${location[2].format("6.2")} RMB ")
        let length = Int64(location[2] / 30000.0)
        println("█" * length)
    }
}

func trades_analysis_by_amount(): ArrayList<(String, Int64, Float64)> {
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
        if (!isExisted) { // si la región no existe, se agrega
            location_analysis.add((trade[2], trade[7], trade[8]))
        }
    }
    return location_analysis
}
