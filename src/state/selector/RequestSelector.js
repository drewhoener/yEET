import axios from 'axios';
import { batch } from 'react-redux';
import { FilterAction, RequestAction } from '../action/RequestActions';

export function resetRequestState() {
    return {
        type: RequestAction.RESET_STATE
    };
}

export function toggleStatusFilterOption(option, state) {
    return (dispatch, getState) => {
        batch(() => {
            dispatch({
                type: FilterAction.TOGGLE_STATUS_FILTER,
                payload: {
                    toggleState: state,
                    type: option,
                    curOptions: getState().requests.filter.options
                }
            });
            dispatch(updateShownEntries());
        });
    };
}

export function setAndRefreshFilter(filter) {
    return (dispatch, getState) => {
        const state = getState();
        dispatch(setSearchFilter(filter, state.requests.employees, state.requests.fuzzyMatcher));
    };
}

function setSearchFilter(filter, employees, searcher) {
    return {
        type: FilterAction.UPDATE_SEARCH_FILTER,
        payload: {
            filter,
            employees,
            searcher
        },
    };
}

export function updateShownEntries() {
    return (dispatch, getState) => {
        const state = getState();
        dispatch({
            type: RequestAction.UPDATE_SHOWN_ENTRIES,
            payload: {
                employees: state.requests.employees,
                selected: state.requests.selectedEmployees,
                options: state.requests.filter.options
            }
        });
    };
}

export function unselectEmployees(employees) {
    return {
        type: RequestAction.UNSELECT_EMPLOYEES,
        payload: {
            employees
        }
    };
}

export function toggleEmployeeSelect(userObjectId) {
    return {
        type: RequestAction.TOGGLE_EMPLOYEE_SELECT,
        payload: {
            user: userObjectId
        }
    };
}

function setRequestsLoading(loading) {
    return {
        type: RequestAction.SET_REQUESTS_LOADING,
        loading
    };
}

function setEmployees(employees) {
    return {
        type: RequestAction.SET_EMPLOYEES,
        employees: employees
    };
}

export function closeTopErrorMessage() {
    return {
        type: RequestAction.CLOSE_TOP_ERROR_MESSAGE,
    };
}

export function popErrorMessage() {
    return {
        type: RequestAction.POP_ERROR_MESSAGE,
    };
}

export function pushErrorMessage(severity, message) {
    return {
        type: RequestAction.PUSH_ERROR_MESSAGE,
        severity,
        content: message
    };

}

function removeRequestState(employeeObjId) {
    return {
        type: RequestAction.REMOVE_REQUEST_STATE,
        payload: {
            employee: employeeObjId
        }
    };
}

export function deleteRequest(employeeObjId) {
    return dispatch => {
        axios.post('/api/request/cancel', { requestedEmployee: employeeObjId.toString() })
            .then(response => {
                batch(() => {
                    dispatch(pushErrorMessage('success', response.data.message));
                    dispatch(removeRequestState(employeeObjId));
                });

            })
            .catch(err => {
                console.error(err);
                if (err.response) {
                    const { data } = err.response;
                    if (data && data.message) {
                        dispatch(pushErrorMessage('warning', data.message));
                    }
                }
                dispatch(fetchRequestStates());
            });
    };
}

function updateRequestStates(requestStates) {
    return {
        type: RequestAction.UPDATE_REQUEST_STATES,
        payload: {
            requestStates
        }
    };
}

function fetchRequestStates() {
    return dispatch => {
        axios.get('/api/request/request-states')
            .then(({ data }) => {
                dispatch(updateRequestStates(data.requestStates));
            })
            .catch(err => {
                console.error(err);
            });
    };
}

function receiveEmployees(employees) {
    return (dispatch, getState) => {
        const filter = getState().requests.filter.text;
        setTimeout(() => {
            batch(() => {
                dispatch(setEmployees(employees));
                dispatch(setAndRefreshFilter(filter));
                dispatch(setRequestsLoading(false));
            });
        }, 650);
    };
}

function fetchEmployees() {
    return dispatch => {
        axios.get('/api/employees')
            .then(({ data }) => {
                if (!data || !data.employees) {
                    data.employees = [];
                }
                dispatch(receiveEmployees(data.employees));
            })
            .catch(err => {
                console.error(err);
            });
    };
}

function updateEmployees() {
    return (dispatch, getState) => {
        axios.get('/api/employees')
            .then(({ data }) => {
                const { employees } = getState().requests;
                if (!data || !data.employees) {
                    data.employees = [];
                }
                const newEmployees = data.employees.filter(employee => {
                    return !employees.some(o => o._id === employee._id);
                });
                if (!newEmployees || !newEmployees.length) {
                    console.log('No new employees to log');
                    return;
                }
                dispatch(receiveEmployees([
                    ...employees,
                    ...newEmployees
                ]));
            })
            .catch(err => {
                console.error(err);
            });
    };
}

export function fetchOrUpdateEmployees() {
    return (dispatch, getState) => {
        const { employees } = getState().requests;
        if (!employees || !employees.length) {
            batch(() => {
                dispatch(fetchEmployees());
                dispatch(fetchRequestStates());
            });
            return;
        }
        batch(() => {
            dispatch(updateEmployees());
            dispatch(fetchRequestStates());
        });
    };
}

export function sendRequests(requestIds) {
    return (dispatch) => {
        axios.post('/api/request/request-users', {
            users: requestIds
        })
            .then(response => {
                console.log(response.data);
                batch(() => {
                    dispatch(unselectEmployees(requestIds));
                    dispatch(fetchRequestStates());
                    if (response && response.data.message) {
                        dispatch(pushErrorMessage('success', response.data.message));
                    }
                });
            })
            .catch(err => {
                console.log(err.response);
                if (err.response) {
                    dispatch(pushErrorMessage('error', err.response.data.message));
                }
            });
    };
}

export function sendSelectedRequests() {
    return (dispatch, getState) => {
        dispatch(sendRequests(getState().requests.selectedEmployees));
    };
}