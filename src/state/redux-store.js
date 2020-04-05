import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import loginReducer from './reducer/LoginReducer';
import requestReducer from './reducer/RequestReducer';
import { InitialState } from './defaultstate';

// Needed for dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(combineReducers({
    login: loginReducer,
    requests: requestReducer
}), InitialState, composeEnhancers(
    applyMiddleware(thunk)
));

