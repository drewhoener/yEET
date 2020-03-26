import {Router} from 'express';
import authRouter from "../middleware/authrouter";
import Company from '../database/schema/companyschema';

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
            res.status(200).json({companies});
        })
        .catch(err => {
            res.status(500).send('Internal Server Error');
        })
});

export default apiRouter;