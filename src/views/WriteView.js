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
            </div>
        </React.Fragment>
    );
}