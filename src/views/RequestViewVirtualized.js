import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { AutoSizer } from 'react-virtualized';
import Loader from '../components/Loader';
import Divider from '@material-ui/core/Divider';
import EmployeeList from '../components/EmployeeList';
import { connect } from 'react-redux';
import { fetchOrUpdateEmployees, setAndRefreshFilter } from '../state/selector/RequestSelector';

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexGrow: '1',
        padding: theme.spacing(3)
    },
    paperContainer: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
    paper: {
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 8,
        // width: '100%'
    },
    margin: {
        margin: theme.spacing(1)
    },
    autoContainer: {
        flexGrow: 1,
    },
    loaderDiv: {
        minWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
    },
}));

function RequestViewVirtualized(
    {
        searchFilter,
        loading,
        setSearchFilter,
        fetchOrUpdateEmployees
    }) {
    const classes = useStyle();

    // On load fetch or update employees if needed
    // On unload uncache the search filter
    React.useEffect(() => {
        fetchOrUpdateEmployees();
        return () => {
            setSearchFilter('');
        };
    }, [setSearchFilter, fetchOrUpdateEmployees]);

    return (
        <React.Fragment>
            <div className={ classes.toolbar }/>
            <div className={ classes.root }>
                <Container className={ classes.paperContainer } maxWidth='xl'>
                    <Paper className={ classes.paper }>
                        <TextField
                            className={ classes.margin }
                            id="search-users"
                            label="Search Users"
                            variant='outlined'
                            value={ searchFilter }
                            InputProps={ {
                                endAdornment: (
                                    <IconButton position='end' aria-label='Search'>
                                        <Search/>
                                    </IconButton>
                                ),
                            } }
                            onChange={ e => setSearchFilter(e.target.value) }
                        />
                        <Divider/>
                        <Loader className={ classes.loaderDiv } visible={ loading }/>
                        <div className={ classes.autoContainer }>
                            <AutoSizer>
                                {
                                    ({ height, width }) => (
                                        <EmployeeList height={ height } width={ width }/>
                                    )
                                }
                            </AutoSizer>
                        </div>
                    </Paper>
                </Container>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    searchFilter: state.requests.filter,
    loading: state.requests.loading,
});

const mapDispatchToProps = dispatch => ({
    setSearchFilter: filter => dispatch(setAndRefreshFilter(filter)),
    fetchOrUpdateEmployees: () => dispatch(fetchOrUpdateEmployees()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RequestViewVirtualized);