import { FilterAction } from '../action/RequestActions';

export function setSearchFilter(filter) {
    return { type: FilterAction.SET_FILTER, filter };
}