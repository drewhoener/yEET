import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import CollapseNavLink from './CollapseNavLink';

const CollapseNavItem = ({ children, basePath, icon, name }, ref) => {

    const history = useHistory();
    const { pathname } = history.location;
    const [open, setOpen] = React.useState(pathname.toLowerCase().startsWith(basePath.toLowerCase()));
    const toggleOpen = () => {
        setOpen(prev => !prev);
    };

    return (
        <>
            <ListItem button onClick={ toggleOpen } ref={ ref }>
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