import fetch from 'node-fetch';

export const xkcdFetcher = async (input: string | null = null): Promise<any> => {
    let url = `https://xkcd.com/${input}/info.0.json`;

    if (!input) {
        url = `https://xkcd.com/info.0.json`;
    }

    try {
        const response = await fetch(url);
        return await response.json()
    } catch (error) {
        return null
    }
};
