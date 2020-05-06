import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import AcceptedStatusButton from './AcceptedStatusButton';
import PendingStatusButton from './PendingStatusButton';
import RequestStatusButton from './RequestStatusButton';

const useStyles = makeStyles(() => ({
    tooltipContainer: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center'
    },
    tooltip: {
        maxWidth: 700
    }
}));

export default function ThemedStatusButton({ type, ...rest }) {

    const classes = useStyles();

    const ButtonComponent = type === 'Pending' ?
        PendingStatusButton : type === 'Accepted' ?
            AcceptedStatusButton : RequestStatusButton;

    const tooltipProps = {
        classes: {
            tooltip: classes.tooltip,
        },
        enterDelay: 750,
        placement: 'bottom-end',
        arrow: true
    };

    return (
        <ButtonComponent { ...rest } tooltipProps={ tooltipProps } containerClass={ classes.tooltipContainer }/>
    );
}