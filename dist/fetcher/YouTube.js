"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.YouTube = async (search) => {
    const url = `https://content.googleapis.com/youtube/v3/search?part=snippet&q=${search}&safeSearch=moderate&key=${process.env.YOUTUBE_API}`;
    try {
        const response = await node_fetch_1.default(url);
        if (response.ok)
            return await response.json();
        else
            return null;
    }
    catch (error) {
        return null;
    }
};
