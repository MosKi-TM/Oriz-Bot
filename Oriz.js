const Discord = require("discord.js");
const talkedRecently = new Set();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');
const adapter = new FileSync('database.json');
const db = low(adapter);
db.defaults({   
    users_db:[],
    pari:[]
}).write()



const files = ["login_token.js", "onReady.js","onNewMember.js", "onReaction.js", "onMessage.js", "player_manager.js"] 
const mises = {
    "💵":100,
    "💶":250,
    "💴":500,
    "💷":1000
}
const emoji_num = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"]
const mises_emote = ["💵","💶","💴","💷"]

var bot = new Discord.Client();
var prefixe = ("oriz,")
var currents_paris = []
const jackpot_luck = 10

class player{
    constructor(player_id, amount, choice)
    {
        this.player_id = player_id;
        this.amount = amount;
        this.choice = choice;
    }
}

class temp_player{
    constructor(player_id)
    {
        this.player_id = player_id;
        this.emojis = [];
    }
}

class pari {
    constructor(id) {
      this.pari_id = id;  
      this.message_id = 0;  
      this.message = "";
      this.choices = [];
      this.players = [];
      this.temp_players = {};
      this.locked = false;
      this.done = false;
    }
}

for(var i = 0; i < files.length; i++) eval(fs.readFileSync('./'+files[i])+'');