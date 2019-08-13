import {FriendlyBot} from './core/FriendlyBot';
import {Container} from './core/utils/Container';

const container = new Container();

let config = require('dotenv').config();
console.log(config);
container.register<Object>('config', config.parsed);

let bot: FriendlyBot = new FriendlyBot(container);
bot.run();