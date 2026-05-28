const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const bot = new TelegramBot(token, {
  polling: true
});

bot.on('polling_error', console.log);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`👋 Welcome to Lucid XMD Bot!

Use /menu to explore features.`);
});

bot.onText(/\/menu/, (msg) => {
  bot.sendMessage(msg.chat.id,
`📜 LUCID XMD MENU

🤖 AI
/ai

🎵 Downloads
/spotify
/ytmp3
/tiktok

🛠 Utilities
/weather
/sticker`);
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id,
`🆘 Need help?

Developer: Lucid Tech Solutions`);
});

bot.onText(/\/ai (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const prompt = match[1];

  bot.sendMessage(chatId, '🤖 Thinking...');

  try {

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    bot.sendMessage(chatId, reply);

  } catch (error) {

    console.log(error.response?.data || error.message);

    bot.sendMessage(chatId,
    '❌ AI request failed.');

  }

});

console.log('Lucid XMD Bot Running...');
