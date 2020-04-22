import { green, grey } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'react-virtualized/styles.css';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import './editorstyle.css';
import LoginView from './views/LoginView';
import MainView from './views/MainView';

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
