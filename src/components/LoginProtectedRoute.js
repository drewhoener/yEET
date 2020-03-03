import React from 'react';
import {Redirect, Route} from "react-router-dom";
import {isLoggedIn} from "../scripts/fakeauth";

export default function LoginProtectedRoute({children, ...rest}) {
    const [loggedIn, setLoggedIn] = React.useState(isLoggedIn());
    React.useEffect(() => {
        setTimeout(() => {
            setLoggedIn(isLoggedIn());
        }, 2);
    }, []);
    return (
        <Route
            {...rest}
            render={({location}) => loggedIn ? (
                children
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {from: location}
                    }}
                />
            )
            }
        />
    );
}