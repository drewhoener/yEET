import { ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { PendingState } from '../state/action/RequestActions';

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
    listItemText: {
        fontWeight: 'bold'
    },
    emptyRequestSet: {
        textAlign: 'center',
    },
    spacedButton: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    }
}));

export default function RequestList({ status, requests, setRequests, emptyText }) {

    const classes = useStyle();

    // Using useMemo so that we don't waste time filtering every time we call this
    // The memoized value will only change if status or requests change
    const renderableRequests = React.useMemo(() => {
        return requests.filter(request => request.statusNumber === status);
    }, [status, requests]);

    const handleAccept = (request) => {
        console.log('accepted');
        axios.post('/api/accept-request', request)
            .then(({ data }) => {
                if (data && data.request) {
                    console.log('Notify success here');
                    return data;
                }
            })
            .catch(err => {
                console.log('Notify failure here');
            }).then((data) => {
                let newRequests = requests.filter(o => o._id.toString() !== request._id.toString());
                if (data && data.request) newRequests = [data.request, ...newRequests];
                setRequests(newRequests);
        });
    };

    const handleReject = (request) => {
        console.log('rejected');
        axios.post('/api/delete-request', request)
            .then(() => {
                console.log('Notify success here');
            })
            .catch(err => {
                console.log('Notify failure here');
            })
            .then(() =>{
                const newRequests = [...requests.filter(o => o._id.toString() !== request._id.toString())];
                setRequests(newRequests);
        });
    };

    const history = useHistory();

    const redirectToEditor = (reviewId) => {
        history.push(`/write/editor/${ reviewId }`);
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
                                className={ classes.listItem }>
                                <ListItemText
                                    aria-label={ status === PendingState.COMPLETED ?
                                            `${ PendingState[status] } review for ${ request.firstName } ${ request.lastName }` :
                                            `${ PendingState[status] } request from ${ request.firstName } ${ request.lastName }, ${ request.position }`
                                        }
                                        id={ `req_${ request._id }` }
                                        primary={ request.firstName + ' ' + request.lastName }
                                        primaryTypographyProps={ { className: classes.listItemText } }
                                        secondary={ request.position }
                                    />
                                    <ListItemSecondaryAction>
                                        {
                                            status === 0 &&
                                            <>
                                                <Button className={ classes.spacedButton } variant={ 'outlined' }
                                                        aria-label={ `Accept pending request from ${ request.firstName } ${ request.lastName }` }
                                                        style={ { color: '#000000' } }
                                                        onClick={ () => handleAccept(request) }>
                                                    Accept
                                                </Button>
                                                <Button className={ classes.spacedButton } variant={ 'outlined' }
                                                        aria-label={ `Reject pending request from ${ request.firstName } ${ request.lastName }` }
                                                        style={ { color: '#f44336' } }
                                                        onClick={ () => handleReject(request) }>
                                                    Reject
                                                </Button>
                                            </>
                                        }
                                        {
                                            status === 1 &&
                                            <>
                                                <Button className={ classes.spacedButton } variant={ 'outlined' }
                                                        aria-label={ `Write review for ${ request.firstName } ${ request.lastName }` }
                                                        style={ { color: '#000000' } }
                                                        onClick={ () => redirectToEditor(request._id) }>
                                                    Write
                                                </Button>
                                                <Button className={ classes.spacedButton } variant={ 'outlined' }
                                                        aria-label={ `Reject request from ${ request.firstName } ${ request.lastName }` }
                                                        style={ { color: '#f44336' } }
                                                        onClick={ () => handleReject(request) }>
                                                    Reject
                                                </Button>
                                            </>
                                        }
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </React.Fragment>
                        );
                    })
            }
            <Divider/>
        </List>
    );
}