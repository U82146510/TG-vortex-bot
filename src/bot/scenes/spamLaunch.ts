import { Bot, Context } from "grammy";
import { userMetadataState, getSpamLaunchMenu } from "../keyboards/spamLaunch.ts";

export function registerSpamLaunchScene(bot: Bot<Context>) {
  // Existing handler
  bot.callbackQuery("spam_launch", async (ctx) => {
    await ctx.answerCallbackQuery();
    const userId = ctx.from!.id;
    const values = userMetadataState.get(userId)?.values || {};

    await ctx.reply(
      `🎯 Project Metadata

Select a field to edit:

❌ Metadata not yet deployed`,
      {
        reply_markup: getSpamLaunchMenu(values),
      }
    );
  });

  // 🆕 Handle text input after button press
  bot.on("message:text", async (ctx) => {
    const userId = ctx.from!.id;
    const state = userMetadataState.get(userId);

    if (!state?.currentField) return;

    const field = state.currentField;
    const value = ctx.message.text;

    const updatedValues = {
      ...state.values,
      [field]: value,
    };

    userMetadataState.set(userId, {
      currentField: undefined,
      values: updatedValues,
    });

    await ctx.reply(`✅ *${field.toUpperCase()}* updated to: *${value}*`, {
      parse_mode: "Markdown",
    });

    await ctx.reply("📄 Updated Metadata Menu:", {
      reply_markup: getSpamLaunchMenu(updatedValues),
    });
  });
}
