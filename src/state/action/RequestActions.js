export const FilterAction = {
    UPDATE_SEARCH_FILTER: 'requests/filter/string/update',
    CLEAR_SEARCH_FILTER: 'requests/filter/string/clear',
    TOGGLE_STATUS_FILTER: 'requests/filter/status/toggle',
};

export const RequestAction = {
    RESET_STATE: 'requests/reset',
    SET_REQUESTS_LOADING: 'requests/setLoading',
    SET_EMPLOYEES: 'requests/setEmployees',
    TOGGLE_EMPLOYEE_SELECT: 'requests/selectedEmployees/toggle',
    UNSELECT_EMPLOYEES: 'requests/selectedEmployees/unselectMultiple',
    UPDATE_SHOWN_ENTRIES: 'requests/filteredEmployees/update',
    PUSH_ERROR_MESSAGE: 'requests/errors/push',
    POP_ERROR_MESSAGE: 'requests/errors/pop',
    CLOSE_TOP_ERROR_MESSAGE: 'requests/errors/closeTop',
    UPDATE_REQUEST_STATES: 'requests/pendingStates/update',
    REMOVE_REQUEST_STATE: 'requests/pendingStates/remove'
};

export const StatusFilter = {
    SHOW_SELECTED: 'ONLY_SELECTED',
    SHOW_PENDING: 'SHOW_PENDING',
    SHOW_PROGRESS: 'SHOW_ACCEPTED',
    SHOW_UNSELECTED: 'SHOW_UNSELECTED'
};

export const PendingState = {
    PENDING: 0,
    ACCEPTED: 1,
    REJECTED: 2,
    COMPLETED: 3,
    0: 'Pending',
    1: 'Accepted',
    2: 'Rejected',
    3: 'Completed',
};