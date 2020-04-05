export const FilterAction = {
    UPDATE_FILTER: 'requests/filter/update',
    CLEAR_FILTER: 'requests/filter/clear'
};

export const RequestAction = {
    RESET_STATE: 'requests/reset',
    SET_REQUESTS_LOADING: 'requests/setLoading',
    SET_EMPLOYEES: 'requests/setEmployees',
    TOGGLE_EMPLOYEE_SELECT: 'requests/selectedEmployees/toggle',
    UNSELECT_EMPLOYEES: 'requests/selectedEmployees/unselectMultiple',
    PUSH_ERROR_MESSAGE: 'requests/errors/push',
    POP_ERROR_MESSAGE: 'requests/errors/pop',
    CLOSE_TOP_ERROR_MESSAGE: 'requests/errors/closeTop',
    UPDATE_REQUEST_STATES: 'requests/pendingStates/update',
    REMOVE_REQUEST_STATE: 'requests/pendingStates/remove'
};