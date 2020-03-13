import React from 'react';
import axios from 'axios';
import {Redirect, Route} from "react-router-dom";

export default function ProtectedModule({component, children, ...rest}) {
    const RenderComponent = component;
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [checkingLogin, setCheckingLogin] = React.useState(true);

    React.useEffect(() => {
        setCheckingLogin(true);
        console.log('Sending auth request...');
        axios.get('/api/auth/validate')
            .then(response => {
                console.log('Got Response');
                console.log(response);
                setLoggedIn(true);
                setCheckingLogin(false);
            })
            .catch(err => {
                console.log(`Caught Error`);
                setLoggedIn(false);
                setCheckingLogin(false);
            });
    }, []);

    const renderAt = ({location}) => {
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
                        state: {from: location}
                    }}
                />
            );
        }
        console.log(`Showing Actual Render`);
        return !!component ? (<RenderComponent/>) : (children);
    };

    return (
        <Route {...rest} render={renderAt}/>
    );
}