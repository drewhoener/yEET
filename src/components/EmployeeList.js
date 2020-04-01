import { List } from 'react-virtualized';
import React from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import { Checkbox, ListItemIcon, ListItemText } from '@material-ui/core';

export default function EmployeeList({ employees, height, width, ...rest }) {

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

        const employee = employees[matchedEmployees[Math.floor(index / 2)]];
        if (!employee) {
            return null;
        }

        return (
            <ListItem key={ key } style={ style } role={ undefined } button
                      onClick={ onSelectItem(employee.employeeId) }>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={ selectedEmployees.some(item => employee.employeeId === item) }
                        tabIndex={ -1 }
                        disableRipple
                        inputProps={ { 'aria-labelledby': 'Add or Remove from Review Request' } }
                    />
                </ListItemIcon>
                <ListItemText className={ classes.listItem }
                              primary={ `${ employee.firstName } ${ employee.lastName }` }
                              primaryTypographyProps={ { className: classes.listItemText } }
                              secondary={ employee.position }/>
            </ListItem>
        );
    };


    return (
        <List
            className={ classes.smallScrollbar }
            width={ width }
            height={ height }
            rowCount={ matchedEmployees.length * 2 }
            rowHeight={ ({ index }) => index % 2 === 1 ? 1 : 65 }
            rowRenderer={ rowRenderer }
            overscanRowCount={ 5 }
        />
    );
}