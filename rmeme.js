const fetch = require("node-fetch");

const memeHistory = new Map();

async function fetchMeme() {
  const res = await fetch("https://meme-api.com/gimme");
  return await res.json();
}

module.exports = {
  name: "rmeme",
  command: ["rmeme"],
  event: ["command", "button"],

  async execute({ m, sock }) {
    const chatId = m.chat;

    // Button click
    if (m.buttonId) {
      const data = memeHistory.get(chatId);
      if (!data) return;

      if (m.buttonId === "meme_next") {
        const meme = await fetchMeme();
        data.list.push(meme);
        data.index++;
        memeHistory.set(chatId, data);
        return sendMeme(sock, chatId, meme, data.index > 0);
      }

      if (m.buttonId === "meme_prev") {
        if (data.index === 0) return;
        data.index--;
        memeHistory.set(chatId, data);
        return sendMeme(sock, chatId, data.list[data.index], data.index > 0);
      }
      return;
    }

    // Command rmeme
    const meme = await fetchMeme();
    memeHistory.set(chatId, { list: [meme], index: 0 });
    await sendMeme(sock, chatId, meme, false);
  }
};

async function sendMeme(sock, chatId, meme, hasPrev) {
  if (!m
      
