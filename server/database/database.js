import mongoose from 'mongoose';
import { scheduleJob } from 'node-schedule';
import util from 'util';

const DBUrl = 'mongodb://%sdrewhoener.com/%s?authSource=%s';

const database = null;
let databaseCleanJob;

export async function scheduleCleanup() {
    databaseCleanJob = scheduleJob('*/30 * * * * *', () => {
        // logger.info('Checking to see if chain time is the same as stored time');
        const nextTime = this.getNextUpdateTime(WeatherHolder.getTimes());
        if (nextTime.valueOf() !== this.chainExpireTime?.valueOf()) {
            logger.info(`*** Next Time is ${ nextTime.valueOf() }, which is different from ${ this.chainExpireTime }`);
            logger.info(`*** Scheduling a job for the next embed to be sent at ${ nextTime.toLocaleString() }`);
            this.scheduleEmbedJob(nextTime);
        }
    });
}

export async function connect(user, pass, database, authDatabase) {
    console.log('Connecting to MongoDB...');
    let auth = '';
    const authSource = authDatabase || 'admin';
    if (user && pass) {
        auth = `${ user }:${ pass }@`;
    }
    const connectionURL = util.format(DBUrl, auth, database, authSource);
    // console.log(connectionURL);

    mongoose.set('useCreateIndex', true);
    await mongoose.connect(connectionURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    database = mongoose.connection;
    database.on('error', console.error.bind(console, 'connection error:'));
}

export function close() {
    mongoose.disconnect();
}

export { database };
