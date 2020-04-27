import { ClickAwayListener, useMediaQuery, useTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { deleteRequest } from '../../state/selector/RequestSelector';

const useStyle = makeStyles(theme => ({
    pending: {
        color: theme.status.warning,
        borderColor: theme.status.warning
    },
    cancel: {
        color: theme.status.danger,
        borderColor: theme.status.danger
    }
}));

function PendingStatusButton(
    {
        employeeName,
        employeeObjId,
        deleteRequest
    }) {

    const classes = useStyle();
    const theme = useTheme();
    const [showCancel, setShowCancel] = React.useState(false);
    const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <ClickAwayListener onClickAway={ () => setShowCancel(false) }>
            {
                showCancel ? (
                    <Button edge='end'
                            classes={ {
                                root: classes.cancel
                            } }
                            aria-label={ `confirm cancel request for ${ employeeName }` }
                            variant='outlined' onClick={ deleteRequest(employeeObjId) }
                    >
                        { `Cancel${ smallScreen ? '' : ' Request' }` }
                    </Button>
                ) : (
                    <Button edge='end'
                            classes={ {
                                root: classes.pending
                            } }
                            aria-label={ `request to ${ employeeName } is pending. click to cancel` }
                            variant='outlined' onClick={ () => setShowCancel(true) }
                    >
                        Pending
                    </Button>
                )
            }
        </ClickAwayListener>
    );
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    deleteRequest: requestId => () => dispatch(deleteRequest([requestId])),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PendingStatusButton);