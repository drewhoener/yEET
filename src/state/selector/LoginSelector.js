import LoginAction from '../action/LoginActions';
import axios from 'axios';

export function setErrorText(text) {
    return {
        type: LoginAction.SET_ERROR_TEXT,
        field: 'loginErrorStr',
        value: text
    };
}

function receiveCompanies(companies) {
    return {
        type: LoginAction.RECEIVE_COMPANIES,
        field: 'companies',
        value: companies
    };
}

export function setSelectedCompany(company) {
    return {
        type: LoginAction.SET_SELECTED_COMPANY,
        field: 'selectedCompany',
        value: company
    };
}

export function setEmployeeId(id) {
    return {
        type: LoginAction.SET_USER_ID,
        field: 'employeeId',
        value: id,
    };
}

export function setPassword(password) {
    return {
        type: LoginAction.SET_PASSWORD,
        field: 'password',
        value: password
    };
}

export function setCheckingLogin(state) {
    return {
        type: LoginAction.SET_CHECKING_LOGIN,
        field: 'checkingLogin',
        value: state
    };
}

export function setLoadingLogin(value) {
    return {
        type: LoginAction.SET_LOGIN_LOADING,
        field: 'loading',
        value
    };
}

export function setNeedsRedirect(value) {
    return {
        type: LoginAction.SET_NEEDS_REDIRECT,
        field: 'needsRedirect',
        value
    };
}

export function fetchCompanies() {
    return (dispatch, getState) => {
        axios.get('/api/companies')
            .then(({ data }) => {
                const stateCompanies = getState().login.companies;
                const dataCompanies = data.companies.filter(val => !stateCompanies.some(o => o.companyId === val.companyId));
                console.log(dataCompanies);
                dispatch(receiveCompanies([...stateCompanies, ...dataCompanies]));
            })
            .catch(err => {
                console.error(err);
                const error = { companyId: '-1', companyName: 'Error Fetching Companies' };
                dispatch(receiveCompanies([error]));
                dispatch(setSelectedCompany(error));
            });
    };
}

export function beginFetchCompanies() {
    return dispatch => {
        dispatch(fetchCompanies());
    };
}

export function resetLoginState() {
    return {
        type: LoginAction.RESET_LOGIN_STATE
    };
}