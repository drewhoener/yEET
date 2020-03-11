import mongoAuth from '../exempt/mongo_auth';
import {close as disconnectDB, connect as connectDB} from '../server/database/database';
import employee_data from '../data/Scranton_Select_Security-employees'
import Employee from "../server/database/schema/employeeschema";
import Company from "../server/database/schema/companyschema";
import moment from "moment";

const finished_users = {};
const objects = shuffle(employee_data);

connectDB(mongoAuth.username, mongoAuth.password, mongoAuth.database, mongoAuth.authDatabase)
    .then(async () => {
        console.log(`Database Connected`);
        const company = await populateCompany();
        console.log(company);
        console.log(`Shuffled contains ${objects.length} items`);
        //Employee.collection.drop();
        for (let obj of objects) {
            await createAndSaveEmployee(obj, company);
        }
        console.log(`Closing Connection`);
        disconnectDB();
    });

async function createAndSaveEmployee(obj, company) {
    if (finished_users.hasOwnProperty(`id_${obj.employeeId}`))
        return;
    const employee = constructEmployee(obj, company);
    if (employee == null) {
        throw new Error("Constructed employee was null");
    }
    if (obj.hasOwnProperty('managerId')) {
        let manager = finished_users[`id_${obj.managerId}`];
        if (manager === undefined) {
            console.log(`Manager for user ${obj.employeeId} doesn't exist, creating`);
            const managerObj = objects.find(i => i.employeeId === obj.managerId);
            manager = await createAndSaveEmployee(managerObj, company);
            console.log(`Saved new manager`);
        } else console.log(`\t\tReusing Manager`);
        const managerID = manager._id;
        employee.manager = manager._id;
    }
    await employee.save();
    finished_users[`id_${obj.employeeId}`] = employee;
    return employee;
}

function constructEmployee(data, company) {
    if (data == null)
        return null;
    return new Employee({
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        startDate: moment(data.startDate, "YYYY-MM-DD").toDate(),
        passwordHash: data.password,
        position: data.positionTitle,
        company: company._id
    });
}

async function populateCompany() {
    let {companyId, companyName} = employee_data[0];
    await Company.deleteOne({companyId: {'$eq': companyId}});
    const company = new Company({companyId, name: companyName});
    await company.save();
    return company;
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

