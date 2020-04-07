import React from 'react';
import './App.css';
import 'react-virtualized/styles.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainView from './views/MainView';
import LoginView from './views/LoginView';
import ProtectedRoute from './components/ProtectedRoute';
import { green, grey } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        primary: green,
        secondary: green,
    },
    status: {
        danger: 'orange',
        logout: grey[200]
    },
    background: {
        default: '#282c34'
    }
});

function App() {

    return (
        <BrowserRouter>
            <ThemeProvider theme={ theme }>
                <Switch>
                    <Route path="/login" component={ LoginView }/>
                    <ProtectedRoute>
                        <MainView/>
                    </ProtectedRoute>
                </Switch>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
