import bent from "bent";
import { GuildMember, Message, Client as DiscordClient } from "discord.js";
import { MongoClient, ObjectId } from "mongodb";
import app from './app';
import PlayerModel from "./player-model";
import ServerConstants from "./server-constants";
import WeebTimer from "./weeb-wednessday/weeb-timer";
import WeebController from "./weeb-wednessday/weeb";

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) {
        console.error(`Error starting server: ${err}`);
        process.abort();
    }

    console.log(`Server is listening on port ${port}.`);
    return;
});

const bot = new DiscordClient();

const commandCooldown = new Set();
const landonCooldown = new Set();

// Get environment variables
const token = process.env.DISCORD_TOKEN;
const mongodbPassword = process.env.MONGO_DATABASE_PASSWORD;
const mongodbName = process.env.MONGO_DATABASE_DB_NAME;
const connectionString = `mongodb+srv://Wc6a4MhgWkQkc2u2x8:${mongodbPassword}@sorryehcluster.tqfuh.azure.mongodb.net/${mongodbName}?retryWrites=true&w=majority`;

bot.on('ready', () => {
    console.log('This bot is online!');
});

const weeb = new WeebController(bot);
const weebTimer = new WeebTimer();

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

    member.roles.set([ServerConstants.GARBORATOR_ROLE])
        .then(console.log)
        .catch(console.error);
});

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
});

bot.on('message', async msg => {
    if (msg.member.roles.cache.has(ServerConstants.POUTINE_ROLE) || msg.member.roles.cache.has(ServerConstants.TEST_SERVER_POUTINE_ROLE)) {
        if (msg.content === "!letTheWeebeningBegin") {
            await weeb.createChannel(msg.guild);
            await msg.reply("Attempting to create the weebiest of weebs");
            weebTimer.start(weeb, msg.guild);
        }
        else if (msg.content === "!letTheWeebeningEnd") {
            await weeb.removeChannel();
            await msg.reply("No one will know what happened here.");
            weebTimer.stop();
        }
        else if (msg.content === "!enableWeebs") {
            await weeb.enableChannel(msg.guild);
        }
        else if (msg.content === "!disableWeebs") {
            await weeb.disableChannel(msg.guild);
        }
    }
});


//leagcy code, we still need this
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


//reads from DB
bot.on('message', msg => {
    if (msg.member.roles.cache.has(ServerConstants.POUTINE_ROLE) && msg.content === "!mongoKayden") {
        //connect to client
        const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

        client.connect(async err => {

            const collection = await client.db("game").collection("gameCollection");

            const outPut = await collection.find().toArray();

            console.log(outPut);

            msg.reply(`You have ${outPut[0].points} points`);
        });


        client.connect(async err => {
            const collection = await client.db("game").collection("gameCollection");
            const outPut = await collection.find().toArray();
            await msg.reply(`You have ${outPut[0].points} points`);
        });

        client.close()
            .catch(msg => {
                console.log("Bro you borked it")
            });
    }
})


//adds points to DB
bot.on('message', msg => {
    if (msg.member.roles.cache.has(ServerConstants.POUTINE_ROLE) && msg.content === "!mongoAddPoints") {
        //connect to client
        const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

        client.connect(async err => {
            const collection = await client.db("game").collection("gameCollection");

            const points = await collection.find().toArray();

            collection.update({ _id: new ObjectId("5f631363aa7d05d7547c6d61") }, { points: points[0].points + 10 })
                .then((value) => {
                    console.log(value);
                });
        });

        client.close()
            .catch(msg => {
                console.log("Bro you borked it")
            });
    }
});

//adds new player
bot.on('message', msg => {
    if (msg.member.roles.cache.has(ServerConstants.POUTINE_ROLE) && msg.content === "!joinGame") {
        //connect to client
        const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

        client.connect(async err => {
            const collection = await client.db("game").collection("gameCollection");

            const points = await collection.find().toArray() as PlayerModel[];

            if (!points.find(pm => pm.playerId === msg.member.id)) {
                //do stuff if not found
                collection.insertOne(new PlayerModel(msg.member.id));
            }
            else {
                //do nothing if found
                console.log("Player already is in system");
            }

        });

        client.close()
            .catch(msg => {
                console.log("Bro you borked it")
            });
    }
});

bot.on('message', msg => {
    var d = new Date(); //current time
    //console.log('Here');

    //console.log(msg.member._roles);
    if (msg.member.roles.cache.has(ServerConstants.POUTINE_ROLE) && msg.content === "!serverTime") {
        //msg.reply('Mock Landon');
        console.log(d.getHours());
        msg.reply(d.getHours());
    }
});

bot.on('message', async (msg) => {
    if (msg.content === "!getBent") {
        const get = bent("https://inspirobot.me/api?generate=true", "GET", "string", 200);
        const response = await get("") as string;
        await msg.reply(response);
    }
});

bot.login(token);
