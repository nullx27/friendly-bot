'use strict';

const Module = require('../module');
const request = require('request');
const rp = require('request-promise-native');
const Discord = require('discord.js');

//ENUM
const TYPE = {
    CORP: 'CORP',
    ALLIANCE: 'ALLIANCE',
    CHARACTER: 'CHARACTER',
};

const userAgent = 'https://github.com/Crowdedlight/friendly-bot - Crow Lightbringer - Crowdedlight';

class who extends Module {
    trigger(){
        return "who";
    }

    help(){
        return "Gets information from corp/alliance/player" + "\n\n" + "!who < corp/player/alliance-name >";
    }

    handle(message) {
        let _this = this;
        _this.message = message;
        let search;

        //try block to catch exception if no command is given
        try {
            search = message.content.substring(1).trim().slice(3).trim().toLowerCase();
        }
        catch (e) {
            search = "";
        }

        if (search === "") {
            message.channel.send("You need to enter something to search for, you highsec dweller!");
            return;
        }

        //loading msg
        this.sentMsg = message.channel.send("Loading Post... Please wait you impatient fool!");

        //Get id from search, none if none is found
        let idRequest = {
            method: 'POST',
            uri: 'https://esi.evetech.net/latest/universe/ids/?datasource=tranquility&language=en-us',
            body: [
                search.trim()
            ],
            headers: {
                'User-Agent': userAgent
            },
            json: true
        };

        rp(idRequest)
            .then(function (data) {
                // POST succeeded...
                // console.log(data); //TODO

            })
            .catch(function (err) {
                // POST failed...
                throw(err);
            });

        // wait on request
        rp(idRequest)
            .then(this.handleID)
            .then(this.getPlayer)
            .then(this.getCorp)
            .then(this.getAlliance)
            .then(this.getZkillPlayerStats)
            .then(this.getZkillCorpStats)
            .then(this.getZkillAllianceStats)
            .then(function(extracted_data) {
                let msg;
                // console.log("Handle Message");

                //switch case on type, then call right function to build embed and display that.
                switch(extracted_data.type) {
                    case TYPE.CHARACTER:
                        msg = _this.makePlayerMessage(extracted_data);
                        break;
                    case TYPE.CORP:
                        msg = _this.makeCorpMessage(extracted_data);
                        break;
                    case TYPE.ALLIANCE:
                        msg = _this.makeAllianceMessage(extracted_data);
                        break;
                }

                //delete loading msg, and post real msg
                _this.sentMsg.then(message => {message.delete(msg)});
                _this.message.channel.send(msg);
            })
            .catch(function(error) {
                //delete loading msg
                let msg;
                _this.sentMsg.then(message => {message.delete(msg)});

                if (error === "empty")
                    _this.message.channel.send("Couldn't find player/corp/alliance. please check spelling");
                else
                    _this.message.channel.send("Error: " + error + ". " + "Something went wrong. Try again, otherwise ping @Crow LightBringer#7621");

                console.log(error);
            });
    }

    //handle returned id from first request
    handleID(data) {
        let extracted_data = {};

        //if no result
        if (isEmpty(data)) {
            throw("empty");
        }

        //if not char, corp or alliance, throw error
        if (data.characters == null && data.corporations == null && data.alliances == null)
            throw("empty");

        //Set type, and save information
        if (data.characters != null && data.characters.length > 0) {

            extracted_data["type"] = TYPE.CHARACTER;
            extracted_data["name"] = data.characters[0].name;
            extracted_data["char_id"] = data.characters[0].id;
        }
        else if (data.corporations != null && data.corporations.length > 0) {

            extracted_data["type"] = TYPE.CORP;
            extracted_data["name"] = data.corporations[0].name;
            extracted_data["corp_id"] = data.corporations[0].id;
        }
        else if (data.alliances != null && data.alliances.length > 0) {

            extracted_data["type"] = TYPE.ALLIANCE;
            extracted_data["name"] = data.alliances[0].name;
            extracted_data["alliance_id"] = data.alliances[0].id;
        }

        return extracted_data;
    }

    getPlayer(extracted_data) {
        //if type != player, return
        if (extracted_data.type !== TYPE.CHARACTER)
            return extracted_data;

        // console.log("Char_Request");

        let _this = this;

        //Get player though request, only return inside request for resolving
        let ESI_char_host = {
            url: `https://esi.evetech.net/latest/characters/${extracted_data.char_id}/?datasource=tranquility`,
            headers: {
                'User-Agent': userAgent
            }
        };

        return new Promise(function(resolve, reject) {
            request(ESI_char_host, (error, response, body) => {
                if(!error && response.statusCode == 200) {
                    let data = JSON.parse(body);

                    //handle data
                    extracted_data["corp_id"] = data.corporation_id;
                    extracted_data["alliance_id"] = data.alliance_id;
                    extracted_data["char_birthday"] = data.birthday;

                    resolve(extracted_data);

                } else {
                    //throw error
                    reject(error);
                }
            });
        })
    }

    getCorp(extracted_data) {
        //if type == corp, return
        if (extracted_data.type === TYPE.ALLIANCE)
            return extracted_data;

        // console.log("Corp_Request");

        //Get corp though request, only return inside request for resolving
        let ESI_corp_host = {
            url: `https://esi.evetech.net/latest/corporations/${extracted_data.corp_id}/?datasource=tranquility`,
            headers: {
                'User-Agent': userAgent
            }
        };


        return new Promise(function(resolve, reject) {
            request(ESI_corp_host, (error, response, body) => {
                if(!error && response.statusCode == 200) {
                    let data = JSON.parse(body);

                    //handle data
                    extracted_data["corp_member_count"] = data.member_count;
                    extracted_data["corp_name"] = data.name;
                    extracted_data["corp_ticker"] = data.ticker;

                    //override ally id so it gets added if not existing
                    extracted_data["alliance_id"] = data.alliance_id;

                    resolve(extracted_data);

                } else {
                    //throw error
                    reject(error);
                }
            });
        });
    }

    getAlliance(extracted_data) {
        //if type == alliance, return
        if (extracted_data.alliance_id == null)
            return extracted_data;

        // console.log("Alliance_Request");

        //Get corp though request, only return inside request for resolving
        let ESI_alliance_host = {
            url: `https://esi.evetech.net/latest/alliances/${extracted_data.alliance_id}/?datasource=tranquility`,
            headers: {
                'User-Agent': userAgent
            }
        };

        return new Promise(function(resolve, reject) {
            request(ESI_alliance_host, (error, response, body) => {
                if(!error && response.statusCode == 200) {
                    let data = JSON.parse(body);

                    //handle data
                    extracted_data["alliance_name"] = data.name;
                    extracted_data["alliance_ticker"] = data.ticker;

                    resolve(extracted_data);

                } else {
                    //throw error
                    reject(error);
                }
            });
        });
    }

    getZkillPlayerStats(extracted_data) {
        if (extracted_data.type !== TYPE.CHARACTER)
            return extracted_data;

        // console.log("Zkill_player_Request");

        //Zkill to get amount of kill/deaths over last two weeks (And provide link to the killboard)
        let zkill_player_host = {
            url: `https://zkillboard.com/api/stats/characterID/${extracted_data.char_id}/`,
            headers: {
                'User-Agent': userAgent
            }
        };

        return new Promise(function(resolve, reject) {
            request(zkill_player_host, (error, response, body) => {
                if(!error && response.statusCode == 200) {
                    let data = JSON.parse(body);

                    //handle data
                    extracted_data["zkill_player_iskdestroyed"] = data.iskDestroyed;
                    extracted_data["zkill_player_isklost"] = data.iskLost;
                    extracted_data["zkill_player_solo_kills"] = data.soloKills;
                    extracted_data["zkill_player_solo_losses"] = data.soloLosses;

                    //recent pvp
                    if (!isEmpty(data.activepvp)) {
                        extracted_data["zkill_player_recent_kills"] = data.activepvp.kills.count;
                        extracted_data["zkill_player_recent_systems"] = data.activepvp.systems.count;
                        extracted_data["zkill_player_recent_regions"] = data.activepvp.regions.count;
                    } else {
                        extracted_data["zkill_player_recent_kills"] = 0;
                        extracted_data["zkill_player_recent_systems"] = 0;
                        extracted_data["zkill_player_recent_regions"] = 0;
                    }

                    let currMonthNum = new Date().getMonth() + 1; //zero index, while the other is 1 index
                    let currMonth = data.months[Object.keys(data.months).sort().pop()];

                    if (currMonth.month === currMonthNum) {
                        extracted_data["zkill_player_currentMonth_kills"] = currMonth.shipsDestroyed;
                        extracted_data["zkill_player_currentMonth_losses"] = currMonth.shipsLost;
                        extracted_data["zkill_player_currentMonth_isk_killed"] = currMonth.iskDestroyed;
                        extracted_data["zkill_player_currentMonth_isk_lost"] = currMonth.iskLost;
                    } else {
                        extracted_data["zkill_player_currentMonth_kills"] = 0;
                        extracted_data["zkill_player_currentMonth_losses"] = 0;
                        extracted_data["zkill_player_currentMonth_isk_killed"] = 0;
                        extracted_data["zkill_player_currentMonth_isk_lost"] = 0;
                    }

                    resolve(extracted_data);

                } else {
                    //throw error
                    reject(error);
                }
            });
        });
    }

    getZkillCorpStats(extracted_data) {
        if (extracted_data.type === TYPE.ALLIANCE)
            return extracted_data;

        // console.log("Zkill_corp_Request");

        //Zkill to get amount of kill/deaths over last two weeks (And provide link to the killboard)
        let zkill_corp_host = {
            url: `https://zkillboard.com/api/stats/corporationID/${extracted_data.corp_id}/`,
            headers: {
                'User-Agent': userAgent
            }
        };

        return new Promise(function(resolve, reject) {
            request(zkill_corp_host, (error, response, body) => {
                if(!error && response.statusCode == 200) {
                    let data = JSON.parse(body);

                    //handle data
                    extracted_data["zkill_corp_iskdestroyed"] = data.iskDestroyed;
                    extracted_data["zkill_corp_isklost"] = data.iskLost;

                    //supers
                    if (!isEmpty(data.supers)) {
                        //go though each key
                        for(let cat in data.supers) {
                            //categories
                            let pilots = data.supers[cat].data;
                            if (pilots != null) {
                                extracted_data["zkill_corp_" + cat + "_pilots"] = pilots;
                            } else {
                                extracted_data["zkill_corp_" + cat + "_pilots"] = [];
                            }

                        }
                    }

                    //recent pvp
                    if (!isEmpty(data.activepvp)) {
                        extracted_data["zkill_corp_recent_kills"] = data.activepvp.kills.count;
                        extracted_data["zkill_corp_recent_systems"] = data.activepvp.systems.count;
                        extracted_data["zkill_corp_recent_regions"] = data.activepvp.regions.count;
                        extracted_data["zkill_corp_recent_pvp_characters"] = data.activepvp.characters.count;
                    } else {
                        extracted_data["zkill_corp_recent_kills"] = 0;
                        extracted_data["zkill_corp_recent_systems"] = 0;
                        extracted_data["zkill_corp_recent_regions"] = 0;
                        extracted_data["zkill_corp_recent_pvp_characters"] = 0;
                    }

                    let currMonthNum = new Date().getMonth() + 1; //zero index, while the other is 1 index;
                    let currMonth = data.months[Object.keys(data.months).sort().pop()];

                    //if no data from current month, just set as zero activity,
                    // TODO unfair on change days. Might change to use activePVP stats instead
                    if (currMonth.month === currMonthNum) {
                        extracted_data["zkill_corp_currentMonth_kills"] = currMonth.shipsDestroyed;
                        extracted_data["zkill_corp_currentMonth_losses"] = currMonth.shipsLost;
                        extracted_data["zkill_corp_currentMonth_isk_killed"] = currMonth.iskDestroyed;
                        extracted_data["zkill_corp_currentMonth_isk_lost"] = currMonth.iskLost;
                    } else {
                        extracted_data["zkill_corp_currentMonth_kills"] = 0;
                        extracted_data["zkill_corp_currentMonth_losses"] = 0;
                        extracted_data["zkill_corp_currentMonth_isk_killed"] = 0;
                        extracted_data["zkill_corp_currentMonth_isk_lost"] = 0;
                    }

                    resolve(extracted_data);

                } else {
                    //throw error
                    reject(error);
                }
            });
        });
    }

    getZkillAllianceStats(extracted_data) {
        if (extracted_data.alliance_id == null)
            return extracted_data;

        // console.log("Zkill_alliance_Request");

        //Zkill to get amount of kill/deaths
        let zkill_alliance_host = {
            url: `https://zkillboard.com/api/stats/allianceID/${extracted_data.alliance_id}/`,
            headers: {
                'User-Agent': userAgent
            }
        };

        return new Promise(function(resolve, reject) {
            request(zkill_alliance_host, (error, response, body) => {
                if(!error && response.statusCode == 200) {
                    let data = JSON.parse(body);

                    //handle data
                    extracted_data["zkill_alliance_iskdestroyed"] = data.iskDestroyed;
                    extracted_data["zkill_alliance_isklost"] = data.iskLost;

                    //supers
                    if (!isEmpty(data.supers)) {
                        //go though each key
                        for(let cat in data.supers) {
                            //categories
                            let pilots = data.supers[cat].data;
                            if (pilots != null) {
                                extracted_data["zkill_alliance_" + cat + "_pilots"] = pilots;
                            } else {
                                extracted_data["zkill_alliance_" + cat + "_pilots"] = [];
                            }

                        }
                    }

                    //recent pvp
                    if (!isEmpty(data.activepvp)) {
                        extracted_data["zkill_alliance_recent_kills"] = data.activepvp.kills.count;
                        extracted_data["zkill_alliance_recent_systems"] = data.activepvp.systems.count;
                        extracted_data["zkill_alliance_recent_regions"] = data.activepvp.regions.count;
                        extracted_data["zkill_alliance_recent_pvp_characters"] = data.activepvp.characters.count;
                    } else {
                        extracted_data["zkill_alliance_recent_kills"] = 0;
                        extracted_data["zkill_alliance_recent_systems"] = 0;
                        extracted_data["zkill_alliance_recent_regions"] = 0;
                        extracted_data["zkill_alliance_recent_pvp_characters"] = 0;
                    }

                    let currMonthNum = new Date().getMonth() + 1; //zero index, while the other is 1 index;
                    let currMonth = data.months[Object.keys(data.months).sort().pop()];

                    //if no data from current month, just set as zero activity,
                    // TODO unfair on change days. Might change to use activePVP stats instead
                    if (currMonth.month === currMonthNum) {
                        extracted_data["zkill_alliance_currentMonth_kills"] = currMonth.shipsDestroyed;
                        extracted_data["zkill_alliance_currentMonth_losses"] = currMonth.shipsLost;
                        extracted_data["zkill_alliance_currentMonth_isk_killed"] = currMonth.iskDestroyed;
                        extracted_data["zkill_alliance_currentMonth_isk_lost"] = currMonth.iskLost;
                    } else {
                        extracted_data["zkill_alliance_currentMonth_kills"] = 0;
                        extracted_data["zkill_alliance_currentMonth_losses"] = 0;
                        extracted_data["zkill_alliance_currentMonth_isk_killed"] = 0;
                        extracted_data["zkill_alliance_currentMonth_isk_lost"] = 0;
                    }

                    resolve(extracted_data);

                } else {
                    //throw error
                    reject(error);
                }
            });
        });
    }

    makePlayerMessage(extracted_data) {
        let embed = new Discord.RichEmbed()
            .setColor(0x00AE86)
            .setFooter("Requested by " + this.message.author.username, this.message.author.avatarURL)
            .setTimestamp();

        embed.setThumbnail(`https://imageserver.eveonline.com/Character/${extracted_data.char_id}_64.jpg`);

        //evewho links
        let player_evewho = encodeURIComponent(extracted_data.name);
        let corp_evewho = encodeURIComponent(extracted_data.corp_name);

        //Name
        embed.addField("Player", '##########', true);
        embed.addField("Corporation", '##########', true);

        embed.addField(extracted_data.name, `[EveWho](https://evewho.com/pilot/${player_evewho})`, true);
        embed.addField(extracted_data.corp_name, `[EveWho](https://evewho.com/corp/${corp_evewho})`, true);

        //Active PVP
        embed.addField("Recent Kills", `[${extracted_data.zkill_player_recent_kills}](https://zkillboard.com/character/${extracted_data.char_id}/kills)`, true);
        embed.addField("Recent Kills", `[${extracted_data.zkill_corp_recent_kills}](https://zkillboard.com/corporation/${extracted_data.corp_id})`, true);

        embed.addField("Solo Kills", `[${extracted_data.zkill_player_solo_kills}](https://zkillboard.com/character/${extracted_data.char_id}/solo)`, true);
        embed.addField("Recent ActivePVP Chars", extracted_data.zkill_corp_recent_pvp_characters, true);

        //supers
        let superText = `[Titans: ${extracted_data.zkill_corp_titans_pilots.length}, Supers: ${extracted_data.zkill_corp_supercarriers_pilots.length}](https://zkillboard.com/corporation/${extracted_data.corp_id}/supers/)`;

        embed.addField("Solo Losses", `[${extracted_data.zkill_player_solo_losses}](https://zkillboard.com/character/${extracted_data.char_id}/solo)`, true);
        embed.addField("Supers", superText, true);

        //Isk
        let isk_player_ratio = roundToTwo(extracted_data.zkill_player_iskdestroyed/extracted_data.zkill_player_isklost);
        let isk_corp_ratio = roundToTwo(extracted_data.zkill_corp_iskdestroyed/extracted_data.zkill_corp_isklost);

        embed.addField("Isk Ratio (killed/lost)", isk_player_ratio, true);
        embed.addField("Isk Ratio (killed/lost)", isk_corp_ratio, true);

        return embed;
    }

    makeCorpMessage(extracted_data) {
        let embed = new Discord.RichEmbed()
            .setColor(0x00AE86)
            .setFooter("Requested by " + this.message.author.username, this.message.author.avatarURL)
            .setTimestamp();

        embed.setThumbnail(`https://imageserver.eveonline.com/Corporation/${extracted_data.corp_id}_64.png`);

        //evewho links
        let corp_evewho = encodeURIComponent(extracted_data.corp_name);
        let alliance_evewho = encodeURIComponent(extracted_data.alliance_name);

        //Name
        embed.addField("Corporation", '##########', true);
        embed.addField("Alliance", '##########', true);

        embed.addField(extracted_data.corp_name, `[EveWho](https://evewho.com/corp/${corp_evewho})`, true);
        embed.addField(extracted_data.alliance_name, `[EveWho](https://evewho.com/alli/${alliance_evewho})`, true);

        embed.addField("Members", extracted_data.corp_member_count, true);
        embed.addBlankField(true);

        //Active PVP
        embed.addField("Recent Kills", `[${extracted_data.zkill_corp_recent_kills}](https://zkillboard.com/corporation/${extracted_data.corp_id}/kills)`, true);
        embed.addField("Recent Kills", `[${extracted_data.zkill_alliance_recent_kills}](https://zkillboard.com/alliance/${extracted_data.alliance_id})`, true);

        embed.addField("Recent ActivePVP Chars", extracted_data.zkill_corp_recent_pvp_characters, true);
        embed.addField("Recent ActivePVP Chars", extracted_data.zkill_alliance_recent_pvp_characters, true);

        //supers
        let superText_corp = `[Titans: ${extracted_data.zkill_corp_titans_pilots.length}, Supers: ${extracted_data.zkill_corp_supercarriers_pilots.length}](https://zkillboard.com/corporation/${extracted_data.corp_id}/supers/)`;
        let superText_ally = `[Titans: ${extracted_data.zkill_alliance_titans_pilots.length}, Supers: ${extracted_data.zkill_alliance_supercarriers_pilots.length}](https://zkillboard.com/alliance/${extracted_data.alliance_id}/supers/)`;

        embed.addField("Supers", superText_corp, true);
        embed.addField("Supers", superText_ally, true);

        //Isk
        let isk_corp_ratio = roundToTwo(extracted_data.zkill_corp_iskdestroyed/extracted_data.zkill_corp_isklost);
        let isk_alliance_ratio = roundToTwo(extracted_data.zkill_alliance_iskdestroyed/extracted_data.zkill_alliance_isklost);

        embed.addField("Isk Ratio (killed/lost)", isk_corp_ratio, true);
        embed.addField("Isk Ratio (killed/lost)", isk_alliance_ratio, true);

        return embed;
    }

    makeAllianceMessage(extracted_data) {
        let embed = new Discord.RichEmbed()
            .setColor(0x00AE86)
            .setFooter("Requested by " + this.message.author.username, this.message.author.avatarURL)
            .setTimestamp();

        embed.setThumbnail(`https://imageserver.eveonline.com/Alliance/${extracted_data.alliance_id}_64.png`);

        //evewho links
        let alliance_evewho = encodeURIComponent(extracted_data.alliance_name);

        //Name
        embed.addField("Alliance", '##########', false);
        embed.addField(extracted_data.alliance_name, `[EveWho](https://evewho.com/alli/${alliance_evewho})`, false);

        //Active PVP
        embed.addField("Recent Kills", `[${extracted_data.zkill_alliance_recent_kills}](https://zkillboard.com/alliance/${extracted_data.alliance_id})`, true);

        embed.addField("Recent ActivePVP Chars", extracted_data.zkill_alliance_recent_pvp_characters, true);

        //supers
        let superText_ally = `[Titans: ${extracted_data.zkill_alliance_titans_pilots.length}, Supers: ${extracted_data.zkill_alliance_supercarriers_pilots.length}](https://zkillboard.com/alliance/${extracted_data.alliance_id}/supers/)`;

        embed.addField("Supers", superText_ally, true);

        //Isk
        let isk_alliance_ratio = roundToTwo(extracted_data.zkill_alliance_iskdestroyed/extracted_data.zkill_alliance_isklost);

        embed.addField("Isk Ratio (killed/lost)", isk_alliance_ratio, true);

        return embed;
    }


}

function isEmpty(obj) {
    for(let key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

module.exports = function(bot) {
    new who(bot);
};