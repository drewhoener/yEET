import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { Checkbox, ListItemIcon, ListItemText, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import ListItem from '@material-ui/core/ListItem';
import { AutoSizer, List } from 'react-virtualized';

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
        //width: '100%'
    },
    margin: {
        margin: theme.spacing(1)
    },
    autoContainer: {
        flexGrow: 1,
    }
}));

export default function RequestViewVirtualized(props) {
    const classes = useStyle();
    const [searchKey, setSearchKey] = React.useState('');
    const [employees, setEmployees] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e) => {
        const searchString = e.target.value;
        setSearchKey(searchString.toLowerCase());
    };

    React.useEffect(() => {
        console.log('Sending request for employees');
        axios.get('/api/employees')
            .then(result => {
                console.log('Got Result');
                console.log(result);
                setLoading(false);
                if (result.data && result.data.employees) {
                    setEmployees(result.data.employees.sort((o1, o2) => o1.lastName.localeCompare(o2.lastName)));
                    // setRenderedEmployees(result.data.employees.sort((o1, o2) => o1.lastName.localeCompare(o2.lastName)));
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const rowRenderer = ({
                             key, // Unique key within array of rows
                             index, // Index of row within collection
                             isScrolling, // The List is currently being scrolled
                             isVisible, // This row is visible within the List (eg it is not an overscanned row)
                             style, // Style object to be applied to row (to position it)
                         }) => {
        const employee = employees[index];
        if (!employee) {
            return null;
        }
        return (
            <ListItem key={ key } style={ style } role={ undefined } button>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={ false }
                        tabIndex={ -1 }
                        disableRipple
                        inputProps={ { 'aria-labelledby': 'Add or Remove from Review Request' } }
                    />
                </ListItemIcon>
                <ListItemText tabIndex={ 0 } className={ classes.listItem }
                              primary={ `${ employee.firstName } ${ employee.lastName }` }
                              primaryTypographyProps={ { className: classes.listItemText } }
                              secondary={ employee.position }/>
            </ListItem>
        );
    };

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
                        <div className={ classes.autoContainer }>
                            <AutoSizer>
                                {
                                    ({ height, width }) => (
                                        <List
                                            width={ width }
                                            height={ height }
                                            rowCount={ employees.length }
                                            rowHeight={ 55 }
                                            rowRenderer={ rowRenderer }
                                            overscanRowCount={ 5 }
                                        />
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