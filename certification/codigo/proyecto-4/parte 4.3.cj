// Proyecto 4 - Tarea 4.3: Refactorización de objetos de negocio
// Software de gestión de dispositivos del hogar inteligente por habitaciones.
// Se aplica polimorfismo (Device.displayStatues / Device.operate) y genéricos (Utils.inputInfo<T>).
// Para compilar: cjc "parte 4.3.cj" -o tarea4_3

import std.collection.*
import std.convert.*
import std.random.*
import std.env.*

// ======================= Interfaces =======================

public interface Openable {
    prop isOpened: Bool
    func open(): Unit
    func close(): Unit
    func togglePower(): Unit
}

public interface TemperatureMonitoring {
    prop temperature: Float64
    func update(): Unit
}

public interface HumidityMonitoring {
    prop humidity: Float64
    func update(): Unit
}

// ======================= Utilidades genéricas =======================

public class Utils {
    // Lee una entrada y la convierte al tipo T; permite 3 intentos
    public static func inputInfo<T>(): T where T <: Parsable<T> {
        var retryNum = 3
        while (retryNum != 0) {
            let input = getStdIn().readln() ?? ""
            let value = T.tryParse(input)
            if (value.isSome()) {
                return value.getOrThrow()
            } else {
                print("Input error, please re-enter:")
            }
            retryNum--
        }
        throw Exception("Input error exceeded 3 times, entry cancelled!")
    }

    // Igual que la anterior pero el valor debe estar en el rango [min, max]
    public static func inputInfo<T>(min: T, max: T): T where T <: Parsable<T> & Comparable<T> {
        var retryNum = 3
        while (retryNum != 0) {
            let input = getStdIn().readln() ?? ""
            let value = T.tryParse(input)
            if (value.isSome()) {
                if (value.getOrThrow() < min || value.getOrThrow() > max) {
                    print("Value out of range, please re-enter:")
                    retryNum--
                    continue
                }
                return value.getOrThrow()
            } else {
                print("Input error, please re-enter:")
            }
            retryNum--
        }
        throw Exception("Input error exceeded 3 times, entry cancelled!")
    }
}

// Limpia la pantalla con una secuencia ANSI (sustituye a la función C del curso)
func clearScreen() {
    print("\u{1b}[2J\u{1b}[H")
}

// ======================= Dispositivo base =======================

public open class Device {
    public static prop deviceType: String {
        get() { "DEVICE" }
    }

    private var _deviceId: Int64 = 0
    public mut prop deviceId: Int64 {
        get() { _deviceId }
        set(value) {
            if (value <= 0) {
                throw Exception("Device ID cannot be negative")
            }
            _deviceId = value
        }
    }

    protected var deviceName: String
    private var _isOnline: Bool = false

    public prop isOnline: Bool {
        get() { _isOnline }
    }

    public init(deviceId: Int64, deviceName: String) {
        this.deviceName = deviceName
        this.deviceId = deviceId
    }

    public func connect(): Unit {
        if (this is Openable) {
            let openable = (this as Openable).getOrThrow()
            if (!openable.isOpened) {
                return
            }
        }
        _isOnline = true
    }

    public func disconnect(): Unit {
        _isOnline = false
    }

    // Mostrar estado: las subclases lo sobrescriben
    public open func displayStatues(): Unit {
        println("statues displaying is not implemented!")
    }

    // Panel de operación: las subclases lo sobrescriben
    public open func operate(): Unit {
        println("operating is not implemented!")
    }

    public func getName(): String {
        return deviceName
    }
}

// ======================= Purificador de aire =======================

public class AirPurifierDevice <: Device & Openable & TemperatureMonitoring & HumidityMonitoring {
    public redef static prop deviceType: String {
        get() { "AIR_PURIFIER_DEVICE" }
    }

    private var _humidity: Float64 = 0.0
    private var _temperature: Float64 = 0.0
    private var _pm25: Float64 = 0.0
    private var _isOpened: Bool = false

    public prop humidity: Float64 {
        get() { _humidity }
    }

    public prop temperature: Float64 {
        get() { _temperature }
    }

    public prop isOpened: Bool {
        get() { _isOpened }
    }

    public prop pm25: Float64 {
        get() { _pm25 }
    }

    public init(deviceId: Int64, deviceName: String) {
        super(deviceId, deviceName)
    }

    public func open(): Unit {
        _isOpened = true
        _temperature = Random().nextGaussianFloat64(mean: 28.0, sigma: 1.0)
        _humidity = Random().nextGaussianFloat64(mean: 50.0, sigma: 15.0)
        _pm25 = Random().nextGaussianFloat64(mean: 30.0, sigma: 10.0)
    }

    // Vinculación de estado: al apagar, el dispositivo se desconecta solo
    public func close(): Unit {
        _isOpened = false
        disconnect()
    }

    public func togglePower(): Unit {
        if (_isOpened) {
            close()
        } else {
            open()
        }
    }

    public func update(): Unit {
        if (!_isOpened || !isOnline) {
            return
        }
        _temperature = Random().nextGaussianFloat64(mean: 28.0, sigma: 1.0)
        _humidity = Random().nextGaussianFloat64(mean: 50.0, sigma: 15.0)
        _pm25 = Random().nextGaussianFloat64(mean: 30.0, sigma: 10.0)
    }

    public override func displayStatues(): Unit {
        update()
        println("---------- ${deviceId} ${deviceName} ----------")
        println("Connection status: ${isOnline}")
        if (isOpened) {
            println("Current status: On PM2.5: ${pm25.format("5.1")}μg/m³ ${temperature.format("5.1")}℃ ${humidity.format("3.0")}%")
        } else {
            println("Current status: Off")
        }
    }

    public override func operate(): Unit {
        while (true) {
            clearScreen()
            displayStatues()
            println("Operations: [1] Connect [2] Power [3] Update [4] Back")
            let order = getStdIn().readln() ?? ""
            match (order) {
                case "1" =>
                    if (isOnline) {
                        disconnect()
                    } else {
                        connect()
                    }
                case "2" => togglePower()
                case "3" => update()
                case "4" => break
                case _ => println("Invalid command input, please try again!")
            }
        }
    }
}

// ======================= Aire acondicionado =======================

public enum FanSpeed {
    | LOW
    | MIDDLE
    | HIGH

    public func toString(): String {
        match (this) {
            case LOW => "Low Speed"
            case MIDDLE => "Medium Speed"
            case HIGH => "High Speed"
        }
    }
}

public class AirConditionerDevice <: Device & Openable & TemperatureMonitoring & HumidityMonitoring {
    public redef static prop deviceType: String {
        get() { "AIR_CONDITIONER_DEVICE" }
    }

    private var _humidity: Float64 = 0.0
    private var _temperature: Float64 = 0.0
    private var _isOpened: Bool = false
    private var _targetTemperature: Int64 = 25
    var fanSpeed: FanSpeed = FanSpeed.MIDDLE

    public prop humidity: Float64 {
        get() { _humidity }
    }

    public prop temperature: Float64 {
        get() { _temperature }
    }

    public prop isOpened: Bool {
        get() { _isOpened }
    }

    public mut prop targetTemperature: Int64 {
        get() { _targetTemperature }
        set(value) {
            if (value < 16) {
                throw Exception("Temperature cannot be lower than 16℃.")
            }
            if (value > 28) {
                throw Exception("Temperature cannot be higher than 28℃.")
            }
            _targetTemperature = value
        }
    }

    public init(deviceId: Int64, deviceName: String) {
        super(deviceId, deviceName)
        _targetTemperature = 25
        fanSpeed = FanSpeed.MIDDLE
    }

    public func toggleFanSpeed(): Unit {
        fanSpeed = match (fanSpeed) {
            case LOW => FanSpeed.MIDDLE
            case MIDDLE => FanSpeed.HIGH
            case HIGH => FanSpeed.LOW
        }
    }

    public func open(): Unit {
        _isOpened = true
        update()
    }

    public func close(): Unit {
        _isOpened = false
        disconnect()
    }

    public func togglePower(): Unit {
        if (_isOpened) {
            close()
        } else {
            open()
        }
    }

    public func update(): Unit {
        if (!_isOpened) {
            return
        }
        _temperature = Random().nextGaussianFloat64(mean: 28.0, sigma: 1.0)
        _humidity = Random().nextGaussianFloat64(mean: 58.0, sigma: 15.0)
    }

    public override func displayStatues(): Unit {
        update()
        println("---------- ${deviceId} ${deviceName} ----------")
        println("Connection status: ${isOnline}")
        if (isOpened) {
            println("Current status: On ${temperature.format("5.1")}℃ ${humidity.format("3.0")}%")
            println("Target temperature: ${targetTemperature}℃  Fan mode: ${fanSpeed}")
        } else {
            println("Current status: Off")
        }
    }

    public override func operate(): Unit {
        while (true) {
            clearScreen()
            displayStatues()
            // Con el aparato apagado o sin conexión no se puede configurar nada
            if (isOpened && isOnline) {
                println("Operation: [1]Connect [2]Power [3]Temperature [4]Fan Speed [5]Exit")
            } else {
                println("Operation: [1]Connect [2]Power [5]Exit")
            }
            let order = getStdIn().readln() ?? ""
            match (order) {
                case "1" =>
                    if (isOnline) {
                        disconnect()
                    } else {
                        connect()
                    }
                case "2" => togglePower()
                case "3" =>
                    if (isOpened && isOnline) {
                        print("Enter target temperature (16-28):")
                        try {
                            targetTemperature = Utils.inputInfo<Int64>(16, 28)
                        } catch (e: Exception) {
                            println(e.message)
                        }
                    } else {
                        println("Device is offline, configuration is disabled.")
                    }
                case "4" =>
                    if (isOpened && isOnline) {
                        toggleFanSpeed()
                    } else {
                        println("Device is offline, configuration is disabled.")
                    }
                case "5" => break
                case _ => println("Invalid command input, please try again!")
            }
        }
    }
}

// ======================= Habitación =======================

public enum RoomType {
    | LIVING_ROOM
    | BED_ROOM

    public func toString(): String {
        match (this) {
            case LIVING_ROOM => "Living Room"
            case BED_ROOM => "Bedroom"
        }
    }
}

public class Room {
    protected var roomId: Int64
    protected var roomName: String
    protected var roomType: RoomType
    protected let devices: ArrayList<Device> = ArrayList<Device>()

    public init(roomId: Int64, roomName: String, roomType: RoomType) {
        this.roomId = roomId
        this.roomName = roomName
        this.roomType = roomType
    }

    public func getRoomId(): Int64 {
        return roomId
    }

    public func getRoomName(): String {
        return roomName
    }

    public func getRoomType(): RoomType {
        return roomType
    }

    public func getDevices(): ArrayList<Device> {
        return devices
    }

    public prop devicesCount: Int64 {
        get() { devices.size }
    }

    // Humedad: la del primer dispositivo conectado que mida humedad
    public prop humidity: Option<Float64> {
        get() {
            var res = Option<Float64>.None
            for (device in devices) {
                if (device is HumidityMonitoring && device.isOnline) {
                    let humiDev = (device as HumidityMonitoring).getOrThrow()
                    res = humiDev.humidity
                    break
                }
            }
            res
        }
    }

    // Temperatura: la del primer dispositivo conectado que mida temperatura
    public prop temperature: Option<Float64> {
        get() {
            var res = Option<Float64>.None
            for (device in devices) {
                if (device is TemperatureMonitoring && device.isOnline) {
                    let tempDev = (device as TemperatureMonitoring).getOrThrow()
                    res = tempDev.temperature
                    break
                }
            }
            res
        }
    }

    public func addDevice(device: Device): Unit {
        devices.add(device)
    }

    public func removeDeviceById(deviceId: Int64): Unit {
        devices.removeIf({ device: Device => deviceId == device.deviceId })
    }

    // Encender todos los dispositivos que se puedan encender
    public func openAllDevices(): Unit {
        for (device in devices) {
            if (device is Openable) {
                (device as Openable).getOrThrow().open()
            }
        }
    }

    // Conectar todos los dispositivos (el polimorfismo evita distinguir tipos)
    public func connectAllDevices(): Unit {
        for (device in devices) {
            device.connect()
        }
    }

    // Apagar todos (al apagar, cada uno se desconecta)
    public func closeAllDevices(): Unit {
        for (device in devices) {
            if (device is Openable) {
                (device as Openable).getOrThrow().close()
            }
        }
    }
}

// ======================= Gestor de habitaciones (singleton) =======================

public class RoomManager {
    public let rooms: ArrayList<Room>

    // El constructor es privado para que solo exista una instancia
    private init() {
        rooms = ArrayList<Room>()
        let room1 = Room(2001, "My Bedroom", RoomType.BED_ROOM)
        room1.addDevice(AirPurifierDevice(1001, "Bedroom Air Purifier"))
        room1.addDevice(AirConditionerDevice(1002, "Bedroom Air Conditioner"))
        rooms.add(room1)

        let room2 = Room(2002, "My Living Room", RoomType.LIVING_ROOM)
        room2.addDevice(AirConditionerDevice(2001, "Living Room Air Conditioner"))
        room2.addDevice(AirPurifierDevice(2002, "Living Room Air Purifier"))
        rooms.add(room2)
    }

    private static let instance: RoomManager = RoomManager()

    public static func getInstance(): RoomManager {
        return instance
    }
}

// ======================= Programa principal =======================

// Muestra temperatura y humedad de una habitación (o "--" si no hay datos)
func environmentText(room: Room): String {
    let temp = match (room.temperature) {
        case Some(t) => "${t.format("5.1")}℃"
        case None => "--"
    }
    let humi = match (room.humidity) {
        case Some(h) => "${h.format("3.0")}%"
        case None => "--"
    }
    return "Temperature: ${temp}  Humidity: ${humi}"
}

// Panel de control de una habitación
func manageDevice(room: Room) {
    while (true) {
        clearScreen()
        println("===== ${room.getRoomName()} (${room.getRoomType()}) =====")
        println(environmentText(room))
        println("Devices: ${room.devicesCount}")

        // Lista de dispositivos con su estado (polimorfismo)
        let devices = room.getDevices()
        for (device in devices) {
            device.displayStatues()
        }

        println("Select device:")
        for (i in 0..devices.size) {
            println("[${i + 1}] ${devices[i].getName()}")
        }
        println("[${devices.size + 1}] Turn on and connect all devices")
        println("[${devices.size + 2}] Turn off all devices")
        println("[${devices.size + 3}] Back")

        try {
            let order = Utils.inputInfo<Int64>(1, devices.size + 3)
            if (order <= devices.size) {
                // El panel de cada dispositivo se resuelve por polimorfismo
                devices[order - 1].operate()
            } else if (order == devices.size + 1) {
                room.openAllDevices()
                room.connectAllDevices()
            } else if (order == devices.size + 2) {
                room.closeAllDevices()
            } else {
                break
            }
        } catch (e: Exception) {
            println(e.message)
            break
        }
    }
}

main(): Int64 {
    let manager = RoomManager.getInstance()

    // Inicialización: todos los dispositivos de todas las habitaciones encendidos y conectados
    for (room in manager.rooms) {
        room.openAllDevices()
        room.connectAllDevices()
    }

    while (true) {
        clearScreen()
        println("===== Smart Home Device Management Software =====")
        let rooms = manager.rooms
        for (i in 0..rooms.size) {
            let room = rooms[i]
            println("[${i + 1}] ID: ${room.getRoomId()}  ${room.getRoomName()}  Devices: ${room.devicesCount}  ${environmentText(room)}")
        }
        println("[${rooms.size + 1}] Exit software")
        println("Select room:")

        try {
            let order = Utils.inputInfo<Int64>(1, rooms.size + 1)
            if (order == rooms.size + 1) {
                break
            }
            manageDevice(rooms[order - 1])
        } catch (e: Exception) {
            println(e.message)
        }
    }
    return 0
}
