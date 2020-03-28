import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, ListItemIcon, ListItemText, TextField, useMediaQuery, useTheme } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { now } from 'moment';

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
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
    list: {
        width: '100%'
    },
    listItem: {
        [theme.breakpoints.down('sm')]: {
            width: '69.69%',
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: '30%'
        }
    },
    requestedText: {
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(1)
        }
    },
    listItemText: {
        fontWeight: 'bold'
    },
    requestIcon: {
        transform: 'translateY(-50%)',
    },
    loaderDiv: {
        minWidth: '100%',
        display: 'flex',
        justifyContent: 'center'
    }
}));

function getNanoSecTime() {
    const hrTime = process.hrtime();
    return hrTime[0] * 1000000000 + hrTime[1];
}

function employeeName(employee) {
    return employee.firstName + ' ' + employee.lastname;
}

const Loader = ({ classes }) => {
    return (
        <div className={ classes.loaderDiv }>
            <CircularProgress size='7.3rem' thickness={ 2 } variant='indeterminate'/>
        </div>
    );
};


const UserList = ({ classes }) => {
    const theme = useTheme();
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const [loading, setLoading] = React.useState(true);
    const [employees, setEmployees] = React.useState([]);
    const [renderedEmployees, setRenderedEmployees] = React.useState([]);
    const [checkedItems, setCheckedItems] = React.useState([]);

    React.useEffect(() => {
        console.log('Sending request for employees');
        axios.get('/api/employees')
            .then(result => {
                console.log('Got Result');
                console.log(result);
                setLoading(false);
                if (result.data && result.data.employees) {
                    setEmployees(result.data.employees.sort((o1, o2) => o1.lastName.localeCompare(o2.lastName)));
                    setRenderedEmployees(result.data.employees.sort((o1, o2) => o1.lastName.localeCompare(o2.lastName)));
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const handleChange = (e) => {
        const searchString = e.target.value;
        filterEmployees(searchString);
    };

    const filterEmployees = (searchString) => {
        setRenderedEmployees(employees.filter((employee) => {
            return employeeName(employee).toLowerCase().substring(0, searchString.length) === searchString.toLowerCase();
        }));
    };

    const updateCheckedItem = value => () => {
        console.log(value);
        const milli = now();
        console.log('Starting Iteration:');
        const index = checkedItems.indexOf(value);
        const newCheckedItems = [...checkedItems];
        if (index === -1) {
            newCheckedItems.push(value);
        } else {
            newCheckedItems.splice(index, 1);
        }
        console.log(`Ending Iteration: ${ (now() - milli) }`);
        setCheckedItems(newCheckedItems);
    };

    return (
        <div className = {classes.list}>
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
                onChange = {handleChange}
            />
            <List>
                {
                    loading &&
                    <Loader classes={ classes }/>
                }
                {
                    renderedEmployees.map(employee => {
                        return (
                            <React.Fragment key={ employee._id }>
                                <Divider/>
                                <ListItem role={ undefined } button onClick={ updateCheckedItem(employee.employeeId) }>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={ checkedItems.indexOf(employee.employeeId) !== -1 }
                                            tabIndex={ -1 }
                                            disableRipple
                                            inputProps={ { 'aria-labelledby': 'Add or Remove from Review Request' } }
                                        />
                                    </ListItemIcon>
                                    <ListItemText tabIndex={ 0 } className={ classes.listItem }
                                                primary={ `${ employee.firstName } ${ employee.lastName }` }
                                                primaryTypographyProps={ { className: classes.listItemText } }
                                                secondary={ employee.position }/>
                                    {
                                        /*
                                        <ListItemSecondaryAction tabIndex={ 0 } className={ classes.requestIcon }>
                                            <IconButton aria-label={ val.state.name }
                                                        style={ { color: val.state.color } }><Icon>{ val.state.icon }</Icon></IconButton>
                                        </ListItemSecondaryAction>
                                        */
                                    }
                                </ListItem>
                            </React.Fragment>
                        );
                    })
                }
                {
                    !loading &&
                    <Divider/>
                }
            </List>
        </div>
    );
};



export default function RequestView(props) {
    const classes = useStyle();

    return (
        <React.Fragment>
            <div className={ classes.toolbar }/>
            <div className={ classes.root }>
                <Container maxWidth='xl'>
                    <Paper className={ classes.paper }>
                        <UserList classes = {classes}/>
                    </Paper>
                </Container>
            </div>
        </React.Fragment>
    );
}