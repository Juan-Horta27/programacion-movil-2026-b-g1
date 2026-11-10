import std.env.*
import std.convert.*

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

main() {
    println("==========Vending Machine Information Entry==========")
    let id = inputDeviceID()
    let district = inputDistrict()
    println("Entered device ID: ${id}, Location: ${district.toString()}")
}
