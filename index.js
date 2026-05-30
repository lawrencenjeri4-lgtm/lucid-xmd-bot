const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const yts = require('yt-search');
const translate = require('@vitalets/google-translate-api');
const startTime = Date.now();
const fs = require('fs');
const path = require('path');

const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);


ffmpeg.setFfmpegPath(ffmpegPath);
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Lucid XMD Bot Running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

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

// Joke
bot.onText(/\/joke/, async (msg) => {
  const chatId = msg.chat.id;

  const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs 😅",
    "Why did the bot go broke? Because it used too many APIs 😂",
    "Why was JavaScript sad? Because it didn’t Node how to Express itself 😭",
    "Why did the developer sleep well? Because they fixed all bugs 😎"
  ];

  const random = jokes[Math.floor(Math.random() * jokes.length)];

  bot.sendMessage(chatId, `😂 Joke:\n\n${random}`);
});

// Quote
bot.onText(/\/quote/, async (msg) => {
  const chatId = msg.chat.id;

  const quotes = [
    "Success starts with consistency.",
    "Dream big. Start small. Act now.",
    "Discipline beats motivation.",
    "Every expert was once a beginner.",
    "Your future is created by what you do today."
  ];

  const random = quotes[Math.floor(Math.random() * quotes.length)];

  bot.sendMessage(chatId, `✨ Quote:\n\n"${random}"`);
});

// Fact
bot.onText(/\/fact/, async (msg) => {
  const chatId = msg.chat.id;

  const facts = [
    "🐙 Octopuses have 3 hearts.",
    "⚡ Lightning is hotter than the sun.",
    "🦒 A giraffe’s tongue is purple.",
    "🌍 Earth is the only known planet with life.",
    "💧 Hot water freezes faster than cold water sometimes."
  ];

  const random = facts[Math.floor(Math.random() * facts.length)];

  bot.sendMessage(chatId, `📚 Random Fact:\n\n${random}`);
});

// Truth
bot.onText(/\/truth/, async (msg) => {
  const chatId = msg.chat.id;

  const truths = [
    "What is your biggest fear?",
    "Who was your first crush?",
    "What secret have you never told anyone?",
    "What is your most embarrassing moment?",
    "Have you ever lied to your best friend?"
  ];

  const random = truths[Math.floor(Math.random() * truths.length)];

  bot.sendMessage(chatId, `🤫 Truth Question:\n\n${random}`);
});

// Dare
bot.onText(/\/dare/, async (msg) => {
  const chatId = msg.chat.id;

  const dares = [
    "Send a funny selfie 😂",
    "Sing your favorite song 🎤",
    "Text someone 'I miss you' 😅",
    "Talk in a robot voice for 1 minute 🤖",
    "Dance without music for 30 seconds 💃"
  ];

  const random = dares[Math.floor(Math.random() * dares.length)];

  bot.sendMessage(chatId, `😈 Dare Challenge:\n\n${random}`);
});

// Ship
bot.onText(/\/ship (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  const text = match[1];

  if (!text.includes("&")) {
    return bot.sendMessage(chatId,
      "❌ Use format:\n/ship name1 & name2");
  }

  const names = text.split("&");

  const name1 = names[0].trim();
  const name2 = names[1].trim();

  const percentage = Math.floor(Math.random() * 101);

  let result = "💔 Not compatible";

  if (percentage > 50) result = "❤️ Cute couple";
  if (percentage > 75) result = "💍 Perfect match";
  if (percentage > 90) result = "🔥 Soulmates";

  bot.sendMessage(
    chatId,
    `💘 Love Calculator\n\n${name1} ❤️ ${name2}\n\nCompatibility: ${percentage}%\n${result}`
  );
});

// Meme
bot.onText(/\/meme/, async (msg) => {
  const chatId = msg.chat.id;

  const memes = [
    "https://i.imgflip.com/30b1gx.jpg",
    "https://i.imgflip.com/1bij.jpg",
    "https://i.imgflip.com/26am.jpg",
    "https://i.imgflip.com/4t0m5.jpg"
  ];

  const random = memes[Math.floor(Math.random() * memes.length)];

  bot.sendPhoto(chatId, random, {
    caption: "😂 Random Meme"
  });
});
// ================= OWNER =================

bot.onText(/\/owner/, async (msg) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId,
`👑 OWNER INFORMATION

Name: Lawrence
Bot: Lucid XMD
Company: Lucid Tech Solutions

📞 WhatsApp:
+254780503649

💬 Telegram:
https://t.me/grimtech

📍 Nairobi, Kenya`);

});
// ================= WEATHER =================

bot.onText(/\/weather (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const city = match[1];

  bot.sendMessage(chatId,
'🌦 Fetching weather data...');

  try {

    const response = await axios.get(
      `https://wttr.in/${city}?format=j1`
    );

    const data = response.data;

    const current = data.current_condition[0];

    const temp = current.temp_C;
    const feels = current.FeelsLikeC;
    const humidity = current.humidity;
    const wind = current.windspeedKmph;
    const desc = current.weatherDesc[0].value;

    bot.sendMessage(chatId,
`🌤 Weather in ${city}

🌡 Temperature: ${temp}°C
🥵 Feels Like: ${feels}°C
💧 Humidity: ${humidity}%
💨 Wind Speed: ${wind} km/h
☁️ Condition: ${desc}`);

  } catch (error) {

    console.log(error);

    bot.sendMessage(chatId,
'❌ Failed to fetch weather.');

  }

});
// ================= TRANSLATE =================

bot.onText(/\/translate(?: (.+))?/, async (msg, match) => {

  const chatId = msg.chat.id;

  let args = match[1];

  if (!args) {

    return bot.sendMessage(chatId,
`🌍 Usage Examples:

/translate french Hello world

OR reply to a message with:

/translate swahili`);

  }

  try {

    let targetLang;
    let textToTranslate;

    // Reply translation
    if (msg.reply_to_message) {

  const parts = args.split(" ");

  targetLang = parts.shift().toLowerCase();

  textToTranslate =
    msg.reply_to_message.text ||
    msg.reply_to_message.caption;

    }

    // Normal translation
    else {

      const parts = args.split(" ");

      targetLang = parts.shift().toLowerCase();

      textToTranslate = parts.join(" ");

    }

    if (!textToTranslate) {

      return bot.sendMessage(chatId,
      '❌ No text found to translate.');

    }

    const languageMap = {

      swahili: 'sw',
      french: 'fr',
      spanish: 'es',
      german: 'de',
      italian: 'it',
      portuguese: 'pt',
      arabic: 'ar',
      chinese: 'zh-cn',
      japanese: 'ja',
      korean: 'ko',
      russian: 'ru',
      hindi: 'hi',
      english: 'en'

    };

    const langCode =
      languageMap[targetLang];

    if (!langCode) {

      return bot.sendMessage(chatId,
`❌ Unsupported language.

Supported:
english
swahili
french
spanish
german
italian
portuguese
arabic
chinese
japanese
korean
russian
hindi`);

    }

    bot.sendMessage(chatId,
'🌍 Translating...');

    const result = await translate.translate(
  textToTranslate,
  { to: langCode }
);

const translated = result.text;

    bot.sendMessage(chatId,
`🌍 Translation

📝 Original:
${textToTranslate}

✅ ${targetLang}:
${translated}`);

  } catch (error) {

    console.log(error);

    bot.sendMessage(chatId,
'❌ Translation failed.');

  }

});
// ================= TIME =================

bot.onText(/\/time/, async (msg) => {

  const chatId = msg.chat.id;

  const now = new Date();

  const time = now.toLocaleTimeString('en-KE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const date = now.toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  bot.sendMessage(chatId,
`⏰ CURRENT TIME

🕒 Time: ${time}

📅 Date: ${date}

📍 Nairobi, Kenya`);

});
// ================= CALCULATOR =================

bot.onText(/\/calc (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;

  const expression = match[1];

  try {

    const result = eval(expression);

    bot.sendMessage(chatId,
`🧮 CALCULATOR

📥 Expression:
${expression}

✅ Result:
${result}`);

  } catch (error) {

    bot.sendMessage(chatId,
'❌ Invalid calculation.');

  }

});
// ================= NEWS =================

bot.onText(/\/news/, async (msg) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId,
'📰 Fetching latest news...');

  try {

    const response = await axios.get(
      `https://gnews.io/api/v4/top-headlines?country=us&lang=en&max=5&apikey=${process.env.GNEWS_API}`
    );

    const articles = response.data.articles;

    if (!articles.length) {

      return bot.sendMessage(chatId,
      '❌ No news found.');

    }

    let newsText = '📰 TOP NEWS\n\n';

    articles.forEach((article, index) => {

      newsText +=
`${index + 1}. ${article.title}

🔗 ${article.url}

`;

    });

    bot.sendMessage(chatId, newsText);

  } catch (error) {

    console.log(error.response?.data || error.message);

    bot.sendMessage(chatId,
'❌ Failed to fetch news.');

  }

});
// ================= WELCOME & GOODBYE =================

// Welcome Message
bot.on('new_chat_members', async (msg) => {

  const chatId = msg.chat.id;

  const newMembers = msg.new_chat_members;

  newMembers.forEach((member) => {

    bot.sendMessage(chatId,
`👋 Welcome ${member.first_name} to the group!

🤖 Powered by Lucid XMD
🔥 Enjoy your stay.`);
    
  });

});

// Goodbye Message
bot.on('left_chat_member', async (msg) => {

  const chatId = msg.chat.id;

  const member = msg.left_chat_member;

  bot.sendMessage(chatId,
`😢 Goodbye ${member.first_name}

We will miss you 💔`);

});
// =============== PING ===============

bot.onText(/\/ping/, async (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId,
`🏓 Pong!

✅ Bot Status: Online
⚡ Speed: Fast`);
});
// =============== RUNTIME ===============

bot.onText(/\/runtime/, async (msg) => {
    const chatId = msg.chat.id;

    const uptime = process.uptime();

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    bot.sendMessage(chatId,
`⏳ BOT RUNTIME

🟢 Online for:
${hours}h ${minutes}m ${seconds}s`);
});
// =============== RULES ===============

bot.onText(/\/rules/, async (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId,
`📜 GROUP RULES

1. Respect everyone
2. No spam
3. No adult content
4. No fake news
5. Follow admin instructions

⚠️ Breaking rules may lead to removal.`);
});
// =============== ADMINS ===============

bot.onText(/\/admins/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const admins = await bot.getChatAdministrators(chatId);

        let text = '👮 GROUP ADMINS\n\n';

        admins.forEach((admin, index) => {
            text += `${index + 1}. ${admin.user.first_name}\n`;
        });

        bot.sendMessage(chatId, text);

    } catch (error) {
        bot.sendMessage(chatId,
'❌ This command only works in groups.');
    }
});
// =============== TAGALL ===============

bot.onText(/\/tagall/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const admins = await bot.getChatAdministrators(chatId);

        let text = '📢 ATTENTION EVERYONE\n\n';

        admins.forEach(admin => {
            text += `@${admin.user.username || admin.user.first_name}\n`;
        });

        bot.sendMessage(chatId, text);

    } catch (error) {
        bot.sendMessage(chatId,
'❌ Tagall works only in groups.');
    }
});
// ================= PLAY / SONG =================

bot.onText(/\/(play|song) (.+)/, async (msg, match) => {

    const chatId = msg.chat.id;
    const query = match[2];

    try {

        await bot.sendMessage(chatId,
`🔍 Searching song...

🎵 Query: ${query}`);

        const search = await yts(query);

        if (!search.videos.length) {
            return bot.sendMessage(chatId, '❌ Song not found.');
        }

        const video = search.videos[0];

        const title = video.title;
        const artist = video.author.name;
        const duration = video.timestamp;
        const thumbnail = video.thumbnail;

        await bot.sendPhoto(chatId, thumbnail, {
            caption:
`🎵 Song Found

📌 Title: ${title}
⏱ Duration: ${duration}
👤 Artist: ${artist}

⬇ Preparing audio...`
        });

        const stream = ytdl(video.url, {
    filter: "audioonly",
    quality: "lowestaudio",
    highWaterMark: 1 << 25
});

        await bot.sendAudio(chatId, stream, {
            title: title,
            performer: artist,
            caption:
`🎧 Now Playing

🎵 ${title}
👤 ${artist}`
        });

    } catch (error) {

        console.error("PLAY ERROR:", error);

        bot.sendMessage(
            chatId,
            `❌ Failed to play song.

${error.message}`
        );
    }
});
// ================= ROLL =================

bot.onText(/\/roll/, (msg) => {
  const number = Math.floor(Math.random() * 6) + 1;

  bot.sendMessage(
    msg.chat.id,
    `🎲 Dice Roll\n\nYou rolled: ${number}`
  );
});
// ================= 8BALL =================

bot.onText(/\/8ball (.+)/, (msg, match) => {

  const answers = [
    "✅ Yes",
    "❌ No",
    "🤔 Maybe",
    "🔥 Definitely",
    "⏳ Ask again later",
    "😅 Uncertain"
  ];

  const reply =
    answers[Math.floor(Math.random() * answers.length)];

  bot.sendMessage(
    msg.chat.id,
    `🎱 Magic 8 Ball\n\n❓ ${match[1]}\n\n${reply}`
  );
});
// ================= PASSWORD =================

bot.onText(/\/password/, (msg) => {

  const password =
    Math.random().toString(36).slice(-12);

  bot.sendMessage(
    msg.chat.id,
    `🔐 Generated Password\n\n${password}`
  );
});
// ================= HACK =================

bot.onText(/\/hack (.+)/, (msg, match) => {

  bot.sendMessage(
    msg.chat.id,
`💻 HACKING TARGET...

🎯 Target: ${match[1]}

▓▓▓▓▓▓▓▓▓▓ 100%

✅ Access Granted

😂 Just kidding!`
  );
});
// ================= STATS =================

bot.onText(/\/stats/, (msg) => {

  const uptime = process.uptime();

  bot.sendMessage(
    msg.chat.id,
`📊 LUCID XMD STATS

🤖 Status: Online
⚡ Commands: 25+
⏳ Uptime: ${Math.floor(uptime)} seconds`
  );
});
// ================= RPS =================

bot.onText(/\/rps (rock|paper|scissors)/i, (msg, match) => {

  const choices = ["rock", "paper", "scissors"];
  const botChoice =
    choices[Math.floor(Math.random() * choices.length)];

  const userChoice = match[1].toLowerCase();

  let result = "🤝 Draw";

  if (
    (userChoice === "rock" && botChoice === "scissors") ||
    (userChoice === "paper" && botChoice === "rock") ||
    (userChoice === "scissors" && botChoice === "paper")
  ) {
    result = "🎉 You Win!";
  } else if (userChoice !== botChoice) {
    result = "😅 Bot Wins!";
  }

  bot.sendMessage(
    msg.chat.id,
`🎮 Rock Paper Scissors

👤 You: ${userChoice}
🤖 Bot: ${botChoice}

${result}`
  );
});
// ================= SHORTURL =================

bot.onText(/\/shorturl (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const url = match[1];

  try {

    const response = await axios.get(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
    );

    bot.sendMessage(chatId,
`🔗 URL SHORTENER

🌐 Original:
${url}

✂️ Short:
${response.data}`);

  } catch (error) {

    bot.sendMessage(chatId,
'❌ Failed to shorten URL.');

  }
});
// ================= QR =================

bot.onText(/\/qr (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const text = match[1];

  const qr =
`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;

  bot.sendPhoto(chatId, qr, {
    caption:
`📱 QR Code Generated

📝 Data:
${text}`
  });

});
