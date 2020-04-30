import Typography from '@material-ui/core/Typography';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Axios from 'axios';

const useStyle = makeStyles(theme => ({
    root: {
        // display: 'flex',
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar
}));

export default function HomepageView(props) {
    const classes = useStyle();
    let data = Axios.get('/api/user-stats')
        .then(data => {
            console.log(data);
        });
    return (
        <div className={ classes.root }>
            
        </div>
    );
}