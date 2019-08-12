import fetch from "node-fetch";

export const EveOnlineStatus = async () => {
    const url = 'https://esi.evetech.net/dev/status/?datasource=tranquility';

    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        return null;
    }
};