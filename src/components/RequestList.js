import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { ListItemText } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Check, Close, Create } from '@material-ui/icons';

const buttons = {
    'accept': {
        'name': 'accept',
        'color': '#4caf50',
        'icon': <Check/>
    },
    'reject': {
        'name': 'reject',
        'color': '#f44336',
        'icon': <Close/>
    },
    'type': {
        'name': 'type',
        'color': '#000000',
        'icon': <Create/>
    }
};

// classes is style
// status is 0 = Pending, 1 = Accepted, 2 = Rejected, 3 = Completed
// requests is the requests fetched in RespondView.js
export default function RequestList({ classes, status, requests, setRequests }) {

    const handleAccept = (request) => {
        console.log('accepted');
        axios.post('/api/accept-request', request)
            .then(({ data }) => {
                console.log('nice');
                if (data && data.request) {
                    const newRequests = [data.request, ...requests.filter(o => o._id.toString() !== data.request._id.toString())];
                    console.log(requests);
                    console.log(newRequests);
                    setRequests(newRequests);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleReject = (request) => {
        console.log('rejected');
        axios.post('/api/delete-request', request)
            .then(() => {
                const newRequests = [...requests.filter(o => o._id.toString() !== request._id.toString())];
                setRequests(newRequests);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const history = useHistory();

    const redirectToEditor = (reviewId) => {
        history.push(`/write/${ reviewId }`);
    };


    return (
        <List className={ classes.list }>
            {
                // Only fetch requests with the appropriate status
                requests.filter(req => req.statusNumber === status)
                    .map(request => {
                        return (
                            // React.fragment is a sort of hack to return multiple JSX elements
                            <React.Fragment
                                key={ `${ request.firstName }_${ request.lastName }_${ request._id }` }>
                                <Divider/>
                                <ListItem>
                                    <ListItemText tabIndex={ 0 } primary={ request.firstName + ' ' + request.lastName }
                                                  primaryTypographyProps={ { className: classes.listItemText } }
                                                  secondary={ request.position }/>
                                    {
                                        status === 0 &&
                                        <>
                                            <IconButton aria-label={ request.firstName }
                                                        style={ { color: buttons.accept.color } }
                                                        onClick={ () => handleAccept(request) }>
                                                { React.cloneElement(buttons.accept.icon) }
                                            </IconButton>
                                            <IconButton aria-label={ request.firstName }
                                                        style={ { color: buttons.reject.color } }
                                                        onClick={ () => handleReject(request) }>
                                                { React.cloneElement(buttons.reject.icon) }
                                            </IconButton>
                                        </>
                                    }
                                    {
                                        status === 1 &&
                                        <>
                                            <IconButton aria-label={ request.firstName }
                                                        style={ { color: buttons.type.color } }
                                                        onClick={ () => redirectToEditor(request._id) }>
                                                { React.cloneElement(buttons.type.icon) }
                                            </IconButton>
                                            <IconButton aria-label={ request.firstName }
                                                        style={ { color: buttons.reject.color } }
                                                        onClick={ () => handleReject(request) }>
                                                { React.cloneElement(buttons.reject.icon) }
                                            </IconButton>
                                        </>
                                    }
                                </ListItem>
                            </React.Fragment>
                        );
                    })
            }
            <Divider/>
        </List>
    );
}