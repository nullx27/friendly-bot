"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.wolframAlphaFetcher = async (input) => {
    const url = `https://api.wolframalpha.com/v2/query?input=${input}&output=JSON&appid=${process.env.WOLFRAMALPHA_API}`;
    try {
        const response = await node_fetch_1.default(url);
        return await response.json();
    }
    catch (error) {
        return null;
    }
};
