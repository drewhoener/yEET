import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import { Create, House, RateReview, Send } from '@material-ui/icons';
import { cloneDeep } from 'lodash';
import React from 'react';
import CollapseNavItem from './CollapseNavItem';
import RoutedListItem from './RoutedListItem';

const useStyles = makeStyles(theme => ({
    drawerSubLink: {
        paddingLeft: theme.spacing(4)
    },
}));

const subordinateReviewCapability = [
    {
        path: '/my-reviews',
        name: 'My Reviews'
    },
    {
        path: '/employee',
        name: 'My Employees\' Reviews',
        fuzzyMatch: true
    }
];

const drawerItemsBase = [
    {
        name: 'Home',
        path: '/home',
        icon: (<House/>)
    },
    {
        name: 'My Reviews',
        path: '/view/my-reviews',
        basePath: '/view',
        icon: (<RateReview/>),
    },
    {
        name: 'Request Review',
        path: '/request',
        icon: (<Send/>)
    },
    {
        name: 'Write Review',
        path: '/write',
        basePath: '/write',
        icon: (<Create/>),
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
];

const DrawerNavigation = ({ closeDrawer, capabilities, children }) => {

    const classes = useStyles();

    const drawerItems = React.useMemo(() => {
        const items = cloneDeep(drawerItemsBase);
        if (capabilities.isManager) {
            const myReviews = items.find(item => item.name === 'My Reviews');
            if (myReviews) {
                myReviews.children = cloneDeep(subordinateReviewCapability);
                myReviews.name = 'Read Reviews';
            }
        }
        return items;
    }, [capabilities]);

    return (
        <List>
            {
                drawerItems.map(({ name: key, ...value }) => {
                    if (value.children) {
                        return (
                            <CollapseNavItem
                                key={ key.toLowerCase().replace(' ', '_') }
                                basePath={ value.basePath }
                                name={ key }
                                icon={ React.cloneElement(value.icon) }
                            >
                                {
                                    value.children.map(item => (
                                        <RoutedListItem
                                            key={ item.name.toLowerCase().replace(' ', '_') }
                                            primary={ item.name }
                                            to={ `${ value.basePath }${ item.path }` }
                                            onClick={ closeDrawer }
                                            headerText={ false }
                                            headerProps={ {
                                                className: classes.drawerSubLink
                                            } }
                                            fuzzyMatch={ value.fuzzyMatch }
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