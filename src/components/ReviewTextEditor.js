import React from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import MUIRichTextEditor from 'mui-rte';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexGrow: '1',
        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(1.5),
        },
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(3)
        }
    },
    toolbar: theme.mixins.toolbar,
}));

// I stole this from React Router.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function ReviewTextEditor() {
    const classes = useStyle();
    const query = useQuery();
    const requestId = query.get('requestId');
    console.log(requestId);

    return (
        <>
            <div className={ classes.toolbar }/>
            <div className={ classes.root }>
                <MUIRichTextEditor label="Start typing..."/>
            </div>
        </>
    );
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReviewTextEditor);