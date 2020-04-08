import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import RequestList from '../components/RequestList';
import axios from 'axios';

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
    modalPaper: {
        position: 'absolute',
        height: '75vh',
        width: '75vw',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
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

export default function WriteView(props) {
    const classes = useStyle();
    const [requests, setRequests] = React.useState([]);
    // Fetch requests on load: this should be virtualized
    React.useEffect(() => {
        axios.get('/api/open-requests')
            .then(({ data }) => {
                setRequests(data.requests);
            })
            .catch(err => {
                // const error = {};
                // setRequests([error]);
            });
    }, []);
    return (
        <React.Fragment>
            <div className={ classes.toolbar }/>
            <div className={ classes.root }>
                <Container maxWidth='xl'>
                    <h1>Pending</h1>
                    <Paper className={ classes.paper }>
                        <RequestList status={ 0 } classes={ classes } requests={ requests }
                                     setRequests={ setRequests }/>
                    </Paper>
                    <h1>Accepted</h1>
                    <Paper className={ classes.paper }>
                        <RequestList status={ 1 } classes={ classes } requests={ requests }
                                     setRequests={ setRequests }/>
                    </Paper>
                    <h1>Completed</h1>
                    <Paper className={ classes.paper }>
                        <RequestList status={ 3 } classes={ classes } requests={ requests }
                                     setRequests={ setRequests }/>
                    </Paper>
                </Container>
            </div>
        </React.Fragment>
    );
}