'use strict';

const Module = require('../module');
const request = require('request');
const path = require('path');
const fs = require('fs');

var configPath = path.join(__dirname,'/admincommands/config.json');
const config = require(configPath);

class AdminCommands extends Module {

    trigger(){
        return "admin";
    }

    help(){
        return "commands only admins on the admin list in config file can use" +
            "\n\n" +
            "Available commands:\n" +
            "!admin say <channel> <message>"+   "\t\t"      + "Bot says message in channel"             +    "\n" +
            "!admin addadmin <username>"    +   "\t\t\t"    + "Add user to the admin list"              +    "\n" +
            "!admin rmadmin <username>"     +   "\t\t\t "   + "Removes user from the config admin list" +    "\n";
    }

    handle(message){
        var command;

        if (!config.admins.includes(message.author.id))
        {
            message.channel.sendMessage("You are not admin!");
            return;
        }

        //try block to catch exception if no command is given
        try {
            command = message.content.substring(6).trim().split(" ");
        }
        catch (e) {
            command = "";
        }

        switch(command[0].toLowerCase())
        {
            case "say":
                command.shift();
                this.say(command, message);
                break;
            case "addadmin":
                command.shift();
                this.addAdmin(command, message);
                break;
            case "rmadmin":
                command.shift();
                this.rmAdmin(command, message);
                break;
        }
    }

    mergeArrayToString(array)
    {
        var string = "";
        array.forEach(function (item, index) {
            string += item + " ";
        });
        return string.trim();
    }

    addAdmin(command, message)
    {
        if(command.length <= 0 )
        {
            message.channel.sendMessage("Need to specify who to add to admin list. Use '!help admin' to see how the command is used");
            return
        }

        var username = this.mergeArrayToString(command);

        var user = this.bot.getUserByName(username);
        if (user == null)
        {
            message.channel.sendMessage("can't find the user. Be sure to spell the name exactly with correct capitalization");
            return;
        }

        //write to config file if user isn't present already
        if (!config.admins.includes(user.id))
            config.admins.push(user.id);
        else
        {
            message.channel.sendMessage("User already exists in admin list");
            return
        }

        var string = JSON.stringify(config, null, '\t');

        fs.writeFile(configPath, string, function(err) {
            if(err) return console.error(err);
            //console.log('Updated config file for Admin Commands');
            message.channel.sendMessage("User: " + (user.username == undefined ? user.nickname : user.username)  + " is now added to adminlist")
        })
    }

    rmAdmin(command, message)
    {
        if(command.length <= 0 )
        {
            message.channel.sendMessage("Need to specify who to remove from admin list. Use '!help admin' to see how the command is used");
            return
        }

        var username = this.mergeArrayToString(command);

        var user = this.bot.getUserByName(username);
        if (user == null)
        {
            message.channel.sendMessage("can't find the user. Be sure to spell the name exactly with correct capitalization");
            return;
        }

        //write to config file if user isn't present already
        if (config.admins.includes(user.id))
        {
            var pos = config.admins.indexOf(user.id);
            config.admins.splice(pos, 1);
        }
        else
        {
            message.channel.sendMessage("User doesn't exists in admin list");
            return
        }

        var string = JSON.stringify(config, null, '\t');

        fs.writeFile(configPath, string, function(err) {
            if(err) return console.error(err);
            //console.log('Updated config file for Admin Commands');
            message.channel.sendMessage("User: " + (user.username == undefined ? user.nickname : user.username) + " is now removed from adminlist")
        })
    }

    say(command, message){
        if(command.length <= 1 )
        {
            message.channel.sendMessage("Need to specify both channel and message. Use '!help admin' to see how the command is used");
            return;
        }

        var channel = this.bot.getChannelByName(command[0]);

        if (channel == null)
        {
            message.channel.sendMessage("Channel doesn't exist or the bot doesn't have access to it");
            return;
        }
        //remove the channel part of the command
        command.shift();

        var msg = this.mergeArrayToString(command);

        channel.sendMessage(msg);
    }
}

module.exports = function(bot) {
    new AdminCommands(bot);
};
