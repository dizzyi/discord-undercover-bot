const Discord = require('discord.js');

let COLOR = 0x0040ff;

function help(message){
    const helpemb = new Discord.MessageEmbed()
    .setTitle('**Welcome To the Undercover Game**')
    .setColor(COLOR)
    .addField('**Description**', 'you know how to play geh')
    .addField('Help','help [command]', true)
    .addField('Game command', 'open\njoin\nstart\nvote\nset\nboard', true)
    .addField('Other command', 'add\ncls\ngif\nreply\nping\nrickroll', true);

    message.channel.send(helpemb);
}

module.exports = { help }