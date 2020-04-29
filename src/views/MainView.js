import { Snackbar } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import ResponsiveNav from '../components/ResponsiveNav';
import ReviewTextEditor from '../components/ReviewTextEditor';
import { closeTopErrorMessage, popErrorMessage } from '../state/selector/RequestSelector';
import ReadReviewView from './ReadReviewView';
import RequestViewVirtualized from './RequestViewVirtualized';
import WriteView from './WriteView';
import HomepageView from './HomepageView';

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

function SlideTransition(props) {
    return <Slide { ...props } direction="up"/>;
}

function MainView(
    {
        errorMessages,
        closeTopErrorMessage,
        popErrorMessage,
    }) {
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
                <div>
                    {

                        errorMessages.filter((val, idx) => idx === 0)
                            .map(message => {
                                return (
                                    <Snackbar
                                        key={ `error-message-${ message.key }` }
                                        open={ message.open }
                                        autoHideDuration={ 3500 }
                                        TransitionComponent={ SlideTransition }
                                        onClose={ () => closeTopErrorMessage() }
                                        TransitionProps={ {
                                            onExited: () => popErrorMessage()
                                        } }
                                        disableWindowBlurListener
                                    >
                                        <Alert action={ undefined } severity={ message.severity }>
                                            { message.content }
                                        </Alert>
                                    </Snackbar>
                                );
                            })

                    }
                </div>
            </main>
        </div>
    );
}

const mapStateToProps = state => ({
    errorMessages: state.requests.errorMessages,
});

const mapDispatchToProps = dispatch => ({
    popErrorMessage: () => dispatch(popErrorMessage()),
    closeTopErrorMessage: () => dispatch(closeTopErrorMessage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainView);