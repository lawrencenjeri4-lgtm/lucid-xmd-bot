const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const bot = new TelegramBot(token, {
  polling: true
});

bot.on('polling_error', (error) => {
  console.log(error);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`👋 Welcome to Lucid XMD Bot!

Use /menu to explore features.`);
});

bot.onText(/\/menu/, (msg) => {
  bot.sendMessage(msg.chat.id,
`📜 LUCID XMD MENU

🤖 AI
/ai hello

🎵 Downloads
/spotify
/ytmp3
/tiktok`);
});

bot.onText(/\/ai (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const prompt = match[1];

  bot.sendMessage(chatId, '🤖 Thinking...');

  try {

    const response = await axios({
      method: 'post',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }
    });

    const reply = response.data.choices[0].message.content;

    bot.sendMessage(chatId, reply);

  } catch (error) {

    console.log(error.response?.data || error.message);

    bot.sendMessage(chatId,
`${JSON.stringify(error.response?.data || error.message, null, 2)}`);

  }

});

console.log('Lucid XMD Bot Running...');
