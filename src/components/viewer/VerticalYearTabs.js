import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
    },
    tabs: {
        borderRight: `1px solid ${ theme.palette.divider }`,
    },
}));

/**
 * It's late and learning is hard, this is from Material UI and I'm trying it out
 * */
function a11yProps(index) {
    return {
        id: `vertical-tab-${ index }`,
        'aria-controls': `vertical-tabpanel-${ index }`,
    };
}

function VerticalTab({ children, value, index, ...other }) {

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={ value !== index }
            id={ `vertical-tabpanel-${ index }` }
            aria-labelledby={ `vertical-tab-${ index }` }
            { ...other }
        >
            { value === index && <Box p={ 3 }>{ children }</Box> }
        </Typography>
    );
}

const VerticalYearTabs = () => {

    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={ classes.root }>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={ value }
                onChange={ handleChange }
                aria-label="Year Reviews"
                className={ classes.tabs }
            >
                <Tab label="Item One" { ...a11yProps(0) } />
                <Tab label="Item Two" { ...a11yProps(1) } />
                <Tab label="Item Three" { ...a11yProps(2) } />
                <Tab label="Item Four" { ...a11yProps(3) } />
                <Tab label="Item Five" { ...a11yProps(4) } />
                <Tab label="Item Six" { ...a11yProps(5) } />
                <Tab label="Item Seven" { ...a11yProps(6) } />
            </Tabs>
            <VerticalTab value={ value } index={ 0 }>
                Item One
            </VerticalTab>
            <VerticalTab value={ value } index={ 1 }>
                Item Two
            </VerticalTab>
            <VerticalTab value={ value } index={ 2 }>
                Item Three
            </VerticalTab>
            <VerticalTab value={ value } index={ 3 }>
                Item Four
            </VerticalTab>
            <VerticalTab value={ value } index={ 4 }>
                Item Five
            </VerticalTab>
            <VerticalTab value={ value } index={ 5 }>
                Item Six
            </VerticalTab>
            <VerticalTab value={ value } index={ 6 }>
                Item Seven
            </VerticalTab>
        </div>
    );
};

export default VerticalYearTabs;