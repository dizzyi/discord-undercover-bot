const Discord  = require('discord.js');
const db       = require('./db.js');
const maingame = require('./undercover');


const bot     =  new Discord.Client();

const token   = '';

const PREFIX  = "UC!";

let Games = [];
let Words = [];

db.getAll(Words);

// to show that the bot is online
bot.on('ready', ()=>{
    console.log("This bot is online");
    /*
    bot.channels.cache.array().forEach((element)=>{
        if(element.type=='text'){
            element.send("Hello everyone! Wanna play Undercover Together? :laughing: ");
        }
    });*/
})

//whenever there are message
bot.on('message' , msg =>{
    maingame(msg, PREFIX, Games, Words);
} );

//login discord as the bot
bot.login(token);

