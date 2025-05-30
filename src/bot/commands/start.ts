import { Context,Bot} from "grammy";
import {getMainMenuKeyboard} from '../keyboards/mainMenu.ts';

export function registerStartCommand(bot:Bot<Context>) {
    bot.command('start',(ctx:Context)=>{
       ctx.reply( `Yo, @${ctx.from?.username || "anon"}! Great to see you back! 🔥

What's the move, boss? Wanna mint some fresh heat or clip profits from your existing bag? 💸

Hit the buttons below and let's make it happen:`,{
    reply_markup:getMainMenuKeyboard() 
    });
})}