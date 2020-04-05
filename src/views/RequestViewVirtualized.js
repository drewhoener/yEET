import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { Snackbar, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { AutoSizer } from 'react-virtualized';
import Loader from '../components/Loader';
import Divider from '@material-ui/core/Divider';
import EmployeeList from '../components/EmployeeList';
import { connect } from 'react-redux';
import {
    closeTopErrorMessage,
    fetchOrUpdateEmployees,
    popErrorMessage,
    setAndRefreshFilter
} from '../state/selector/RequestSelector';
import RequestInfoData from '../components/RequestInfoData';
import Slide from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';

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

function SlideTransition(props) {
    return <Slide { ...props } direction="up"/>;
}

function RequestViewVirtualized(
    {
        searchFilter,
        loading,
        errorMessages,
        setSearchFilter,
        fetchOrUpdateEmployees,
        popErrorMessage,
        closeTopErrorMessage
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
                        <div className={ classes.requestOrganization }>
                            <TextField
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
                {/* Holder for snackbar messages */ }
                <div>
                    {

                        errorMessages.filter((val, idx) => idx === 0)
                            .map(message => {
                                return (
                                    <Snackbar
                                        key={ `error-message-${ message.key }` }
                                        open={ message.open }
                                        autoHideDuration={ 5000 }
                                        TransitionComponent={ SlideTransition }
                                        onClose={ () => closeTopErrorMessage() }
                                        TransitionProps={ {
                                            onExited: () => popErrorMessage()
                                        } }
                                        disableWindowBlurListener
                                    >
                                        <Alert action={ undefined } severity={ message.severity }>
                                            { message.content }
                                        </Alert>
                                    </Snackbar>
                                );
                            })

                    }
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    searchFilter: state.requests.filter,
    loading: state.requests.loading,
    errorMessages: state.requests.errorMessages,
});

const mapDispatchToProps = dispatch => ({
    setSearchFilter: filter => dispatch(setAndRefreshFilter(filter)),
    fetchOrUpdateEmployees: () => dispatch(fetchOrUpdateEmployees()),
    popErrorMessage: () => dispatch(popErrorMessage()),
    closeTopErrorMessage: () => dispatch(closeTopErrorMessage()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RequestViewVirtualized);