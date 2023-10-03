const {
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType
} = require("@adiwajshing/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const {
  Configuration,
  OpenAIApi
} = require("openai");
const {
  constant
} = require("lodash");


module.exports = sansekai = async (client, m, chatUpdate, store, setting) => {
  try {
      var body =
          m.mtype === "conversation" ?
          m.message.conversation :
          m.mtype == "imageMessage" ?
          m.message.imageMessage.caption :
          m.mtype == "videoMessage" ?
          m.message.videoMessage.caption :
          m.mtype == "extendedTextMessage" ?
          m.message.extendedTextMessage.text :
          m.mtype == "buttonsResponseMessage" ?
          m.message.buttonsResponseMessage.selectedButtonId :
          m.mtype == "listResponseMessage" ?
          m.message.listResponseMessage.singleSelectReply.selectedRowId :
          m.mtype == "templateButtonReplyMessage" ?
          m.message.templateButtonReplyMessage.selectedId :
          m.mtype === "messageContextInfo" ?
          m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text :
          "";
      var budy = typeof m.text == "string" ? m.text : "";
      // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
      var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
      const isCmd2 = body.startsWith(prefix);
      const command = body.replace(prefix, "")
          .trim()
          .split(/ +/)
          .shift()
          .toLowerCase();
      const args = body.trim()
          .split(/ +/)
          .slice(1);
      const pushname = m.pushName || "No Name";
      const BOT_owner = "尺oんﾉｲ";
      const donet = "917820953034"
      let text = (q = args.join(" "));
      const from = m.chat;
      const reply = m.reply;
      const mek = chatUpdate.messages[0];
      
      const color = (text, color) => {
          return !color ? chalk.green(text) : chalk.keyword(color)(text);
      };
      
      // Group
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat)
          .catch(() => {}) : "";
      const groupName = m.isGroup ? groupMetadata.subject : "";
      
      // Push Message To Console
      let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;
      
      if (isCmd2 && !m.isGroup) {
          console.log(chalk.black(chalk.bgWhite("[ LOGS ]")), color(argsLog, "turquoise"), chalk.magenta("From"), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`));
      } else if (isCmd2 && m.isGroup) {
          console.log(
              chalk.black(chalk.bgWhite("[ LOGS ]")), color(argsLog, "turquoise"), chalk.magenta("From"), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`), chalk.blueBright("IN"), chalk.green(groupName)
          );
      }
      
      if (isCmd2) {
          switch (command) {
          case "help":
    case "menu":
        m.reply(`*❒═════❬ NXT v-2.0 MENU ❭═════╾❒*
YO!! ${pushname} 😎 
*『I"M RA-1, A CHAT-BOT DEVELOPED BY ${BOT_owner} 🏆』*

Here is my command list 👇

*(ASK TO RA-1)*
Cmd: ${prefix}ra1
*Ask anything to AI.* 

*(IMG GENERATING AI)*
Cmd: ${prefix}img
*Generate images by text.*

*(FUN COMMANDS)*
Cmd: ${prefix}ra1 tell me a joke
*Get a random joke.*

Cmd: ${prefix}afk 
*A surprise reply.*

Cmd: ${prefix}ra1 give me a fact
*Get a random fact.*

Cmd: ${prefix}ra1 give me a quote 
*Get a random quote.*

*(USE AT YOUR OWN RISK)*
Cmd: ${prefix}play <song name>
*Play a song from YouTube.*

*(CONTACT INFO)*
🗣️ *OWNER:* ${BOT_owner}
🤖 *CONTACT:* ${donet}
💚 *INSTAGRAM:* [NXT_7R](https://www.instagram.com/nxt_7r/)

Feel free to explore and enjoy! 😊
        `);
              break;
          case "afk":
              m.reply('What are you donig here go away from keyboard 😂')
              break;
          case "fact":
              m.reply("A group of flamingos is called a flamboyance. 🦩");
              break;
          case "actra1": case "hi": case "hello": 
              m.reply(`*❒═════❬ NXT v-2.0 ❭═════╾❒*
        YO!! ${pushname} 😎 \n Type ${prefix} menu or help to get full command list  
      `)
              break;
          case "play":
              m.reply(" Bro i'm not doing this \ngo to https://www.youtube.com/  and play what you want 🤣 \n*BAKA!!*");
              
              break;
          case "owner":
              m.reply(`Hi there, you can contact my owner at: ${donet}`)
              
              break;
          case "ai":
          case "openai":
          case "ra1":
              try {
                  if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI") return reply("Apikey  diisi\n\nPlease fill in the apikey first in the file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys");
                  if (!text) return reply(`I'm RA-1 I am artificial intelligence 
           developed by 尺oんﾉｲ .\n\nfor use Example:\n\n${prefix}${command} What is a recession`);
                  const configuration = new Configuration({
                      apiKey: setting.keyopenai,
                  });
                  const openai = new OpenAIApi(configuration);
                  
                  /*const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: text,
            temperature: 0, // Higher values means the model will take more risks.
            max_tokens: 2048, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
            top_p: 1, // alternative to sampling with temperature, called nucleus sampling
            frequency_penalty: 0.3, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
            presence_penalty: 0 // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
        });
          m.reply(`${response.data.choices[0].text}`);*/
                  const response = await openai.createChatCompletion({
                      model: "gpt-3.5-turbo",
                      messages: [{
                          role: "user",
                          content: text
                      }],
                  });
                  m.reply(`${response.data.choices[0].message.content}`);
              } catch (error) {
                  if (error.response) {
                      console.log(error.response.status);
                      console.log(error.response.data);
                      console.log(`${error.response.status}\n\n${error.response.data}`);
                  } else {
                      console.log(error);
                      m.reply("Sorry an  error :" + error.message);
                  }
              }
              break; //replace this if not working properly
          case "img":
          case "ai-img":
          case "image":
          case "images":
              try {
                  if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI") return reply("Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys");
                  if (!text) return reply(`Creating an image from AI.\n\nContoh:\n${prefix}${command} Wooden house on snow mountain`);
                  const configuration = new Configuration({
                      apiKey: setting.keyopenai,
                  });
                  
                  
                  const openai = new OpenAIApi(configuration);
                  const response = await openai.createImage({
                      
                      /*engine: "davinci",
                      prompt: text,
                      maxTokens: 0,
                      temperature: 0.7,*/
                      prompt: text,
                      model: "image-alpha-001",
                      size: "512x512",
                      n: 1,
                      /*stop: "\n",*/
                  });
                  /*const imageUrl = response.choices[0].text.trim();*/
                  client.sendImage(from, response.data.data[0].url, text, mek);
              } catch (error) {
                  if (error.response) {
                      console.log(error.response.status);
                      console.log(error.response.data);
                      console.log(`${error.response.status}\n\n${error.response.data}`);
                  } else {
                      console.log(error);
                      m.reply("sorry an internal error :" + error.message);
                  }
              }
              
              /*case "img": case "ai-img": case "image": case "images":
                try {
                  if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI") return reply("Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys");
                  if (!text) return reply(`Creating an image from AI.\n\nContoh:\n${prefix}${command} Wooden house on snow mountain`);
                  const configuration = new Configuration({
                    apiKey: setting.keyopenai,
                  });
                  const openai = new OpenAIApi(configuration);
                  const response = await openai.createImage({
                    prompt: text,
                    n: 1,
                    size: "512x512",
                  });
                  //console.log(response.data.data[0].url)
                  client.sendImage(from, response.data.data[0].url, text, mek);
                  } catch (error) {
                if (error.response) {
                  console.log(error.response.status);
                  console.log(error.response.data);
                  console.log(`${error.response.status}\n\n${error.response.data}`);
                } else {
                  console.log(error);
                  m.reply("sorry an internal error :"+ error.message);
                }
              }*/
              ////////////////////////////////////////////////////////////////////////////////////////////////////////
              break;
          case "AUD":
          case "msic":
              try {
                  if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI") return reply("Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys");
                  if (!text) return reply(`Creating an image from AI.\n\nContoh:\n${prefix}${command} Wooden house on snow mountain`);
                  const configuration = new Configuration({
                      apiKey: setting.keyopenai,
                  });
                  const openai = new OpenAIApi(configuration);
                  const response = await openai.createTranscription(
                      fs.createReadStream("audio.mp3"),
                      
                      {
                          "file": "audio.mp3",
                          "model": "whisper-1"
                      }
                      
                  );
                  m.reply(`${response.data.choices[0].message.content}`);
              } catch (error) {
                  if (error.response) {
                      console.log(error.response.status);
                      console.log(error.response.data);
                      console.log(`${error.response.status}\n\n${error.response.data}`);
                  } else {
                      console.log(error);
                      m.reply("Sorry an  error  :" + error.message);
                  }
              }
              
              ///////////////////////////96        
              break;
          default: {
              if (isCmd2 && budy.toLowerCase() != undefined) {
                  if (m.chat.endsWith("broadcast")) return;
                  if (m.isBaileys) return;
                  if (!budy.toLowerCase()) return;
                  if (argsLog || (isCmd2 && !m.isGroup)) {
                      // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                      console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${prefix}${command}`, "turquoise"), color("Not found", "turquoise"));
                  } else if (argsLog || (isCmd2 && m.isGroup)) {
                      // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                      console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${prefix}${command}`, "turquoise"), color("Not found", "turquoise"));
                  }
              }
          }
          }
      }
  } catch (err) {
      m.reply(util.format(err));
  }
};


let file = require.resolve(__filename); ////global////
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
