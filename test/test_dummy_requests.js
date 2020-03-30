import { close as disconnectDB, connect as connectDB } from '../server/database/database';
import mongoAuth from '../exempt/mongo_auth';
import { ObjectId } from 'mongodb';
import Employee from '../server/database/schema/employeeschema';
import moment from 'moment';
import Request, { PendingState } from '../server/database/schema/requestschema';

connectDB(mongoAuth.username, mongoAuth.password, mongoAuth.database, mongoAuth.authDatabase)
    .then(async () => {
        console.log(`Database Connected`);
        const employees = await Employee.find({ company: new ObjectId('5e6ab44d3626010a68078b61') });

        for (let i = 0; i < 2; i++) {
            for (const requester of employees) {
                for (const responder of employees) {
                    if (requester._id === responder._id) {
                        continue;
                    }
                    const time = moment();
                    if (Math.random() > .5) {
                        time.add(Math.random() * 10, 'd');
                    } else {
                        time.subtract(Math.random() * 10, 'd');
                    }
                    const review = new Request({
                        company: requester.company,
                        timeRequested: time.toDate(),
                        userRequesting: requester._id,
                        userReceiving: responder._id,
                        status: PendingState.PENDING,
                    });
                    await review.save();

                }
            }
        }

        disconnectDB();
    });