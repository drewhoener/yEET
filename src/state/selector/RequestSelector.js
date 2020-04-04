import { FilterAction, RequestAction } from '../action/RequestActions';
import axios from 'axios';

export function setAndRefreshFilter(filter) {
    return (dispatch, getState) => {
        dispatch(setSearchFilter(filter));
        const { filter: newFilter, employees, fuzzyMatcher } = getState().requests;
        dispatch(filterEmployees(newFilter, fuzzyMatcher, employees));
    };
}

function setSearchFilter(filter) {
    return {
        type: FilterAction.SET_FILTER,
        field: 'filter',
        value: filter,
    };
}

function filterEmployees(filter, searcher, employees) {
    const action = {
        type: RequestAction.SET_FILTERED_EMPLOYEES,
        field: 'filteredEmployees',
    };

    if (!filter || !filter.length) {
        action.value = employees.map((val, idx) => idx);
        return action;
    }

    const results = searcher.search(filter);
    action.value = results.sort((o1, o2) => {
        const compareScore = o1.score - o2.score;
        if (compareScore !== 0) {
            return compareScore;
        }
        return o1.item.lastName.localeCompare(o2.item.lastName);
    }).map(item => item.refIndex);

    return action;
}

export function setSelectedEmployees(selectedEmployees) {
    return {
        type: RequestAction.SET_SELECTED_EMPLOYEES,
        field: 'selectedEmployees',
        value: selectedEmployees
    };
}

export function selectEmployee(idx) {
    return (dispatch, getState) => {
        const selectedEmployees = [
            ...getState().requests.selectedEmployees
        ];
        const index = selectedEmployees.indexOf(idx);
        if (index === -1) {
            selectedEmployees.push(idx);
        } else {
            selectedEmployees.splice(index, 1);
        }

        dispatch(setSelectedEmployees(selectedEmployees));
    };
}

function setRequestsLoading(loading) {
    return {
        type: RequestAction.SET_REQUESTS_LOADING,
        field: 'loading',
        value: loading
    };
}

function setEmployees(employees) {
    return {
        type: RequestAction.SET_EMPLOYEES,
        employees: employees
    };
}

function receiveEmployees(employees) {
    return (dispatch, getState) => {
        setTimeout(() => {
            dispatch(setEmployees(employees.sort((o1, o2) => o1.lastName.localeCompare(o2.lastName))));
            dispatch(setAndRefreshFilter(getState().requests.filter));
            dispatch(setRequestsLoading(false));
        }, 750);
    };
}

function fetchEmployees() {
    console.log('Fresh Fetching Employees');
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
        console.log(`Employees: ${ !!employees }, Employees Length: ${ !!employees.length }`);
        if (!employees || !employees.length) {
            dispatch(fetchEmployees());
            return;
        }
        dispatch(updateEmployees());
    };
}