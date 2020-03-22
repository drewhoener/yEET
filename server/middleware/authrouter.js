import {Router} from 'express';
import Employee from "../database/schema/employeeschema";
import {authMiddleware, issueToken} from "./authtoken";
import {ObjectId} from 'mongodb';

const authRouter = new Router();

// noinspection JSUnresolvedFunction
authRouter.post('/login', (req, res, next) => {
    const {companyId, employeeNumber, password} = req.body;
    //There needs to be a better way to do this
    if (!companyId || companyId === '-1' || !employeeNumber || employeeNumber < 1 || !password || password === '') {
        res.status(400).send('Bad Request, missing fields');
        return;
    }
    Employee.findOne({employeeId: employeeNumber, company: ObjectId(companyId)}).exec()
        .then(employee => {
            if (!employee) {
                res.status(401).send('Invalid Username or Password');
                return;
            }
            console.log(`Found User`);
            console.log(employee);
            employee.validatePassword(password)
                .then(result => {
                    if (!result) {
                        res.status(401).send('Invalid Username or Password');
                        return;
                    }
                    const start = getNanoSecTime();
                    const token = issueToken(employee);
                    console.log(`Issuing Token, took ${(getNanoSecTime() - start)} nanoseconds`);
                    console.log(token);
                    res.cookie('auth0', token, {httpOnly: true})
                        .sendStatus(200);
                })
                .catch(err => {
                    res.status(500).send('Internal Server Error');
                })
        })
        .catch(err => {
            res.status(401).send('Invalid Username or Password');
        });
});

authRouter.post('/logout', (req, res) => {
    res.clearCookie('auth0').sendStatus(200);
});

// noinspection JSUnresolvedFunction
authRouter.get('/validate', authMiddleware, (req, res) => {
    res.sendStatus(200);
});

function getNanoSecTime() {
    const hrTime = process.hrtime();
    return hrTime[0] * 1000000000 + hrTime[1];
}

export default authRouter;