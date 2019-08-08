'use strict'

const Command = require('../models/Command')
const Reply = require('../models/messages/Reply')
const Help = require('../models/messages/Help')
const ytFetcher = require('../fetcher/YouTube')

class Youtube extends Command {
    trigger () {
        return ['youtube', 'y']
    }

    help () {
        return new Help().addTitle('Youtube').
            addDescription('Post a link for a Video on youtube matching your search term').
            addCommand('![y, youtube] <search>', 'Search for a youtube video')
    }

    async handle (message, args) {
        if (args.length === 0)
            throw 'Argument Missing!'

        let data = await ytFetcher(args.join(' '))
        console.log(data);

        let reply = new Reply(message)
        reply.setTitle('YouTube')

        if (data == null || data.items[0].id.videoId == null) {
            reply.addField('Error', 'No video found for that input!')
            reply.send()
            return
        }
        let link = `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`
        reply.getEmbed().setURL(link)
        reply.send(link)
    }

}

module.exports = Youtube