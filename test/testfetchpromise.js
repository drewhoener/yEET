import mongoAuth from '../exempt/mongo_auth';
import {close as disconnectDB, connect as connectDB} from '../server/database/database';
import Employee from "../server/database/schema/employeeschema";
import {ObjectId} from 'mongodb';

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