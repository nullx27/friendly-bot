'use strict';

const fetch = require('node-fetch');


const EveOnlineStatus = async (logger) => {
    const url = 'https://esi.evetech.net/dev/status/?datasource=tranquility';

    try {
        const response = await fetch(url);
        logger.debug('Fetched eve online status');
        return response.json();
    } catch (error) {
        logger.warn('Can not fetch eve online status with error: ' + error);
        return null;
    }
};

module.exports = EveOnlineStatus;