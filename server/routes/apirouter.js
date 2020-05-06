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

apiRouter.get('/my-employees', authMiddleware, async (req, res) => {

    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    try {
        const employees = await Employee.find({
            company: new ObjectId(req.tokenData.company),
            manager: req.tokenData.id
        });

        const allRequests = await Request.find({
            company: req.tokenData.company,
            status: PendingState.COMPLETED
        });
        const allReviews = await Review.find({
            requestID: { '$in': allRequests.map(request => request._id) }
        });

        if (!employees) {
            res.sendStatus(500);
            return;
        }

        const thisYear = new Date().getFullYear();

        res.status(200).json({
            employees: employees.map(e => {
                const employee = truncateEmployee(e);
                const reviewsThisYear = allRequests.filter(request => {
                    if (request.userRequesting.toString() !== employee._id.toString()) {
                        return false;
                    }
                    const review = allReviews.find(review => review.requestID.toString() === request._id.toString());
                    if (!review || !review.completed) {
                        return false;
                    }
                    return review.dateWritten.getFullYear() === thisYear;
                }).length;
                return {
                    ...employee,
                    reviewsThisYear
                };
            }),
        });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }

});


apiRouter.get('/reviews', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    let employeeObjId = req.tokenData.id;
    if (req.query.employee) {
        employeeObjId = req.query.employee;
    }
    try {

        if (!employeeObjId) {
            res.sendStatus(404);
            return;
        }

        const requestingEmployee = await Employee.findOne({
            company: new ObjectId(req.tokenData.company),
            _id: new ObjectId(employeeObjId)
        });

        if (!requestingEmployee) {
            res.sendStatus(404);
            return;
        }

        if (requestingEmployee._id.toString() !== req.tokenData.id && (requestingEmployee.hasManager() && requestingEmployee.manager.toString() !== req.tokenData.id)) {
            res.sendStatus(403);
            return;
        }

        const reviews = await Request.find({
            status: PendingState.COMPLETED,
            company: new ObjectId(req.tokenData.company),
            userRequesting: new ObjectId(employeeObjId)
        })
            .then(async requests => {
                const employees = await Employee.find({ company: new ObjectId(req.tokenData.company) });
                if (!requests || !requests.length) {
                    return [];
                }

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
            employeeName: requestingEmployee._id.toString() === req.tokenData.id ? undefined : requestingEmployee.firstName,
            reviews
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
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

    const requestAbout = await Request.findOne({
        _id: review.requestID
    });

    if (!requestAbout) {
        res.sendStatus(404);
        return;
    }

    const userAbout = await Employee.findOne({
        _id: requestAbout.userRequesting
    });

    if (!userAbout || (userAbout._id.toString() !== req.tokenData.id && (userAbout.hasManager() && userAbout.manager.toString() !== req.tokenData.id))) {
        res.sendStatus(403);
        return;
    }

    res.status(200).json({
        contents: review.contents
    });
});

apiRouter.get('/user-stats', authMiddleware, async (req, res) => {

    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    const user = await Employee.findOne({ _id: new ObjectId(req.tokenData.id) });

    const lastLogin = user.lastLoggedIn;

    const companyRequests = await Request.find({ company: new ObjectId(user.company) });
    const companyReviews = await Review.find({ requestID: { '$in': companyRequests.map(r => r._id.toString()) } });

    const requestsReceived = companyRequests.filter((request) => request.userReceiving.toString() === user._id.toString());
    const requestsSent = companyRequests.filter((request) => request.userRequesting.toString() === user._id.toString());

    const reqRecievedIds = requestsReceived.map(req => req._id.toString());
    const reqSentIds = requestsSent.map(req => req._id.toString());

    const reviewsReceived = companyReviews.filter(rev => reqSentIds.includes(rev.requestID.toString()));
    const reviewsSent = companyReviews.filter(rev => reqSentIds.includes(rev.requestID.toString()));

    const stats = {};

    stats.requests = {
        incoming: {
            pending: requestsReceived.filter(r => r.status === PendingState.PENDING).length,
            pendingSinceLastLogin: requestsReceived.filter(r => r.status === PendingState.PENDING && r.timeRequested > lastLogin).length,
            accepted: requestsReceived.filter(r => r.status === PendingState.ACCEPTED).length,
            completed: requestsReceived.filter(r => r.status === PendingState.COMPLETED).length,
        },
        outgoing: {
            pending: requestsSent.filter(r => r.status === PendingState.PENDING).length,
            accepted: requestsSent.filter(r => r.status === PendingState.ACCEPTED).length,
            completed: requestsSent.filter(r => r.status === PendingState.COMPLETED).length
        }
    };

    stats.reviews = {
        incoming: {
            reviewsSinceLastLogin: reviewsReceived.filter(r => r.completed && r.dateWritten > lastLogin).length,
            allTime: reviewsReceived.length
        },
        outgoing: {
            allTime: reviewsSent.length
        }
    }

    res.status(200).json({
        stats
    });

});

export default apiRouter;