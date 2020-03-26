import ResponsiveNav from "../components/ResponsiveNav";
import DummyView from "./DummyView";
import React from "react";
import {Redirect, Route, Switch} from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles";
import ReadReviewView from "./ReadReviewView";
import RequestView from "./RequestView";
import RespondView from "./RespondView";

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    toolbar: {
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
    }
}));

export default function MainView(props) {
    const classes = useStyle();
    return (
        <div className={classes.root}>
            <ResponsiveNav/>
            <main className={classes.content}>
                <Switch>
                    {/*Redirect the '/' path to the home view*/}
                    <Redirect exact from='/' to='/home'/>
                    <Route path='/home'>
                        <div className={classes.toolbar}/>
                        <DummyView/>
                    </Route>
                    <Route path='/my-reviews'>
                        <ReadReviewView/>
                    </Route>
                    <Route path='/request'>
                        <RequestView/>
                    </Route>
                    <Route path='/write'>
                        <RespondView/>
                    </Route>
                </Switch>
            </main>
        </div>
    );
}