import React from 'react';
import logo from './logo.svg';
import './App.css';
import ResponsiveNav from "./components/ResponsiveNav";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {BrowserRouter} from "react-router-dom";
import DummyView from "./views/DummyView";


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
                    <ResponsiveNav/>
                    <main className={classes.content}>
                        <div className={classes.toolbar}/>
                        <DummyView/>
                    </main>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}

// eslint-disable-next-line no-unused-vars
function Appp() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload. <br/>
                    Hi my name is drew and im lame
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
