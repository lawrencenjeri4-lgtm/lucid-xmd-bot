const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const yts = require('yt-search');

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
        { text: '📥 Downloaders', callback_data: 'download' },
        { text: '⚙️ Utilities', callback_data: 'tools' }
      ],

      [
        { text: '👑 Owner', callback_data: 'owner' },
        { text: '❓ Help', callback_data: 'help' }
      ]

    ]
  }
});

});

bot.on('callback_query', async (query) => {

  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'ai') {

    bot.sendMessage(chatId,
`🤖 AI COMMANDS

/ai hello
/ai write a poem`);

  }

  else if (data === 'music') {

    bot.sendMessage(chatId,
`🎵 MUSIC COMMANDS

/ytmp3 believer`);

  }

  else if (data === 'download') {

    bot.sendMessage(chatId,
`📥 DOWNLOADER COMMANDS

/tiktok link
/instagram link`);

  }

  else if (data === 'tools') {

    bot.sendMessage(chatId,
`⚙️ UTILITIES

/weather
/sticker`);

  }

  else if (data === 'owner') {

    bot.sendMessage(chatId,
`👑 OWNER INFO

Developer: Lucid Tech Solutions`);

  }

  else if (data === 'help') {

    bot.sendMessage(chatId,
`❓ HELP MENU

Use /menu to access commands.`);

  }

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
`🎵 Found:

${video.title}

🔗 ${video.url}`);

  } catch (error) {

    console.log(error);

    bot.sendMessage(chatId,
'❌ Failed to fetch song.');

  }

});

bot.onText(/\/tiktok (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const link = match[1];

  bot.sendMessage(chatId,
`🎬 TikTok Downloader

🔗 Your link:
${link}

⚠️ Full downloader API coming soon 😎`);

});

bot.onText(/\/instagram (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const link = match[1];

  bot.sendMessage(chatId,
`📸 Instagram Downloader

🔗 Your link:
${link}

⚠️ Full downloader API coming soon 😎`);

});

console.log('Lucid XMD Bot Running...');
