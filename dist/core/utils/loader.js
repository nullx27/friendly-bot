"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var decache_1 = __importDefault(require("decache"));
function loader(directory, container) {
    var items = fs_1.default.readdirSync(directory);
    var folders = items.filter(function (f) {
        return fs_1.default.lstatSync(path_1.default.join(directory, f)).isDirectory();
    });
    var subcommands = folders.map(function (folder) {
        return loader(path_1.default.join(directory, folder), container);
    });
    var files = items.filter(function (f) { return f.indexOf('.js') > -1; });
    var commands = files.map(function (file) {
        var fullPath = path_1.default.join(directory, file);
        decache_1.default(path_1.default.join(directory, file));
        var Cmd = require(require.resolve(fullPath));
        if (Object.prototype.toString.call(Cmd) === '[object Function]') {
            return new Cmd(container);
        }
    });
    // flatten the subcommands array and merge it with the other one
    return commands.concat([].concat.apply([], subcommands));
}
exports.default = loader;
