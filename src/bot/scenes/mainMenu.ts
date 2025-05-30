import { Bot,Context } from "grammy";

export function registerMainMenuCallBacks(bot:Bot<Context>){
    bot.callbackQuery("your_projects", async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.reply("Showing your projects...");
    });

    bot.callbackQuery("create_project", async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.reply("Creating new project...");
    });
};