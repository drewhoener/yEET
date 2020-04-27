import { Collapse, List } from '@material-ui/core';
import React from 'react';

const CollapseNavLink = (
    {
        open,
        component = 'div',
        children
    }, ref) => {

    return (
        <Collapse
            ref={ ref }
            in={ open }
            timeout='auto'
            unmountOnExit
        >
            <List component={ component } disablePadding>
                { children }
            </List>
        </Collapse>
    );

};

export default React.forwardRef(CollapseNavLink);