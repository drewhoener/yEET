import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { VariableSizeList } from 'react-window';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
        minHeight: '100%',
        backgroundColor: theme.palette.background.paper,
    }
}));

export default function VirtualizedList({ children }) {
    const classes = useStyles();
    console.log(children);

    return (
        <div className={ classes.root }>
            <VariableSizeList height={ 600 } itemSize={ (i) => 45 }>
                { children }
            </VariableSizeList>
        </div>
    );
}