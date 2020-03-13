import React from 'react';
import axios from 'axios';
import {Redirect, Route} from "react-router-dom";
import {Snackbar} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ProtectedModule({component, children, ...rest}) {
    const RenderComponent = component;
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [checkingLogin, setCheckingLogin] = React.useState(true);
    const [unauthorized, setUnauthorized] = React.useState(false);

    React.useEffect(() => {
        setCheckingLogin(true);
        console.log('Sending auth request...');
        axios.get('/api/auth/validate')
            .then(response => {
                console.log('Got Response');
                console.log(response);
                setLoggedIn(true);
                setUnauthorized(false);
                setCheckingLogin(false);
            })
            .catch(err => {
                console.log(`Caught Error`);
                setUnauthorized(true);
                setCheckingLogin(false);
            });
    }, []);

    const onCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setLoggedIn(false);
        setCheckingLogin(false);
        setUnauthorized(false);
    };

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
        return (
            <>
                {
                    !!component ? <RenderComponent/> : children
                }
                <Snackbar open={unauthorized} autoHideDuration={6000} onClose={onCloseAlert}>
                    <Alert onClose={onCloseAlert} severity="warning">
                        This is a success message!
                    </Alert>
                </Snackbar>
            </>
        );
    };

    return (
        <Route {...rest} render={renderAt}/>
    );
}