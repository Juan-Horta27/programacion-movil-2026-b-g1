// Proyecto 4 - Tarea 4.2: Extensión de objetos de negocio
// Jerarquía: Device -> ChargeableDevice -> SensorDevice / BodyFatScaleDevice
//            Device -> AirPurifierDevice (con interfaces Openable, TemperatureMonitoring, HumidityMonitoring)
// Para compilar: cjc "parte 4.2.cj" -o tarea4_2

import std.random.*
import std.convert.*
import std.env.*

// ======================= Interfaces =======================

// Dispositivos que se pueden encender / apagar
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

// ======================= Clase base =======================

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

    // Conectar: si el dispositivo se puede encender, debe estar encendido antes
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
}

// ======================= Dispositivos con batería =======================

public abstract class ChargeableDevice <: Device {
    public redef static prop deviceType: String {
        get() { "CHARGEABLE_DEVICE" }
    }

    protected var batteryPercentage: UInt8 = 100

    public init(deviceId: Int64, deviceName: String) {
        super(deviceId, deviceName)
    }

    public init(deviceId: Int64, deviceName: String, batteryPercentage: UInt8) {
        super(deviceId, deviceName)
        this.batteryPercentage = batteryPercentage
    }

    public func showBatteryInformation(): Unit
}

// ======================= Sensor de temperatura y humedad =======================

public class SensorDevice <: ChargeableDevice & TemperatureMonitoring & HumidityMonitoring {
    public redef static prop deviceType: String {
        get() { "SENSOR_DEVICE" }
    }

    private var _humidity: Float64 = 0.0
    private var _temperature: Float64 = 0.0

    public prop humidity: Float64 {
        get() { _humidity }
    }

    public prop temperature: Float64 {
        get() { _temperature }
    }

    public init(deviceId: Int64, deviceName: String) {
        super(deviceId, deviceName)
        _temperature = Random().nextGaussianFloat64(mean: 28.0, sigma: 1.0)
        _humidity = Random().nextGaussianFloat64(mean: 50.0, sigma: 15.0)
    }

    public func update(): Unit {
        if (!isOnline) {
            return
        }
        _temperature = Random().nextGaussianFloat64(mean: 28.0, sigma: 1.0)
        _humidity = Random().nextGaussianFloat64(mean: 50.0, sigma: 15.0)
        // Simula el consumo de batería
        if (batteryPercentage > 0) {
            batteryPercentage--
        }
    }

    public func showBatteryInformation(): Unit {
        println("Current battery level: ${batteryPercentage}%")
    }

    public func displayStatues(): Unit {
        update()
        println("---------- ${deviceId} ${deviceName} ----------")
        println("Connection status: ${isOnline}")
        showBatteryInformation()
        println("Current status: ${temperature.format("5.1")}℃ ${humidity.format("3.0")}%")
    }
}

// ======================= Báscula de grasa corporal =======================

public class BodyFatScaleDevice <: ChargeableDevice {
    public redef static prop deviceType: String {
        get() { "BODY_FAT_SCALE_DEVICE" }
    }

    public init(deviceId: Int64, deviceName: String) {
        super(deviceId, deviceName)
    }

    // Devuelve (peso, IMC); (None, None) si el dispositivo está desconectado
    public func measure(): (Option<Float64>, Option<Float64>) {
        if (!isOnline) {
            return (None, None)
        }
        let weight = Random().nextGaussianFloat64(mean: 60.0, sigma: 15.0)
        let bmi = Random().nextGaussianFloat64(mean: 20.0, sigma: 2.0)
        // Simula el consumo de batería
        if (batteryPercentage > 0) {
            batteryPercentage--
        }
        return (weight, bmi)
    }

    public func showBatteryInformation(): Unit {
        println(if (batteryPercentage > 20) { "Battery is sufficient." } else { "Low battery, please recharge in time." })
    }

    public func displayStatues(): Unit {
        println("---------- ${deviceId} ${deviceName} ----------")
        showBatteryInformation()
        println("Connection status: ${isOnline}")
    }
}

// ======================= Purificador de aire =======================

public class AirPurifierDevice <: Device & Openable & TemperatureMonitoring & HumidityMonitoring {
    public redef static prop deviceType: String {
        get() { "AIR_PURIFIER_DEVICE" }
    }

    private var _humidity: Float64 = 0.0
    private var _temperature: Float64 = 0.0
    private var _isOpened: Bool = false
    private var _pm25: Float64 = 0.0

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

    // Encender no implica estar conectado
    public func open(): Unit {
        _isOpened = true
        _temperature = Random().nextGaussianFloat64(mean: 28.0, sigma: 1.0)
        _humidity = Random().nextGaussianFloat64(mean: 50.0, sigma: 15.0)
        _pm25 = Random().nextGaussianFloat64(mean: 30.0, sigma: 10.0)
    }

    public func close(): Unit {
        _isOpened = false
    }

    public func togglePower(): Unit {
        if (_isOpened) {
            close()
        } else {
            open()
        }
    }

    public func update(): Unit {
        // Si está apagado o desconectado no se actualiza nada
        if (!_isOpened || !isOnline) {
            return
        }
        _temperature = Random().nextGaussianFloat64(mean: 28.0, sigma: 1.0)
        _humidity = Random().nextGaussianFloat64(mean: 50.0, sigma: 15.0)
        _pm25 = Random().nextGaussianFloat64(mean: 30.0, sigma: 10.0)
    }

    public func displayStatues(): Unit {
        update()
        println("---------- ${deviceId} ${deviceName} ----------")
        println("Connection Status: ${isOnline}")
        if (isOpened) {
            println("Current Status: Powered On - PM2.5: ${pm25.format("5.1")}μg/m³ ${temperature.format("5.1")}℃ ${humidity.format("3.0")}%")
        } else {
            println("Current Status: Powered Off")
        }
    }
}

// ======================= Programa principal =======================

// Limpia la pantalla con una secuencia ANSI (sustituye a la función C del curso)
func clearScreen() {
    print("\u{1b}[2J\u{1b}[H")
}

let sensor = SensorDevice(1001, "My temperature and humidity sensor")
let airPurifier = AirPurifierDevice(1002, "My air purifier")
let bodyFatScale = BodyFatScaleDevice(1003, "My body fat scale")

func operateSensor() {
    while (true) {
        clearScreen()
        sensor.displayStatues()
        println("Operation: [1] Connect [2] Update [3] Return")
        let order = getStdIn().readln() ?? ""
        match (order) {
            case "1" =>
                if (sensor.isOnline) {
                    sensor.disconnect()
                } else {
                    sensor.connect()
                }
            case "2" => sensor.update()
            case "3" => break
            case _ => println("Invalid command input, please try again!")
        }
    }
}

func operateAirPurifier() {
    while (true) {
        clearScreen()
        airPurifier.displayStatues()
        println("Operation: [1] Connect [2] Power [3] Update [4] Return")
        let order = getStdIn().readln() ?? ""
        match (order) {
            case "1" =>
                if (airPurifier.isOnline) {
                    airPurifier.disconnect()
                } else {
                    airPurifier.connect()
                }
            case "2" => airPurifier.togglePower()
            case "3" => airPurifier.update()
            case "4" => break
            case _ => println("Invalid command input, please try again!")
        }
    }
}

func operateBodyFatScale() {
    var weightText = "--"
    var bmiText = "--"
    while (true) {
        clearScreen()
        bodyFatScale.displayStatues()
        println("Last measurement: weight ${weightText} kg, BMI ${bmiText}")
        println("Operation: [1] Connect [2] Measure weight and BMI [3] Return")
        let order = getStdIn().readln() ?? ""
        match (order) {
            case "1" =>
                if (bodyFatScale.isOnline) {
                    bodyFatScale.disconnect()
                } else {
                    bodyFatScale.connect()
                }
            case "2" =>
                let (weight, bmi) = bodyFatScale.measure()
                match (weight) {
                    case Some(w) => weightText = w.format("5.1")
                    case None => weightText = "--"
                }
                match (bmi) {
                    case Some(b) => bmiText = b.format("4.1")
                    case None => bmiText = "--"
                }
            case "3" => break
            case _ => println("Invalid command input, please try again!")
        }
    }
}

main(): Int64 {
    // Se arrancan y conectan los dispositivos
    sensor.connect()
    airPurifier.open()
    airPurifier.connect()
    bodyFatScale.connect()

    while (true) {
        clearScreen()
        println("===== Smart Device Management Software =====")

        // Estado general de todos los dispositivos
        sensor.displayStatues()
        airPurifier.displayStatues()
        bodyFatScale.displayStatues()

        println("Select device: [1] Temperature and humidity sensor [2] Air purifier [3] Body fat scale [4] Exit software")

        let order = getStdIn().readln() ?? ""
        match (order) {
            case "1" => operateSensor()
            case "2" => operateAirPurifier()
            case "3" => operateBodyFatScale()
            case "4" => break
            case _ => println("Command input error, please re-enter!")
        }
    }
    return 0
}
