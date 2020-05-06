import { Divider, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { PendingState } from '../../state/action/RequestActions';
import CompactableRequestList from './CompactableRequestList';

const useStyles = makeStyles(theme => ({
    root: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
        [theme.breakpoints.up('lg')]: {
            display: 'flex',
            minHeight: '100%'

        }
    },
}));

const AcceptWritePanel = ({ requests, setRequests }) => {

    const classes = useStyles();
    const dividerHorizontal = useMediaQuery(theme => theme.breakpoints.down('md'));

    return (
        <div className={ classes.root }>
            <CompactableRequestList title='Pending' status={ PendingState.PENDING } requests={ requests }
                                    setRequests={ setRequests }/>
            <Divider orientation={ dividerHorizontal ? 'horizontal' : 'vertical' } flexItem={ !dividerHorizontal }/>
            <CompactableRequestList title='Accepted' status={ PendingState.ACCEPTED } requests={ requests }
                                    setRequests={ setRequests }/>
        </div>
    );
};

export default AcceptWritePanel;