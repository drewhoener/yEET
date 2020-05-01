import { ListItemText, useMediaQuery } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { pushErrorMessage } from '../state/selector/RequestSelector.js';
import RequestCardItem from './write/RequestCardItem';
import RequestListItem from './write/RequestListItem';

const useStyle = makeStyles(theme => ({
    list: {
        width: '100%'
    },
    listItem: {
        backgroundColor: '#ffffff',
        '&:hover': {
            backgroundColor: '#eeeeee'
        }
    },
    emptyRequestSet: {
        textAlign: 'center',
    },
    spacedButton: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    }
}));

function RequestList({ status, requests, setRequests, emptyText, pushError }) {

    const classes = useStyle();
    const RequestListComponent = useMediaQuery(theme => theme.breakpoints.down('md')) ? RequestCardItem : RequestListItem;

    // Using useMemo so that we don't waste time filtering every time we call this
    // The memoized value will only change if status or requests change
    const renderableRequests = React.useMemo(() => {
        return requests.filter(request => request.statusNumber === status).sort((o1, o2) => o2.expireTime.valueOf() - o2.expireTime.valueOf());
    }, [status, requests]);

    const handleAccept = (request) => {
        console.log('accepted');
        axios.post('/api/accept-request', request)
            .then(({ data }) => {
                if (data && data.request) {
                    pushError('success', 'Request accepted');
                    return data;
                }
            })
            .catch(err => {
                pushError('error', 'Request couldn\'t be accepted. It either expired or does not exist.');
            })
            .then((data) => {
                let newRequests = requests.filter(o => o._id.toString() !== request._id.toString());
                if (data && data.request) {
                    newRequests = [
                        {
                            ...data.request,
                            expireTime: moment(data.request.expireTime),
                        },
                        ...newRequests,
                    ];
                }
                setRequests(newRequests);
            });
    };

    const handleReject = (request) => {
        console.log('rejected');
        axios.post('/api/delete-request', request)
            .then(() => {
                pushError('success', 'Request rejected');
            })
            .catch(err => {
                pushError('error', 'Request couln\'t be rejected. It either expired or does not exist.');
            })
            .then(() => {
                const newRequests = [...requests.filter(o => o._id.toString() !== request._id.toString())];
                setRequests(newRequests);
            });
    };

    const history = useHistory();

    const redirectToEditor = (reviewId) => {
        axios.get('/api/editor/review-valid', {
            params: {
                requestId: reviewId
            }
        }).then(() => {
            history.push(`/write/editor/${ reviewId }`);
        }).catch(() => {
            pushError('warning', 'Cannot open editor, this review might not exist.');
        });
    };


    return (
        <List className={ classes.list }>
            {
                renderableRequests.length <= 0 && (
                    <>
                        <Divider/>
                        <ListItem
                            tabIndex={ 0 }
                            aria-labelledby={ `req_emptystatus_${ status }` }
                            className={ classes.listItem }>
                            <ListItemText
                                className={ classes.emptyRequestSet }
                                aria-label={ 'Nothing to display' }
                                id={ `req_emptystatus_${ status }` }
                                primary={ emptyText || 'No Requests to display' }
                            />
                        </ListItem>
                    </>
                )
            }
            {
                renderableRequests.length > 0 &&
                renderableRequests.map(request => {
                    return (
                        <React.Fragment
                            key={ `${ request.firstName }_${ request.lastName }_${ request._id }` }>
                            <Divider/>
                            <ListItem
                                tabIndex={ 0 }
                                aria-labelledby={ `req_${ request._id }` }
                                className={ classes.listItem }
                            >
                                <RequestListComponent
                                    status={ status }
                                    request={ request }
                                    handleAccept={ handleAccept }
                                    handleReject={ handleReject }
                                    redirectToEditor={ redirectToEditor }
                                />
                            </ListItem>
                        </React.Fragment>
                    );
                })
            }
            <Divider/>
        </List>
    );
}

const mapDispatchToProps = (dispatch) => ({
    pushError: (severity, message) => dispatch(pushErrorMessage(severity, message))
});

export default connect(null, mapDispatchToProps)(RequestList);