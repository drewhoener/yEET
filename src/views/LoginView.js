import React from "react";
import {CssBaseline, TextField} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {isLoggedIn, logInUser} from "../scripts/fakeauth";
import {Redirect, useHistory, useLocation} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '75vh'
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: 8,
        [theme.breakpoints.up('sm')]: {
            padding: 16
        }
    },
    loginButton: {
        marginTop: 8
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    errorText: {
        width: '100%',
        textAlign: 'center'
    }
}));

export default function LoginView(props) {
    const classes = useStyles();
    let history = useHistory();
    let location = useLocation();
    const [error, setError] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    let {from} = location.state || {from: {pathname: "/"}};

    const onChange = (f, event) => {
        f(event.target.value);
    };

    const onSubmitForm = (event) => {
        event.preventDefault();
        setError(false);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (!logInUser(username, password)) {
                setError(true);
                return;
            }
            history.replace(from);
        }, 5000);
    };

    const form = (
        <div className={classes.root}>
            <CssBaseline/>
            <Container height='100%'>
                <Paper variant='outlined' elevation={16}>
                    <Typography color='secondary' fontWeight='fontWeightBold' align='center'
                                variant='h1'>yEET</Typography>
                    <Typography align='center' variant='subtitle1'>Your Employee Evaluation Tool</Typography>
                    <form className={classes.form} onSubmit={onSubmitForm} aria-label='Login Form'>
                        <TextField
                            id="login-username"
                            label="Username"
                            placeholder="UserID"
                            fullWidth
                            margin='normal'
                            variant='outlined'
                            InputLabelProps={{shrink: true}}
                            value={username}
                            disabled={loading}
                            onChange={event => onChange(setUsername, event)}
                        />
                        <TextField
                            id="login-password"
                            label="Password"
                            placeholder="Password"
                            type='password'
                            fullWidth
                            margin='normal'
                            variant='outlined'
                            InputLabelProps={{shrink: true}}
                            value={password}
                            disabled={loading}
                            onChange={event => onChange(setPassword, event)}
                        />
                        <Button
                            className={classes.loginButton}
                            variant='contained'
                            color='secondary'
                            size='large'
                            type='submit'
                            aria-label="Login"
                            disableElevation
                            disableFocusRipple
                            fullWidth
                            disabled={loading}
                        >
                            Login
                        </Button>
                        <Typography className={classes.errorText} variant='subtitle1' color='error' hidden={!error}>Invalid
                            Username or Password</Typography>
                    </form>
                </Paper>
            </Container>
        </div>
    );

    return isLoggedIn() ? (
        <Redirect
            to={{
                pathname: from.pathname,
                state: from
            }}
        />
    ) : (
        form
    );
}