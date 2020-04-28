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