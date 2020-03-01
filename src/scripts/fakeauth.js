const cache = {};

const isLoggedIn = (username) => {
    if (!cache.hasOwnProperty(username))
        return false;
    const user = cache[username];
    if (user.expireTime <= Date.now()) {
        delete cache[username];
        return false;
    }
    return true;
};

const logInUser = (username) => {
    cache[username] = {
        expireTime: Date.now() + (1000 * 60 * 5)
    };
};

export {isLoggedIn, logInUser};