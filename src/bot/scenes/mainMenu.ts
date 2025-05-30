import { Bot, Context, InlineKeyboard } from "grammy";

interface BumpState {
  expecting: boolean;
  timeoutId?: NodeJS.Timeout;
}

const userBumpState = new Map<number, BumpState>();
const userCTOInput: Record<number, string> = {};

export function registerMainMenuCallBacks(bot: Bot<Context>) {
  // "Your Projects"
  bot.callbackQuery("your_projects", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("Showing your projects...");
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

  // Handle text input
  bot.on("message:text", async (ctx) => {
    const userId = ctx.from!.id;
    const state = userBumpState.get(userId);

    if (!state?.expecting) return;

    // Cancel timeout and store token
    if (state.timeoutId) clearTimeout(state.timeoutId);

    const tokenAddress = ctx.message.text.trim();
    userCTOInput[userId] = tokenAddress;
    userBumpState.delete(userId);

    await ctx.reply(`✅ Token address received:\n\`${tokenAddress}\``, {
      parse_mode: "Markdown",
    });

    // You can continue logic here (e.g., validation, next step)
  });
}
