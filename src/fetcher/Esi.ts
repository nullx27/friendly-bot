import fetch from "node-fetch";

const baseUrl = "https://esi.evetech.net/latest";

const url = function (resource: String) {
    return `${baseUrl}/${resource}/?datasource=tranquility`;
};

export const fetchStatus = async () => {
    try {
        const response = await fetch(url('status'));
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const fetchCharacter = async (id: String) => {
    try {
        const response = await fetch(url(`characters/${id}`));
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const fetchCorporation = async (id: String) => {
    try {
        const response = await fetch(url(`corporations/${id}`));
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const fetchAlliance = async (id: String) => {
    try {
        const response = await fetch(url(`alliances/${id}`));
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const fetchKillmail = async (id: string, hash: string) => {
    const res = `https://esi.evetech.net/latest/killmails/${id}/${hash}/?datasource=tranquility`;

    try {
        const response = await fetch(res);
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const fetchType = async (typeId: String) => {
    try {
        const response = await fetch(url(`universe/types/${typeId}`));
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const fetchSystem = async (systemId: String) => {
    try {
        const response = await fetch(url(`universe/systems/${systemId}`));
        return await response.json();
    } catch (error) {
        return null;
    }
};