import {Api, Bot, Context} from 'grammy';
import dotnev from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {registerStartCommand} from './commands/start.ts';
import {registerMainMenuCallBacks} from './scenes/mainMenu.ts';
import {registerSpamLaunchScene} from './scenes/spamLaunch.ts';
import {registerMetadataFieldHandlers} from './keyboards/spamLaunch.ts';
import {registerSpamLaunchUpload} from './scenes/spamLaunchUpload.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotnev.config({
    path:path.resolve(__dirname,'../../.env')
});

const token = process.env.bot_token;
if(!token){
    throw new Error('missing bot token');
};

const bot:Bot<Context,Api> = new Bot(token);

registerStartCommand(bot);
registerMainMenuCallBacks(bot);
registerSpamLaunchScene(bot);
registerMetadataFieldHandlers(bot);
registerSpamLaunchUpload(bot);

bot.start()