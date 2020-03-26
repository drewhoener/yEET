import mongoAuth from '../exempt/mongo_auth';
import {close as disconnectDB, connect as connectDB} from '../server/database/database';
import Employee from "../server/database/schema/employeeschema";
import {ObjectId} from 'mongodb';
import {validateToken} from "../server/middleware/authtoken";

const employeeId = 1;
const companyId = '5e6861e8ce31237958ae6f44';

connectDB(mongoAuth.username, mongoAuth.password, mongoAuth.database, mongoAuth.authDatabase)
    .then(async () => {
        console.log(`Database Connected`);
        await Employee.findOne({employeeId: employeeId, company: ObjectId(companyId)}).exec()
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.error(err);
            });
        console.log(`Closing Connection`);
        disconnectDB();
    })
    .catch(err => {
        console.error(err);
    });

const token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNjg2MWU5Y2UzMTIzNzk1OGFlNmY0OCIsImVtcGxveWVlSWQiOjEsImNvbXBhbnkiOiI1ZTY4NjFlOGNlMzEyMzc5NThhZTZmNDQiLCJpYXQiOjE1ODM5OTQwNjUsImV4cCI6MTU4Mzk5NzY2NX0.AULKrSnFfdX007VXBnVhJiISXxcnRA4pcb2wUW8aqRMPf-45PL-b529zQp7u2Is009xL8IYfLRoR-7VrohSaTuvpAZViMepCNWRyXgLib1N-H7ZUWBs6vHNx2EW0mGL8oS-3MqAPdAl2gDVrKQsOJmtcFPI5gecQKwgXSKsgodlZqz28';
validateToken(token)
    .then(decoded => {
        console.log(decoded);
        console.log(`Token is valid: ${!!decoded}`);
    })
    .catch(console.error);
