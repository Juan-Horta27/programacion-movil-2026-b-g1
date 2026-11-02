// Project 2 - Task 2.2: Log File Saving
// The administrator selects which campus intelligent system to view; the real-time data
// is simulated with random values and saved to log.txt. Option 5 exits.

import std.random.*
import std.convert.*
import stdx.logger.*
import std.fs.*
import std.env.*

main(): Int64 {
    while (true) {
        try {
            let file = File(Path("./log.txt"), Append)
            print("Please select the real-time data to save:")
            println("[1] Access Control [2] Parking Lot [3] Video Surveillance [4] Server Room Monitoring [5] Exit")
            var input = getStdIn().readln().getOrThrow()
            var event = "Event: "
            var message = "Message: "
            if (input == "1") {
                event += "Access Control"
                message += "Card Reader " + if (Random().nextBool()) { "Normal" } else { "Abnormal" }
            } else if (input == "2") {
                event += "Parking Lot"
                message += "Remaining Campusing Spaces ${Random().nextInt64(1000)}/999"
            } else if (input == "3") {
                event += "Video Surveillance"
                message += "Camera " + if (Random().nextBool()) { "Online" } else { "Offline" }
            } else if (input == "4") {
                event += "Server Room Monitoring"
                message += "Temperature ${(25.0 + Random().nextFloat64()).format(".1f")}C"
                message += " Humidity ${(50.0 + Random().nextFloat64()).format(".1f")}%"
            } else if (input == "5") {
                println("Execution finished!")
                break
            } else {
                println("Please select again!")
            }
            let logger = SimpleLogger(file)
            logger.info(event + message)
            println(event + message + " Saved to log.txt file")
        } catch (e: Exception) {
            println("System exception: ${e}")
            break
        } finally {
            println("\n")
        }
    }
    return 0
}
