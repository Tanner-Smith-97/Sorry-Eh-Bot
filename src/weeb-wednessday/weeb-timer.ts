import { Guild } from 'discord.js';
import schedule from 'node-schedule';
import WeebController from './weeb';

export default class WeebTimer {
    private enableJob: schedule.Job;
    private disableJob: schedule.Job;
    public static weebTimerIsRunning = false;

    public start(weeb: WeebController, guild: Guild): void {
        console.log("configure scheduled jobs");
        this.enableJob = schedule.scheduleJob('0 0 12 * * 3', async () => {
            console.log("Before Enable Channel Status: ", weeb.isChannelEnabled);
            await weeb.enableChannel(guild);
            console.log("After Enable Channel Status: ", weeb.isChannelEnabled);
        });

        this.disableJob = schedule.scheduleJob('0 59 23 * * 3', async () => {
            console.log("Before Disable Channel Status: ", weeb.isChannelEnabled);
            await weeb.disableChannel(guild);
            console.log("After Disable Channel Status: ", weeb.isChannelEnabled);
        });
        WeebTimer.weebTimerIsRunning = true;
    }

    public stop(): void {
        this.enableJob?.cancel();
        this.disableJob?.cancel();
        console.log("stop scheduled jobs");
        WeebTimer.weebTimerIsRunning = false;
    }
}