import { useMediaQuery } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, ThemeProvider, useTheme } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { sendSelectedRequests, unselectEmployees } from '../state/selector/RequestSelector';
import { colorButtonTheme } from '../util';

const useStyle = makeStyles(theme => ({
    infoBlockHolder: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: theme.spacing(1)
    },
    otherSpace: {
        flex: '1 1 auto',
    },
    deselectButton: {
        [theme.breakpoints.down('xs')]: {
            marginRight: theme.spacing(1)
        }
    },
    submitButton: {
        [theme.breakpoints.down('xs')]: {
            marginLeft: theme.spacing(1)
        }
    }
}));

function RequestInfoData(
    {
        selectedEmployees,
        resetSelected,
        sendSelectedRequests,
    }) {

    const classes = useStyle();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const showOptionButtons = () => {
        return !!(selectedEmployees && selectedEmployees.length);
    };

    return (
        <ThemeProvider theme={ colorButtonTheme }>
            <Grow in={ showOptionButtons() } unmountOnExit timeout={ 450 }>
                <div className={ classes.infoBlockHolder }>
                    <Button className={ classes.deselectButton } variant='outlined'
                            color='primary'
                            onClick={ resetSelected(selectedEmployees) } disableElevation
                            disableFocusRipple
                    >
                        Deselect All
                    </Button>
                    <Hidden xsDown>
                        <div className={ classes.otherSpace }/>
                        {/* <Typography noWrap>Remaining: 0</Typography> */ }
                    </Hidden>
                    <div className={ classes.otherSpace }/>
                    <Button className={ classes.submitButton } variant='contained'
                            color='primary'
                            onClick={ () => sendSelectedRequests() } disableElevation
                            disableFocusRipple
                    >
                        {
                            isSmallScreen ?
                                'Request All' :
                                'Submit Requests'
                        }
                    </Button>
                </div>
            </Grow>
        </ThemeProvider>
    );
}

const mapStateToProps = state => ({
    selectedEmployees: state.requests.selectedEmployees
});

const mapDispatchToProps = dispatch => ({
    resetSelected: (employees) => () => dispatch(unselectEmployees(employees)),
    sendSelectedRequests: () => dispatch(sendSelectedRequests()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RequestInfoData);