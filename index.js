// ================= MONGODB =================

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {

  try {

    console.log("🔄 Connecting to MongoDB...");
    console.log(
      "MongoDB URI exists:",
      !!process.env.MONGODB_URI
    );

    await client.connect();

    db = client.db("LucidXMD");

    console.log(
      "✅✅✅ MONGODB CONNECTED SUCCESSFULLY ✅✅✅"
    );

    console.log(
      "📂 Database:",
      db.databaseName
    );

    // Test write
    await db.collection("test").insertOne({
      message: "Lucid XMD MongoDB Test",
      time: new Date()
    });

    console.log(
      "🧪 Test document inserted successfully"
    );

  } catch (err) {

    console.error(
      "❌ MongoDB Error:",
      err
    );

  }

}

connectDB();
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
// ================= WARN =================

bot.onText(/\/warn (.+)/, (msg, match) => {

  bot.sendMessage(
    msg.chat.id,
`⚠️ WARNING ISSUED

👤 User: ${match[1]}

Please follow group rules.`
  );
});
// ================= KICK =================

bot.onText(/\/kick (.+)/, (msg, match) => {

  bot.sendMessage(
    msg.chat.id,
`👮 Kick Command

Target:
${match[1]}

⚠️ Full admin kick system coming soon.`
  );
});
// ================= MUTE =================

bot.onText(/\/mute (.+)/, (msg, match) => {

  bot.sendMessage(
    msg.chat.id,
`🔇 User Muted

👤 ${match[1]}

⏳ Until an admin unmutes them.`
  );
});
// ================= UNMUTE =================

bot.onText(/\/unmute (.+)/, (msg, match) => {

  bot.sendMessage(
    msg.chat.id,
`🔊 User Unmuted

👤 ${match[1]}`
  );
});
// ================= ID =================

bot.onText(/\/id/, async (msg) => {

  bot.sendMessage(
    msg.chat.id,
`🆔 INFORMATION

👤 User ID: ${msg.from.id}
💬 Chat ID: ${msg.chat.id}
📛 Name: ${msg.from.first_name}`
  );

});
// ================= GROUPINFO =================

bot.onText(/\/groupinfo/, async (msg) => {

  try {

    const chat = await bot.getChat(msg.chat.id);

    bot.sendMessage(
      msg.chat.id,
`👥 GROUP INFO

📛 Name: ${chat.title || "Private Chat"}
🆔 ID: ${chat.id}
📌 Type: ${chat.type}`
    );

  } catch (error) {

    bot.sendMessage(
      msg.chat.id,
      '❌ Failed to get group info.'
    );

  }

});
// ================= USERINFO =================

bot.onText(/\/userinfo/, async (msg) => {

  const user = msg.from;

  bot.sendMessage(
    msg.chat.id,
`👤 USER INFO

📛 Name: ${user.first_name}
🆔 ID: ${user.id}
🌐 Username: @${user.username || "None"}
🤖 Is Bot: ${user.is_bot ? "Yes" : "No"}`
  );

});
// ================= REPORT =================

bot.onText(/\/report (.+)/, (msg, match) => {

  bot.sendMessage(
    msg.chat.id,
`🚨 REPORT SUBMITTED

📝 Reason:
${match[1]}

✅ Admins have been notified.`
  );

});
// ================= BAN =================

bot.onText(/\/ban (.+)/, (msg, match) => {

  bot.sendMessage(
    msg.chat.id,
`🔨 User Banned

👤 ${match[1]}

⚠️ Full ban system coming soon.`
  );

});
// ================= UNBAN =================

bot.onText(/\/unban (.+)/, (msg, match) => {

  bot.sendMessage(
    msg.chat.id,
`🔓 User Unbanned

👤 ${match[1]}`
  );

});
// ================= CODE =================

bot.onText(/\/code (.+)/, async (msg, match) => {

    const chatId = msg.chat.id;
    const prompt = match[1];

    await bot.sendMessage(chatId,
    '💻 Generating code...');

    try {

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert programmer.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const reply =
        response.data.choices[0].message.content;

        bot.sendMessage(chatId, reply);

    } catch (error) {

        console.log(
            error.response?.data || error.message
        );

        bot.sendMessage(
            chatId,
            `❌ Code generation failed.\n\n${
                error.response?.data?.error?.message ||
                error.message
            }`
        );

    }

});
// ================= EXPLAIN =================

bot.onText(/\/explain (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

  bot.sendMessage(chatId,
'📚 Explaining...');

  try {

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `Explain ${topic} in simple terms`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`
        }
      }
    );

    bot.sendMessage(
      chatId,
      response.data.choices[0].message.content
    );

  } catch (error) {

    bot.sendMessage(chatId,
'❌ Explanation failed.');
  }

});
// ================= SUMMARY =================

bot.onText(/\/summary (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const text = match[1];

  bot.sendMessage(chatId,
'📝 Summarizing...');

  try {

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `Summarize this:\n\n${text}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`
        }
      }
    );

    bot.sendMessage(
      chatId,
      response.data.choices[0].message.content
    );

  } catch (error) {

    bot.sendMessage(chatId,
'❌ Summary failed.');
  }

});
// ================= TEMPMAIL =================

bot.onText(/\/tempmail/, async (msg) => {

  const random =
    Math.random().toString(36).substring(2, 10);

  bot.sendMessage(
    msg.chat.id,
`📧 Temporary Email

${random}@lucidmail.com

⚠️ Demo version`
  );

});
// ================= ADVICE =================

bot.onText(/\/advice/, (msg) => {

  const advice = [
    "Stay consistent.",
    "Learn something every day.",
    "Focus on progress, not perfection.",
    "Invest in your skills.",
    "Don't quit too early."
  ];

  const random =
    advice[Math.floor(Math.random() * advice.length)];

  bot.sendMessage(
    msg.chat.id,
    `💡 Advice\n\n${random}`
  );

});
// ================= TRIVIA =================

bot.onText(/\/trivia/, (msg) => {

  const questions = [
    "🌍 What is the capital of Kenya?\nAnswer: Nairobi",
    "🐘 What is the largest land animal?\nAnswer: Elephant",
    "☀️ What star is at the center of our solar system?\nAnswer: Sun"
  ];

  const random =
    questions[Math.floor(Math.random() * questions.length)];

  bot.sendMessage(
    msg.chat.id,
    `🧠 Trivia\n\n${random}`
  );

});
// ================= ROAST =================

bot.onText(/\/roast/, (msg) => {

  const roasts = [
    "😂 You're running on low battery and high confidence.",
    "😂 Your WiFi is faster than your decision making.",
    "😂 Even my calculator is confused by you."
  ];

  const random =
    roasts[Math.floor(Math.random() * roasts.length)];

  bot.sendMessage(
    msg.chat.id,
    random
  );

});
// ================= CRYPTO =================

bot.onText(/\/crypto/, async (msg) => {

    try {

        const response = await axios.get(
            "https://api.coinlore.net/api/tickers/"
        );

        const btc = response.data.data.find(
            coin => coin.symbol === "BTC"
        );

        bot.sendMessage(
            msg.chat.id,
`💰 Bitcoin

💵 Price: $${btc.price_usd}
📈 Rank: ${btc.rank}`
        );

    } catch (error) {

        console.log("CRYPTO ERROR:", error.message);

        bot.sendMessage(
            msg.chat.id,
            "❌ Crypto service unavailable."
        );

    }

});

// ================= CURRENCY =================

bot.onText(/\/currency (.+)/, async (msg, match) => {

  const amount = parseFloat(match[1]);

  try {

    const response = await axios.get(
      'https://open.er-api.com/v6/latest/USD'
    );

    const kes =
      (amount * response.data.rates.KES).toFixed(2);

    bot.sendMessage(
      msg.chat.id,
      `💱 Currency Converter\n\n$${amount} = KES ${kes}`
    );

  } catch {

    bot.sendMessage(
      msg.chat.id,
      '❌ Conversion failed.'
    );

  }

});
// ================= DEFINE =================

bot.onText(/\/define (.+)/, async (msg, match) => {

  const word = match[1];

  try {

    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    const meaning =
      response.data[0].meanings[0].definitions[0].definition;

    bot.sendMessage(
      msg.chat.id,
      `📖 ${word}\n\n${meaning}`
    );

  } catch {

    bot.sendMessage(
      msg.chat.id,
      '❌ Word not found.'
    );

  }

});
// ================= GITHUB =================

bot.onText(/\/github (.+)/, async (msg, match) => {

  const username = match[1];

  try {

    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const user = response.data;

    bot.sendMessage(
      msg.chat.id,
`🐙 GitHub Profile

👤 ${user.login}
📚 Repos: ${user.public_repos}
👥 Followers: ${user.followers}
🔗 ${user.html_url}`
    );

  } catch {

    bot.sendMessage(
      msg.chat.id,
      '❌ GitHub user not found.'
    );

  }

});
// ================= WIKI =================

bot.onText(/\/wiki (.+)/, async (msg, match) => {

    const query = match[1];

    try {

        const response = await axios.get(
            `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&namespace=0&format=json`,
            {
                headers: {
                    'User-Agent': 'Lucid-XMD-Bot'
                }
            }
        );

        const result = response.data;

        if (!result[1].length) {
            return bot.sendMessage(
                msg.chat.id,
                '❌ Topic not found.'
            );
        }

        bot.sendMessage(
            msg.chat.id,
`📚 Wikipedia

📖 ${result[1][0]}

📝 ${result[2][0]}

🔗 ${result[3][0]}`
        );

    } catch (error) {

        console.log("WIKI ERROR:", error.message);

        bot.sendMessage(
            msg.chat.id,
            '❌ Failed to fetch Wikipedia data.'
        );

    }

});
// ================= MOVIE =================

bot.onText(/\/movie (.+)/, async (msg, match) => {

    const movie = match[1];

    try {

        const response = await axios.get(
            `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(movie)}`
        );

        const data = response.data;

        if (data.Response === "False") {
            return bot.sendMessage(
                msg.chat.id,
                "❌ Movie not found."
            );
        }

        bot.sendMessage(
            msg.chat.id,
`🎬 Movie Information

📌 Title: ${data.Title}
📅 Year: ${data.Year}
⭐ Rating: ${data.imdbRating}
🎭 Genre: ${data.Genre}
🎬 Director: ${data.Director}

📝 Plot:
${data.Plot}`
        );

    } catch (error) {

        console.log(
            "MOVIE ERROR:",
            error.response?.data || error.message
        );

        bot.sendMessage(
            msg.chat.id,
            "❌ Failed to fetch movie."
        );
    }
});
// ================= LYRICS =================

bot.onText(/\/lyrics (.+)/, async (msg, match) => {

    const song = match[1];

    try {

        const response = await axios.get(
            `https://api.lyrics.ovh/v1/Coldplay/${encodeURIComponent(song)}`
        );

        bot.sendMessage(
            msg.chat.id,
`🎵 Lyrics

${response.data.lyrics.substring(0, 3500)}`
        );

    } catch (error) {

        bot.sendMessage(
            msg.chat.id,
            "❌ Lyrics not found."
        );

    }

});
// ================= ANIME =================

bot.onText(/\/anime (.+)/, async (msg, match) => {

  const query = match[1];

  try {

    const response = await axios.get(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`
    );

    const anime = response.data.data[0];

    if (!anime) {
      return bot.sendMessage(
        msg.chat.id,
        '❌ Anime not found.'
      );
    }

    await bot.sendPhoto(
      msg.chat.id,
      anime.images.jpg.image_url,
      {
        caption:
`🎌 Anime Information

📌 Title: ${anime.title}

⭐ Score: ${anime.score || 'N/A'}

📺 Episodes: ${anime.episodes || 'Unknown'}

🎭 Genre:
${anime.genres.map(g => g.name).join(', ')}

📝 Synopsis:
${anime.synopsis?.slice(0, 500) || 'No synopsis available.'}`
      }
    );

  } catch (error) {

    console.log(
      "ANIME ERROR:",
      error.response?.data || error.message
    );

    bot.sendMessage(
      msg.chat.id,
      '❌ Failed to fetch anime.'
    );

  }

});
// ================= NPM =================

bot.onText(/\/npm (.+)/, async (msg, match) => {

  const packageName = match[1];

  try {

    const response = await axios.get(
      `https://registry.npmjs.org/${packageName}`
    );

    const pkg = response.data;

    bot.sendMessage(
      msg.chat.id,
`📦 NPM PACKAGE

📌 Name: ${pkg.name}

🏷 Version: ${pkg["dist-tags"].latest}

👤 Author: ${
  pkg.author?.name || "Unknown"
}

📝 Description:
${pkg.description || "No description"}

🔗 https://www.npmjs.com/package/${pkg.name}`
    );

  } catch (error) {

    console.log(
      "NPM ERROR:",
      error.response?.data || error.message
    );

    bot.sendMessage(
      msg.chat.id,
      "❌ Package not found."
    );

  }

});
// ================= IP LOOKUP =================

bot.onText(/\/ip (.+)/, async (msg, match) => {

  const ip = match[1];

  try {

    const response = await axios.get(
      `http://ip-api.com/json/${ip}`
    );

    const data = response.data;

    if (data.status !== "success") {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Invalid IP address."
      );
    }

    bot.sendMessage(
      msg.chat.id,
`🌍 IP INFORMATION

🔢 IP: ${data.query}

🌎 Country: ${data.country}
🏙 City: ${data.city}

📍 Region: ${data.regionName}

📡 ISP: ${data.isp}

🕒 Timezone: ${data.timezone}

📌 Coordinates:
${data.lat}, ${data.lon}`
    );

  } catch (error) {

    console.log(
      "IP ERROR:",
      error.response?.data || error.message
    );

    bot.sendMessage(
      msg.chat.id,
      "❌ Failed to lookup IP."
    );

  }

});
// ================= CAT FACT =================

bot.onText(/\/catfact/, async (msg) => {

  try {

    const response = await axios.get(
      "https://catfact.ninja/fact"
    );

    bot.sendMessage(
      msg.chat.id,
`🐱 CAT FACT

${response.data.fact}`
    );

  } catch (error) {

    console.log(
      "CATFACT ERROR:",
      error.response?.data || error.message
    );

    bot.sendMessage(
      msg.chat.id,
      "❌ Failed to fetch cat fact."
    );

  }

});
// ================= DOG =================

bot.onText(/\/dog/, async (msg) => {

  try {

    const response = await axios.get(
      "https://dog.ceo/api/breeds/image/random"
    );

    await bot.sendPhoto(
      msg.chat.id,
      response.data.message,
      {
        caption: "🐶 Random Dog"
      }
    );

  } catch (error) {

    bot.sendMessage(
      msg.chat.id,
      "❌ Failed to fetch dog image."
    );

  }

});
// ================= REPO =================

bot.onText(/\/repo (.+)/, async (msg, match) => {

  const repo = match[1];

  try {

    const response = await axios.get(
      `https://api.github.com/repos/${repo}`
    );

    const data = response.data;

    bot.sendMessage(
      msg.chat.id,
`📂 GitHub Repository

📌 Name: ${data.full_name}

⭐ Stars: ${data.stargazers_count}

🍴 Forks: ${data.forks_count}

📝 Description:
${data.description || "No description"}

🔗 ${data.html_url}`
    );

  } catch {

    bot.sendMessage(
      msg.chat.id,
      "❌ Repository not found."
    );

  }

});
// ================= STATUS =================

bot.onText(/\/status (.+)/, async (msg, match) => {

  try {

    const response = await axios.get(match[1]);

    bot.sendMessage(
      msg.chat.id,
      `🌐 Website Status\n\n✅ Online\nStatus: ${response.status}`
    );

  } catch (error) {

    bot.sendMessage(
      msg.chat.id,
      `❌ Website Offline\n\nStatus: ${error.response?.status || "Unknown"}`
    );

  }

});
// ================= FANCY FONT =================

bot.onText(/\/fancy (.+)/, (msg, match) => {

  const text = match[1];

  const bold = text
    .split("")
    .map(c =>
      String.fromCodePoint(
        c >= "A" && c <= "Z"
          ? c.charCodeAt(0) - 65 + 0x1D400
          : c >= "a" && c <= "z"
          ? c.charCodeAt(0) - 97 + 0x1D41A
          : c.charCodeAt(0)
      )
    )
    .join("");

  const monospace = text
    .split("")
    .map(c =>
      String.fromCodePoint(
        c >= "A" && c <= "Z"
          ? c.charCodeAt(0) - 65 + 0x1D670
          : c >= "a" && c <= "z"
          ? c.charCodeAt(0) - 97 + 0x1D68A
          : c.charCodeAt(0)
      )
    )
    .join("");

  bot.sendMessage(
    msg.chat.id,
`🎨 FANCY FONTS

📝 Original:
${text}

🔥 Bold:
${bold}

💻 Monospace:
${monospace}`
  );

});
// ================= NAME GENERATOR =================

bot.onText(/\/name (.+)/, (msg, match) => {

  const name = match[1];

  const styles = `👑 VIP NAME GENERATOR

1. 𓉳 𝗠𝗥⎢${name}𓋹

2. 𒁂VΣ᳄ФM𒀭 ${name}

3. ꧁༒☬${name}☬༒꧂

4. 『👑』${name}『👑』

5. 𓃵 𝗟𝗘𝗚𝗘𝗡𝗗⎢${name}

6. ☠️⃟${name}⃟☠️

7. ⤹ꜛ⃟🕷️⃟ꜛ⤸${name}

8. 𓆩⚡𓆪 ${name} 𓆩⚡𓆪

9. ༄𓆩${name}𓆪༄

10. ☢⃟${name}⃟☢

11. ✞⏤͟͞𓆩${name}𓆪͙⏤͟͞✞

12. 𓆣⃝⃪🦋 ${name} 🦋⃝⃪𓆈

13. ♛ ${name} ♛

14. ★彡 ${name} 彡★

15. ꧁𓊈𒆜${name}𒆜𓊉꧂`;

  bot.sendMessage(msg.chat.id, styles);

});
// ================= COUNTRY INFO =================

bot.onText(/\/country (.+)/, async (msg, match) => {

  const country = match[1];

  try {

    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${country}`
    );

    const data = response.data[0];

    const name = data.name.common;
    const capital = data.capital?.[0] || "N/A";
    const region = data.region;
    const population = data.population.toLocaleString();
    const currency = Object.values(data.currencies || {})[0]?.name || "N/A";
    const flag = data.flag;

    bot.sendMessage(
      msg.chat.id,
`🌍 COUNTRY INFORMATION

${flag} ${name}

🏛 Capital: ${capital}
🌎 Region: ${region}
👥 Population: ${population}
💰 Currency: ${currency}`
    );

  } catch (error) {

    console.log(error.message);

    bot.sendMessage(
      msg.chat.id,
      '❌ Country not found.'
    );

  }

});
// ================= CONVERT =================

bot.onText(/\/convert (\d+) ([A-Za-z]{3}) ([A-Za-z]{3})/, async (msg, match) => {

  const amount = parseFloat(match[1]);
  const from = match[2].toUpperCase();
  const to = match[3].toUpperCase();

  try {

    const response = await axios.get(
      `https://open.er-api.com/v6/latest/${from}`
    );

    const rate = response.data.rates[to];

    if (!rate) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Invalid currency code."
      );
    }

    const result = (amount * rate).toFixed(2);

    bot.sendMessage(
      msg.chat.id,
`💱 CURRENCY CONVERTER

💵 ${amount} ${from}

🔄 = ${result} ${to}`
    );

  } catch (error) {

    console.log(error.message);

    bot.sendMessage(
      msg.chat.id,
      "❌ Failed to convert currency."
    );

  }

});
// ================= POLL =================

bot.onText(/\/poll (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;

  const options = match[1]
    .split("|")
    .map(option => option.trim());

  if (options.length < 2) {
    return bot.sendMessage(
      chatId,
      "❌ Usage:\n/poll Option1|Option2"
    );
  }

  try {

    await bot.sendPoll(
      chatId,
      "📊 Lucid XMD Poll",
      options
    );

  } catch (error) {

    console.log(error);

    bot.sendMessage(
      chatId,
      "❌ Failed to create poll."
    );

  }

});
// ================= WHOIS =================

bot.onText(/\/whois (.+)/, async (msg, match) => {

  const domain = match[1]
    .replace("https://", "")
    .replace("http://", "")
    .split("/")[0];

  try {

    const response = await axios.get(
      `https://api.api-ninjas.com/v1/whois?domain=${domain}`,
      {
        headers: {
          'X-Api-Key': process.env.NINJAS_API_KEY
        }
      }
    );

    const data = response.data;

    bot.sendMessage(
      msg.chat.id,
`💻 DOMAIN INFORMATION

🌐 Domain: ${domain}

📅 Created:
${data.creation_date || 'Unknown'}

📆 Updated:
${data.updated_date || 'Unknown'}

⏳ Expires:
${data.expiration_date || 'Unknown'}

🏢 Registrar:
${data.registrar || 'Unknown'}`
    );

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    bot.sendMessage(
      msg.chat.id,
      '❌ Failed to fetch domain information.'
    );

  }

});
// ================= PHONE INFO =================

bot.onText(/\/phone (.+)/, async (msg, match) => {

  const number = match[1];

  try {

    const response = await axios.get(
      `http://apilayer.net/api/validate?access_key=${process.env.NUMVERIFY_API_KEY}&number=${encodeURIComponent(number)}`
    );

    const data = response.data;

    if (!data.valid) {
      return bot.sendMessage(
        msg.chat.id,
        '❌ Invalid phone number.'
      );
    }

    bot.sendMessage(
      msg.chat.id,
`📱 PHONE INFORMATION

☎️ Number: ${data.international_format}

🌍 Country: ${data.country_name}

📡 Carrier: ${data.carrier || 'Unknown'}

📍 Location: ${data.location || 'Unknown'}

📞 Line Type: ${data.line_type || 'Unknown'}`
    );

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    bot.sendMessage(
      msg.chat.id,
      '❌ Failed to fetch phone information.'
    );

  }

});
// ================= TEAM INFO =================

bot.onText(/\/team (.+)/, async (msg, match) => {

  const teamName = match[1];

  try {

    const response = await axios.get(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`
    );

    const teams = response.data.teams;

    if (!teams || teams.length === 0) {

      return bot.sendMessage(
        msg.chat.id,
        '❌ Team not found.'
      );

    }

    // Try exact match first
    let team = teams.find(
      t => t.strTeam &&
      t.strTeam.toLowerCase() === teamName.toLowerCase()
    );

    // If exact match not found, use first result
    if (!team) {
      team = teams[0];
    }

    bot.sendMessage(
      msg.chat.id,
`⚽ TEAM INFORMATION

🏟 Name: ${team.strTeam}

🌍 Country: ${team.strCountry}

🏆 League: ${team.strLeague}

📅 Founded: ${team.intFormedYear || 'Unknown'}

🏟 Stadium: ${team.strStadium || 'Unknown'}

👥 Capacity: ${team.intStadiumCapacity || 'Unknown'}

📝 Description:

${(team.strDescriptionEN || 'No description available.')
.substring(0, 500)}...`
    );

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    bot.sendMessage(
      msg.chat.id,
      '❌ Failed to fetch team information.'
    );

  }

});
// ================= REMINDER =================

bot.onText(/\/remind (\d+) (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;

  const minutes = parseInt(match[1]);
  const reminder = match[2];

  if (minutes <= 0) {
    return bot.sendMessage(
      chatId,
      '❌ Please enter a valid number of minutes.'
    );
  }

  bot.sendMessage(
    chatId,
`⏰ Reminder Set!

🕒 Time: ${minutes} minute(s)

📝 Message:
${reminder}`
  );

  setTimeout(() => {

    bot.sendMessage(
      chatId,
`🔔 REMINDER

${reminder}`
    );

  }, minutes * 60 * 1000);

});
// ================= COUNTDOWN =================

bot.onText(/\/countdown (.+)/, async (msg, match) => {

  const targetDate = new Date(match[1]);

  if (isNaN(targetDate)) {
    return bot.sendMessage(
      msg.chat.id,
      '❌ Invalid date format.\n\nExample:\n/countdown 2027-01-01'
    );
  }

  const now = new Date();

  const diff = targetDate - now;

  if (diff <= 0) {
    return bot.sendMessage(
      msg.chat.id,
      '🎉 That date has already arrived!'
    );
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  bot.sendMessage(
    msg.chat.id,
`⏳ COUNTDOWN

📅 Target Date: ${match[1]}

🕒 Days Remaining: ${days}`
  );

});
// ================= LOGO MAKER =================

bot.onText(/\/logo (.+)/, async (msg, match) => {

  const text = encodeURIComponent(match[1]);

  bot.sendMessage(
    msg.chat.id,
`🎨 LOGO MAKER

Choose a logo style:

🔥 Gaming Logo
https://textpro.me/create-neon-light-text-effect-online-882.html

👑 Gold Logo
https://textpro.me/gold-text-effect-online-876.html

⚡ Neon Logo
https://textpro.me/neon-text-effect-online-963.html

💎 Luxury Logo
https://textpro.me/luxury-gold-text-effect-1003.html

📝 Your Text:
${decodeURIComponent(text)}

⚠️ Paste your text on the website to generate the logo.`
  );

});
// ================= SCREENSHOT =================

bot.onText(/\/ss (.+)/, async (msg, match) => {

  let website = match[1].trim();

  if (
    !website.startsWith("http://") &&
    !website.startsWith("https://")
  ) {
    website = "https://" + website;
  }

  try {

    const screenshotUrl =
      `https://api.screenshotone.com/take?access_key=${process.env.SCREENSHOT_API_KEY}&url=${encodeURIComponent(website)}&format=jpg&full_page=true&delay=3&timeout=60&image_quality=80`;

    console.log("SCREENSHOT URL:", screenshotUrl);

    await bot.sendPhoto(
      msg.chat.id,
      screenshotUrl,
      {
        caption:
`🌐 WEBSITE SCREENSHOT

🔗 ${website}`
      }
    );

  } catch (error) {

    console.log(
      "SCREENSHOT ERROR:",
      error.response?.data || error.message
    );

    bot.sendMessage(
      msg.chat.id,
      "❌ Failed to capture screenshot."
    );

  }

});
// ================= ANTI-LINK =================

bot.on('message', async (msg) => {

  if (!msg.text) return;

  const chatId = msg.chat.id;

  // Ignore private chats
  if (msg.chat.type === 'private') return;

  const text = msg.text.toLowerCase();

  if (
    text.includes('http://') ||
    text.includes('https://') ||
    text.includes('t.me/')
  ) {

    try {

      const admins =
        await bot.getChatAdministrators(chatId);

      const isAdmin =
        admins.some(
          admin => admin.user.id === msg.from.id
        );

      if (isAdmin) return;

      await bot.deleteMessage(
        chatId,
        msg.message_id
      );

      bot.sendMessage(
        chatId,
        `🚫 Links are not allowed, ${msg.from.first_name}!`
      );

    } catch (error) {
      console.log(error);
    }

  }

});
// ================= NOTES =================

// Save Note
bot.onText(/\/save (.+)/, async (msg, match) => {

  try {

    const userId = msg.from.id;
    const note = match[1];

    await db.collection("notes").updateOne(
      { userId },
      {
        $set: {
          note,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    bot.sendMessage(
      msg.chat.id,
      "✅ Note saved successfully."
    );

  } catch (err) {

    console.error(err);

    bot.sendMessage(
      msg.chat.id,
      "❌ Failed to save note."
    );

  }

});

// View Note
bot.onText(/\/mynote/, async (msg) => {

  try {

    const userId = msg.from.id;

    const data = await db
      .collection("notes")
      .findOne({ userId });

    if (!data) {

      return bot.sendMessage(
        msg.chat.id,
        "❌ You don't have any saved note."
      );

    }

    bot.sendMessage(
      msg.chat.id,
      `📝 YOUR SAVED NOTE

${data.note}`
    );

  } catch (err) {

    console.error(err);

    bot.sendMessage(
      msg.chat.id,
      "❌ Failed to fetch note."
    );

  }

});
