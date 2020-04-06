import React from 'react';
import { connect } from 'react-redux';
import MUIRichTextEditor from 'mui-rte';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';

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
    editorBase: {
        flexGrow: 1,
        color: 'green'
    }
}));

const editorThemeOptions = theme => {
    console.log(theme);
    return {
        overrides: {
            MUIRichTextEditor: {
                root: {
                    flexGrow: 1,
                    display: 'flex'
                },
                container: {
                    display: 'flex',
                    flexGrow: 1,
                    flexDirection: 'column',
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    transition: theme.transitions.create('box-shadow'),
                    border: `1px solid ${ theme.palette.divider }`
                },
                editor: {
                    display: 'flex',
                    flexGrow: 1,
                },
                editorContainer: {
                    flexGrow: 1
                }
            }
        }
    };
};

function ReviewTextEditor(props) {
    const classes = useStyle();

    const { requestId } = props.match.params;
    console.log(requestId);

    const onSave = (data) => {
        console.log(data);
    };

    const onChange = (state) => {
        console.log(state);
    };

    return (
        <>
            <div className={ classes.toolbar }/>
            <div className={ classes.root }>
                <ThemeProvider theme={ theme => ({ ...theme, ...editorThemeOptions(theme) }) }>
                    <MUIRichTextEditor
                        classes={ { container: classes.editor } }
                        onSave={ onSave }
                        onChange={ onChange }
                        label="Start typing..."
                    />
                </ThemeProvider>
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