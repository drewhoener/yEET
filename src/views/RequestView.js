import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {ListItemSecondaryAction, ListItemText, TextField} from "@material-ui/core";
import {Search} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Icon from "@material-ui/core/Icon";
import Container from "@material-ui/core/Container";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center'
    },
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
        maxWidth: '30%'
    },
    listItemText: {
        fontWeight: 'bold'
    }
}));

const data = require('../data/users');
const UserList = ({classes}) => (
    <List className={classes.list}>
        {
            Object.entries(data).map(([key, val]) => {
                console.log(key);
                console.log(val);
                let {requestedBefore, lastRequested} = val;
                console.log(requestedBefore);
                let time = requestedBefore ? moment(lastRequested) : null;
                console.log(time !== null ? time.calendar() : "");
                return (
                    <React.Fragment>
                        <Divider/>
                        <ListItem key={`${key.toLowerCase().replace(' ', '_')}-${val.employeeID}`}>
                            <ListItemText className={classes.listItem} primary={key}
                                          primaryTypographyProps={{className: classes.listItemText}}
                                          secondary={`Employee ID: ${val.employeeID}`}/>
                            {
                                (requestedBefore && time !== null) ?
                                    <ListItemText primary={`Last Requested`} secondary={time.calendar()}/> : null
                            }
                            <ListItemSecondaryAction>
                                <Icon style={{color: val.state.color}}>{val.state.icon}</Icon>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </React.Fragment>
                )
            })
        }
        <Divider/>
    </List>
);

export default function RequestView(props) {
    const classes = useStyle();

    return (
        <Container maxWidth='xl'>
            <Paper className={classes.paper}>
                <TextField
                    className={classes.margin}
                    id="search-users"
                    label="Search Users"
                    variant='outlined'
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <IconButton position='end'>
                                <Search/>
                            </IconButton>
                        ),
                    }}
                />
                {/*<Typography variant='h2' align='center'>Hello World</Typography>*/}
                <UserList classes={classes}/>
            </Paper>
        </Container>
    );
}