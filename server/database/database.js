import moment from 'moment';
import mongoose from 'mongoose';
import { scheduleJob } from 'node-schedule';
import util from 'util';
import Request, { PendingState } from '../database/schema/requestschema';
import Review from '../database/schema/reviewschema';
import { getExpireTime } from '../util/serverutil';

const DBUrl = 'mongodb://%sdrewhoener.com/%s?authSource=%s';

const database = null;
let databaseCleanJob;

export function scheduleCleanup() {
    console.log('Scheduling Database Cleanup Job...');
    databaseCleanJob = scheduleJob('0 0 0 * * *', async () => {
        console.log('Running Database Cleanup...');
        let requests = await Request.find({ status: { '$ne': PendingState.COMPLETED } });
        const now = moment();

        requests = requests.filter(request => {
            const endTime = getExpireTime(request);
            return now.isAfter(endTime);
        });
        const ids = requests.map(o => o._id);

        try {

            const requestDeleteResults = await Request.deleteMany({
                _id: { '$in': ids }
            });

            const reviewDeleteResults = await Review.deleteMany({
                requestID: { '$in': ids },
                completed: false
            });

            // console.log(requestDeleteResults);
            // console.log(reviewDeleteResults);

            if (requestDeleteResults.deletedCount > 0 || reviewDeleteResults.deletedCount > 0) {

                console.log('----------[ Prune Results ]----------');
                console.log(`Initially Found ${ requests.length } to delete`);
                console.log(`Requests Found: ${ requestDeleteResults.n } / Deleted: ${ requestDeleteResults.deletedCount }`);
                console.log(`Reviews Found: ${ reviewDeleteResults.n } / Deleted: ${ reviewDeleteResults.deletedCount }`);
                console.log('----------------------------------------');
            } else {
                console.log('No Data to prune.');
            }

        } catch (err) {
            console.error('An Error occurred while pruning old results');
            console.error(err);
        }
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
    mongoose.set('useFindAndModify', false);
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
