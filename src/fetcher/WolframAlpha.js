'use strict';

const fetch = require('node-fetch');

const WolframAlpha = async (input) => {
    const url = `https://api.wolframalpha.com/v2/query?input=${input}&output=JSON&appid=${process.env.WOLFRAMALPHA_API}`;

    try {
        const response = await fetch(url);
        return response.json();
    } catch (error) {
        return null;
    }
};

module.exports = WolframAlpha;