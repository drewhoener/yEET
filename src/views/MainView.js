import ResponsiveNav from "../components/ResponsiveNav";
import DummyView from "./DummyView";
import React from "react";
import {Redirect, Switch} from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles";
import ProtectedModule from "../components/ProtectedModule";
import ReadReviewView from "./ReadReviewView";
import RequestView from "./RequestView";

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
                    <ProtectedModule path='/home'>
                        <div className={classes.toolbar}/>
                        <DummyView/>
                    </ProtectedModule>
                    <ProtectedModule path='/my-reviews' component={ReadReviewView}/>
                    <ProtectedModule path='/request' component={RequestView}/>
                </Switch>
            </main>
        </div>
    );
}