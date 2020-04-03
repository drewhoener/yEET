import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import loginReducer from './reducer/LoginReducer';
import requestReducer from './reducer/RequestReducer';
import Fuse from 'fuse.js';

export const InitialLoginState = {
    needsRedirect: false,
    checkingLogin: true,
    loading: false,
    loginErrorStr: '',
    selectedCompany: { companyId: '-1', companyName: '---' },
    companies: [{ companyId: '-1', companyName: '---' }],
    employeeId: '',
    password: '',
};

export const InitialRequestState = {
    filter: '',
    employees: [],
    filteredEmployees: [],
    selectedEmployees: [],
    fuzzyMatcher: new Fuse([]),
    loading: true
};

export const InitialState = {
    login: InitialLoginState,
    requests: InitialRequestState
};

// Needed for dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(combineReducers({
    login: loginReducer,
    requests: requestReducer
}), InitialState, composeEnhancers(
    applyMiddleware(thunk)
));

