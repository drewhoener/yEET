import { InitialLoginState } from '../redux-store';
import { LoginAction } from '../action/LoginActions';

const modNormalField = (state, fieldName, value) => {
    if (!Object.prototype.hasOwnProperty.call(state, fieldName)) {
        return state;
    }

    return {
        ...state,
        [fieldName]: value
    };
};

export default function loginReducer(state = InitialLoginState, action) {
    switch (action.type) {
        case LoginAction.SET_COMPANY:
        case LoginAction.SET_PASSWORD:
        case LoginAction.SET_USER_ID:
            return modNormalField(state, action.field, action.value);
        default:
            return state;
    }
}