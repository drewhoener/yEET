import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { ListItemText } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';

const buttons = {
    'accept': {
        'name': 'accept',
        'color': '#4caf50',
        'icon': 'send'
    },
    'reject': {
        'name': 'reject',
        'color': '#f44336',
        'icon': 'close'
    },
    'type': {
        'name': 'type',
        'color': '#000000',
        'icon': 'message'
    }
};

function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

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
                console.log('nice');
                const newRequests = [...requests.filter(o => o._id.toString() !== request._id.toString())];
                console.log(requests);
                console.log(newRequests);
                setRequests(newRequests);
            })
            .catch(err => {
                console.log(err);
            });
    };


    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const handleType = (request) => {
        console.log('type');
        console.log(request);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <List className={ classes.list }>
            {
                // Only fetch requests with the appropriate status
                requests.filter(req => req.statusNumber === status)
                    .map(request => {
                        return (
                            // React.fragment is a sort of hack to return multiple JSX elements
                            <React.Fragment
                                key={ `${ (request.firstName + ' ' + request.lastName).toLowerCase().replace(' ', '_') }-${ request._id }` }>
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
                                                <Icon>{ buttons.accept.icon }</Icon>
                                            </IconButton>
                                            <IconButton aria-label={ request.firstName }
                                                        style={ { color: buttons.reject.color } }
                                                        onClick={ () => handleReject(request) }>
                                                <Icon>{ buttons.reject.icon }</Icon>
                                            </IconButton>
                                        </>
                                    }
                                    {
                                        status === 1 &&
                                        <>
                                            <IconButton aria-label={ request.firstName }
                                                        style={ { color: buttons.type.color } }
                                                        onClick={ () => handleType(request) }>
                                                <Icon>{ buttons.type.icon }</Icon>
                                            </IconButton>
                                            <Modal  open={open}
                                                    onClose={handleClose}>
                                                <div className={classes.modalPaper}
                                                    style={modalStyle}
                                                    aria-labelledby="text-box"
                                                    aria-describedby="write-your-review-here">
                                                    <h1>Hello there</h1>
                                                </div>
                                            </Modal>
                                            <IconButton aria-label={ request.firstName }
                                                        style={ { color: buttons.reject.color } }
                                                        onClick={ () => handleReject(request) }>
                                                <Icon>{ buttons.reject.icon }</Icon>
                                            </IconButton>
                                        </>
                                    }
                                </ListItem>
                            </React.Fragment>
                        )
                    })
            }
            <Divider/>
        </List>
    );
}