import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexGrow: '1',
        padding: theme.spacing(3)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },
    toolbar: theme.mixins.toolbar,
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 8,
        width: '100%'
    },
    margin: {
        margin: theme.spacing(1)
    },
}));

export default function RequestViewVirtualized(props) {
    const classes = useStyle();
    const [searchKey, setSearchKey] = React.useState('');

    const handleChange = (e) => {
        const searchString = e.target.value;
        setSearchKey(searchString.toLowerCase());
    };

    return (
        <React.Fragment>
            <div className={ classes.toolbar }/>
            <div className={ classes.root }>
                <Container maxWidth='xl'>
                    <Paper className={ classes.paper }>
                        <TextField
                            className={ classes.margin }
                            id="search-users"
                            label="Search Users"
                            variant='outlined'
                            fullWidth
                            InputProps={ {
                                endAdornment: (
                                    <IconButton position='end' aria-label='Search'>
                                        <Search/>
                                    </IconButton>
                                ),
                            } }
                            onChange={ handleChange }
                        />
                        <div>

                        </div>
                    </Paper>
                </Container>
            </div>
        </React.Fragment>
    );
}