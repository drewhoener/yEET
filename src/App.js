import React from 'react';
import logo from './logo.svg';
import './App.css';
import ResponsiveNav from "./components/ResponsiveNav";
import {ThemeProvider} from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import Typography from "@material-ui/core/Typography";
import {Container} from "@material-ui/core";

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

function App(){
  return (
      <ThemeProvider theme={theme}>
        <ResponsiveNav/>
        <Container>
          <Typography variant={"h6"}>Hello World</Typography>
        </Container>
      </ThemeProvider>
  );
}

// eslint-disable-next-line no-unused-vars
function Appp() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
