'use strict'

class Task {
    lastExecute = 0
    lock = false

    constructor (bot, target) {
        this.bot = bot
        this.target = target
    }

    schedule () {
        return this.target
    }

    async execute () {
        if (this.lock === true) return

        this.lock = true
        await this.run()
        this.lock = false
    }

    run () {}
}

module.exports = Task