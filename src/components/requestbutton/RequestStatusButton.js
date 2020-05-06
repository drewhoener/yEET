import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { connect } from 'react-redux';
import { sendRequests } from '../../state/selector/RequestSelector';

function RequestStatusButton(
    {
        employeeName,
        employeeObjId,
        sendSingleRequest,
        tooltipProps = {},
        containerClass
    }) {

    return (
        <Tooltip
            { ...tooltipProps }
            title={
                <div className={ containerClass }>
                    <Typography variant={ 'caption' }>Request a review from { employeeName }.</Typography>
                    <Typography variant={ 'caption' }>The request may be cancelled until they accept and start
                        writing.</Typography>
                </div>
            }
        >
            <Button
                edge='end'
                color='primary'
                variant='outlined'
                onClick={ sendSingleRequest(employeeObjId.toString()) }
                aria-label={ `request review from ${ employeeName }` }
            >
                Request
            </Button>
        </Tooltip>
    );
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    sendSingleRequest: requestId => () => dispatch(sendRequests([requestId])),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RequestStatusButton);