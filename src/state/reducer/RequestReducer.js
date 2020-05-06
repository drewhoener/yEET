import Fuse from 'fuse.js';
import { createReducer } from '../../util';
import { FilterAction, RequestAction, StatusFilter } from '../action/RequestActions';
import { InitialRequestState } from '../defaultstate';

const employeeSearchOptions = {
    includeScore: true,
    threshold: 0.3,
    location: 0,
    distance: 95,
    minMatchCharLength: 1,
    keys: [
        {
            name: 'fullName',
            weight: 0.5
        },
        {
            name: 'lastName',
            weight: 0.3
        },
        {
            name: 'firstName',
            weight: 0.3
        },
        {
            name: 'position',
            weight: 0.2
        },
        {
            name: 'employeeId',
            weight: 0.8
        },
    ]
};

const filterReducer = createReducer(InitialRequestState.filter, {
    [FilterAction.UPDATE_SEARCH_FILTER]: (state, action) => {
        if (action.payload.filter == null) {
            return state;
        }
        return {
            ...state,
            text: action.payload.filter
        };
    },
    [FilterAction.CLEAR_SEARCH_FILTER]: (state) => {
        return {
            ...state,
            text: ''
        };
    },
    [FilterAction.TOGGLE_STATUS_FILTER]: (state, action) => {
        if (action.payload.type == null) {
            return state;
        }

        const newOptions = state.options.filter(item => item !== action.payload.type);
        if (action.payload.toggleState) {
            newOptions.push(action.payload.type);
        }

        return {
            text: state.text,
            options: newOptions
        };
    }
});

const employeesReducer = createReducer([...InitialRequestState.employees], {
    [RequestAction.SET_EMPLOYEES]: (state, action) => {
        return action.employees.sort((o1, o2) => o1.lastName.localeCompare(o2.lastName));
    }
});

const requestStateReducer = createReducer({ ...InitialRequestState.requestStates }, {
    [RequestAction.UPDATE_REQUEST_STATES]: (state, action) => {
        if (!action.payload || !action.payload.requestStates) {
            return state;
        }
        const { requestStates } = action.payload;
        const newState = {
            keys: [],
            byKey: {}
        };
        requestStates.filter(o => !!o && !!o.userObjId && !!o.statusName)
            .forEach(state => {
                newState.keys.push(state.userObjId);
                newState.byKey[state.userObjId] = {
                    status: state.status,
                    statusName: state.statusName,
                };
            });
        return newState;
    },
    [RequestAction.REMOVE_REQUEST_STATE]: (state, action) => {
        const { employee } = action.payload;
        if (!employee) {
            return { ...state };
        }
        const entries = { ...state.byKey };
        delete entries[employee];
        return {
            keys: state.keys.filter(o => o.toString() !== employee.toString()),
            byKey: entries
        };
    },
});

const filteredEmployeesReducer = createReducer([...InitialRequestState.filteredEmployees], {
    [FilterAction.UPDATE_SEARCH_FILTER]: (state, action) => {
        if (!action.payload) {
            return state;
        }
        const { filter, employees, searcher } = action.payload;

        if (!filter || !filter.length) {
            return employees.map((val, idx) => idx);
        }

        if (!employees || !searcher) {
            return state;
        }

        const results = searcher.search(filter);
        return results.sort((o1, o2) => {
            const compareScore = o1.score - o2.score;
            if (compareScore !== 0) {
                return compareScore;
            }
            return o1.item.lastName.localeCompare(o2.item.lastName);
        }).map(item => item.refIndex);
    },
    [RequestAction.UPDATE_SHOWN_ENTRIES]: (state, action) => {
        if (!action.payload) {
            return state;
        }

        const { selected, employees, options } = action.payload;
        if (!options || !options.length) {
            return [];
        }

        const alreadyFiltered = [...state];
        // console.log('Already Filtered users');
        // console.log(alreadyFiltered);

        let alreadyFilteredMapped = alreadyFiltered.map(idx => ({
            employee: employees[idx],
            idx
        })).filter(o => o.employee !== undefined);
        // console.log('Mapped');
        // console.log(alreadyFilteredMapped);

        const unselected = alreadyFilteredMapped.filter(employee => {
            const existsInSelected = selected.some(selectedEmployee => selectedEmployee === employee.employee._id);
            return !existsInSelected;
        });
        // console.log('Unselected Employees');
        // console.log(unselected);

        const selectedMappedUsers = selected.map(selectedUser => {
            const idx = employees.findIndex(employee => employee._id === selectedUser);
            return {
                employee: employees[idx],
                idx
            };
        }).filter(obj => alreadyFiltered.includes(obj.idx));

        // console.log('Selected Users Mapped:');
        // console.log(selectedMappedUsers);

        // Don't show selected users
        if (!options.includes(StatusFilter.SHOW_SELECTED)) {
            alreadyFilteredMapped = alreadyFilteredMapped.filter(employee => {
                const isSelected = selectedMappedUsers.some(selectedUser => selectedUser.idx === employee.idx);
                return !isSelected;
            });
        }

        // console.log('Without Selected');
        // console.log(alreadyFilteredMapped);

        return alreadyFilteredMapped.map(o => o.idx);
    }
});

const selectedEmployeesReducer = createReducer([...InitialRequestState.selectedEmployees], {
    [RequestAction.TOGGLE_EMPLOYEE_SELECT]: (state, action) => {
        if (!Object.prototype.hasOwnProperty.call(action.payload, 'user')) {
            return state;
        }
        const selectedEmployees = [
            ...state
        ];
        const index = selectedEmployees.indexOf(action.payload.user);
        if (index === -1) {
            selectedEmployees.push(action.payload.user);
        } else {
            selectedEmployees.splice(index, 1);
        }

        return selectedEmployees;
    },
    [RequestAction.UNSELECT_EMPLOYEES]: (state, action) => {
        const { employees } = action.payload;
        if (!employees || !employees.length) {
            return state;
        }
        return state.filter(o => !employees.some(employeeId => o.toString() === employeeId.toString()));
    },
});

const matcherReducer = createReducer(InitialRequestState.fuzzyMatcher, {
    [RequestAction.SET_EMPLOYEES]: (state, action) => {
        return new Fuse(action.employees, employeeSearchOptions);
    }
});

const loadingReducer = createReducer(InitialRequestState.loading, {
    [RequestAction.SET_REQUESTS_LOADING]: (state, action) => {
        return action.loading;
    }
});

const errorMessageReducer = createReducer([...InitialRequestState.errorMessages], {
    [RequestAction.PUSH_ERROR_MESSAGE]: (messages, action) => {
        if (!action.severity || !action.content || !action.content.length) {
            return [
                ...messages
            ];
        }

        return [
            ...messages,
            {
                key: messages[messages.length] ? messages[messages.length].key + 1 : 0,
                severity: action.severity,
                content: action.content,
                open: true,
            }
        ];
    },
    [RequestAction.POP_ERROR_MESSAGE]: (messages) => {
        if (!messages.length) {
            return [];
        }
        return [
            ...messages.slice(1)
        ];
    },
    [RequestAction.CLOSE_TOP_ERROR_MESSAGE]: (messages) => {
        if (!messages.length) {
            return [];
        }
        return [
            {
                key: messages[0].key,
                severity: messages[0].severity,
                content: messages[0].content,
                open: false
            },
            ...messages.slice(1)
        ];
    }
});

export default function requestReducer(state = InitialRequestState, action) {

    if (action.type === RequestAction.RESET_STATE) {
        return {
            ...InitialRequestState
        };
    }

    return {
        filter: filterReducer(state.filter, action),
        employees: employeesReducer(state.employees, action),
        requestStates: requestStateReducer(state.requestStates, action),
        filteredEmployees: filteredEmployeesReducer(state.filteredEmployees, action),
        selectedEmployees: selectedEmployeesReducer(state.selectedEmployees, action),
        fuzzyMatcher: matcherReducer(state.fuzzyMatcher, action),
        loading: loadingReducer(state.loading, action),
        errorMessages: errorMessageReducer(state.errorMessages, action)
    };
}