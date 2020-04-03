import { List } from 'react-virtualized';
import React from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import { Checkbox, ListItemIcon, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectEmployee } from '../state/selector/RequestSelector';

const useStyle = makeStyles(theme => ({
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

function EmployeeList(
    {
        width,
        height,
        employees,
        filteredEmployees,
        selectedEmployees,
        selectEmployee,
        ...rest
    }) {

    const classes = useStyle();

    const rowRenderer = ({
                             // Unique key within array of rows
                             key,
                             // Index of row within collection
                             index,
                             // The List is currently being scrolled
                             isScrolling,
                             // This row is visible within the List (eg it is not an overscanned row)
                             isVisible,
                             // Style object to be applied to row (to position it)
                             style,
                         }) => {

        if (index % 2 === 1) {
            return (<Divider key={ key } style={ style }/>);
        }

        const employee = employees[filteredEmployees[Math.floor(index / 2)]];
        if (!employee) {
            return null;
        }

        return (
            <ListItem key={ key } style={ style } role={ undefined } button
                      onClick={ () => selectEmployee(employee.employeeId) }>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={ selectedEmployees.some(item => employee.employeeId === item) }
                        tabIndex={ -1 }
                        disableRipple
                        inputProps={ { 'aria-labelledby': 'Add or Remove from Review Request' } }
                    />
                </ListItemIcon>
                <ListItemText // className={ classes.listItem }
                    primary={ employee.fullName }
                    // primaryTypographyProps={ { className: classes.listItemText } }
                    secondary={ employee.position }/>
            </ListItem>
        );
    };


    return (
        <List
            className={ classes.smallScrollbar }
            width={ width }
            height={ height }
            rowCount={ filteredEmployees.length * 2 }
            rowHeight={ ({ index }) => index % 2 === 1 ? 1 : 65 }
            rowRenderer={ rowRenderer }
            overscanRowCount={ 5 }
            { ...rest }
        />
    );
}

const mapStateToProps = state => ({
    employees: state.requests.employees,
    filteredEmployees: state.requests.filteredEmployees,
    selectedEmployees: state.requests.selectedEmployees,
});

const mapDispatchToProps = (dispatch, getState) => ({
    selectEmployee: idx => dispatch(selectEmployee(idx)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeList);