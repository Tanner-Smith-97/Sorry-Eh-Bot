import {Client as DiscordClient, Guild, TextChannel} from "discord.js";
import ServerConstants from "../server-constants";

export default class WeebController {
    public get weebChannelName() { return "weeb-wednesday"; }
    public static weebChannel: TextChannel;

    constructor(private bot: DiscordClient) {
    }

    public async createChannel(guild: Guild): Promise<void> {
        WeebController.weebChannel = await guild.channels.create(this.weebChannelName, {
            type: "text",
            topic: "weebs",
            nsfw: true,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: ['VIEW_CHANNEL']
                }
            ]
        });

        try {
            await WeebController.weebChannel.updateOverwrite(ServerConstants.TEST_SERVER_POUTINE_ROLE, {
                VIEW_CHANNEL: true
            });
        } catch (e) {
            console.error("You are not on the TEST server cannot override role that doesn't exist");
        }
        try {
            await WeebController.weebChannel.updateOverwrite(ServerConstants.POUTINE_ROLE, {
                VIEW_CHANNEL: true
            });
        } catch (e) {
            console.error("You are not on the PRIMARY server cannot override role that doesn't exist");
        }
    }

    public async enableChannel(guild: Guild): Promise<void> {
        await WeebController.weebChannel.updateOverwrite(guild.roles.everyone, {
            VIEW_CHANNEL: true
        });
    }

    public async disableChannel(guild: Guild): Promise<void> {
        await WeebController.weebChannel.updateOverwrite(guild.roles.everyone, {
            VIEW_CHANNEL: false
        });
    }

    public async removeChannel(): Promise<void> {
        try {
            await WeebController.weebChannel.delete("Its end of Weeb Wednesday!");
        } catch (err) {
            console.error("Channel could not be deleted", err);
        }
    }
}
