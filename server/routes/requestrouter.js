import { Router } from 'express';
import { authMiddleware } from '../middleware/authtoken';
import { ObjectId } from 'mongodb';
import Employee from '../database/schema/employeeschema';
import Request, { PendingState } from '../database/schema/requestschema';
import moment from 'moment';

export const requestRouter = Router();

// noinspection JSUnresolvedFunction
requestRouter.post('/request-users', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    const { users } = req.body;
    if (!users) {
        res.status(400).end();
        return;
    }

    const filteredUsers = users.filter(o => !!o).map(o => new ObjectId(o));
    const foundEmployees = await Employee.find({ _id: { '$in': filteredUsers } })
        .then(response => {
            if (!response) {
                return [];
            }
            return response.filter(o => !!o);
        })
        .catch(err => {
            console.error(err);
            return [];
        });

    console.log('Employees for the current request');
    console.log(foundEmployees);

    // Get the current requests for this user to make sure they're not performing a double request
    // This shouldn't happen but it's good to check just in case?
    const currentRequests = await Request.find(
        {
            userRequesting: new ObjectId(req.tokenData.id),
            userReceiving: { '$in': foundEmployees.map(o => o._id) },
            status: { '$in': [PendingState.PENDING, PendingState.ACCEPTED] }
        }
    ).then(response => {
        if (!response) {
            return [];
        }
        // Still not sure if this is necessary, not sure if mongoose will return undefined/null results
        return response.filter(o => !!o);
    }).catch(err => {
        console.error(err);
        return null;
    });

    if (!currentRequests) {
        res.status(500).json({
            message: 'Unable to submit your requests at this time, please try again',
        });
        return;
    }

    console.log(`Found ${ currentRequests.length } requests that match users being asked for`);
    console.log(currentRequests);

    const newRequests = foundEmployees.filter(employee => {
        return !currentRequests.some(request => request.userReceiving.toString() === employee._id.toString());
    }).map(employee => {
        return [
            employee._id,
            new Request({
                company: employee.company,
                timeRequested: moment().toDate(),
                userRequesting: new ObjectId(req.tokenData.id),
                userReceiving: employee._id,
                status: PendingState.PENDING
            })
        ];
    });

    if (!newRequests.length) {
        res.status(400).json({
            message: 'You already have requests pending for the selected user(s)'
        });
        return;
    }

    const successIds = [];
    const requestStates = [];
    for (const [employeeObjId, request] of newRequests) {
        try {
            await request.save();
            console.log(`Processing new request for employee ${ employeeObjId }`);
            console.log(request);
            successIds.push(employeeObjId);
            requestStates.push({
                userObjId: request.userReceiving,
                status: request.status,
                statusName: PendingState[request.status]
            });
        } catch (err) {
            console.error(err);
        }
    }

    if (successIds.length !== newRequests.length) {
        res.status(500).json({
            savedRequests: successIds,
            requestStates,
            message: 'Unable to process all requests, please try again with the remaining users in a moment'
        });
        return;
    }
    res.status(201).json({
        savedRequests: successIds,
        requestStates,
        message: `Sent requests to ${ successIds.length } other user(s)`
    });
});

requestRouter.get('/request-states', authMiddleware, (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    Request.find({
        company: new ObjectId(req.tokenData.company),
        userRequesting: new ObjectId(req.tokenData.id),
        status: { '$in': [PendingState.PENDING, PendingState.ACCEPTED] }
    }).then(result => {
        if (!result) {
            result = [];
        }

        console.log(result);

        res.status(200).json({
            requestStates: result.map(request => ({
                userObjId: request.userReceiving,
                status: request.status,
                statusName: PendingState[request.status]
            }))
        });
    }).catch(err => {
        console.error(err);
        res.status(500).send('Internal Error');
    });
});

requestRouter.post('/cancel', authMiddleware, (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    const { requestedEmployee } = req.body;

    if (!requestedEmployee) {
        res.status(400).send('Invalid body');
        return;
    }

    Request.findOneAndDelete({
        company: req.tokenData.company,
        userRequesting: req.tokenData.id,
        userReceiving: new ObjectId(requestedEmployee)
    })
        .then(result => {
            res.status(200).send('OK');
        })
        .catch(err => {
            console.error(err);
            res.status(500).end();
        });

});
