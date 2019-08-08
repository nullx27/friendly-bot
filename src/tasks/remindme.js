'use strict'

const Task = require('../models/Task')

class Remindme extends Task {

    constructor (user, message, datetime) {
        super()
        this.user = user
        this.message = message
        this.target = datetime
    }

    schedule () {
        return this.target
    }

    run () {
        this.user.createDM().then(channel => {
            channel.send(this.message);
        })
    }

}

module.exports = Remindme