import Fuse from 'fuse.js';
import { StatusFilter } from './action/RequestActions';

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
    filter: {
        text: '',
        options: [
            StatusFilter.SHOW_UNSELECTED,
            StatusFilter.SHOW_PROGRESS,
            StatusFilter.SHOW_PENDING,
            StatusFilter.SHOW_SELECTED
        ],
    },
    employees: [],
    requestStates: {
        keys: [],
        byKey: {}
    },
    filteredEmployees: [],
    selectedEmployees: [],
    fuzzyMatcher: new Fuse([]),
    loading: true,
    errorMessages: [],
};

export const InitialState = {
    login: InitialLoginState,
    requests: InitialRequestState
};