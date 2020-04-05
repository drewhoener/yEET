import Button from '@material-ui/core/Button';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery, useTheme } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
    completed: {
        color: theme.status.success
    }
}));

export default function AcceptedStatusButton() {

    const classes = useStyle();
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Button edge='end' variant='outlined'
                disableElevation
                disableFocusRipple
                disableTouchRipple
                disableRipple
                classes={ {
                    root: classes.completed
                } }
        >
            { `${ smallScreen ? 'Writing' : 'In Progress' }` }
        </Button>
    );
}