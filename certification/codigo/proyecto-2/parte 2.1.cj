// Project 2 - Task 2.1: Console Log Generation
// The administrator enters campus information in the console and the program prints a log line.

import std.convert.*
import stdx.logger.*
import std.env.*

main(): Int64 {
    println("Please enter the campus name:")
    let campusName: String = getStdIn().readln().getOrThrow()
    println("Please enter the number of buildings:")
    let buildingNum: Int64 = Int64.parse(getStdIn().readln().getOrThrow())
    println("Please enter the building area (ten thousand square meters):")
    let buildingArea: Float64 = Float64.parse(getStdIn().readln().getOrThrow())
    println("Is it a smart campus(yes/no):")
    let isSmartCampus: Bool = getStdIn().readln().getOrThrow() == "yes"

    let logger = SimpleLogger(getStdOut())
    let event = "Event: Entry operation "
    var message = "Message:"
    message += "Campus name:${campusName} "
    message += "Number of buildings:${buildingNum} "
    message += "Building area:${buildingArea.format(".1f")}ten thousand square meters "
    message += "Smart campus:${isSmartCampus}"
    logger.info(event + message)
    return 0
}
