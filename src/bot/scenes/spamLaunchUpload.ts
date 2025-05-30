import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { Api, Bot, Context } from "grammy";
import { userMetadataState } from '../keyboards/spamLaunch.ts';
import { getSpamLaunchMenu } from '../keyboards/spamLaunch.ts';

function isImageFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
}

export function registerSpamLaunchUpload(bot: Bot<Context, Api>): void {
  bot.on("message:photo", async (ctx) => {
    const userID = ctx.from!.id;
    const state = userMetadataState.get(userID);

    if (!state || state.currentField !== 'image') return;

    try {
        const photo = ctx.message.photo.at(-1);
        if (!photo) throw new Error("No photo found in the message");

        const file = await ctx.api.getFile(photo.file_id);
        if (!file.file_path) {
            throw new Error("Missing file_path from Telegram API");
        }
        if (!isImageFile(file.file_path)) {
            throw new Error(`Invalid image type (not jpg/png/gif/webp): ${file.file_path}`);
        }
        const fileUrl = `https://api.telegram.org/file/bot${process.env.bot_token}/${file.file_path}`;
        const filename = `user_${userID}_image_${Date.now()}.jpg`;
        const outputPath = path.resolve("uploads", filename);

        fs.mkdirSync("uploads", { recursive: true });

        const response = await fetch(fileUrl);
        if (!response.ok || !response.body) {
            throw new Error("Failed to download the image from Telegram servers");
        }

        const fileStream = fs.createWriteStream(outputPath);
        await pipeline(response.body, fileStream);

        const updatedValues = {
            ...state.values,
            image: filename,
        };

        userMetadataState.set(userID, {
            currentField: undefined,
            values: updatedValues,
        });

        await ctx.reply("✅ *Image* saved successfully!", { parse_mode: "Markdown" });

        await ctx.reply("📄 Updated Metadata Menu:", {
            reply_markup: getSpamLaunchMenu(updatedValues),
        });
    } catch (err) {
      await ctx.reply("❌ Something went wrong while processing your image. Please try again.");
    }
  });
}