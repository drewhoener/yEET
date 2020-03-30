import React from 'react';
import { CssBaseline, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
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

export default function LoginView(props) {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const [error, setError] = React.useState('');
    const [employeeId, setEmployeeId] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [checking, setChecking] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [companies, setCompanies] = React.useState([{ companyId: '-1', companyName: '---' }]);
    const [selectedCompany, setSelectedCompany] = React.useState(companies[0]);

    const { from } = location.state || { from: { pathname: '/' } };

    React.useEffect(() => {
        console.log('We think login view mounted');
        axios.get('/api/companies')
            .then(({ data }) => {
                setCompanies(c => [...c, ...data.companies]);
            })
            .catch(err => {
                const error = { companyId: '-1', companyName: 'Error Fetching Companies' };
                setCompanies([error]);
                setSelectedCompany(error);
            });
        axios.get('/api/auth/validate')
            .then(response => {
                setShouldRedirect(true);
                setChecking(false);
            })
            .catch(err => {
                setChecking(false);
            });
    }, []);

    const onChange = (f, event) => {
        f(event.target.value);
    };

    const onSubmitForm = (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        axios.post('/api/auth/login', {
            companyId: selectedCompany.companyId,
            employeeNumber: employeeId,
            password
        })
            .then(result => {
                setLoading(false);
                history.replace(from);
            })
            .catch(err => {
                const { response } = err;
                setLoading(false);
                if (response.status === 500) {
                    setError('Internal Error, please try again');
                    return;
                }
                setError('Invalid Username or Password');
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
            value={selectedCompany.companyId}
            onChange={event => onChange((val) => setSelectedCompany(companies.find(elem => elem.companyId === val)), event)}
            SelectProps={{
                native: true,
            }}
            variant="outlined"
        >
            {companies.map(elem => (
                <option key={elem.companyId} value={elem.companyId}>
                    {elem.companyName}
                </option>
            ))}
        </TextField>
    ) : (
        <Autocomplete
            {...selectOptions}
            className={classes.companyAC}
            disabled={loading}
            id="company-select"
            value={selectedCompany}
            onChange={(event, newValue) => {
                setSelectedCompany(newValue);
            }}
            renderInput={params => {
                return (
                    <TextField { ...params } fullWidth variant='outlined' label="Company"
                               margin="normal"/>
                );
            }}
        />
    );

    const form = (
        <div className={classes.root}>
            <CssBaseline/>
            <Container height='100%'>
                <Paper variant='outlined' elevation={16}>
                    <Typography color='secondary' fontWeight='fontWeightBold' align='center'
                                variant='h1'>yEET</Typography>
                    <Typography align='center' variant='subtitle1'>Your Employee Evaluation Tool</Typography>
                    <form className={classes.form} onSubmit={onSubmitForm} aria-label='Login Form' data-lpignore="true">
                        <div className={classes.employeeCompanyHolder}>
                            {select}
                            <div className={classes.employeeId}>
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
                            color='secondary'
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
                                    hidden={ !error.length }>{ error }</Typography>
                    </form>
                </Paper>
            </Container>
        </div>
    );

    const chooseRender = () => {
        if (checking) {
            return null;
        }
        if (shouldRedirect) {
            console.log(from);
            return (
                <Redirect to={ '/home' } from={ from }/>
            );
        }
        return form;
    };

    return chooseRender();
}