// Project 2 - Task 2.3: Log File Analysis
// Reads log.txt and prints only the lines of the log level chosen by the administrator.
// Options: [1] trace [2] debug [3] info [4] warn [5] error [6] exit

import std.env.*
import std.fs.*
import std.io.*

main(): Int64 {
    while (true) {
        try (file = File(Path("./log.txt"), Read)) {
            print("select log level to filter:")
            println(" [1] trace [2] debug [3] info [4] warn [5] error [6] exit")
            var input = getStdIn().readln().getOrThrow() // Enter command in console
            if (parseCommand(input, "1", file, "TRACE")) { continue } // If input is valid, perform filtering
            if (parseCommand(input, "2", file, "DEBUG")) { continue }
            if (parseCommand(input, "3", file, "INFO")) { continue }
            if (parseCommand(input, "4", file, "WARN")) { continue }
            if (parseCommand(input, "5", file, "ERROR")) { continue }
            if (parseCommand(input, "6") { println("Operation ended") }) { break } // trailing lambda expression
            println("Please select again!") // If the input is incorrect, re-enter
        } catch (e: Exception) {
            println("System exception: ${e}")
            break
        } finally {
            println("\n")
        }
    }
    return 0
}

// Filters and prints the log lines that contain the level, only if the command is valid.
func parseCommand(input: String, valid: String, file: File, target: String): Bool {
    if (input == valid) {
        let log = StringReader(file) // Read string
        for (line in log.lines() where line.contains(target)) { // Filter log content
            println(line) // Print log information
        }
        true
    } else {
        false
    }
}

// Overloaded version used for the exit option: runs the callback if the command is valid.
func parseCommand(input: String, valid: String, callback: () -> Unit): Bool {
    if (input == valid) {
        callback()
        true
    } else {
        false
    }
}
