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
    loading: true,
    errorMessages: [],
};

export const InitialState = {
    login: InitialLoginState,
    requests: InitialRequestState
};