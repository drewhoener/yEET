import { close as disconnectDB, connect as connectDB } from '../server/database/database';
import mongoAuth from '../exempt/mongo_auth';
import { ObjectId } from 'mongodb';
import Employee from '../server/database/schema/employeeschema';
import moment from 'moment';
import Request from '../server/database/schema/requestschema';
import Review from '../server/database/schema/reviewschema';

//5 years
const fiveYear = 157784760000;

connectDB(mongoAuth.username, mongoAuth.password, mongoAuth.database, mongoAuth.authDatabase)
    .then(async () => {
        console.log(`Database Connected`);
        const employees = await Employee.find({ company: new ObjectId('5e6ab44d3626010a68078b61') });

        for (let i = 0; i < 20; i++) {
            for (const requester of employees) {
                for (const responder of employees) {
                    if (requester._id.toString() === responder._id.toString()) {
                        continue;
                    }
                    const time = moment();
                    if (Math.random() > .5) {
                        time.add(Math.random() * fiveYear, 'ms');
                    } else {
                        time.subtract(Math.random() * fiveYear, 'ms');
                    }

                    const request = new Request({
                        company: requester.company,
                        timeRequested: time.toDate(),
                        userRequesting: requester._id,
                        userReceiving: responder._id,
                        status: 3,
                    });
                    await request.save();
                    const content = `[{"type":"heading-one","children":[{"text":"Review for: ${ requester.firstName } ${ requester.lastName }"}]},{"type":"heading-two","children":[{"text":"Reviewer: ${ responder.firstName } ${ responder.lastName }"}]},{"type":"paragraph","children":[{"text":"*Write your review here*"}]}]`;
                    const review = new Review({
                        contents: content,
                        dateWritten: time.clone().add(2, 'weeks'),
                        requestID: request._id,
                        completed: true
                    });
                    await review.save();
                }
            }
        }

        disconnectDB();
    });