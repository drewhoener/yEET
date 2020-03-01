import React from 'react';
import './App.css';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import MainView from "./views/MainView";
import LoginView from "./views/LoginView";


const styles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    }

}));

const theme = createMuiTheme({
    palette: {
        primary: purple,
        secondary: green,
    },
    status: {
        danger: 'orange',
    },
    background: {
        default: "#282c34"
    }
});

function App() {
    const classes = styles();
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    <Switch>
                        <Route path="/login">
                            <LoginView/>
                        </Route>
                        <Route>
                            <MainView classes={classes}/>
                        </Route>
                    </Switch>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
