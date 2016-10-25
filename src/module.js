'use strict';

class Module {
    constructor(Bot){
        this.bot = Bot;

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

}

module.exports = Module;