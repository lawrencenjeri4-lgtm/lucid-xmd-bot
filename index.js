const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const yts = require('yt-search');

const token = process.env.BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

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
`╭━━━〔 LUCID XMD 〕━━⬣
┃ 🤖 AI Powered Bot
┃ ⚡ Status: Online
┃ 👨‍💻 Developer: Lucid
╰━━━━━━━━━━━━━━⬣

Choose an option below 👇`);

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
        model: 'llama-3.3-70b-versatile',
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

    console.log(error);

    bot.sendMessage(chatId,
'❌ AI request failed.');

  }

});

bot.onText(/\/ytmp3 (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const query = match[1];

  bot.sendMessage(chatId, '🔍 Searching song...');

  try {

    const search = await yts(query);

    const video = search.videos[0];

    if (!video) {
      return bot.sendMessage(chatId, '❌ Song not found.');
    }

    bot.sendMessage(chatId,
`🎵 ${video.title}

🔗 ${video.url}`);

  } catch (error) {

    console.log(error);

    bot.sendMessage(chatId,
'❌ Failed to fetch song.');

  }

});

bot.onText(/\/tiktok (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const url = match[1];

  bot.sendMessage(chatId, '📥 Downloading TikTok video...');

  try {

    const api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;

    const response = await axios.get(api);

    const video = response.data.data.play;

    await bot.sendVideo(chatId, video, {
      caption: '✅ TikTok downloaded successfully'
    });

  } catch (error) {

    console.log(error);

    bot.sendMessage(chatId,
'❌ Failed to download TikTok video.');

  }

});

console.log('Lucid XMD Bot Running...');
