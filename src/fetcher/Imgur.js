'use strict';

const fetch = require('node-fetch');

const Imgur = async (channel, type) => {
    const url = `https://imgur.com/r/${channel}/${type}.json`;

    try {
        const response = await fetch(url);
        return response.json();
    } catch (error) {
        logger.warn('Can not fetch eve online status with error: ' + error);
        return null;
    }
};

module.exports = Imgur;