import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { ListItemSecondaryAction, ListItemText, useTheme } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

// Note that at the time of this commit these buttons are just placeholders
// We're going to need a way to conditionally render buttons
const buttons = {
    "accept": {
        "name": "accept",
        "color": "#4caf50",
        "icon": "send"
    },
    "reject": {
        "name": "reject",
        "color": "#f44336",
        "icon": "close"
    },
    "type": {
        "name": "type",
        "color": "#000000",
        "icon": "message"
    }
};

export default function RequestList({ classes, status, requests }) {
    let theme = useTheme();
    // 0 = Pending, 1 = Accepted, 2 = Rejected, 3 = Completed
    // status 2 = Rejected is irrelevant for rendering purposes but necessary to be distinguished from status 3 = Completed
    return (
        <List className={ classes.list }>
            {
                requests.filter(req => req.statusNumber === status)
                        .map(request => {
                    return (
                        <React.Fragment
                        key={ `${ (request.firstName + ' ' + request.lastName).toLowerCase().replace(' ', '_') }-${ request._id }` }>
                            <Divider/>
                            <ListItem>
                                <ListItemText tabIndex={0} primary={request.firstName + ' ' + request.lastName}
                                              primaryTypographyProps={{className: classes.listItemText}}
                                              secondary={request.position}/>
                                <ListItemSecondaryAction tabIndex={0}>
                                    <IconButton aria-label={request.firstName}
                                                style={{color: buttons.accept.color}}><Icon>{buttons.accept.icon}</Icon></IconButton>
                                </ListItemSecondaryAction>
                                <ListItemSecondaryAction tabIndex={0}>
                                    <IconButton aria-label={request.firstName}
                                                style={{color: buttons.reject.color}}><Icon>{buttons.reject.icon}</Icon></IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </React.Fragment>
                    )
                })
            }
            <Divider/>
        </List>
    );
};