"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.EveOnlineStatus = async () => {
    const url = 'https://esi.evetech.net/dev/status/?datasource=tranquility';
    try {
        const response = await node_fetch_1.default(url);
        return await response.json();
    }
    catch (error) {
        return null;
    }
};
