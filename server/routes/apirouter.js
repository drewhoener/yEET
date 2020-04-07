import { Router } from 'express';
import authRouter from '../middleware/authrouter';
import Company from '../database/schema/companyschema';
import { authMiddleware } from '../middleware/authtoken';
import Employee from '../database/schema/employeeschema';
import Request, { PendingState } from '../database/schema/requestschema';
import { ObjectId } from 'mongodb';
import { requestRouter } from './requestrouter';

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
        userData: loggedIn,
        requestingData: userRequesting,
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
                employees: result.map(({ _id, employeeId, firstName, lastName, startDate, position }) => ({
                    _id,
                    employeeId,
                    firstName,
                    lastName,
                    startDate,
                    position,
                    fullName: `${ firstName } ${ lastName }`
                }))
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
    console.log(req.tokenData);
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

export default apiRouter;