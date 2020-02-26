import React from 'react';
import PropTypes from 'prop-types';
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import {CssBaseline} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import makeStyles from "@material-ui/core/styles/makeStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import List from "@material-ui/core/List";
import {AccountBox, AccountCircle, RateReview} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import RoutedListItem from "./RoutedListItem";

const drawerWidth = 240;
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
        //At every breakpoint from small up set the width to be an offset from the always-open drawer
        [theme.breakpoints.up('sm')]: {
            //width: `calc(100% - ${drawerWidth}px)`,
            //marginLeft: drawerWidth,
            zIndex: theme.zIndex.drawer + 1
        }
    },
    title: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2),
        //Don't display the menu button if we're not actually allowing the drawer to be collapsed
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    }
}));

function ElevationScroll(props) {
    const {children, window} = props;
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

function ResponsiveNav(props) {
    const {container} = props;
    const classes = useStyles();
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const onDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawerItems = {
        'My Reviews': {
            path: '/my-reviews',
            icon: (<RateReview/>)
        },
        'My Account': {
            path: '/account',
            icon: (<AccountBox/>)

        }
    };

    const drawer = (
        <div>
            {/*<div className={classes.toolbar} />*/}
            <Toolbar/>
            <Divider/>
            <List>
                {
                    Object.entries(drawerItems).map(([key, value]) => (
                        <RoutedListItem
                            key={key.toLowerCase().replace(' ', '_')}
                            icon={React.cloneElement(value.icon)}
                            primary={key}
                            to={value.path}
                        />
                    ))
                }
            </List>
        </div>
    );

    return (
        <React.Fragment>
            <CssBaseline/>
            <ElevationScroll {...props}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Open Menu Drawer"
                            edge="start"
                            className={classes.menuButton}
                            onClick={onDrawerToggle}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant={"h4"} className={classes.title}>yEET</Typography>
                        <Button
                            variant="contained"
                            aria-label="Login Menu"
                            edge="start"
                            startIcon={<AccountCircle/>}
                        >
                            Login
                        </Button>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <nav className={classes.drawer} aria-label="review navigation menu">
                {/*This drawer will not exist on screens greater than xs*/}
                <Hidden smUp implementation='css'>
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={drawerOpen}
                        onClose={onDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        ModalProps={{
                            keepMounted: true //Apparently this performs better on mobile
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                {/*This drawer will not be visible on screens greater than XS. Permanent drawer*/}
                <Hidden xsDown implementation='css'>
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        variant='permanent'
                        PaperProps={{
                            elevation: 0
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
        </React.Fragment>
    )
}

export default ResponsiveNav;