import moment from 'moment';
import { ObjectId } from 'mongodb';
import mongoAuth from '../exempt/mongo_auth';
import { close as disconnectDB, connect as connectDB } from '../server/database/database';
import Employee from '../server/database/schema/employeeschema';
import Request, { PendingState } from '../server/database/schema/requestschema';

//5 years
const fiveYear = 157784760000;
const twentyMin = 1000 * 60 * 20;


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
                        time.add(Math.random() * twentyMin, 'ms');
                    } else {
                        time.subtract(Math.random() * twentyMin, 'ms');
                    }

                    const request = new Request({
                        company: requester.company,
                        timeRequested: time.toDate(),
                        userRequesting: requester._id,
                        userReceiving: responder._id,
                        status: PendingState.PENDING,
                    });
                    await request.save();
                    /*
                    const content = (rq, rs) => [
                        {
                            'type': 'heading-one',
                            'children': [{ 'text': `Review for: ${ rq.firstName } ${ rq.lastName }` }]
                        },
                        {
                            'type': 'heading-two',
                            'children': [{ 'text': `Reviewer: ${ rs.firstName } ${ rs.lastName }` }]
                        },
                        {
                            'type': 'paragraph', 'children': [{ 'text': '*Write your review here*' }]
                        }
                    ];
                    const review = new Review({
                        contents: JSON.stringify({ children: content(requester, responder) }),
                        dateWritten: time.clone().add(2, 'weeks'),
                        requestID: request._id,
                        completed: true
                    });
                    await review.save();
                     */
                }
            }
        }

        disconnectDB();
    });