import React from 'react';
import './App.css';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import MainView from "./views/MainView";
import LoginView from "./views/LoginView";

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
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <Switch>
                    <Route path="/login">
                        <LoginView/>
                    </Route>
                    <Route>
                        <MainView/>
                    </Route>
                </Switch>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
