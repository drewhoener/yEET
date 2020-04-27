import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyle = makeStyles(theme => ({
    elevatedMenu: {
        zIndex: 300
    }
}));

const RequestFilteredMenu = (props, ref) => {
    const classes = useStyle();
    const { open, closeWindow } = props;

    const onKeyDown = (event) => {
        if (event.key === 'Tab') {
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
                            <Paper>
                                <ClickAwayListener onClickAway={ closeWindow }>
                                    <MenuList
                                        autoFocusItem={ open }
                                        id='employee-list-filters'
                                        onKeyDown={ onKeyDown }
                                    >
                                        <MenuItem onClick={ closeWindow }>Show Selected</MenuItem>
                                        <MenuItem onClick={ closeWindow }>Show Pending</MenuItem>
                                        <MenuItem onClick={ closeWindow }>Show In Progress</MenuItem>
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

export default React.forwardRef(RequestFilteredMenu);