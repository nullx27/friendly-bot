'use strict'

const moment = require('moment')

class Scheduler {

    constructor (bot) {
        this.lock = false
        this.bot = bot
        this.tasks = []
    }

    addTask (task) {
        this.tasks.push(task)
    }

    run () {
        this.tasks.forEach((task, index) => {
            if (task.schedule() instanceof Date || task.schedule() instanceof moment) {
                if (moment().diff(task.schedule()) > 0) {
                    task.execute()
                    this.tasks.splice(index, 1)
                }
            } else {
                if (task.lastExecute + task.schedule() <= moment().format('x')) {
                    task.execute()
                    task.lastExecute = moment().format('x')
                }
            }
        })
    }
}

module.exports = Scheduler