import Typography from '@material-ui/core/Typography';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
    root: {
        // display: 'flex',
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar
}));

export default function HomepageView(props) {
    const classes = useStyle();
    return (
        <div className={ classes.root }>
            Hi
        </div>
    );
}