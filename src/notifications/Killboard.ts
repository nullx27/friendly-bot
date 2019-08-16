import {Notification} from "../core/base/Notification";
import {Container} from "../core/utils/Container";
import {Channel, TextChannel} from "discord.js";
import WebSocket from "ws";
import {Message} from "../core/models/messages/Message";
import {fetchAlliance, fetchCharacter, fetchCorporation, fetchKillmail, fetchSystem, fetchType} from "../fetcher/Esi";
import {fetchzKill} from "../fetcher/zKillboard";

//@todo: This needs refactoring so that only

class Killboard extends Notification {
    private channel: TextChannel;
    private corpIds: String[];
    private ws: WebSocket | any;

    constructor(container: Container) {
        super(container);

        const config = this.container.get('config');
        const channelId = config.BROADCAST_CHANNEL;

        if (!channelId || !this.container.get('discord').channels.some((channel: Channel) => channel.id == channelId)) {
            throw "Can not find broadcast channel! Check the channel id in the config file";
        }

        this.channel = this.container.get('discord').channels.get(channelId);
        this.corpIds = config.KILLBOARD_CORP_IDS.split(',');
    }

    async handle(): Promise<void> {
        this.ws = new WebSocket('wss://zkillboard.com:2096');

        this.ws.on('open', this.subscribe.bind(this));
        this.ws.on('message', this.message.bind(this));
    }

    subscribe(): void {
        for (const id of this.corpIds) {
            const filter = {
                "action": "sub",
                "channel": `corporation:${id.toString()}`
            };

            this.ws.send(JSON.stringify(filter));
        }
    }

    async message(data: any): Promise<void> {
        data = JSON.parse(data);
        let zkill = await fetchzKill(data.killID);
        const km = await fetchKillmail(data.killID, data.hash);
        zkill = zkill[0];
        Object.assign(zkill, km);

        const killmail: Killmail = await this.populate(zkill);
        const victim = this.formatActor(killmail.victim);
        const attacker = this.formatActor(killmail.attacker);

        let details = "";
        details += this.formatField('Value', new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'ISK'
        }).format(zkill.zkb.totalValue));

        details += this.formatField('System', killmail.system.name, `http://evemaps.dotlan.net/system/${killmail.system.name}`);

        try {
            const msg = new Message(this.channel).setTitle(`${killmail.shipName} killed in ${killmail.system.name}`);
            msg.addField('Victim', victim);

            if (!zkill.zkb.npc) msg.addField('Final Blow', attacker);

            msg.addField('Details', details);

            if (zkill.zkb.npc || zkill.zkb.awox || zkill.zkb.solo) {
                if (zkill.zkb.npc) msg.getEmbed().setDescription('**NPC Kill**');
                if (zkill.zkb.awox) msg.getEmbed().setDescription('**Awox**');
                if (zkill.zkb.solo) msg.getEmbed().setDescription('**Solo kill**');
            }

            msg.getEmbed().setThumbnail(`https://image.eveonline.com/Render/${killmail.shipTypeId}_128.png`);
            msg.getEmbed().setTimestamp(killmail.time);
            msg.getEmbed().setURL(`https://zkillboard.com/kill/${data.killID}`);
            msg.getEmbed().setFooter('powered by zKillboard', 'https://raw.githubusercontent.com/zKillboard/zKillboard/master/public/img/wreck.png');
            msg.send();
        } catch (e) {
            this.container.get('logger').error(e);
        }
    }

    private formatActor(actor: Actor): string {
        let format = "";
        if (actor.characterName) format += this.formatField('Name', actor.characterName, `https://evewho.com/pilot/${encodeURI(actor.characterName)}`);
        if (actor.corporationName) format += this.formatField('Coporation', actor.corporationName, `https://evewho.com/corp/${encodeURI(actor.corporationName)}`);
        if (actor.allianceName) format += this.formatField('Alliance', actor.allianceName, `https://evewho.com/alli/${encodeURI(actor.allianceName)}`);

        return format;
    }

    private formatField(name: string, value: string, link: string = '') {
        if (link.length > 0) {
            return `${name}: \t\t\t\t [${value}](${link}) \n`;
        }

        return `${name}: \t\t\t\t ${value}\n`;
    }

    async populate(esiKillmail: any) {
        const victim = await this.getActor(esiKillmail.victim);
        let lastHitter = esiKillmail.attackers.find((x: any) => x.final_blow == true);
        let attacker: Actor = await this.getActor(lastHitter);

        const esiSystem = await fetchSystem(esiKillmail.solar_system_id);
        const system: System = {id: esiSystem.system_id, name: esiSystem.name, security: esiSystem.security_status};

        const ship = await fetchType(esiKillmail.victim.ship_type_id);

        const killmail: Killmail = {
            id: esiKillmail.killmail_id,
            time: new Date(esiKillmail.killmail_time),
            system: system,
            damageTaken: esiKillmail.victim.damage_taken,
            shipTypeId: ship.type_id,
            shipName: ship.name,

            attacker: attacker,
            victim: victim,
            zkb: esiKillmail.zkb
        };

        return killmail;
    }

    async getActor(data: any) {
        const character = await fetchCharacter(data.character_id);
        const corporation = await fetchCorporation(data.corporation_id);
        let alliance = {id: 0, name: ''};

        if (data.alliance_id) alliance = await fetchAlliance(data.alliance_id);

        const actor: Actor = {
            "characterName": character.name,
            "characterId": data.character_id,
            "corporationName": corporation.name,
            "corporationId": data.corporation_id,
            "allianceId": alliance.id,
            "allianceName": alliance.name
        };

        return actor;
    }


}

interface Killmail {
    id: number,
    time: Date,
    system: System,
    damageTaken: number,
    shipTypeId: number,
    shipName: string

    attacker: Actor,
    victim: Actor,
    zkb: any,
}

interface Actor {
    "characterName": string,
    "characterId": number,
    "corporationName": string,
    "corporationId": number,
    "allianceId": number,
    "allianceName": string,
}

interface System {
    id: number,
    name: string,
    security: number
}


module.exports = Killboard;