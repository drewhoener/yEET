import { createMuiTheme } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';

export const isMobile = /iphone|ipod|ipad|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase());

export const colorButtonTheme = createMuiTheme({
    palette: {
        primary: {
            main: green[600]
        },
        secondary: {
            main: red[600]
        },
    },
});

export function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    };
}