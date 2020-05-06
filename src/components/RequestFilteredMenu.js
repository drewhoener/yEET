import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { connect } from 'react-redux';
import { StatusFilter } from '../state/action/RequestActions';
import { toggleStatusFilterOption } from '../state/selector/RequestSelector';

const useStyle = makeStyles(() => ({
    elevatedMenu: {
        zIndex: 300
    },
    menuPaper: {
        display: 'flex',
        flexDirection: 'column'
    },
    expandedText: {
        flex: 1
    },
    menuFlexItem: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        flex: 1
    }
}));

const RequestFilteredMenu = (props, ref) => {
    const classes = useStyle();
    const { open, closeWindow, hasFilterStatusOption, toggleOption } = props;

    const sliderOptions = React.useMemo(() => [
        {
            text: 'Show Selected',
            option: StatusFilter.SHOW_SELECTED
        },
        {
            text: 'Show Pending',
            option: StatusFilter.SHOW_PENDING
        },
        {
            text: 'Show In Progress',
            option: StatusFilter.SHOW_PROGRESS
        },
        {
            text: 'Show Unselected',
            option: StatusFilter.SHOW_UNSELECTED
        },
    ], []);

    const toggleStatusOption = React.useCallback((statusOption) => () => {
        toggleOption(statusOption, !hasFilterStatusOption(statusOption));
    }, [toggleOption, hasFilterStatusOption]);

    const onKeyDown = (event) => {
        if (event.key === 'Tab' || event.key === 'Escape') {
            event.preventDefault();
            closeWindow();
        }
    };

    return (
        <div className={ classes.elevatedMenu }>
            <Popper
                placement='bottom'
                disablePortal
                transition
                open={ open }
                anchorEl={ ref.current }
                role={ undefined }
                modifiers={ {
                    flip: {
                        enabled: true,
                    },
                    preventOverflow: {
                        enabled: true,
                        boundariesElement: 'scrollParent',
                    }
                } }
            >
                {
                    ({ TransitionProps, placement }) => (
                        <Grow
                            { ...TransitionProps }
                            style={ { transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' } }
                        >
                            <Paper className={ classes.menuPaper }>
                                <ClickAwayListener onClickAway={ closeWindow }>
                                    <MenuList
                                        autoFocusItem={ open }
                                        id='employee-list-filters'
                                        onKeyDown={ onKeyDown }
                                    >
                                        {
                                            sliderOptions.map(item => {
                                                return (
                                                    <MenuItem key={ `MenuItem_${ item.option }` }
                                                              onClick={ toggleStatusOption(item.option) }>
                                                        <div className={ classes.menuFlexItem }>
                                                            <Typography
                                                                className={ classes.expandedText }
                                                            >
                                                                { item.text }
                                                            </Typography>
                                                            <Switch checked={ hasFilterStatusOption(item.option) }/>
                                                        </div>
                                                    </MenuItem>
                                                );
                                            })
                                        }
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )
                }
            </Popper>
        </div>
    );
};

const mapStateToProps = state => ({
    hasFilterStatusOption: (status) => state.requests.filter.options.some(item => item === status)
});

const mapDispatchToProps = (dispatch) => ({
    toggleOption: (option, toggleStatus) => dispatch(toggleStatusFilterOption(option, toggleStatus))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    undefined,
    {
        forwardRef: true
    }
)(React.forwardRef(RequestFilteredMenu));