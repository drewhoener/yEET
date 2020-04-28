import { Divider, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import CompactableRequestList from './CompactableRequestList';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        height: '100%',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        }
    },
}));

const AcceptWritePanel = ({ requests, setRequests }) => {

    const classes = useStyles();
    const dividerHorizontal = useMediaQuery(theme => theme.breakpoints.down('md'));

    return (
        <div className={ classes.root }>
            <CompactableRequestList title='Pending' status={ 0 } requests={ requests } setRequests={ setRequests }/>
            <Divider orientation={ dividerHorizontal ? 'horizontal' : 'vertical' } flexItem={ !dividerHorizontal }/>
            <CompactableRequestList title='Accepted' status={ 1 } requests={ requests } setRequests={ setRequests }/>
        </div>
    );
};

export default AcceptWritePanel;