import {GuildMember, Message, Client as DiscordClient} from "discord.js";
import * as dotenv from "dotenv";
import {MongoClient} from "mongodb";
import ServerConstants from "./server-constants";

dotenv.config();

const bot = new DiscordClient();



const commandCooldown = new Set();
const landonCooldown = new Set();

// Get environment variables
const token = process.env.DISCORD_TOKEN;
const connectionString = process.env.MONGO_DATABASE_PASSWORD;

// Retrieve
//const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });




bot.on('ready', () => {

    console.log('This bot is online!');

})

//auto roles
bot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'spam');

    if (!channel) {
        console.log("Could not find Spam")
        return;
    }

    console.log(`Welcome to the server, ${member}`);
    // @ts-ignore
    channel.send(`Welcome to the server, ${member}`);

    member.roles.set(['643678930754076712'])
        .then(console.log)
        .catch(console.error);
})


bot.on('message', msg => {
    if (msg.content === "HELLO") {
        if (commandCooldown.has(msg.author.id)) {
            msg.reply("Wait 1 minute before using this command")
        } else {
            msg.reply('HELLO FRIEND');
            // Adds the user to the set so that they can't talk for a minute
            //console.log(msg.member);
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

    if (msg.author.id === Landon && (d.getHours() >= 3 && d.getHours() <= 11)) {
        //msg.reply('Mock Landon');
        msg.reply('https://cdn.discordapp.com/attachments/751951417207422976/752783620099276921/SmartSelect_20200907-055103_Twitter.png');
    }
})
*/

bot.on('message', msg => {
    if (msg.member.roles.cache.has(ServerConstants.POUTINE_ROLE) && msg.content === "!mongo") {
        client.connect(async err => {

                const collection = await client.db("game").collection("gameCollection");
                const outPut = await collection.find().toArray();
                console.log(outPut)
                msg.reply(`You have ${outPut[0].points} points`)
                
                
                console.log("It works");


        });
    }
})

bot.on('message', msg => {
    if (msg.member.roles.cache.has(ServerConstants.POUTINE_ROLE) && msg.content === "!mongoAddPoints") {


        client.connect(async err => {

            /*
           await pointSchema.findOneAndUpdate(
                {_id: '5f631363aa7d05d7547c6d61' },
                {points: 10}
            )
            */
            /*
            try {
                const collection = await client.db("game").collection("gameCollection");
                collection.findOneAndUpdate({
                    filter: { _id : { $eq : '5f631363aa7d05d7547c6d61' }},
                    update: { $set : {'points': 10 }}
                }).then(console.log("foo")).catch(console.log());    
            }
            */
            /*
            try{
                const collection = await client.db("game").collection("gameCollection");
                collection.findOneAndUpdate(
                    {_id : '5f631363aa7d05d7547c6d61'},
                    {points : 10}
                    ).then(console.log('foo'));
            }
            catch (err) {
                console.log(err);
            }
            

            */

            //console.log(outPut)
            msg.reply(`You have added 10 points`)
            //perform actions on the collection object
            //client.close();
        });
    }
})


bot.on('message', msg => {
    var d = new Date(); //current time
    //console.log('Here');
    console.log(d.getHours());
    //console.log(msg.member._roles);
    if (msg.member.roles.cache.has(ServerConstants.POUTINE_ROLE) && msg.content === "!serverTime") {
        //msg.reply('Mock Landon');
        msg.reply(d.getHours());
    }
})


bot.login(token);
