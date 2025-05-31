import { Bot, Context } from "grammy";
import { userMetadataState, getSpamLaunchMenu } from "../keyboards/spamLaunch.ts";
import { userReferralState } from "../scenes/referrals.ts";
import { userBumpState, userCTOInput } from "../scenes/mainMenu.ts";

export function registerTextInputHandler(bot: Bot<Context>) {
  bot.on("message:text", async (ctx) => {
    const userId = ctx.from!.id;
    const text = ctx.message.text.trim();

    // Handle Spam Launch metadata input
    const metadata = userMetadataState.get(userId);
    if (metadata?.currentField) {
      const updatedValues = {
        ...metadata.values,
        [metadata.currentField]: text,
      };

      userMetadataState.set(userId, {
        currentField: undefined,
        values: updatedValues,
        menuMessageId: metadata.menuMessageId,
      });

      await ctx.reply(`✅ *${metadata.currentField.toUpperCase()}* updated to: *${text}*`, {
        parse_mode: "Markdown",
      });

      if (metadata.menuMessageId) {
        await ctx.api.editMessageReplyMarkup(ctx.chat.id, metadata.menuMessageId, {
          reply_markup: getSpamLaunchMenu(updatedValues),
        });
      }
      return;
    }

    // Handle Referral input
    const referralState = userReferralState.get(userId);
    if (referralState?.expectingInput) {
      const valid = /^[a-zA-Z0-9]{4,15}$/.test(text);
      if (!valid) {
        await ctx.reply("❌ Invalid code. Use 4–15 letters or numbers, no spaces/symbols.");
        return;
      }

      userReferralState.set(userId, { expectingInput: false });
      await ctx.reply(`✅ Referral code *${text}* saved successfully!`, {
        parse_mode: "Markdown",
      });
      return;
    }

    // Handle Bump input
    const bumpState = userBumpState.get(userId);
    if (bumpState?.expecting) {
      if (bumpState.timeoutId) clearTimeout(bumpState.timeoutId);
      userCTOInput[userId] = text;
      userBumpState.delete(userId);

      await ctx.reply(`✅ Token address received:\n\`${text}\``, {
        parse_mode: "Markdown",
      });
      return;
    }

    // Fallback (no handler matched)
    await ctx.reply("❓ Unexpected message. Please use the menu to continue.");
  });
}
