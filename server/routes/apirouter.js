import { Router } from 'express';
import moment from 'moment';
import { ObjectId } from 'mongodb';
import Company from '../database/schema/companyschema';
import Employee from '../database/schema/employeeschema';
import Request, { PendingState } from '../database/schema/requestschema';
import Review from '../database/schema/reviewschema';
import authRouter from '../middleware/authrouter';
import { authMiddleware } from '../middleware/authtoken';
import { getExpireTime, truncateEmployee } from '../util/serverutil';
import { editorRouter } from './editorrouter';
import { requestRouter } from './requestrouter';

const apiRouter = Router();

// noinspection JSUnresolvedFunction
apiRouter.use('/auth', authRouter);
// noinspection JSUnresolvedFunction
apiRouter.use('/request', requestRouter);
// noinspection JSUnresolvedFunction
apiRouter.use('/editor', editorRouter);

apiRouter.get('/whoami', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(404).end();
        return;
    }
    Employee.findOne({
        _id: new ObjectId(req.tokenData.id),
        company: new ObjectId(req.tokenData.company)
    }).then(async user => {
        if (!user) {
            res.status(404).end();
            return;
        }

        let isManager = false;
        try {
            const managerResults = await Employee.find({
                company: new ObjectId(req.tokenData.company),
                manager: new ObjectId(req.tokenData.id),
            });
            if (managerResults && managerResults.length) {
                isManager = true;
            }
        } catch (err) {
            console.error(err);
        }

        return res.status(200).json({
            userName: `${ user.firstName } ${ user.lastName }`,
            isManager,
        });
    }).catch(err => {
        res.status(404).end();
        console.error(err);
    });

});

apiRouter.post('/logged-in', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(404).end();
        return;
    }
    Employee.findOneAndUpdate(
        {
            _id: new ObjectId(req.tokenData.id),
            company: new ObjectId(req.tokenData.company)
        },
        {
            lastLoggedIn: moment().toDate()
        }
    ).catch((err) => {
        console.error(err);
    }).then(res.sendStatus(200));
});

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
            console.error(err);
        });
});

const reviewsByYear = (reviews) => {

    const byYear = {};
    reviews.forEach(review => {
        const year = review.dateWritten.getFullYear();

        if (!byYear[year]) {
            byYear[year] = [];
        }
        byYear[year].push(review);
    });


    return byYear;
};

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
            const closedReviews = await Review.find({
                requestID: { '$in': requests.map(o => o._id) },
                completed: true
            });
            return requests.map(request => {
                const { _id, company, timeRequested, userRequesting, userReceiving } = request;
                const employee = employees.find(e => e._id.toString() === request.userRequesting.toString());
                const review = closedReviews.find(r => r.requestID.toString() === request._id.toString());
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
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    position: employee.position,
                    submittedTime: review != null ? review.dateWritten : getExpireTime(request).toDate()
                };
            }).filter(o => !!o);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Error');
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
        res.sendStatus(404);
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
    let review = undefined;
    try {
        request = await Request.findOneAndDelete({
            _id: req.body._id,
            userReceiving: req.tokenData.id,
            status: { '$in': [PendingState.PENDING, PendingState.ACCEPTED] },
        });
        console.log(request);
        if (!request) {
            res.sendStatus(404);
            return;
        }
        review = await Review.findOneAndDelete({
            requestID: req.body._id
        });
        console.log(review);
        res.status(200).end();
    } catch {
        res.status(500).end();
    }
});

apiRouter.get('/employee-reviews', authMiddleware, async (req, res) => {

    const employees = await Employee.find({ company: new ObjectId(req.tokenData.company), manager: req.tokenData.id });

    const reviews = {};

    for (const employee of employees) {
        // console.log(employee.firstName);
        reviews[`${ employee.firstName } ${ employee.lastName }`] = await Request.find({
            status: PendingState.COMPLETED,
            company: new ObjectId(req.tokenData.company),
            userRequesting: new ObjectId(employee._id)
        })
            .then(async requests => {
                const allEmployees = await Employee.find({ company: new ObjectId(req.tokenData.company) });
                if (!requests || !requests.length) {
                    return [];
                }

                // console.log(requests);

                const subReviews = await Review.find({ requestID: { '$in': requests.map(r => r._id) } });


                // console.log(subReviews);

                return reviewsByYear(subReviews.map(review => {
                    // console.log(review);
                    const request = requests.find((_req) => _req._id.toString() === review.requestID.toString());
                    // console.log(request);
                    const sendingEmployee = allEmployees.find(e => e._id.toString() === request.userReceiving.toString());
                    return {
                        requestId: request._id,
                        reviewId: review._id,
                        contents: review.contents,
                        dateWritten: review.dateWritten,
                        isCompleted: review.completed,
                        firstName: sendingEmployee.firstName,
                        lastName: sendingEmployee.lastName,
                        email: sendingEmployee.email,
                        position: sendingEmployee.position,
                    };
                }));

            });
    }

    res.status(200).json({
        reviews
    });

});


apiRouter.get('/reviews', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    const reviews = await Request.find({
        status: PendingState.COMPLETED,
        company: new ObjectId(req.tokenData.company),
        userRequesting: new ObjectId(req.tokenData.id)
    })
        .then(async requests => {
            const employees = await Employee.find({ company: new ObjectId(req.tokenData.company) });
            if (!requests || !requests.length) {
                return [];
            }

            // console.log(requests);/

            const reviews = await Review.find({ requestID: { '$in': requests.map(r => r._id) } });


            return reviewsByYear(reviews.map(review => {
                // console.log(review);
                const request = requests.find((_req) => _req._id.toString() === review.requestID.toString());
                // console.log(request);
                const employee = employees.find(e => e._id.toString() === request.userReceiving.toString());
                return {
                    requestId: request._id,
                    reviewId: review._id,
                    dateWritten: review.dateWritten,
                    isCompleted: review.completed,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    position: employee.position,
                };
            }));

        });


    // console.log(reviews);

    res.status(200).json({
        reviews
    });
});

apiRouter.get('/review-contents', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    const { requestId } = req.query;

    console.log(requestId);

    if (!requestId) {
        res.status(400).send('Invalid query');
        return;
    }

    const review = await Review.findOne({ _id: new ObjectId(requestId) });

    if (!review) {
        res.status(404).send('Not found');
        return;
    }

    console.log(review);

    res.status(200).json({
        contents: review.contents
    });
});

apiRouter.get('/user-stats', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    const stats = {};

    const companyRequests = await Request.find({ company: req.tokenData.company });
    const requestsReceived = companyRequests.filter((request) => request.userReceiving.toString() === req.tokenData.id.toString());
    const requestsSent = companyRequests.filter((request) => request.userRequesting.toString() === req.tokenData.id.toString());

    // console.log('Requests in my company:');
    // console.log(companyRequests);

    stats.receivedRequests = {
        pending: requestsReceived.filter(r => r.status === PendingState.PENDING).length,
        accepted: requestsReceived.filter(r => r.status === PendingState.ACCEPTED).length
    };

    stats.sentRequests = {
        pending: requestsSent.filter(r => r.status === PendingState.PENDING).length,
        accpeted: requestsSent.filter(r => r.status === PendingState.ACCEPTED).length
    };

    const reqRecievedIds = requestsReceived.filter(r => r.status === PendingState.COMPLETED).map(r => r._id.toString());
    const reqSentIds = requestsSent.filter(r => r.status === PendingState.COMPLETED).map(r => r._id.toString());

    const companyReviews = await Review.find({ requestID: { '$in': companyRequests.map(r => r._id.toString()) } });

    const reviewsReceived = companyReviews.filter(rev => reqRecievedIds.includes(rev.requestID.toString()));
    const reviewsSent = companyReviews.filter(rev => reqSentIds.includes(rev.requestID.toString()));

    const now = new Date();

    // prolly a better way to do this
    const week = 1000 * 60 * 60 * 24 * 7;

    stats.receivedReviews = {
        lastWeek: reviewsReceived.filter(r => now - r.dateWritten < week).length,
        allTime: reviewsReceived.length
    };

    stats.sentReviews = {
        lastWeek: reviewsSent.filter(r => now - r.dateWritten < week).length,
        allTime: reviewsSent.length
    };

    res.status(200).json({
        stats
    });

});

export default apiRouter;