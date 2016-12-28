'use strict';

const Module = require('../module');
const request = require('request');

class Zkill extends Module {

    init() {
        this.allianceID = this.bot.config.allianceID;
        this.killid = 0;

        this.getLastKillID();
        setInterval(this.callback.bind(this), 300000);
    }

    getLastKillID() {
        this.killid = 0;
        let url = `https://zkillboard.com/api/allianceID/${this.allianceID}/orderDirection/desc/limit/1/`;

        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let killmail = JSON.parse(body);
                this.killid = killmail[0]['killID'];
            }
        })
    }

    callback() {
        if (this.killid == 0) {
            this.getLastKillID();
            console.log('no kill id');
            return;
        }

        let channel = this.bot.getChannelByName(this.bot.config.boardcast_channel);
        let url = `https://zkillboard.com/api/allianceID/${this.allianceID}/afterKillID/${this.killid}/orderDirection/asc/`;

        request(url, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let killmails = JSON.parse(body);
                    for (let killmail of killmails) {

                        request(`https://crest-tq.eveonline.com/solarsystems/${killmail.solarSystemID}/`, (error, response, body) => {
                            if (!error && response.statusCode == 200) {
                                let systemInfo = JSON.parse(body);

                                request(`https://crest-tq.eveonline.com/inventory/types/${killmail.victim.shipTypeID}/`, (error, response, body) => {
                                    if (!error && response.statusCode == 200) {
                                        let typeInfo = JSON.parse(body);
                                        let message = '```';

                                        if (killmail.victim.allianceID == this.allianceID) {
                                            message += killmail.victim.characterName + ' lost a ' + typeInfo.name + ' ';
                                        } else {
                                            let killer = '';
                                            for (let attacker of killmail.attackers) {
                                                if (attacker.finalBlow == 1) {
                                                    killer = attacker;
                                                    break;
                                                }
                                            }

                                            message += killer.characterName + ' killed a ' + typeInfo.name + ' ';
                                        }

                                        message += 'in ' + systemInfo.name + '\n';
                                        message += 'Value: ' + Number(killmail.zkb.totalValue).toLocaleString() + ' ISK \n';
                                        message += '```';
                                        message += 'https://zkillboard.com/kill/' + killmail.killID + '\n';
                                        channel.sendMessage(message);
                                    }
                                })
                            }
                        });
                    }
                }
                else {
                    console.log(error);
                }
            }
        );

        this.getLastKillID();
    }
}

module.exports = function (bot) {
    new Zkill(bot);
};