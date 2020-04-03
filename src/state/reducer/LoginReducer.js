import { InitialLoginState } from '../redux-store';
import LoginAction from '../action/LoginActions';
import { modNormalField } from './reducerutil';

export default function loginReducer(state = InitialLoginState, action) {
    switch (action.type) {
        case LoginAction.SET_ERROR_TEXT:
        case LoginAction.RECEIVE_COMPANIES:
        case LoginAction.SET_SELECTED_COMPANY:
        case LoginAction.SET_USER_ID:
        case LoginAction.SET_PASSWORD:
        case LoginAction.SET_CHECKING_LOGIN:
        case LoginAction.SET_LOGIN_LOADING:
        case LoginAction.SET_NEEDS_REDIRECT:
            return modNormalField(state, action.field, action.value);
        case LoginAction.RESET_LOGIN_STATE:
            return {
                ...InitialLoginState
            };
        default:
            return {
                ...state
            };
    }
}