import ResponsiveNav from "../components/ResponsiveNav";
import DummyView from "./DummyView";
import React from "react";
import {Redirect, Route, Switch} from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles";
import LoginProtectedRoute from "../components/LoginProtectedRoute";
import ReadReviewView from "./ReadReviewView";

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    }
}));

export default function MainView(props) {
    const classes = useStyle();
    return (
        <div className={classes.root}>
            <ResponsiveNav/>
            <main className={classes.content}>
                <div className={classes.toolbar}/>

                <Switch>
                    {/*Redirect the '/' path to the home view*/}
                    <Route exact path='/' render={({location}) => (
                        <Redirect to={{
                            pathname: '/home',
                            state: {from: location}
                        }}/>
                    )}/>
                    <LoginProtectedRoute path='/home'>
                        <DummyView/>
                    </LoginProtectedRoute>
                    <LoginProtectedRoute path='/my-reviews'>
                        <ReadReviewView/>
                    </LoginProtectedRoute>
                </Switch>
            </main>
        </div>
    );
}