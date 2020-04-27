import { CssBaseline } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { Create, ExitToApp, House, RateReview, Send } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import axios from 'axios';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import logo from '../img/logo.png';
import { resetRequestState } from '../state/selector/RequestSelector';
import CollapseNavItem from './navlink/CollapseNavItem';
import RoutedListItem from './navlink/RoutedListItem';

const drawerWidth = 250;
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0
        }
    },
    appBar: {
        // At every breakpoint from small up set the width to be an offset from the always-open drawer
        [theme.breakpoints.up('sm')]: {
            // width: `calc(100% - ${drawerWidth}px)`,
            // marginLeft: drawerWidth,
            zIndex: theme.zIndex.drawer + 1
        }
    },
    spacer: {
        flexGrow: 1,
        flex: '1 0 auto',
        [theme.breakpoints.down('xs')]: {
            width: '14vw',
        },
    },
    hiddenSpacer: {
        flex: '1 1 auto',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    logo: {
        display: 'flex',
        minWidth: 0
    },
    logoImage: {
        maxWidth: '56px',
        maxHeight: '56px',
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: theme.status.logout,
        borderColor: theme.status.logout,
        // Don't display the menu button if we're not actually allowing the drawer to be collapsed
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    drawerSubLink: {
        paddingLeft: theme.spacing(4)
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    whiteButton: {
        color: theme.status.logout,
        borderColor: theme.status.logout
    },
    userName: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    largeAvatar: {
        width: theme.spacing(9),
        height: theme.spacing(9),
        marginBottom: theme.spacing(0.75)
    }
}));

function ElevationScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined
    });

    return React.cloneElement(children, {
        elevation: trigger ? 5 : 2
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func
};

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
                path: '/accept-pending',
                name: 'Accept Requests'
            },
            {
                path: '/write-request',
                name: 'Complete Requests'
            },
            {
                path: '/completed',
                name: 'Completed'
            }
        ]
    }
};

function ResponsiveNav({ container, resetRequestState, ...rest }) {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [userName, setUserName] = React.useState('');

    const onDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const closeDrawer = React.useCallback(() => {
        setDrawerOpen(false);

    }, [setDrawerOpen]);

    React.useEffect(() => {
        axios.get('/api/whoami')
            .then(({ data }) => {
                if (!data) {
                    setUserName('');
                }
                setUserName(data.fullName || '');
            });
    }, []);

    const onLogout = React.useCallback(() => {
        axios.post('/api/auth/logout')
            .then().catch().then(() => {
            history.push({ pathname: '/login' });
            resetRequestState();
        });
    }, [history, resetRequestState]);

    const drawer = React.useMemo(() => {
            return (
                <div>
                    {/* <div className={classes.toolbar} />*/ }
                    <div className={ classes.toolbar }>
                        <div className={ classes.userName }>
                            <Avatar className={ classes.largeAvatar }/>
                            {
                                (userName.length > 0) &&
                                <Typography align='center' variant='h5'>{ userName }</Typography>
                            }
                        </div>
                    </div>
                    <Divider/>
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
                        <Hidden smUp>
                            <ListItem button onClick={ onLogout }>
                                <ListItemIcon><ExitToApp/></ListItemIcon>
                                <ListItemText primary="Logout"/>
                            </ListItem>
                        </Hidden>
                    </List>
                </div>
            );
        },
        [classes.toolbar, classes.userName, classes.largeAvatar, onLogout, closeDrawer, userName]
    );

    return (
        <React.Fragment>
            <CssBaseline/>
            <ElevationScroll { ...rest }>
                <AppBar className={ classes.appBar }>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Open Menu Drawer"
                            edge="start"
                            className={ classes.menuButton }
                            onClick={ onDrawerToggle }
                        >
                            <MenuIcon/>
                        </IconButton>
                        <div className={ classes.hiddenSpacer }/>
                        <div className={ classes.logo }>
                            <img className={ classes.logoImage } src={ logo } alt='Yeet Logo'/>
                        </div>
                        {
                            // TODO Make this integrate better with the whole UI}
                        }
                        <div className={ classes.spacer }/>
                        <Hidden xsDown>
                            <Button
                                className={ classes.whiteButton }
                                variant='outlined'
                                color='default'
                                aria-label='Logout'
                                endIcon={ <ExitToApp/> }
                                onClick={ onLogout }
                            >
                                Logout
                            </Button>
                        </Hidden>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <nav className={ classes.drawer } aria-label="review navigation menu">
                {/* This drawer will not exist on screens greater than xs*/ }
                <Hidden smUp implementation='css'>
                    <Drawer
                        container={ container }
                        variant="temporary"
                        anchor={ theme.direction === 'rtl' ? 'right' : 'left' }
                        open={ drawerOpen }
                        onClose={ onDrawerToggle }
                        classes={ {
                            paper: classes.drawerPaper
                        } }
                        ModalProps={ {
                            // Apparently this performs better on mobile
                            keepMounted: true
                        } }
                    >
                        { drawer }
                    </Drawer>
                </Hidden>
                {/* This drawer will not be visible on screens greater than XS. Permanent drawer*/ }
                <Hidden xsDown implementation='css'>
                    <Drawer
                        classes={ {
                            paper: classes.drawerPaper
                        } }
                        variant='permanent'
                        PaperProps={ {
                            elevation: 0
                        } }
                        open
                    >
                        <div className={ classes.toolbar }/>
                        { drawer }
                    </Drawer>
                </Hidden>
            </nav>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    resetRequestState: () => dispatch(resetRequestState()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResponsiveNav);