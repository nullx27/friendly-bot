"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../models/Command");
const SimpleReply_1 = require("../models/messages/SimpleReply");
let Ping = class Ping extends Command_1.Command {
    async handle(message, args) {
        new SimpleReply_1.SimpleReply(message, 'pong').send();
    }
};
Ping = __decorate([
    Command_1.trigger('ping')
], Ping);
module.exports = Ping;
