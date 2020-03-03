import React from 'react';
import {useHistory} from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles";
import {ListItemSecondaryAction, ListItemText, TextField, useMediaQuery, useTheme} from "@material-ui/core";
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
        [theme.breakpoints.down('sm')]: {
            width: '69.69%',
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: '30%'
        }
    },
    requestedText: {
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(1)
        }
    },
    listItemText: {
        fontWeight: 'bold'
    },
    requestIcon: {
        transform: 'translateY(-50%)',
    }
}));

const data = require('../data/users');
const UserList = ({classes}) => {
    let theme = useTheme();
    let history = useHistory();
    let largeScreen = useMediaQuery(theme.breakpoints.up('md'));
    return (
        <List className={classes.list}>
            {
                Object.entries(data).map(([key, val]) => {
                    let {requestedBefore, lastRequested} = val;
                    let time = requestedBefore ? moment(lastRequested) : null;
                    return (
                        <React.Fragment key={`${key.toLowerCase().replace(' ', '_')}-${val.employeeID}`}>
                            <Divider/>
                            <ListItem>
                                <ListItemText tabIndex={0} className={classes.listItem} primary={key}
                                              primaryTypographyProps={{className: classes.listItemText}}
                                              secondary={`Employee ID: ${val.employeeID}`}/>
                                {
                                    (requestedBefore && time !== null) ?
                                        <ListItemText tabIndex={0} className={classes.requestedText}
                                                      primary={`Requested ${largeScreen ? 'Review' : ''}`}
                                                      secondary={time.calendar()}/> : null
                                }
                                <ListItemSecondaryAction tabIndex={0} className={classes.requestIcon}>
                                    <IconButton aria-label={val.state.name}
                                                style={{color: val.state.color}}><Icon>{val.state.icon}</Icon></IconButton>
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
                            <IconButton position='end' aria-label='Search'>
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