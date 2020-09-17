const Discord = require('discord.js');
const client = new discord.Client();
const bot = new Discord.Client();

const Landon = "140205912727093248";
const Tanner = "379807275877138443";

const commandCooldown = new Set();
const landonCooldown = new Set();
//var d = new Date(); //current time

let token = process.env.discordToken;



bot.on('ready', () => {

    console.log('This bot is online!');

})

//auto roles
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch.name === 'spam');

    if(!channel) return;

    channel.send('Welcome to the server, ${member}');
})


bot.on('message', msg => {
    if (msg.content === "HELLO") {
        if (commandCooldown.has(msg.author.id)) {
            msg.reply("Wait 1 minute before using this command")
        } else {
            msg.reply('HELLO FRIEND');
            // Adds the user to the set so that they can't talk for a minute
            commandCooldown.add(msg.author.id);
            setTimeout(() => {
                // Removes the user from the set after a minute
                commandCooldown.delete(msg.author.id);
            }, 60000);
        }
    }
})

/*
bot.on('message', msg => {
    var d = new Date(); //current time
    //console.log(d.getHours());

    if (!landonCooldown.has(msg.author.id)) {
        if (msg.author.id === Landon && (d.getHours() >= 3 && d.getHours() <= 11)) {
            //msg.reply('Mock Landon');
            msg.reply('https://cdn.discordapp.com/attachments/751951417207422976/752783620099276921/SmartSelect_20200907-055103_Twitter.png');
            landonCooldown.add(msg.author.id);
            setTimeout(() => {
                // Removes the user from the set after 5 hours
                landonCooldown.delete(msg.author.id);
            }, 90);
        }
    }

})
*/

bot.on('message', msg => {
    var d = new Date(); //current time
    //console.log(d.getHours());

    if (msg.author.id === Landon && (d.getHours() >= 3 && d.getHours() <= 11)) {
        //msg.reply('Mock Landon');
        msg.reply('https://cdn.discordapp.com/attachments/751951417207422976/752783620099276921/SmartSelect_20200907-055103_Twitter.png');
    }
})

bot.on('message', msg => {
    var d = new Date(); //current time
    //console.log('Here');
    console.log(d.getHours());
    if (msg.author.id === Tanner && msg.content === "!serverTime") {
        //msg.reply('Mock Landon');
        msg.reply(d.getHours());
    }
})


bot.login(token);