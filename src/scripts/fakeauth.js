
const isLoggedIn = () => {
    const user = localStorage.getItem("loggedIn");
    if (user === null)
        return false;
    if (user.expire <= Date.now()) {
        console.log("Expiring user...");
        localStorage.removeItem("loggedIn");
        return false;
    }
    return true;
};

const logInUser = () => {
    localStorage.setItem("loggedIn", JSON.stringify({expire: Date.now() + (1000 * 60 * 5)}));
};

const logoutUser = () => {
    localStorage.removeItem("loggedIn");
};

export {isLoggedIn, logInUser, logoutUser};