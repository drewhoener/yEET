import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import { Create, House, RateReview, Send } from '@material-ui/icons';
import React from 'react';
import CollapseNavItem from './CollapseNavItem';
import RoutedListItem from './RoutedListItem';

const useStyles = makeStyles(theme => ({
    drawerSubLink: {
        paddingLeft: theme.spacing(4)
    },
}));

const drawerItems = {
    'Home': {
        path: '/home',
        icon: (<House/>)
    },
    'My Reviews': {
        path: '/my-reviews',
        icon: (<RateReview/>)
    },
    'Request Review': {
        path: '/request',
        icon: (<Send/>)
    },
    'Write Review': {
        path: '/write',
        icon: (<Create/>),
        notify: 1,
        children: [
            {
                path: '/accept',
                name: 'Accept/Complete Requests'
            },
            {
                path: '/completed',
                name: 'Completed Requests'
            }
        ]
    }
};

const DrawerNavigation = ({ closeDrawer, children }) => {

    const classes = useStyles();

    return (
        <List>
            {
                Object.entries(drawerItems).map(([key, value]) => {
                    if (value.children) {
                        return (
                            <CollapseNavItem
                                key={ key.toLowerCase().replace(' ', '_') }
                                basePath={ value.path }
                                name={ key }
                                icon={ React.cloneElement(value.icon) }
                            >
                                {
                                    value.children.map(item => (
                                        <RoutedListItem
                                            key={ item.name.toLowerCase().replace(' ', '_') }
                                            primary={ item.name }
                                            to={ `${ value.path }${ item.path }` }
                                            notify={ 0 }
                                            onClick={ closeDrawer }
                                            headerText={ false }
                                            headerProps={ {
                                                className: classes.drawerSubLink
                                            } }
                                        />
                                    ))
                                }
                            </CollapseNavItem>
                        );
                    }
                    return (
                        <RoutedListItem
                            key={ key.toLowerCase().replace(' ', '_') }
                            icon={ React.cloneElement(value.icon) }
                            primary={ key }
                            to={ value.path }
                            notify={ value.notify ? value.notify : 0 }
                            onClick={ closeDrawer }
                        />
                    );
                })
            }
            { children }
        </List>
    );
};

export default DrawerNavigation;