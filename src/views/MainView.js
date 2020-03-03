import ResponsiveNav from "../components/ResponsiveNav";
import DummyView from "./DummyView";
import React from "react";
import {Redirect, Switch} from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles";
import LoginProtectedRoute from "../components/LoginProtectedRoute";
import ReadReviewView from "./ReadReviewView";
import RequestView from "./RequestView";

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        minHeight: '93vh',
        [theme.breakpoints.up('md')]: {
            minHeight: '95vh'
        }
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
                    <Redirect exact from='/' to='/home'/>
                    <LoginProtectedRoute path='/home'>
                        <DummyView/>
                    </LoginProtectedRoute>
                    <LoginProtectedRoute path='/my-reviews'>
                        <ReadReviewView/>
                    </LoginProtectedRoute>
                    <LoginProtectedRoute path='/request'>
                        <RequestView/>
                    </LoginProtectedRoute>
                </Switch>
            </main>
        </div>
    );
}