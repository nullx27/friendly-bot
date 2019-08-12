"use strict";
// @ts-nocheck
'use strcit';
const fs = require('fs');
const path = require('path');
const decache = require('decache');
function loader(directory, bot) {
    let items = fs.readdirSync(directory);
    let folders = items.filter(f => {
        return fs.lstatSync(path.join(directory, f)).isDirectory();
    });
    let subcommands = folders.map(folder => {
        return loader(path.join(directory, folder), bot);
    });
    let files = items.filter(f => f.indexOf('.js') > -1);
    let commands = files.map(file => {
        const fullPath = path.join(directory, file);
        decache(path.join(directory, file));
        const Cmd = require(require.resolve(fullPath));
        if (Object.prototype.toString.call(Cmd) === '[object Function]') {
            return new Cmd(bot);
        }
    });
    // flatten the subcommands array and merge it with the other one
    return commands.concat([].concat(...subcommands));
}
module.exports = loader;
