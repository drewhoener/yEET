import { Snackbar } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { connect } from 'react-redux';
import { closeTopErrorMessage, popErrorMessage } from '../state/selector/RequestSelector';

function SlideTransition(props) {
    return <Slide { ...props } direction="up"/>;
}

const SnackbarNotify = (
    {
        errorMessages,
        closeTopErrorMessage,
        popErrorMessage,
    }
) => {
    return (
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
    );
};

const mapStateToProps = state => ({
    errorMessages: state.requests.errorMessages,
});

const mapDispatchToProps = dispatch => ({
    popErrorMessage: () => dispatch(popErrorMessage()),
    closeTopErrorMessage: () => dispatch(closeTopErrorMessage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SnackbarNotify);