import {Router} from 'express';
import authRouter from "../middleware/authrouter";

const apiRouter = Router();

// noinspection JSUnresolvedFunction
apiRouter.use('/auth', authRouter);

export default apiRouter;