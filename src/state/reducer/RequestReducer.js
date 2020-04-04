import { InitialRequestState } from '../redux-store';
import { FilterAction, RequestAction } from '../action/RequestActions';
import { modNormalField } from './reducerutil';
import Fuse from 'fuse.js';

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

export default function requestReducer(state = InitialRequestState, action) {
    switch (action.type) {
        case FilterAction.CLEAR_FILTER:
            return modNormalField(state, 'filter', '');
        case FilterAction.SET_FILTER:
        case RequestAction.SET_FILTERED_EMPLOYEES:
        case RequestAction.SET_SELECTED_EMPLOYEES:
        case RequestAction.SET_REQUESTS_LOADING:
            return modNormalField(state, action.field, action.value);
        case RequestAction.SET_EMPLOYEES:
            return {
                ...state,
                employees: action.employees,
                fuzzyMatcher: new Fuse(action.employees, employeeSearchOptions),
            };
        default:
            return {
                ...state
            };

    }
}
