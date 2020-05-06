import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import CollapseNavLink from './CollapseNavLink';

const CollapseNavItem = ({ children, basePath, icon, name }, ref) => {

    const history = useHistory();
    const { pathname } = history.location;

    const matchesPath = React.useCallback(() => {
        return pathname.toLowerCase().startsWith(basePath.toLowerCase());
    }, [basePath, pathname]);

    const [open, setOpen] = React.useState(matchesPath());
    const toggleOpen = () => {
        setOpen(prev => !prev);
    };

    return (
        <>
            <ListItem button onClick={ toggleOpen } ref={ ref } selected={ !open && matchesPath() }>
                <ListItemIcon>{ icon }</ListItemIcon>
                <ListItemText primary={ name }/>
            </ListItem>
            <CollapseNavLink open={ open } ref={ ref }>
                { children }
            </CollapseNavLink>
        </>
    );
};

export default React.forwardRef(CollapseNavItem);