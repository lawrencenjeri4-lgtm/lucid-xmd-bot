const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const yts = require('yt-search');

const token = process.env.BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const bot = new TelegramBot(token, {
  polling: true
});

console.log('✅ Lucid XMD Bot Running...');

bot.on('polling_error', (error) => {
  console.log(error);
});



// START COMMAND

bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id,
`👋 Welcome to Lucid XMD Bot!

⚡ AI Powered Telegram Bot
🔥 Fast & Powerful

Use /menu to explore commands.`);

});



// MENU COMMAND

bot.onText(/\/menu/, (msg) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId,
`╭━━━〔 LUCID XMD 〕━━⬣
┃ 🤖 AI Powered Bot
┃ ⚡ Status: Online
┃ 👨‍💻 Developer: Lucid
╰━━━━━━━━━━━━━━⬣

Choose an option below 👇`,
{
  reply_markup: {
    inline_keyboard: [

      [
        { text: '🤖 AI Chat', callback_data: 'ai' },
        { text: '🎵 Music', callback_data: 'music' }
      ],

      [
        { text: '🎬 TikTok', callback_data: 'tiktok' },
        { text: '⚙️ Tools', callback_data: 'tools' }
      ],

      [
        { text: '👑 Owner', callback_data: 'owner' },
        { text: '❓ Help', callback_data: 'help' }
      ]

    ]
  }
});

});



// BUTTON RESPONSES

bot.on('callback_query', async (query) => {

  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'ai') {

    bot.sendMessage(chatId,
`🤖 AI COMMANDS

/ai hello
/ai write a poem
/ai explain coding`);

  }

  else if (data === 'music') {

    bot.sendMessage(chatId,
`🎵 MUSIC COMMANDS

/ytmp3 believer`);

  }

  else if (data === 'tiktok') {

    bot.sendMessage(chatId,
`🎬 TIKTOK DOWNLOADER

Usage:
/tiktok TikTokLink`);

  }

  else if (data === 'tools') {

    bot.sendMessage(chatId,
`⚙️ UTILITIES

/menu
/help`);

  }

  else if (data === 'owner') {

    bot.sendMessage(chatId,
`👑 OWNER INFO

Developer: Lucid Tech Solutions`);

  }

  else if (data === 'help') {

    bot.sendMessage(chatId,
`❓ HELP MENU

Use:
/menu`);

  }

});



// HELP COMMAND

bot.onText(/\/help/, (msg) => {

  bot.sendMessage(msg.chat.id,
`🆘 Lucid XMD Help

/menu - Open menu
/ai - Chat with AI
/ytmp3 - Search songs
/tiktok - Download TikTok`);

});



// AI COMMAND

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

    console.log(error.response?.data || error.message);

    bot.sendMessage(chatId,
'❌ AI request failed.');

  }

});



// YOUTUBE SEARCH

bot.onText(/\/ytmp3 (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const query = match[1];

  bot.sendMessage(chatId, '🔍 Searching song...');

  try {

    const search = await yts(query);

    const video = search.videos[0];

    if (!video) {

      return bot.sendMessage(chatId,
      '❌ Song not found.');

    }

    bot.sendMessage(chatId,
`🎵 Found Song

📌 Title:
${video.title}

🔗 Link:
${video.url}`);

  } catch (error) {

    console.log(error);

    bot.sendMessage(chatId,
'❌ Failed to search song.');

  }

});



// TIKTOK DOWNLOADER

bot.onText(/\/tiktok (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const url = match[1];

  bot.sendMessage(chatId,
'📥 Downloading TikTok video...');

  try {

    const apiUrl =
`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;

    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.data) {

      return bot.sendMessage(chatId,
      '❌ Invalid TikTok link.');

    }

    const videoUrl = response.data.data.play;

    if (!videoUrl) {

      return bot.sendMessage(chatId,
      '❌ Failed to get TikTok video.');

    }

    await bot.sendVideo(chatId, videoUrl, {
      caption: '✅ TikTok downloaded successfully'
    });

  } catch (error) {

    console.log(error.response?.data || error.message);

    bot.sendMessage(chatId,
`❌ TikTok download failed.

Try another TikTok link.`);

  }

});
