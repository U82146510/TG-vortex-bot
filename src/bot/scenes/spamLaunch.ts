import { Bot, Context } from "grammy";
import { userMetadataState, getSpamLaunchMenu } from "../keyboards/spamLaunch.ts";

export function registerSpamLaunchScene(bot: Bot<Context>) {
  bot.callbackQuery("spam_launch", async (ctx) => {
    await ctx.answerCallbackQuery();
    const userId = ctx.from!.id;
    const values = userMetadataState.get(userId)?.values || {};

    const sent = await ctx.reply(
      `🎯 Project Metadata\n\nSelect a field to edit:\n\n❌ Metadata not yet deployed`,
      {
        reply_markup: getSpamLaunchMenu(values),
      }
    );

    userMetadataState.set(userId, {
      ...userMetadataState.get(userId),
      values,
      currentField: undefined,
      menuMessageId: sent.message_id,
    });
  });

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

    // Save updated metadata and clear the current field
    userMetadataState.set(userId, {
      ...state,
      currentField: undefined,
      values: updatedValues,
    });

    await ctx.reply(`✅ *${field.toUpperCase()}* updated to: *${value}*`, {
      parse_mode: "Markdown",
    });

    // Update the existing message with new keyboard
    if (state.menuMessageId) {
      await ctx.api.editMessageReplyMarkup(ctx.chat.id, state.menuMessageId, {
        reply_markup: getSpamLaunchMenu(updatedValues),
      });
    }
  });
}
