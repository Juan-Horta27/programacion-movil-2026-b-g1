import std.collection.*
import std.convert.*
import std.env.*
import std.random.*

// Modo de ventilador con tres niveles
enum FanSpeed {
    LOW | MIDDLE | HIGH

    // Convierte el modo de ventilador a texto
    func toString(): String {
        match (this) {
            case LOW => "Low Speed"
            case MIDDLE => "Medium Speed"
            case HIGH => "High Speed"
        }
    }
}

// Entidad de negocio: dispositivo de aire acondicionado
class AirConditionerDevice {
    // Tipo de dispositivo (propiedad estática de solo lectura)
    static prop deviceType: String {
        get() { "AIR_CONDITIONER_DEVICE" }
    }

    // ID del dispositivo (encapsulado, no puede ser negativo ni cero al asignarlo)
    private var _deviceId: Int64
    mut prop deviceId: Int64 {
        get() { _deviceId }
        set(id) {
            if (id <= 0) {
                throw Exception("Device ID cannot be negative.")
            }
            _deviceId = id
        }
    }

    var deviceName: String
    var isOnline: Bool = false
    var isOpened: Bool = false
    var temperature: Float64
    var humidity: Float64

    // Temperatura objetivo (encapsulada, rango válido 16~28 °C)
    private var _targetTemperature: Int64
    mut prop targetTemperature: Int64 {
        get() { _targetTemperature }
        set(temperature) {
            if (temperature < 16) {
                throw Exception("Temperature cannot be lower than 16℃.")
            }
            if (temperature > 28) {
                throw Exception("Temperature cannot be higher than 28℃.")
            }
            _targetTemperature = temperature
        }
    }

    var fanSpeed: FanSpeed

    // Constructor
    init(deviceId: Int64, deviceName: String) {
        if (deviceId < 0) {
            throw Exception("Device ID cannot be negative.")
        }
        this._deviceId = deviceId
        this.deviceName = deviceName
        // Valores por defecto
        temperature = 0.0
        humidity = 0.0
        _targetTemperature = 25
        fanSpeed = FanSpeed.MIDDLE
    }

    // Conectar (solo si está encendido)
    func connect() {
        if (!isOpened) {
            return
        }
        isOnline = true
    }

    // Desconectar
    func disconnect() {
        isOnline = false
    }

    // Encender
    func open() {
        isOpened = true
        update()
    }

    // Apagar: se desconecta y se reinician temperatura y humedad
    func close() {
        isOpened = false
        isOnline = false
        temperature = 0.0
        humidity = 0.0
    }

    // Alternar encendido/apagado
    func togglePower() {
        if (isOpened) {
            close()
        } else {
            open()
        }
    }

    // Muestra el panel de información del dispositivo
    func displayStatues() {
        update()
        println("-------- ${deviceId} ${deviceName} --------")
        println("Connection Status: ${isOnline}")
        println("Current State: ${if (isOpened) { "On ${temperature.format("5.1")}℃ ${humidity.format("3.0")}%" } else { "Off" }}")
        println("Target Temperature: ${targetTemperature}℃")
        println("Fan Speed Mode: ${fanSpeed.toString()}")
    }

    // Simula datos en tiempo real (distribución gaussiana)
    func update() {
        if (isOpened) {
            temperature = Random().nextGaussianFloat64(mean: 28.0, sigma: 1.0)
            humidity = Random().nextGaussianFloat64(mean: 58.0, sigma: 15.0)
        }
    }

    // Cambia al siguiente nivel de ventilador
    func toggleFanSpeed() {
        fanSpeed = match (fanSpeed) {
            case LOW => MIDDLE
            case MIDDLE => HIGH
            case HIGH => LOW
        }
    }

    // Panel de control del dispositivo
    func operateByConsole() {
        while (true) {
            clearScreen()
            this.displayStatues()
            // Solo los dispositivos encendidos y conectados pueden controlar temperatura y ventilador
            if (this.isOpened && this.isOnline) {
                println("Operation: [1] Connect [2] Power [3] Temperature [4] Fan Speed [5] Exit")
                let order = getStdIn().readln() ?? ""
                match (order) {
                    case "1" =>
                        if (this.isOnline) {
                            this.disconnect()
                        } else {
                            this.connect()
                        }
                    case "2" => this.togglePower()
                    case "3" =>
                        print("Please enter the target temperature (16~28): ")
                        let tempStr = getStdIn().readln() ?? ""
                        try {
                            this.targetTemperature = Int64.parse(tempStr)
                        } catch (e: Exception) {
                            println("${e}")
                            print("Press Enter to continue.")
                            getStdIn().readln()
                        }
                    case "4" => this.toggleFanSpeed()
                    case "5" => break
                    case _ => println("Incorrect command input, please try again!")
                }
            } else {
                // Dispositivo apagado o desconectado: menú reducido
                println("Operation: [1]Connect [2]Power [3]Exit")
                let order = getStdIn().readln() ?? ""
                match (order) {
                    case "1" =>
                        if (this.isOnline) {
                            this.disconnect()
                        } else {
                            this.connect()
                        }
                    case "2" => this.togglePower()
                    case "3" => break
                    case _ => println("Incorrect command input, please try again!")
                }
            }
        }
    }
}

// Limpia la pantalla con secuencias ANSI (sustituye a la función en C del curso,
// así el programa corre con un solo archivo .cj)
func clearScreen() {
    print("\u{1b}[2J\u{1b}[H")
}

// Gestor de dispositivos (patrón singleton)
class AirConditionerManager {
    // Lista de dispositivos
    public let airconditioners = ArrayList<AirConditionerDevice>()

    // Constructor privado: crea dos equipos de ejemplo, encendidos y conectados
    private init() {
        let airConditioner01 = AirConditionerDevice(10001, "Living Room Air Conditioner")
        airConditioner01.open()
        airConditioner01.connect()
        airconditioners.add(airConditioner01)
        let airConditioner02 = AirConditionerDevice(10002, "Bedroom Air Conditioner")
        airConditioner02.open()
        airConditioner02.connect()
        airconditioners.add(airConditioner02)
    }

    // Instancia única
    private static let manager = AirConditionerManager()

    public static func getInstance() {
        manager
    }

    // Agregar dispositivo
    public func addAirConditionner(device: AirConditionerDevice) {
        this.airconditioners.add(device)
    }

    // Eliminar dispositivo por índice
    public func removeAirConditioner(index: Int64) {
        this.airconditioners.remove(at: index)
    }
}

main(): Int64 {
    let manager = AirConditionerManager.getInstance()
    while (true) {
        clearScreen()
        println("==============================")
        println("=====Smart Air Conditioner Device Management Software=====")
        println("==============================")
        println("Please enter command: [1]Configure Device [2]Add Device [3]Delete Device [4]Exit Software")
        match (getStdIn().readln() ?? "") {
            case "1" =>
                // Lista de dispositivos y selección
                for (i in 0..manager.airconditioners.size) {
                    let airconditioner = manager.airconditioners[i]
                    println("[${i + 1}]Device: ${airconditioner.deviceName}; ID: ${airconditioner.deviceId}")
                }
                print("Please enter the number:")
                let index = getStdIn().readln() ?? ""
                // Entra al panel del dispositivo elegido
                for (i in 0..manager.airconditioners.size) {
                    if (index == (i + 1).toString()) {
                        manager.airconditioners[i].operateByConsole()
                        break
                    }
                    if (i == manager.airconditioners.size - 1) {
                        println("Incorrect number, please try again!")
                        getStdIn().readln()
                    }
                }
            case "2" =>
                print("Please enter the device ID")
                let deviceId_str = getStdIn().readln() ?? ""
                try {
                    let deviceId = Int64.parse(deviceId_str)
                    print("Please enter the device name")
                    let deviceName = getStdIn().readln() ?? ""
                    manager.addAirConditionner(AirConditionerDevice(deviceId, deviceName))
                    println("Device added successfully! Press Enter to continue.")
                    getStdIn().readln()
                } catch (e: Exception) {
                    println("${e}")
                    getStdIn().readln()
                }
            case "3" =>
                for (i in 0..manager.airconditioners.size) {
                    let airconditioner = manager.airconditioners[i]
                    println("[${i + 1}] Device: ${airconditioner.deviceName}")
                }
                print("Please enter the serial number")
                let index = getStdIn().readln() ?? ""
                try {
                    let pos = Int64.parse(index) - 1
                    if (pos < 0 || pos >= manager.airconditioners.size) {
                        throw Exception("Incorrect number, please try again!")
                    }
                    manager.removeAirConditioner(pos)
                    println("Device deleted successfully! Press Enter to continue.")
                    getStdIn().readln()
                } catch (e: Exception) {
                    println("${e}")
                    getStdIn().readln()
                }
            case "4" => break
            case _ => println("Incorrect command input, please try again!")
        }
    }
    return 0
}
