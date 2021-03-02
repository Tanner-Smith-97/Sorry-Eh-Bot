import { Guild } from 'discord.js';
import schedule from 'node-schedule';
import WeebController from './weeb';

export default class WeebTimer {
    private enableJob: schedule.Job;
    private disableJob: schedule.Job;

    public start(weeb: WeebController, guild: Guild): void {
        console.log("before first scheduled job");

        this.enableJob = schedule.scheduleJob('30 * * * * *', async () => {
            console.log("Before Enable Channel Status: ", weeb.isChannelEnabled);
            await weeb.enableChannel(guild);
            console.log("After Enable Channel Status: ", weeb.isChannelEnabled);
        });

        console.log("after first scheduled job");

        this.disableJob = schedule.scheduleJob('25 * * * * *', async () => {
            console.log("Before Diable Channel Status: ", weeb.isChannelEnabled);
            await weeb.disableChannel(guild);
            console.log("After Diable Channel Status: ", weeb.isChannelEnabled);
        });

        console.log("after second scheduled job");
    }

    public stop(): void {
        this.enableJob?.cancel();
        this.disableJob?.cancel();
    }
}