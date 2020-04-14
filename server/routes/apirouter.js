import { Router } from 'express';
import authRouter from '../middleware/authrouter';
import Company from '../database/schema/companyschema';
import { authMiddleware } from '../middleware/authtoken';
import Employee from '../database/schema/employeeschema';
import Request, { PendingState } from '../database/schema/requestschema';
import { ObjectId } from 'mongodb';
import { requestRouter } from './requestrouter';
import Review from '../database/schema/reviewschema';
import moment from 'moment';

const apiRouter = Router();

// noinspection JSUnresolvedFunction
apiRouter.use('/auth', authRouter);
// noinspection JSUnresolvedFunction
apiRouter.use('/request', requestRouter);

// noinspection JSUnresolvedFunction
apiRouter.get('/companies', (req, res) => {
    Company.find({})
        .then(result => {
            const companies = result.map(entry => {
                return {
                    companyId: entry._id,
                    companyName: entry.name
                };
            });
            res.status(200).json({ companies });
        })
        .catch(err => {
            res.status(500).send('Internal Server Error');
        });
});

const truncateEmployee = ({ _id, employeeId, firstName, lastName, startDate, position }) => {
    return {
        _id,
        employeeId,
        firstName,
        lastName,
        startDate,
        position,
        fullName: `${ firstName } ${ lastName }`
    };
};

const reviewsByYear = (reviews) => {

    let byYear = {};
    reviews.forEach(review => {
        let year = review.dateWritten.getFullYear();

        if(!byYear[year]) {
            byYear[year] = [];
        }
        byYear[year].push(review);
    });



    return byYear;   
}


apiRouter.post('/submit-review', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    const { requestId, content } = req.body;
    if (!requestId || !content) {
        res.status(400).send('Request missing fields');
        return;
    }

    const request = await Request.findOne({
        _id: new ObjectId(requestId),
        company: new ObjectId(req.tokenData.company),
        userReceiving: new ObjectId(req.tokenData.id)
    });

    console.log(request);

    if (!request) {
        res.status(404).send('Requested Resource not found');
        return;
    }

    let review = await Review.findOne({ requestID: new ObjectId(requestId) });
    if (!review) {
        review = new Review({
            requestID: requestId,
        });
    }

    review.contents = content;
    review.dateWritten = moment().toDate();
    review.completed = true;

    request.status = PendingState.COMPLETED;
    await request.save();
    await review.save();

    console.log(review);

    res.status(201).json({
        reviewId: review._id,
        requestId: requestId
    });
});

apiRouter.get('/editor-data', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    const { requestId } = req.query;
    if (!requestId) {
        res.status(400).send('Invalid Id Supplied');
        return;
    }

    const loggedIn = await Employee.findOne({
        company: new ObjectId(req.tokenData.company),
        _id: new ObjectId(req.tokenData.id)
    });

    const requestObj = await Request.findOne({
        company: new ObjectId(req.tokenData.company),
        _id: new ObjectId(requestId)
    });

    if (!loggedIn) {
        res.status(401).send('Unauthorized');
        return;
    }

    if (!requestObj) {
        res.status(404).send('Not Found');
        return;
    }
    console.log(loggedIn);
    console.log(requestObj);
    const userRequesting = await Employee.findOne({
        company: new ObjectId(req.tokenData.company),
        _id: new ObjectId(requestObj.userRequesting.toString())
    });

    if (!userRequesting) {
        res.status(404).send('Not Found');
        return;
    }

    res.status(200).json({
        userData: truncateEmployee(loggedIn),
        requestingData: truncateEmployee(userRequesting),
        request: requestObj
    });
});

// noinspection JSUnresolvedFunction
apiRouter.get('/employees', authMiddleware, (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    Employee.find({ company: new ObjectId(req.tokenData.company), _id: { '$ne': new ObjectId(req.tokenData.id) } })
        .then(result => {
            // console.log(result);
            if (!result) {
                result = [];
            }
            res.status(200).json({
                employees: result.map(employee => truncateEmployee(employee))
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Error');
        });
});

// noinspection JSUnresolvedFunction
apiRouter.get('/open-requests', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    console.log('Requests');
    const requests = await Request.find({ company: req.tokenData.company, userReceiving: req.tokenData.id })
        .then(async requests => {
            console.log(requests);
            if (!requests || !requests.length) {
                console.log('No Requests Found');
                return [];
            }
            const employees = await Employee.find({ company: new ObjectId(req.tokenData.company) });
            return requests.map(request => {
                const { _id, company, timeRequested, userRequesting, userReceiving } = request;
                const employee = employees.find(e => e._id.toString() === request.userRequesting.toString());
                console.log(employee);
                if (!employee) {
                    // Not ideal but what exactly are you supposed to do when you can't find a user?
                    return null;
                }
                return {
                    _id,
                    company,
                    timeRequested,
                    userRequesting,
                    userReceiving,
                    statusNumber: request.status,
                    statusName: PendingState[request.status],
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    position: employee.position,
                };
            }).filter(o => !!o);
        });
    // Get employee for each requester in requests, etc
    // Map to data structure
    console.log(requests);
    res.status(200).json({
        requests
    });
});

apiRouter.post('/accept-request', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }
    console.log(req.tokenData);
    console.log('Request');
    // const request = await Request.findOneAndUpdate({ _id: req.body._id, userReceiving: req.tokenData.id}, {status: PendingState.ACCEPTED});
    const finalRequest = await Request.findOne({ _id: req.body._id, userReceiving: req.tokenData.id })
        .then(request => {
            if (!request) {
                return undefined;
            }
            request.status = PendingState.ACCEPTED;
            return request.save();
        })
        .catch(err => {
            console.error(err);
            return undefined;
        });

    console.log('Final Request');
    console.log(finalRequest);
    if (!finalRequest) {
        res.status(200).json({
            request: finalRequest
        });
        return;
    }
    const employee = await Employee.findOne({ _id: finalRequest.userRequesting });
    if (!employee) {
        res.status(200).json({
            request: undefined
        });
        return;
    }

    const returnObj = {
        _id: finalRequest._id,
        company: finalRequest.company,
        timeRequested: finalRequest.timeRequested,
        userRequesting: finalRequest.userRequesting,
        userReceiving: finalRequest.userReceiving,
        statusNumber: finalRequest.status,
        statusName: PendingState[finalRequest.status],
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        position: employee.position,
    };
    console.log(returnObj);
    res.status(200).json({ request: returnObj });
});

apiRouter.post('/delete-request', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }
    console.log(req.tokenData);
    console.log('Request');
    console.log(req);
    let request = undefined;
    try {
        request = await Request.findOneAndDelete({ _id: req.body._id, userReceiving: req.tokenData.id });
        console.log(request);
        res.status(200).end();
    } catch {
        res.status(500).end();
    }
});

apiRouter.get('/employee-reviews', authMiddleware, async (req, res) => {

    const employees = await Employee.find({ company: new ObjectId(req.tokenData.company), manager: req.tokenData.id });

    console.log(employees);

});


apiRouter.get('/reviews', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    const reviews = await Request.find({ status: PendingState.COMPLETED, company: new ObjectId(req.tokenData.company), userRequesting: new ObjectId(req.tokenData.id) })
        .then(async requests => {
            const employees = await Employee.find({ company: new ObjectId(req.tokenData.company) });
            if (!requests || !requests.length) {
                console.log('No Completed Requests Found');
                return [];
            }

            // console.log(requests);/

            const reviews = await Review.find({ requestID: {'$in': requests.map(r => r._id)} });


            return reviewsByYear(reviews.map(review => {
                // console.log(review);
                const request = requests.find((_req) => _req._id.toString() === review.requestID.toString());
                // console.log(request);
                const employee = employees.find(e => e._id.toString() === request.userReceiving.toString());
                return {
                    id: request._id,
                    contents: review.contents,
                    dateWritten: review.dateWritten,
                    isCompleted: review.completed,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    position: employee.position,
                }
            }));
            
        });


    // console.log(reviews);

    res.status(200).json({
        reviews
    });
});


export default apiRouter;