import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';

const useStyle = makeStyles(theme => ({
    root: {
        flex: '0 1 auto',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        // position: '-webkit-sticky'
    },
    toolbar: theme.mixins.toolbar,
    wideTab: {
        minWidth: '50%'
    },
    constrained: {
        padding: theme.spacing(3),
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

export default function TabbedReviewBar({ children, ...rest }) {
    const classes = useStyle();
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newVal) => {
        setTabValue(newVal);
    };

    return (
        <React.Fragment>
            <div className={ classes.root }>
                <div className={ classes.toolbar }/>
                <Paper square variant='outlined'>
                    <Tabs
                        value={ tabValue }
                        onChange={ handleTabChange }
                        indicatorColor='secondary'
                        textColor='inherit'
                        centered
                    >
                        <Tab className={ classes.wideTab } label='My Reviews'/>
                        <Tab className={ classes.wideTab } label='Employee Reviews'/>
                    </Tabs>
                </Paper>
            </div>
            <Paper square variant='outlined' className={ classes.constrained }>
                <Divider flexItem orientation='horizontal'/>
                { children[tabValue] }
            </Paper>
        </React.Fragment>
    );
}