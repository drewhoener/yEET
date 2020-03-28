import React from 'react';
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ListItemSecondaryAction, ListItemText, TextField, useMediaQuery, useTheme} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar,
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 8,
        width: '100%'
    },
    margin: {
        margin: theme.spacing(1)
    },
    list: {
        width: '100%'
    },
    listItem: {
        [theme.breakpoints.down('sm')]: {
            width: '69.69%',
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: '30%'
        }
    },
    listItemText: {
        fontWeight: 'bold'
    }
}));

const users2 = require('../data/users2');
const requests = require('../data/requestdata');
const RequestList = ({classes, status}) => {
    let theme = useTheme();
    let reqs = requests.requests.filter(req => req.status == status);
    return (
        <List className={classes.list}>
            {
                reqs.map(req => { 
                    console.log(reqs);
                    let sender;                         // Get the request sender's data
                    for (let user in users2.users) {    // There's probably a way to do this 10x less awful with the actual DB and mongoose (?)
                        if (users2.users[user].employeeID == req.senderID) {
                            sender = users2.users[user];
                        }
                    }
                    return (
                        <React.Fragment key={`${sender.name.toLowerCase().replace(' ', '_')}-${sender.employeeID}`}>
                            <Divider/>
                            <ListItem>
                                <ListItemText tabIndex={0} primary={sender.name}
                                              primaryTypographyProps={{className: classes.listItemText}}
                                              secondary={sender.positionTitle}/>
                                <ListItemSecondaryAction tabIndex={0}>
                                    <IconButton aria-label={sender.state.name}
                                                style={{color: sender.state.color}}><Icon>{sender.state.icon}</Icon></IconButton>
                                </ListItemSecondaryAction>
                                <ListItemSecondaryAction tabIndex={0}>
                                    <IconButton aria-label={sender.state.name}
                                                style={{color: sender.state.color}}><Icon>{sender.state.icon}</Icon></IconButton>
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

const Pending = ({classes}) => {
    return (
        <Paper className={classes.paper}>
            <RequestList status={0} classes={classes}/>
        </Paper>
    );
};

const Accepted = ({classes}) => {
    return (
        <Paper className={classes.paper}>
            <RequestList status={1} classes={classes}/>
        </Paper>
    );
};

const Completed = ({classes}) => {
    return (
        <Paper className={classes.paper}>
            <RequestList status={2} classes={classes}/>
        </Paper>
    );
};

export default function RespondView(props) {
    const classes = useStyle();
    return (
        <React.Fragment>
            <div className={classes.toolbar}/>
            <div className={classes.root}>
                <Container maxWidth='xl'>
                    <h1>Pending</h1>
                    <Pending classes={classes}/>
                    <h1>Accepted</h1>
                    <Accepted classes={classes}/>
                    <h1>Completed</h1>
                    <Completed classes={classes}/>
                </Container>
            </div>
        </React.Fragment>
    );
}