import {Bot,Context} from 'grammy';
import {getMainMenuKeyboard} from '../keyboards/mainMenu.ts';

export function registerNavigatorHandler(bot:Bot<Context>){
    bot.callbackQuery("back_to_home",async(ctx)=>{
        await ctx.answerCallbackQuery();
        await ctx.reply("🏠 Back to main menu:",{
            reply_markup:getMainMenuKeyboard()
        })
    });
}