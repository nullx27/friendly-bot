import fetch from 'node-fetch';

export const wolframAlphaFetcher = async (input: string) => {
    const url = `https://api.wolframalpha.com/v2/query?input=${input}&output=JSON&appid=${process.env.WOLFRAMALPHA_API}`;

    try {
        const response = await fetch(url);
        return await response.json()
    } catch (error) {
        return null
    }
};