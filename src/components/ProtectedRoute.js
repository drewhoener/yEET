import React, {useCallback} from 'react';
import axios from 'axios';
import {Redirect, Route} from "react-router-dom";

export default function ProtectedRoute({children, ...rest}) {
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [checkingLogin, setCheckingLogin] = React.useState(true);


    const checkLogin = useCallback(() => {
        axios.get('/api/auth/validate')
            .then(response => {
                console.log('Got Response');
                console.log(response);
                setLoggedIn(true);
                setCheckingLogin(false);
            })
            .catch(err => {
                console.log(`Caught Error`);
                console.log(err);
                console.log(err.response);
                setLoggedIn(false);
                setCheckingLogin(false);
            });
    }, []);

    React.useEffect(() => {
        console.log(`Mounted Main View`);
        setCheckingLogin(true);
        console.log('Sending auth request...');
        checkLogin();
    }, [checkLogin]);

    const renderAt = () => {
        checkLogin();
        if (checkingLogin) {
            console.log('Checking Login');
            return null;
        }
        if (!loggedIn) {
            console.log(`Reached Login Redirect`);
            return (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {from: rest.location}
                    }}
                />
            );
        }
        console.log(`Showing Actual Render`);
        return (
            <Route {...rest}>
                {children}
            </Route>
        );
    };

    return renderAt();
}