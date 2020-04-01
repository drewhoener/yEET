import { LoginAction } from '../action/LoginActions';

function receiveEmployees(employees) {
    return {
        type: LoginAction.RECEIVE_EMPLOYEES,
        employees
    };
}

export function fetchEmployees() {
    return dispatch => {
        axios.get()
    }
}