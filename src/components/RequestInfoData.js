import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { setSelectedEmployees } from '../state/selector/RequestSelector';
import { green, red } from '@material-ui/core/colors';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';

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

const colorButtonTheme = createMuiTheme({
    palette: {
        primary: {
            main: green[600]
        },
        secondary: {
            main: red[600]
        },
    },
});

function RequestInfoData(
    {
        selectedEmployees,
        resetSelected
    }) {

    const classes = useStyle();
    const showOptionButtons = () => {
        return !!(selectedEmployees && selectedEmployees.length);
    };

    return (
        <ThemeProvider theme={ colorButtonTheme }>
            <Grow in={ showOptionButtons() } unmountOnExit>
                <div className={ classes.infoBlockHolder }>
                    <Button className={ classes.deselectButton } variant='contained'
                            color='secondary'
                            onClick={ resetSelected } disableElevation
                            disableFocusRipple>
                        Deselect All
                    </Button>
                    <Hidden xsDown>
                        <div className={ classes.otherSpace }/>
                        <Typography noWrap>Remaining: 0</Typography>
                        <div className={ classes.otherSpace }/>
                    </Hidden>
                    <Button className={ classes.submitButton } variant='contained'
                            color='primary' disableElevation
                            disableFocusRipple>
                        Submit Requests
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
    resetSelected: () => dispatch(setSelectedEmployees([])),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RequestInfoData);