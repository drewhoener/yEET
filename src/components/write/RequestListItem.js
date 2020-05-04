import { ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { PendingState } from '../../state/action/RequestActions';
import RequestListOptionButton from './RequestListOptionButton';

const useStyles = makeStyles(theme => ({
    listItemText: {
        fontWeight: 'bold'
    },
    shrinkable: {
        flex: '1 0'
    },
    secondary: {
        display: 'flex',
        flex: 0
    }
}));

const RequestListItem = ({ status, request, handleAccept, handleReject, redirectToEditor }, ref) => {

    const classes = useStyles();
    const expireTimeStr = React.useMemo(() => {
        return request.submittedTime.calendar();
    }, [request]);

    return (
        <>
            <ListItemText
                ref={ ref }
                className={ classes.shrinkable }
                aria-label={ status === PendingState.COMPLETED ?
                    `${ PendingState[status] } review for ${ request.firstName } ${ request.lastName }` :
                    `${ PendingState[status] } request from ${ request.firstName } ${ request.lastName }, ${ request.position }`
                }
                id={ `req_${ request._id }` }
                primary={ request.firstName + ' ' + request.lastName }
                primaryTypographyProps={ { className: classes.listItemText } }
                secondaryTypographyProps={ { component: 'span', className: classes.secondary } }
                secondary={
                    request.position
                }
            />
            <ListItemText
                ref={ ref }
                aria-label={ status !== PendingState.COMPLETED ?
                    `Request Expires ${ expireTimeStr }` :
                    `Request Completed ${ expireTimeStr }`
                }
                id={ `req_${ request._id }` }
                primary={ status === PendingState.COMPLETED ? 'Completed' : 'Expires' }
                primaryTypographyProps={ { className: classes.listItemText } }
                secondary={ expireTimeStr }
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