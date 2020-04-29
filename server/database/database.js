import moment from 'moment';
import mongoose from 'mongoose';
import { scheduleJob } from 'node-schedule';
import util from 'util';
import Request, { PendingState } from '../database/schema/requestschema';
import { getExpireTime } from '../util/serverutil';

const DBUrl = 'mongodb://%sdrewhoener.com/%s?authSource=%s';

const database = null;
let databaseCleanJob;

export function scheduleCleanup() {
    console.log('Scheduling Database Cleanup Job...');
    databaseCleanJob = scheduleJob('59 59 23 * * *', async () => {
        let requests = await Request.find({ status: { '$ne': PendingState.COMPLETED } });
        const now = moment();
        let deleted = 0;
        let errors = 0;
        requests = requests.filter(request => {
            const endTime = getExpireTime(request);
            return now.isAfter(endTime);
        });

        for (const request of requests) {
            try {
                await request.remove();
                deleted++;
            } catch (err) {
                console.err(err);
                errors++;
            }
        }
        console.log(`Pruned ${ deleted } expired requests with ${ errors } error(s)`);
    });
    console.log('Database Cleanup Scheduled!');
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
