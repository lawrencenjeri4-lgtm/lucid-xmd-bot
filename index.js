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



// ================= START =================

bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id,
`👋 Welcome to Lucid XMD Bot!

⚡ AI Powered Telegram Bot
🔥 Fast & Powerful

Use /menu to explore commands.`);

});



// ================= MENU =================

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
        { text: '📸 Instagram', callback_data: 'instagram' }
      ],

      [
        { text: '⚙️ Tools', callback_data: 'tools' },
        { text: '❓ Help', callback_data: 'help' }
      ]

    ]
  }
});

});



// ================= BUTTONS =================

bot.on('callback_query', async (query) => {

  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'ai') {

    bot.sendMessage(chatId,
`🤖 AI COMMANDS

/ai hello
/ai explain coding
/ai write a poem`);

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

  else if (data === 'instagram') {

    bot.sendMessage(chatId,
`📸 INSTAGRAM DOWNLOADER

Usage:
/instagram InstagramLink`);

  }

  else if (data === 'tools') {

    bot.sendMessage(chatId,
`⚙️ TOOLS

/menu
/help`);

  }

  else if (data === 'help') {

    bot.sendMessage(chatId,
`❓ HELP MENU

/menu - Open menu
/ai - Chat with AI
/ytmp3 - Search songs
/tiktok - Download TikTok
/instagram - Instagram info`);

  }

});



// ================= HELP =================

bot.onText(/\/help/, (msg) => {

  bot.sendMessage(msg.chat.id,
`🆘 Lucid XMD Help

/menu - Open menu
/ai - Chat with AI
/ytmp3 - Search songs
/tiktok - Download TikTok
/instagram - Instagram info`);

});



// ================= AI =================

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



// ================= YOUTUBE SEARCH =================

bot.onText(/\/ytmp3 (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const query = match[1];

  bot.sendMessage(chatId,
'🔍 Searching song...');

  try {

    const search = await yts(query);

    const video = search.videos[0];

    if (!video) {

      return bot.sendMessage(chatId,
      '❌ Song not found.');

    }

    bot.sendMessage(chatId,
`🎵 Found Song

📌 ${video.title}

🔗 ${video.url}`);

  } catch (error) {

    console.log(error);

    bot.sendMessage(chatId,
'❌ Failed to search song.');

  }

});



// ================= TIKTOK DOWNLOADER =================

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
'❌ TikTok download failed.');

  }

});



// ================= INSTAGRAM =================

bot.onText(/\/instagram (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const url = match[1];

  if (!url.includes('instagram.com')) {

    return bot.sendMessage(chatId,
    '❌ Please provide a valid Instagram link.');

  }

  bot.sendMessage(chatId,
`📸 Instagram Downloader

⚠️ Instagram API is temporarily unavailable.

🔗 Your Link:
${url}`);

});
// ================= FUN COMMANDS =================

// Joke Command
bot.command("joke", async (ctx) => {
  const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs 😅",
    "Why did the bot go broke? Because it used too many APIs 😂",
    "Why was JavaScript sad? Because it didn’t Node how to Express itself 😭",
    "Why did the developer sleep well? Because they fixed all bugs 😎"
  ];

  const random = jokes[Math.floor(Math.random() * jokes.length)];

  ctx.reply(`😂 Joke:\n\n${random}`);
});

// Quote Command
bot.command("quote", async (ctx) => {
  const quotes = [
    "Success starts with consistency.",
    "Dream big. Start small. Act now.",
    "Discipline beats motivation.",
    "Every expert was once a beginner.",
    "Your future is created by what you do today."
  ];

  const random = quotes[Math.floor(Math.random() * quotes.length)];

  ctx.reply(`✨ Quote:\n\n"${random}"`);
});

// Fact Command
bot.command("fact", async (ctx) => {
  const facts = [
    "🐙 Octopuses have 3 hearts.",
    "⚡ Lightning is hotter than the sun.",
    "🦒 A giraffe’s tongue is purple.",
    "🌍 Earth is the only known planet with life.",
    "💧 Hot water freezes faster than cold water sometimes."
  ];

  const random = facts[Math.floor(Math.random() * facts.length)];

  ctx.reply(`📚 Random Fact:\n\n${random}`);
});

// Truth Command
bot.command("truth", async (ctx) => {
  const truths = [
    "What is your biggest fear?",
    "Who was your first crush?",
    "What secret have you never told anyone?",
    "What is your most embarrassing moment?",
    "Have you ever lied to your best friend?"
  ];

  const random = truths[Math.floor(Math.random() * truths.length)];

  ctx.reply(`🤫 Truth Question:\n\n${random}`);
});

// Dare Command
bot.command("dare", async (ctx) => {
  const dares = [
    "Send a funny selfie 😂",
    "Sing your favorite song 🎤",
    "Text someone 'I miss you' 😅",
    "Talk in a robot voice for 1 minute 🤖",
    "Dance without music for 30 seconds 💃"
  ];

  const random = dares[Math.floor(Math.random() * dares.length)];

  ctx.reply(`😈 Dare Challenge:\n\n${random}`);
});

// Ship Command
bot.command("ship", async (ctx) => {
  const text = ctx.message.text.split(" ").slice(1).join(" ");

  if (!text.includes("&")) {
    return ctx.reply("❌ Use format:\n/ship name1 & name2");
  }

  const names = text.split("&");

  const name1 = names[0].trim();
  const name2 = names[1].trim();

  const percentage = Math.floor(Math.random() * 101);

  let result = "💔 Not compatible";

  if (percentage > 50) result = "❤️ Cute couple";
  if (percentage > 75) result = "💍 Perfect match";
  if (percentage > 90) result = "🔥 Soulmates";

  ctx.reply(
    `💘 Love Calculator\n\n${name1} ❤️ ${name2}\n\nCompatibility: ${percentage}%\n${result}`
  );
});

// Meme Command
bot.command("meme", async (ctx) => {
  const memes = [
    "https://i.imgflip.com/30b1gx.jpg",
    "https://i.imgflip.com/1bij.jpg",
    "https://i.imgflip.com/26am.jpg",
    "https://i.imgflip.com/4t0m5.jpg"
  ];

  const random = memes[Math.floor(Math.random() * memes.length)];

  ctx.replyWithPhoto(random, {
    caption: "😂 Random Meme"
  });
});
