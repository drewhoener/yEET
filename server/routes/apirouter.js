import { Router } from 'express';
import authRouter from '../middleware/authrouter';
import Company from '../database/schema/companyschema';
import { authMiddleware } from '../middleware/authtoken';
import Employee from '../database/schema/employeeschema';
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

export default apiRouter;