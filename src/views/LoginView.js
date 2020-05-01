import { CssBaseline, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import {
    beginFetchCompanies,
    resetLoginState,
    setCheckingLogin,
    setEmployeeId,
    setErrorText,
    setLoadingLogin,
    setNeedsRedirect,
    setPassword,
    setSelectedCompany
} from '../state/selector/LoginSelector';
import { isMobile } from '../util';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '75vh'
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: 8,
        [theme.breakpoints.up('sm')]: {
            padding: 16
        }
    },
    employeeCompanyHolder: {
        width: '100%',
        alignItems: 'center',
        display: 'flex',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row'
        },
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column'
        },
    },
    companyAC: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            paddingRight: theme.spacing(1)
        }
    },
    translated: {
        transform: `translateY(3px)`,
    },
    employeeId: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(1)
        }
    },
    helperCenered: {
        textAlign: 'center'
    },
    loginButton: {
        marginTop: 8
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    errorText: {
        width: '100%',
        textAlign: 'center'
    }
}));

function LoginView(
    {
        errorText,
        setErrorText,
        companies,
        fetchCompanies,
        selectedCompany,
        setSelectedCompany,
        employeeId,
        setEmployeeId,
        password,
        setPassword,
        checkingLogin,
        setCheckingLogin,
        loading,
        setLoading,
        needsRedirect,
        setNeedsRedirect,
        resetLoginState
    }) {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();

    const { from } = location.state || { from: { pathname: '/' } };

    React.useEffect(() => {
        console.log('We think login view mounted');
        fetchCompanies();

        axios.get('/api/auth/validate')
            .then(response => {
                setNeedsRedirect(true);
                setCheckingLogin(false);
            })
            .catch(err => {
                setCheckingLogin(false);
            });

    }, [fetchCompanies, setNeedsRedirect, setCheckingLogin]);

    const onChange = (f, event) => {
        f(event.target.value);
    };

    const onSubmitForm = (event) => {
        event.preventDefault();
        setErrorText('');
        setLoading(true);
        axios.post('/api/auth/login', {
            companyId: selectedCompany.companyId,
            employeeNumber: employeeId,
            password
        })
            .then(result => {
                setLoading(false);
                history.replace(from);
                resetLoginState();
            })
            .catch(err => {
                const { response } = err;
                setLoading(false);
                if (response.status === 500) {
                    setErrorText('Internal Error, please try again');
                    return;
                }
                setErrorText('Invalid Username or Password');
            });
    };

    const selectOptions = {
        options: companies,
        getOptionLabel: val => val.companyName,
        autoComplete: true,
        autoSelect: true,
        autoHighlight: true,
        includeInputInList: true,
        disableOpenOnFocus: true,
        disableClearable: true
    };

    const select = isMobile ? (
        <TextField
            id="mobile-native-company-select"
            select
            label="Company"
            value={ selectedCompany.companyId }
            onChange={ event => onChange((val) => setSelectedCompany(companies.find(elem => elem.companyId === val)), event) }
            SelectProps={ {
                native: true,
            } }
            variant="outlined"
        >
            { companies.map(elem => (
                <option key={ elem.companyId } value={ elem.companyId }>
                    { elem.companyName }
                </option>
            )) }
        </TextField>
    ) : (
        <Autocomplete
            { ...selectOptions }
            className={ classes.companyAC }
            disabled={ loading }
            id="company-select"
            value={ selectedCompany }
            onChange={ (event, newValue) => {
                setSelectedCompany(newValue);
            } }
            renderInput={ params => {
                return (
                    <TextField { ...params } fullWidth variant='outlined' label="Company"
                               margin="normal"/>
                );
            } }
        />
    );

    const form = (
        <div className={ classes.root }>
            <CssBaseline/>
            <Container height='100%'>
                <Paper variant='outlined' elevation={ 16 }>
                    <Typography color='primary' fontWeight='fontWeightBold' align='center'
                                variant='h1'>yEET</Typography>
                    <Typography align='center' variant='subtitle1'>Your Employee Evaluation Tool</Typography>
                    <form className={ classes.form } onSubmit={ onSubmitForm } aria-label='Login Form'
                          data-lpignore="true">
                        <div className={ classes.employeeCompanyHolder }>
                            <div className={ classes.translated }>
                                { select }
                            </div>
                            <div className={ classes.employeeId }>
                                <TextField
                                    id="login-username"
                                    label="Employee ID"
                                    placeholder="ID Number"
                                    fullWidth
                                    margin='normal'
                                    variant='outlined'
                                    InputLabelProps={ { shrink: true } }
                                    value={ employeeId }
                                    disabled={ loading }
                                    onChange={ event => onChange(setEmployeeId, event) }
                                />
                            </div>
                        </div>
                        <TextField
                            id="login-password"
                            label="Password"
                            placeholder="Password"
                            type='password'
                            fullWidth
                            margin='normal'
                            variant='outlined'
                            InputLabelProps={ { shrink: true } }
                            value={ password }
                            disabled={ loading }
                            // error={true}
                            // helperText={'Helper Text Text'}
                            FormHelperTextProps={ { className: classes.helperCenered } }
                            onChange={ event => onChange(setPassword, event) }
                        />
                        <Button
                            className={ classes.loginButton }
                            variant='contained'
                            color='primary'
                            size='large'
                            type='submit'
                            aria-label="Login"
                            disableElevation
                            disableFocusRipple
                            fullWidth
                            disabled={ loading }
                        >
                            Login
                        </Button>
                        <Typography className={ classes.errorText } variant='subtitle1' color='error'
                                    hidden={ !errorText.length }>{ errorText }</Typography>
                    </form>
                </Paper>
            </Container>
        </div>
    );

    const chooseRender = () => {
        if (checkingLogin) {
            return null;
        }
        if (needsRedirect) {
            console.log(from);
            resetLoginState();
            return (
                <Redirect to={ '/home' } from={ from }/>
            );
        }
        return form;
    };

    return chooseRender();
}

const mapStateToProps = state => ({
    errorText: state.login.loginErrorStr,
    companies: state.login.companies,
    selectedCompany: state.login.selectedCompany,
    employeeId: state.login.employeeId,
    password: state.login.password,
    checkingLogin: state.login.checkingLogin,
    loading: state.login.loading,
    needsRedirect: state.login.needsRedirect,
});

const mapDispatchToProps = dispatch => ({
    setErrorText: text => dispatch(setErrorText(text)),
    fetchCompanies: () => dispatch(beginFetchCompanies()),
    setSelectedCompany: company => dispatch(setSelectedCompany(company)),
    setEmployeeId: id => dispatch(setEmployeeId(id)),
    setPassword: password => dispatch(setPassword(password)),
    setCheckingLogin: state => dispatch(setCheckingLogin(state)),
    setLoading: state => dispatch(setLoadingLogin(state)),
    setNeedsRedirect: state => dispatch(setNeedsRedirect(state)),
    resetLoginState: () => dispatch(resetLoginState()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginView);