import { Bot, Context, InlineKeyboard } from "grammy";

interface BumpState {
  expecting: boolean;
  timeoutId?: NodeJS.Timeout;
}

export const userBumpState = new Map<number, BumpState>();
export const userCTOInput: Record<number, string> = {};

export function registerMainMenuCallBacks(bot: Bot<Context>) {
  // "Your Projects"
  bot.callbackQuery("your_projects", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("Showing your projects...",{
      parse_mode:"Markdown",
      reply_markup:new InlineKeyboard()
      .text("🔙 Back to Menu", "back_to_home"),
    });
  });

  // "Create New Project"
  bot.callbackQuery("create_project", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("Creating new project...");
  });
  

  // "BUMP BOT"
  bot.callbackQuery("bump_bot", async (ctx) => {
    await ctx.answerCallbackQuery();
    const userId = ctx.from!.id;

    // Clear previous timeout
    const existing = userBumpState.get(userId);
    if (existing?.timeoutId) clearTimeout(existing.timeoutId);

    // Set new timeout
    const timeoutId = setTimeout(async () => {
      userBumpState.delete(userId);
      await ctx.reply("⌛ CTO creation timed out. Please try again.", {
        reply_markup: new InlineKeyboard().text("🔁 Try Again", "bump_bot"),
      });
    }, 60_000); // 60 seconds

    // Save state
    userBumpState.set(userId, { expecting: true, timeoutId });

    await ctx.reply("🤖 Please send the token address you want to create a CTO for:");
  });
}
