import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { AutoSizer } from 'react-virtualized';
import Loader from '../components/Loader';
import Fuse from 'fuse.js';
import Divider from '@material-ui/core/Divider';
import EmployeeList from '../components/EmployeeList';

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
    smallScrollbar: {
        '&::-webkit-scrollbar': {
            width: '0.8em',
            height: '0.6em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 10px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '2px solid slategrey'
        }
    },
}));

const searchOptions = {
    includeScore: true,
    threshold: 0.4,
    location: 0,
    distance: 95,
    minMatchCharLength: 1,
    keys: [
        'lastName',
        'firstName',
        'position',
        'employeeId',
    ]
};

export default function RequestViewVirtualized(props) {
    const classes = useStyle();
    const [searchKey, setSearchKey] = React.useState('');
    const [employees, setEmployees] = React.useState([]);
    const [selectedEmployees, setSelectedEmployees] = React.useState([]);
    const [matchedEmployees, setMatchedEmployees] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [searcher, setSearcher] = React.useState(new Fuse([], searchOptions));

    const handleChange = (e) => {
        const searchString = e.target.value;
        setSearchKey(searchString.toLowerCase());
    };

    const onSelectItem = id => () => {
        const index = selectedEmployees.indexOf(id);
        const selected = [...selectedEmployees];

        if (index === -1) {
            selected.push(id);
        } else {
            selected.splice(index, 1);
        }

        setSelectedEmployees(selected);
    };

    React.useEffect(() => {
        setSearcher(new Fuse(employees, searchOptions));
    }, [employees]);

    React.useEffect(() => {
        // console.log('Setting filtered users');
        if (!searchKey) {
            setMatchedEmployees(employees.map((val, idx) => idx));
            return;
        }
        const results = searcher.search(searchKey);
        // console.log('Results: ');
        // console.log(results);
        setMatchedEmployees(results.sort((o1, o2) => {
                const compareScore = o1.score - o2.score;
                if (compareScore !== 0) {
                    return compareScore;
                }
                return o1.item.lastName.localeCompare(o2.item.lastName);
            }).map(item => item.refIndex)
        );
    }, [searcher, employees, searchKey]);

    React.useEffect(() => {
        console.log('Sending request for employees');
        axios.get('/api/employees')
            .then(result => {
                console.log('Got Result');
                console.log(result);

                setTimeout(() => {
                    if (result.data && result.data.employees) {
                        setEmployees(result.data.employees.sort((o1, o2) => o1.lastName.localeCompare(o2.lastName)));
                        setLoading(false);
                        // setRenderedEmployees(result.data.employees.sort((o1, o2) => o1.lastName.localeCompare(o2.lastName)));
                    }
                }, 750);

            })
            .catch(err => {
                console.error(err);
            });
    }, []);

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
                            InputProps={ {
                                endAdornment: (
                                    <IconButton position='end' aria-label='Search'>
                                        <Search/>
                                    </IconButton>
                                ),
                            } }
                            onChange={ handleChange }
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