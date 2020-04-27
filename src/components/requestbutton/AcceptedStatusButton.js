import { useMediaQuery, useTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyle = makeStyles(theme => ({
    completed: {
        color: theme.status.success
    }
}));

export default function AcceptedStatusButton({ employeeName }) {

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
                aria-label={ `Review from ${ employeeName } in progress` }
        >
            { `${ smallScreen ? 'Writing' : 'In Progress' }` }
        </Button>
    );
}