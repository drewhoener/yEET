import { Router } from 'express';
import moment from 'moment';
import { ObjectId } from 'mongodb';
import Employee from '../database/schema/employeeschema';
import Request, { PendingState } from '../database/schema/requestschema';
import Review from '../database/schema/reviewschema';
import { authMiddleware } from '../middleware/authtoken';
import { truncateEmployee } from '../util/serverutil';

export const editorRouter = Router();

editorRouter.post('/submit-review', authMiddleware, async (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    const { requestId, content } = req.body;
    console.log(req.body);
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

    request.save()
        .then(() => {
            review.save()
                .then(() => {
                    console.log(review);
                    res.status(201).json({
                        reviewId: review._id,
                        requestId: requestId
                    });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Error');
        });
});

editorRouter.get('/editor-data', authMiddleware, async (req, res) => {
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