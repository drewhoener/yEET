import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import RequestList from '../RequestList';

const useStyles = makeStyles(theme => ({
    halfPanel: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        [theme.breakpoints.down('md')]: {
            paddingTop: theme.spacing(2),
        }
    },
    paperContainer: {
        width: '100%',
    },
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        flex: 1,
        padding: 8,
        margin: theme.spacing(2),
    },
}));

const CompactableRequestList = ({ title, status, requests, setRequests, emptyRequestsTitle }) => {

    const classes = useStyles();

    return (
        <div className={ classes.halfPanel }>
            <Typography variant='h3'>{ title }</Typography>
            <div className={ classes.paperContainer }>
                <Paper className={ classes.paper }>
                    <RequestList status={ status } requests={ requests } setRequests={ setRequests }
                                 emptyText={ emptyRequestsTitle }/>
                </Paper>
            </div>
        </div>
    );
};

export default CompactableRequestList;