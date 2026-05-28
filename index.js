const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id,
`👋 Welcome to Lucid XMD Bot

Use /menu to view commands.`);
});

bot.onText(/\/menu/, (msg) => {
    bot.sendMessage(msg.chat.id,
`📜 Lucid XMD Menu

🤖 AI Commands
/ai

🎵 Downloaders
/spotify
/ytmp3
/tiktok

👥 Group Tools
/tagall

🛠 Utilities
/sticker
/weather

👨‍💻 Developed by Lucid Tech Solutions`);
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id,
`🆘 Need help?

Contact the bot developer.`);
});

console.log('Lucid XMD Bot Running...');
