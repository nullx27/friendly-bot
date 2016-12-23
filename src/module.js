'use strict';

class Module {
    constructor(Bot){
        this.bot = Bot;
        this.bot.register(this.constructor.name, this);

        if(this.trigger() != '') {
            this.bot.on('trigger:' + this.trigger(), this.handle.bind(this));
        }

        this.init();
    }

    trigger(){
        return "";
    }

    handle(message){
        return;
    }

    init(){
        return;
    }

    help(){
        return "";
    }
}

module.exports = Module;