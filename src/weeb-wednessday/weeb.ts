import {Channel, Client as DiscordClient} from "discord.js";

export default class WeebController {
    public get weebChannelName() { return "weeb-wednesday"; }
    public static weebChannel: Channel;

    constructor(private bot: DiscordClient) {
    }

    public createChannel(): void {
        WeebController.weebChannel = this.bot.channels.add(this.weebChannelName);
    }

    public async removeChannel(): Promise<void> {
        const channel = WeebController.weebChannel ?? await this.bot.channels.fetch(this.weebChannelName);

        try {
            await channel.delete();
        } catch (err) {
            console.error("Channel could not be deleted", err);
        }
    }
}
