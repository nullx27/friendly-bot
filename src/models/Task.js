'use strict'

class Task {
    lastExecute = 0
    lock = false

    schedule () {}

    execute () {
        if (this.lock === true) return

        this.lock = true
        this.run()
        this.lock = false
    }

    run () {}
}

module.exports = Task