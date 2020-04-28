import { Checkbox, ListItemIcon, ListItemText } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { List } from 'react-virtualized';
import { toggleEmployeeSelect, updateShownEntries } from '../state/selector/RequestSelector';
import { colorButtonTheme } from '../util';
import ThemedStatusButton from './requestbutton/ThemedStatusButton';

const useStyle = makeStyles(() => ({
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
        requestStates,
        selectEmployee,
        updateShownEntries,
        ...rest
    }) {

    const classes = useStyle();

    React.useEffect(() => {
        updateShownEntries();
    }, [updateShownEntries, selectedEmployees, requestStates]);

    const SecondaryActionWrapper = ({ ...props }) => <ListItemSecondaryAction { ...props }/>;
    SecondaryActionWrapper.muiName = ListItemSecondaryAction.muiName;

    const rowRenderer = React.useCallback(
        ({
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
            const requestState = requestStates[employee._id.toString()];
            const hasRequest = !!requestState;
            const isChecked = selectedEmployees.some(item => employee._id.toString() === item) && !hasRequest;

            return (
                <div key={ key } style={ style }>
                    <ListItem
                        disabled={ hasRequest }
                        ContainerComponent='div'
                        role={ 'button' }
                        disableRipple
                        button
                        onClick={ selectEmployee(employee._id.toString()) }
                        aria-label={ `${ employee.fullName } ${ employee.position }, click to ${ !isChecked ? 'select' : 'deselect' }.` }
                    >
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={ isChecked }
                                disabled={ hasRequest }
                                tabIndex={ -1 }
                                disableRipple
                                inputProps={ { 'aria-labelledby': 'Add or Remove from Review Request' } }
                                color='primary'
                            />
                        </ListItemIcon>
                        <ListItemText primary={ employee.fullName }
                                      secondary={ `${ employee.position }` }
                        />
                        <ListItemSecondaryAction>
                            <ThemedStatusButton
                                type={ hasRequest ? requestState.statusName : '' }
                                employeeObjId={ employee._id }
                                employeeName={ employee.fullName }
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </div>
            );
        }, [employees, filteredEmployees, selectedEmployees, requestStates, selectEmployee]);

    return (
        <ThemeProvider theme={ colorButtonTheme }>
            <List
                className={ classes.smallScrollbar }
                width={ width }
                height={ height }
                rowCount={ filteredEmployees.length * 2 }
                rowHeight={ ({ index }) => index % 2 === 1 ? 1 : 72 }
                rowRenderer={ rowRenderer }
                overscanRowCount={ 5 }
                aria-label={ `employee list, ${ filteredEmployees.length } shown` }
                { ...rest }
            />
        </ThemeProvider>
    );
}

const mapStateToProps = state => ({
    employees: state.requests.employees,
    filteredEmployees: state.requests.filteredEmployees,
    selectedEmployees: state.requests.selectedEmployees,
    requestStates: state.requests.requestStates.byKey,
});

const mapDispatchToProps = (dispatch) => ({
    selectEmployee: idx => () => dispatch(toggleEmployeeSelect(idx)),
    updateShownEntries: () => dispatch(updateShownEntries()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeList);