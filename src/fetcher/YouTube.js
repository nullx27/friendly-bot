'use strict'

const fetch = require('node-fetch')

const YouTube = async (search) => {
    const url = `https://content.googleapis.com/youtube/v3/search?part=snippet&q=${search}&safeSearch=moderate&key=${process.env.YOUTUBE_API}`
    console.log(url)

    try {
        const response = await fetch(url)
        if (response.ok())
            return response.json()
        else
            return null
    } catch (error) {
        return null
    }
}

module.exports = YouTube