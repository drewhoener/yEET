const loginData = require('../data/logindata');

const isLoggedIn = () => {
    const userStr = localStorage.getItem("loggedIn");
    if (userStr === null)
        return false;
    const user = JSON.parse(userStr);
    if (user.expire <= Date.now()) {
        console.log("Expiring user...");
        localStorage.removeItem("loggedIn");
        return false;
    }
    return true;
};

const logInUser = (user, pass) => {
    if (!loginData.login.find((val) => val.user === user && val.pass === pass))
        return false;
    localStorage.setItem("loggedIn", JSON.stringify({expire: Date.now() + (1000 * 60 * 5)}));
    return true;
};

const logoutUser = () => {
    localStorage.removeItem("loggedIn");
};

export {isLoggedIn, logInUser, logoutUser};