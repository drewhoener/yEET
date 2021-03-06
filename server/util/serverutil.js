import moment from 'moment';

export const truncateEmployee = ({ _id, employeeId, firstName, lastName, startDate, position }) => {
    return {
        _id,
        employeeId,
        firstName,
        lastName,
        startDate,
        position,
        fullName: `${ firstName } ${ lastName }`
    };
};

export const getExpireTime = (request) => {
    const requestTime = moment(request.timeRequested);
    // return requestTime.add(2, 'minutes');
    return requestTime.add(21, 'days').endOf('day');
};