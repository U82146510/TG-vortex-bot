import { Bot, Context, InlineKeyboard } from "grammy";

export const userReferralState = new Map<number, { expectingInput: boolean }>();

export function registerReferralScene(bot: Bot<Context>) {
  // Show referral stats + buttons
  bot.callbackQuery("referrals", async (ctx) => {
    await ctx.answerCallbackQuery();
    const referralCode = ""; // Replace with stored code if needed

    const keyboard = new InlineKeyboard()
      .text("🎯 Create Referral", "create_referral")
      .text("🔙 Back to Menu", "back_to_home");

    await ctx.reply(
      `🤝 *Your Referral Program*

Your Link: https://t.me/DeployOnVortexBot?start=${referralCode}

Stats:
• Total Referrals: 0
• Referral %: 28%
• Unpaid Earnings: 0.0000 SOL
• Paid Earnings: 0.0000 SOL
• Total Earnings: 0.0000 SOL

Share your link to grow the community!`,
      {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      }
    );
  });

  // Ask for referral code input
  bot.callbackQuery("create_referral", async (ctx) => {
    await ctx.answerCallbackQuery();
    const userId = ctx.from.id;
    userReferralState.set(userId, { expectingInput: true });

    await ctx.reply(
      `🎯 *Create Your Custom Referral*

Please enter your desired referral code.

Requirements:
• Only letters and numbers
• 4-15 characters long
• No spaces or special characters`,
      {
        parse_mode: "Markdown",
      }
    );
  });
}
