import ResponsiveNav from '../components/ResponsiveNav';
import DummyView from './DummyView';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ReadReviewView from './ReadReviewView';
import RequestViewVirtualized from './RequestViewVirtualized';
import WriteView from './WriteView';
import ReviewTextEditor from '../components/ReviewTextEditor';

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    toolbar: {
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
    }
}));

export default function MainView(props) {
    const classes = useStyle();
    return (
        <div className={ classes.root }>
            <ResponsiveNav/>
            <main className={ classes.content }>
                <Switch>
                    {/* Redirect the '/' path to the home view*/ }
                    <Redirect exact from='/' to='/home'/>
                    <Route path='/home'>
                        <div className={ classes.toolbar }/>
                        <DummyView/>
                    </Route>
                    <Route path='/my-reviews'>
                        <ReadReviewView/>
                    </Route>
                    <Route path='/request'>
                        <RequestViewVirtualized/>
                    </Route>
                    <Route exact path='/write/'>
                        <WriteView/>
                    </Route>
                    <Route path='/write/:requestId' component={ ReviewTextEditor }/>
                </Switch>
            </main>
        </div>
    );
}