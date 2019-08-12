import fetch, {Response} from 'node-fetch';

export const YouTube = async (search: string) => {
    const url = `https://content.googleapis.com/youtube/v3/search?part=snippet&q=${search}&safeSearch=moderate&key=${process.env.YOUTUBE_API}`;

    try {
        const response: Response = await fetch(url);
        if (response.ok)
            return await response.json();
        else
            return null
    } catch (error) {
        return null
    }
};