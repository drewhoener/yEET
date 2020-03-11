import util from 'util';
import mongoose from 'mongoose';

const DBUrl = 'mongodb://%sdrewhoener.com/%s?authSource=%s';

let pending = true;
let database = null;

export async function connect(user, pass, database, authDatabase) {
    console.log(`Connecting to MongoDB...`);
    let auth = '';
    let authSource = authDatabase || 'admin';
    if (user && pass) {
        auth = `${user}:${pass}@`;
    }
    const connectionURL = util.format(DBUrl, auth, database, authSource);
    //console.log(connectionURL);

    mongoose.set('useCreateIndex', true);
    await mongoose.connect(connectionURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    pending = false;

    database = mongoose.connection;
    database.on('error', console.error.bind(console, 'connection error:'));
}

export function close() {
    mongoose.disconnect();
}

export {database};
