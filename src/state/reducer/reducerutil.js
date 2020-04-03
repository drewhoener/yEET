export const modNormalField = (state, fieldName, value) => {
    if (!Object.prototype.hasOwnProperty.call(state, fieldName)) {
        return state;
    }

    return {
        ...state,
        [fieldName]: value
    };
};