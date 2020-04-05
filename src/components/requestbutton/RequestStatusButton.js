import Button from '@material-ui/core/Button';
import React from 'react';
import { connect } from 'react-redux';
import { sendRequests } from '../../state/selector/RequestSelector';

function RequestStatusButton(
    {
        employeeObjId,
        sendSingleRequest
    }) {

    return (
        <Button edge='end' color='primary' variant='outlined'
                onClick={ sendSingleRequest(employeeObjId.toString()) }>
            Request
        </Button>
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