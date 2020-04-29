import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ResponsiveNav from '../components/ResponsiveNav';
import ReviewTextEditor from '../components/ReviewTextEditor';
import SnackbarNotify from '../components/SnackbarNotify';
import HomepageView from './HomepageView';
import ReadReviewView from './ReadReviewView';
import RequestViewVirtualized from './RequestViewVirtualized';
import WriteView from './WriteView';

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

export default function MainView() {
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
                        <HomepageView/>
                    </Route>
                    <Route path='/my-reviews'>
                        <ReadReviewView/>
                    </Route>
                    <Route path='/request'>
                        <RequestViewVirtualized/>
                    </Route>
                    <Route path='/write'>
                        <Switch>
                            <Route exact path='/write/editor/:requestId' component={ ReviewTextEditor }/>
                            <Route>
                                <WriteView/>
                            </Route>
                        </Switch>
                    </Route>
                </Switch>
                {/* Holder for snackbar messages */ }
                <SnackbarNotify/>
            </main>
        </div>
    );
}