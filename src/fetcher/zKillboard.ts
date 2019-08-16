import fetch from "node-fetch";

export const fetchzKill = async (killId: string) => {
    const url = `https://zkillboard.com/api/killID/${killId}/`;

    try {
        const response = await fetch(url, {'headers': {'User-Agent': 'friendly-bot, Maintainer: Grimm <necrotex@gmail.com>'}});
        return await response.json();
    } catch (error) {
        return null;
    }
};