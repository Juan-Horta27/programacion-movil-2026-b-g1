import std.collection.*
import std.env.*
import std.convert.*

// Vending machine ArrayList, tuples contain (machine ID: Int64, location: String)
let devices = ArrayList<(Int64, String)>()
// Device IDs already exist in the system
let deviceIDs = HashSet<Int64>()

// ---------- Reused from Task 3.1 ----------
enum District {
    | Dongcheng
    | Xicheng
    | Haidian
    | Chaoyang
    | Fengtai

    func toString(): String {
        match (this) {
            case District.Dongcheng => "Dongcheng District"
            case District.Xicheng => "Xicheng District"
            case District.Haidian => "Haidian District"
            case District.Chaoyang => "Chaoyang District"
            case District.Fengtai => "Fengtai District"
        }
    }
}

func inputDeviceID(): Int64 {
    var id: Int64 = 0
    while (true) {
        print("Please enter the machine ID (1000~1100): ")
        let input = getStdIn().readln().getOrThrow()
        try {
            let temp = Int64.parse(input)
            if (temp > 1100 || temp < 1000) {
                throw Exception("Machine ID input error, please re-enter!")
            } else {
                id = temp
            }
        } catch (e: Exception) {
            println("${e}")
            continue
        }
        break
    }
    return id
}

func inputDistrict(): District {
    var district: District = District.Dongcheng
    while (true) {
        print("Enter location (Dongcheng, Xicheng, Haidian, Chaoyang, Fengtai): ")
        var input = getStdIn().readln() ?? ""
        district = match (input) {
            case "Dongcheng" => District.Dongcheng
            case "Xicheng" => District.Xicheng
            case "Haidian" => District.Haidian
            case "Chaoyang" => District.Chaoyang
            case "Fengtai" => District.Fengtai
            case _ =>
                println("Location input error, please re-enter!")
                continue
        }
        break
    }
    return district
}
// ------------------------------------------

func printDevices() {
    println("Total number of devices: ${devices.size}")
    for (device in devices) {
        println("Machine ID: ${device[0]}, Location: ${device[1]}")
    }
}

func addDevice() {
    var id: Int64 = inputDeviceID()
    while (deviceIDs.contains(id)) {
        println("ID is duplicated, please re-enter!")
        id = inputDeviceID()
    }
    // Add the machine ID to the deviceIDs set
    deviceIDs.add(id)
    let location = inputDistrict().toString()
    devices.add((id, location))
    println("Entry successful, Machine ID: ${id}, ${location}")
}

func removeDevices() {
    print("Please enter the device ID.")
    var id = inputDeviceID()
    for (i in 0..devices.size) {
        if (id == devices[i][0]) {
            devices.remove(at: i)
            deviceIDs.remove(id)
            println("Device ${id} information deleted successfully!")
            return
        }
    }
    println("Device ${id} does not exist!")
}

func updateDevices() {
    print("Device information update!")
    var id = inputDeviceID()
    for (i in 0..devices.size) {
        if (id == devices[i][0]) {
            print("Update device location!")
            var district = inputDistrict().toString()
            devices[i] = (id, district)
            return
        }
    }
    println("Device ${id} does not exist!")
}

func selectDevices() {
    var num: Int64 = 0
    var district = inputDistrict().toString()
    for (i in 0..devices.size) {
        if (district == devices[i][1]) {
            println("Device ID: ${devices[i][0]}, Location: ${devices[i][1]}")
            num++
        }
    }
    if (num == 0) {
        println("No devices installed in ${district} yet!")
    } else {
        println("Total number of devices: ${num}")
    }
}

main() {
    println("=======Vending Machine Management=======")
    while (true) {
        println("Menu: [1] Print [2] Add [3] Delete [4] Modify [5] Query (Area) [6] Exit")
        let order = getStdIn().readln() ?? ""
        match (order) {
            case "1" => printDevices() // Print vending machine information
            case "2" => addDevice() // Add information (insert)
            case "3" => removeDevices() // Delete information
            case "4" => updateDevices() // Modify information
            case "5" => selectDevices() // Query
            case "6" => break // Exit
            case _ => println("Command input error, please re-enter!")
        }
    }
}
