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

// classes is style
// status is 0 = Pending, 1 = Accepted, 2 = Rejected, 3 = Completed
// requests is the requests fetched in RespondView.js
export default function RequestList({ classes, status, requests }) {
    let theme = useTheme();
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
                                <ListItemText tabIndex={0} primary={request.firstName + ' ' + request.lastName}
                                              primaryTypographyProps={{className: classes.listItemText}}
                                              secondary={request.position}/>
                                    <IconButton aria-label={request.firstName} style={{color: buttons.accept.color}}><Icon>{buttons.accept.icon}</Icon></IconButton>
                                    <IconButton aria-label={request.firstName} style={{color: buttons.reject.color}}><Icon>{buttons.reject.icon}</Icon></IconButton>
                            </ListItem>
                        </React.Fragment>
                    )
                })
            }
            <Divider/>
        </List>
    );
};