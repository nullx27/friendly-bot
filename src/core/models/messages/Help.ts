import Discord, {RichEmbed} from "discord.js";
import {MessageInterface} from "../../contracts/MessageInterface";

export class Help implements MessageInterface {
    protected msg: RichEmbed;

    constructor() {
        this.msg = new Discord.RichEmbed();
        this.msg.setTimestamp();

        return this;
    }

    addTitle(title: string): Help {
        this.msg.setTitle('Help: ' + title);
        return this;
    }

    addDescription(desc: string): Help {
        this.msg.addField('\u200B', desc, true);
        return this;
    }

    addCommand(cmd: string, desc: string): Help {
        this.msg.addField(cmd, desc, true);
        return this;
    }

    getMessage(): RichEmbed {
        return this.msg;
    }
}