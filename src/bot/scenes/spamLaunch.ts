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

}
