import fs from "fs";
import path from "path";
import decache from "decache";
import {Container} from "./Container";

export default function loader (directory: string, container: Container): any {
    let items = fs.readdirSync(directory);

    let folders = items.filter(f => {
        return fs.lstatSync(path.join(directory, f)).isDirectory()
    });

    let subcommands = folders.map(folder => {
        return loader(path.join(directory, folder), container)
    });

    let files = items.filter(f => f.indexOf('.js') > -1);

    let commands = files.map(file => {
        const fullPath = path.join(directory, file);

        decache(path.join(directory, file));

        const Cmd = require(require.resolve(fullPath));

        if (Object.prototype.toString.call(Cmd) === '[object Function]') {
            return new Cmd(container)
        }
    });

    // flatten the subcommands array and merge it with the other one
    return commands.concat([].concat(...subcommands))
}