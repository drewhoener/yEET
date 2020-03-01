import ResponsiveNav from "../components/ResponsiveNav";
import DummyView from "./DummyView";
import React from "react";
import {Redirect, Route, Switch} from 'react-router-dom';

export default function MainView(props) {
    const {classes} = props;
    return (
        <React.Fragment>
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
                    <Route>
                        <DummyView/>
                    </Route>
                </Switch>
            </main>
        </React.Fragment>
    );
}