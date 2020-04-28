import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AcceptWritePanel from '../components/write/AcceptWritePanel';
import CompactableRequestList from '../components/write/CompactableRequestList';

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
        padding: theme.spacing(3),
        flex: 1,
    },
    toolbar: theme.mixins.toolbar,
    paperContainer: {
        width: '100%',
    },
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 8,
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
}));

export default function WriteView() {
    const classes = useStyle();
    const [requests, setRequests] = React.useState([]);
    React.useEffect(() => {
        axios.get('/api/open-requests')
            .then(({ data }) => {
                setRequests(data.requests);
            })
            .catch(err => {
                console.log(err);
                // const error = {};
                // setRequests([error]);
            });
    }, []);
    return (
        <React.Fragment>
            <div className={ classes.toolbar }/>
            <div className={ classes.root }>
                <Container maxWidth='xl'>
                    <Switch>
                        <Route path={ '/write/accept' }>
                            <AcceptWritePanel requests={ requests } setRequests={ setRequests }/>
                        </Route>
                        <Route path={ '/write/completed' }>
                            <CompactableRequestList title='Completed' status={ 3 } requests={ requests }
                                                    setRequests={ setRequests }
                                                    emptyRequestsTitle={ 'You haven\'t completed any requests yet' }/>
                        </Route>
                    </Switch>
                </Container>
            </div>
        </React.Fragment>
    );
}