import React from 'react';
import TabbedReviewBar from "../components/TabbedReviewBar";
import {makeStyles} from "@material-ui/core/styles";

const useStyle = makeStyles(theme => ({
    inlineFlex: {
        display: 'inline-flex',
        flexDirection: 'column',
        minHeight: '100%'
    }
}));

export default function ReadReviewView(props) {
    const classes = useStyle();
    return (
        <div className={classes.inlineFlex}>
            <TabbedReviewBar/>
        </div>
    );
}