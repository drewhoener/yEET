import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DummyView from "../views/DummyView";
import Divider from "@material-ui/core/Divider";

const useStyle = makeStyles(theme => ({
    root: {
        flex: '0 1 auto'
    },
    toolbar: theme.mixins.toolbar,
    wideTab: {
        minWidth: '50%'
    },
    constrained: {
        flexBasis: '0px',
        height: '85vh',
        flex: '1 1 auto',
        overflowY: 'auto',
        minHeight: '0px',
        '&::-webkit-scrollbar': {
            width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
        }
    }
}));

export default function TabbedReviewBar(props) {
    const classes = useStyle();
    const {children, ...rest} = props;
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newVal) => {
        setTabValue(newVal);
    };

    return (
        <React.Fragment>
            <Paper square variant='outlined' className={classes.root}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor='secondary'
                    textColor='inherit'
                    centered
                >
                    <Tab className={classes.wideTab} label='My Reviews'/>
                    <Tab className={classes.wideTab} label='Employee Reviews'/>
                </Tabs>
            </Paper>
            <Paper square variant='elevation' className={classes.constrained}>
                <Divider flexItem orientation='horizontal'/>
                <DummyView/>
            </Paper>
        </React.Fragment>
    );
}