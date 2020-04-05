import Button from '@material-ui/core/Button';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
    completed: {
        color: theme.status.success
    }
}));

export default function CompletedStatusButton() {

    const classes = useStyle();

    return (
        <Button edge='end' variant='outlined'
                classes={ {
                    root: classes.completed
                } }
        >
            Completed
        </Button>
    );
}