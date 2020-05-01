import { ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { PendingState } from '../../state/action/RequestActions';
import RequestListOptionButton from './RequestListOptionButton';

const useStyles = makeStyles(theme => ({
    listItemText: {
        fontWeight: 'bold'
    },
}));

const RequestListItem = ({ status, request, handleAccept, handleReject, redirectToEditor }, ref) => {

    const classes = useStyles();

    return (
        <>
            <ListItemText
                ref={ ref }
                aria-label={ status === PendingState.COMPLETED ?
                    `${ PendingState[status] } review for ${ request.firstName } ${ request.lastName }` :
                    `${ PendingState[status] } request from ${ request.firstName } ${ request.lastName }, ${ request.position }`
                }
                id={ `req_${ request._id }` }
                primary={ request.firstName + ' ' + request.lastName }
                primaryTypographyProps={ { className: classes.listItemText } }
                secondary={ request.position }
            />
            <ListItemSecondaryAction ref={ ref }>
                <RequestListOptionButton
                    status={ status }
                    request={ request }
                    handleAccept={ handleAccept }
                    handleReject={ handleReject }
                    redirectToEditor={ redirectToEditor }
                />
            </ListItemSecondaryAction>
        </>
    );
};

export default React.forwardRef(RequestListItem);