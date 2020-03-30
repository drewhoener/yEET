import { Router } from 'express';
import authRouter from '../middleware/authrouter';
import Company from '../database/schema/companyschema';
import { authMiddleware } from '../middleware/authtoken';
import { ObjectId } from 'mongodb';
import Request, { PendingState } from '../database/schema/requestschema';
import Employee from '../database/schema/employeeschema';


const apiRouter = Router();

// noinspection JSUnresolvedFunction
apiRouter.use('/auth', authRouter);
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
        })
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
            if (!requests) {
                return [];
            }
            const employees = await Employee.find({ company: new ObjectId(req.tokenData.company) });
            return requests.map(request => {
                const { _id, company, timeRequested, userRequesting, userReceiving } = request;
                const employee = employees.find(e => e._id.toString() === request.userRequesting.toString());
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

export default apiRouter;