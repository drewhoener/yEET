import { LoginAction } from '../action/LoginActions';
import axios from 'axios';

export function setEmployeeId(id) {
    return {
        type: LoginAction.SET_USER_ID,
        field: 'employeeId',
        value: id,
    }
}

export function setPassword(password) {
    return {
        type: LoginAction.SET_PASSWORD,
        field: 'password',
        value: password
    }
}

export function fetchCompanies() {
    return dispatch => {
        axios.get('/api/companies')
            .then(({ data }) => {
                dispatch(receiveCompanies([...data.companies]));
            })
            .catch(err => {
                const error = { companyId: '-1', companyName: 'Error Fetching Companies' };
                dispatch(receiveCompanies([error]));
                dispatch(setSelectedCompany(error));
            });
    }
}

export function beginFetchCompanies() {
    return dispatch => {
        dispatch(fetchCompanies());
    }
}

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