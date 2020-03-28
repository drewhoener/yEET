import { Router } from 'express';
import authRouter from '../middleware/authrouter';
import Company from '../database/schema/companyschema';
import { authMiddleware } from '../middleware/authtoken';
import Request from '../database/schema/requestschema';

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
    const requests = await Request.find({ company: req.tokenData.company, userReceiving: req.tokenData.id });
    // Get employee for each requester in requests, etc
    // Map to data structure
    console.log(requests);
    res.status(200).json({
        requests
    });
});

export default apiRouter;