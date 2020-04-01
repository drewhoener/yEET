import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import loginReducer from './reducer/LoginReducer';

export const InitialLoginState = {
    needsRedirect: false,
    checkingLogin: false,
    loginErrorStr: '',
    selectedCompany: { companyId: '-1', companyName: '---' },
    companies: [{ companyId: '-1', companyName: '---' }],
    employeeId: -1,
    password: '',
};

export const InitialRequestState = {
    filter: '',
    employees: [],
    filteredEmployees: [],
    selectedEmployees: [],
    loading: true
};

export const InitialState = {
    login: InitialLoginState,
    requests: InitialRequestState
};

export const store = createStore(combineReducers({
    login: loginReducer
}), InitialState, applyMiddleware(thunk));

