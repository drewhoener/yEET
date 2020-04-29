import { Tooltip, useMediaQuery, useTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyle = makeStyles(theme => ({
    completed: {
        color: theme.status.success,
        borderColor: theme.status.success,
    }
}));

export default function AcceptedStatusButton({ employeeName, tooltipProps = {} }) {

    const classes = useStyle();
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Tooltip
            { ...tooltipProps }
            title={
                <Typography variant='caption'>
                    This user has already started writing your review, you may not cancel the request.
                </Typography>
            }
        >
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
        </Tooltip>
    );
}