'use strict';

const Module = require('../module');
const request = require('request');

class Killmail extends Module {
    trigger(){
        return null;
    }

    init(){
        //this.interval = setTimeout(this.request.bind(this), 20000);
        this.request();
    }

    request(){
        var url = "http://redisq.zkillboard.com/listen.php";

        request(url, (error, response, body) => {
            if(!error && response.statusCode == 200) {
                var killmails = JSON.parse(body);



                for(var killmail of killmails){
                    var killmail = killmails[index];
                    console.log(killmail);
                }
            }
        });
    }

}

module.exports = function(bot) {
    new Killmail(bot);
};