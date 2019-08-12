import fetch from "node-fetch";

export const Imgur = async (channel: string, type: string) => {
    const url = `https://imgur.com/r/${channel}/${type}.json`;

    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        return null;
    }
};