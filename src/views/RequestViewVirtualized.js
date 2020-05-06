import { TextField } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { FilterList } from '@material-ui/icons';
import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer } from 'react-virtualized';
import EmployeeList from '../components/EmployeeList';
import Loader from '../components/Loader';
import RequestFilteredMenu from '../components/RequestFilteredMenu';
import RequestInfoData from '../components/RequestInfoData';
import { fetchOrUpdateEmployees, setAndRefreshFilter } from '../state/selector/RequestSelector';

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexGrow: '1',
        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(1.5),
        },
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(3)
        }
    },
    paperContainer: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        }
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
    requestOrganization: {
        margin: theme.spacing(1.125),
        display: 'flex',
        // flex: '1 0 auto'
        flexDirection: 'column',
        justifyContent: 'center',
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
        fetchOrUpdateEmployees,
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

    const [filterWindowOpen, setFilterWindowOpen] = React.useState(false);
    const filterAnchor = React.useRef(null);
    const prevOpenState = React.useRef(filterWindowOpen);
    // Restore focus on close window
    React.useEffect(() => {
        if (prevOpenState.current === true && filterWindowOpen === false) {
            // noinspection JSUnresolvedFunction
            filterAnchor.current.focus();
        }

        prevOpenState.current = filterWindowOpen;
    }, [filterWindowOpen]);

    const toggleFilterWindow = () => {
        setFilterWindowOpen((prev) => !prev);
    };

    const closeFilterWindow = (event) => {
        if (event && filterAnchor.current && filterAnchor.current.contains(event.target)) {
            return;
        }

        setFilterWindowOpen(false);
    };

    return (
        <React.Fragment>
            <div className={ classes.toolbar }/>
            <div className={ classes.root }>
                <Container className={ classes.paperContainer } maxWidth='xl'>
                    <Paper className={ classes.paper }>
                        <div className={ classes.requestOrganization }>
                            <TextField
                                id="search-users"
                                label="Search Users"
                                variant='outlined'
                                value={ searchFilter }
                                InputProps={ {
                                    endAdornment: (
                                        <IconButton
                                            position='end'
                                            aria-label='edit filters'
                                            ref={ filterAnchor }
                                            aria-haspopup='true'
                                            aria-controls={ filterWindowOpen ? 'employee-list-filters' : undefined }
                                        >
                                            <FilterList/>
                                        </IconButton>
                                    ),
                                } }
                                onChange={ e => setSearchFilter(e.target.value) }
                            />
                            <RequestFilteredMenu ref={ filterAnchor } open={ filterWindowOpen }
                                                 closeWindow={ closeFilterWindow }/>
                            <RequestInfoData/>
                        </div>
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
    searchFilter: state.requests.filter.text,
    loading: state.requests.loading,
});

const mapDispatchToProps = dispatch => ({
    setSearchFilter: filter => {
        dispatch(setAndRefreshFilter(filter));
    },
    fetchOrUpdateEmployees: () => dispatch(fetchOrUpdateEmployees()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RequestViewVirtualized);