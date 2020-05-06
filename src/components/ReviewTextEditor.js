import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Toolbar,
    useMediaQuery
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
    Code,
    FormatBold,
    FormatItalic,
    FormatListBulleted,
    FormatListNumbered,
    FormatQuote,
    FormatUnderlined,
    Save,
    Send
} from '@material-ui/icons';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';
import { pushErrorMessage } from '../state/selector/RequestSelector';
import { BlockButton, BlockTextButton } from './editor/BlockButton';
import { EditorElement, EditorLeaf } from './editor/EditorRenderer';
import { countCharacters } from './editor/EditorSerializer';
import FormattingType from './editor/FormattingType';
import { MarkdownButton } from './editor/MarkdownButton';

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexGrow: '1',
        flexDirection: 'column',
        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(1.5),
        },
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(3)
        }
    },
    toolbar: theme.mixins.toolbar,
    editorToolbar: {
        paddingLeft: theme.spacing(0.75),
        display: 'flex',
        flexWrap: 'wrap'
    },
    spacedButtonGroup: {
        paddingLeft: theme.spacing(0.75),
        paddingRight: theme.spacing(0.75),
        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(0.5),
            paddingBottom: theme.spacing(0.5),
        }
    },
    codeFormatIcon: {
        paddingLeft: theme.spacing(0.125),
        paddingRight: theme.spacing(0.125),
    },
    paddedEditor: {
        paddingLeft: theme.spacing(1.5),
        position: 'relative',
        display: 'flex',
        paddingBottom: theme.spacing(2),
        '&>div[role="textbox"]': {
            flex: 1,
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            msWordBreak: 'break-all',
            msHyphens: 'auto',
            MozHyphens: 'auto',
            WebkitHyphens: 'auto',
            hyphens: 'auto',
        }
    },
    editorOverlay: {
        display: 'flex',
        position: 'absolute',
        flex: '1 0 auto',
        top: 0,
        left: 0,
        minWidth: '100%',
        minHeight: '100%',
        zIndex: 100,
        pointerEvents: 'none',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    wordCount: {
        marginRight: theme.spacing(2)
    },
    draftSaved: {
        marginLeft: theme.spacing(1.5),
        marginRight: theme.spacing(2),
    },
    spacer: {
        flex: '1 0 auto'
    },
    editorBase: {
        flexGrow: 1,
        color: 'green'
    },
    quote: {
        borderLeft: '2px solid #ddd',
        marginLeft: 0,
        marginRight: 0,
        paddingLeft: '10px',
        color: '#aaa',
        fontStyle: 'italic',
    },
    code: {
        fontFamily: 'monospace',
        fontSize: '1.25rem',
        backgroundColor: ' #eee',
        padding: theme.spacing(0.25),
    },
    saveButton: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    saveSubmitGroup: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
    }
}));

const initialEditorState = (person, reviewer) => [
    {
        type: FormattingType.H1,
        children: [
            { text: `Review for: ${ person }` }
        ]
    },
    {
        type: FormattingType.H2,
        children: [
            { text: `Reviewer: ${ reviewer }` }
        ]
    },
    {
        type: FormattingType.PARAGRAPH,
        children: [
            { text: '*Write your review here*' }
        ]
    }

];

const CHAR_MAX = 10000;

function ReviewTextEditor({ pushError, ...props }) {
    const classes = useStyle();
    const history = useHistory();
    const [saveOnUnmount, setSaveOnUnmount] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [draftSaveTime, setDraftSaveTime] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [editorState, setEditorState] = useState([
        {
            type: FormattingType.PARAGRAPH,
            children: [{ text: '' }]
        }
    ]);
    const [charCount, setCharCount] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogState, setDialogState] = useState('success');
    const renderElement = useCallback(props => <EditorElement classes={ classes } { ...props } />, [classes]);
    const renderLeaf = useCallback(props => <EditorLeaf classes={ classes } { ...props } />, [classes]);
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { requestId } = props.match.params;

    const closeAndRedirect = React.useCallback(() => {
        setDialogOpen(false);
        if (dialogState === 'success') {
            history.replace('/write/accept');
        }
    }, [dialogState, history]);

    React.useEffect(() => {
        axios.get('/api/editor/editor-data',
            {
                params: {
                    requestId
                }
            })
            .then(({ data }) => {
                if (!data.userData || !data.requestingData || !data.request) {
                    return;
                }
                // console.log(data);
                if (data.contents) {
                    const jsonData = JSON.parse(data.contents);
                    if (!jsonData.children || !Array.isArray(jsonData.children)) {
                        return;
                    }
                    setEditorState(jsonData.children);
                    return;
                }
                setEditorState(initialEditorState(
                    `${ data.requestingData.firstName } ${ data.requestingData.lastName }`,
                    `${ data.userData.firstName } ${ data.userData.lastName }`)
                );
            })
            .catch(err => {
                console.error(err);
                closeAndRedirect();
            });
    }, [requestId, closeAndRedirect]);

    const onChange = (state) => {
        const chars = countCharacters({
            children: state
        });
        if (chars > CHAR_MAX) {
            const diff = chars - CHAR_MAX;
            if (diff === 1) {
                editor.undo();
                return;
            }
            while (countCharacters({ children: editor.children }) > CHAR_MAX) {
                editor.deleteBackward('word');
            }
            // noinspection JSCheckFunctionSignatures
            setEditorState(editor.children);
            return;
        }
        setCharCount(chars);
        setEditorState(state);
    };

    const prepareSave = React.useCallback((submitReview, editorState) => {
        return axios.post('/api/editor/save-review',
            {
                requestId,
                content: JSON.stringify({
                    children: editorState
                }),
                submit: submitReview
            },
            {
                timeout: 10000
            }
        );
    }, [requestId]);

    const onSaveDraft = React.useCallback(() => {
        if (isSaving) {
            // console.log('Stopping save procedure because we\'re saving');
            return;
        }
        // console.log('Setting save var for draft');
        setIsSaving(true);
        prepareSave(false, editorState)
            .then(response => {
                console.log(response);
                setDraftSaveTime(moment());
            })
            .catch(err => {
                console.error(err);
            })
            .then(() => {
                setIsSaving(false);
            });
    }, [editorState, prepareSave, isSaving]);

    const submitReview = () => {
        if (isSaving) {
            // console.log('Stopping submit procedure because we\'re saving');
            return;
        }
        // console.log('Setting save var for review');
        setIsSaving(true);
        prepareSave(true, editorState)
            .then(response => {
                setSaveOnUnmount(false);
                // console.log(response);
            })
            .catch(err => {
                console.error(err);
                setSaveOnUnmount(true);
                setDialogState('failure');
            })
            .then(() => {
                setSaveOnUnmount(false);
                // console.log(`Save on Unmount is ${ saveOnUnmount }`);
                setIsSaving(false);
                setDialogOpen(true);
            });
    };

    React.useEffect(() => {
        return () => {
            if (saveOnUnmount) {
                // console.log('Set Saving Draft');
                prepareSave(false, editor.children)
                    .then(response => {
                        // console.log(response);
                        if (response.status === 201) {
                            pushError('success', 'Review Sent!');
                            return;
                        }
                        pushError('success', 'Draft Saved!');
                    })
                    .catch(err => {
                        console.error(err);
                        pushError('error', 'Failed to save draft!');
                    });
            }
        };
    }, [editor, prepareSave, pushError, saveOnUnmount]);

    return (
        <>
            <Dialog open={ dialogOpen } onClose={ closeAndRedirect }>
                <DialogTitle>
                    { dialogState === 'success' ?
                        'Your request has been submitted' :
                        'Failed to submit your request!'
                    }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        { dialogState === 'success' ?
                            'Close this dialog to be redirected to the write review page' :
                            'Try again or save a draft and come back later'
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ closeAndRedirect } color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <div className={ classes.toolbar }/>
            <div className={ classes.root }>
                <Slate editor={ editor } value={ editorState } onChange={ newState => onChange(newState) }>
                    <Paper square>
                        <Toolbar className={ classes.editorToolbar }>
                            <ToggleButtonGroup className={ classes.spacedButtonGroup }>
                                <MarkdownButton format={ FormattingType.BOLD } IconComponent={ FormatBold }/>
                                <MarkdownButton format={ FormattingType.ITALIC } IconComponent={ FormatItalic }/>
                                <MarkdownButton format={ FormattingType.UNDERLINE } IconComponent={ FormatUnderlined }/>
                            </ToggleButtonGroup>
                            <ToggleButtonGroup className={ classes.spacedButtonGroup }>
                                <MarkdownButton iconProps={ { className: classes.codeFormatIcon } }
                                                format={ FormattingType.CODE } IconComponent={ Code }/>
                                <BlockButton format={ FormattingType.BLOCK_QUOTE } IconComponent={ FormatQuote }/>
                            </ToggleButtonGroup>
                            <ToggleButtonGroup className={ classes.spacedButtonGroup }>
                                <BlockTextButton format={ FormattingType.H1 } text={ 'H1' }/>
                                <BlockTextButton format={ FormattingType.H2 } text={ 'H2' }/>
                            </ToggleButtonGroup>
                            <ToggleButtonGroup className={ classes.spacedButtonGroup }>
                                <BlockButton format={ FormattingType.NUMBERED_LIST }
                                             IconComponent={ FormatListNumbered }/>
                                <BlockButton format={ FormattingType.BULLETED_LIST }
                                             IconComponent={ FormatListBulleted }/>
                            </ToggleButtonGroup>
                            <div className={ classes.saveSubmitGroup }>
                                <div className={ classes.spacedButtonGroup }>
                                    <Button size='small' className={ classes.saveButton } variant='outlined'
                                            onClick={ onSaveDraft }
                                            startIcon={ <Save/> }>
                                        Save Draft
                                    </Button>
                                </div>
                                <div className={ classes.spacedButtonGroup }>
                                    <Button size='small' className={ classes.saveButton } variant='outlined'
                                            onClick={ submitReview }
                                            startIcon={ <Send/> }>
                                        { `Submit${ smallScreen ? '' : ' Review' }` }
                                    </Button>
                                </div>
                            </div>
                        </Toolbar>
                    </Paper>
                    <Paper square className={ classes.paddedEditor }>
                        <div className={ classes.editorOverlay }>
                            <div className={ classes.spacer }/>
                            <Typography variant='caption'>
                                {
                                    draftSaveTime &&
                                    `Draft Saved ${ draftSaveTime.calendar() }`
                                }
                            </Typography>
                            <Typography variant='caption' className={ classes.draftSaved }>
                                {
                                    draftSaveTime &&
                                    '|'
                                }
                            </Typography>
                            <Typography className={ classes.wordCount } variant='caption'>
                                { charCount } / 10000
                            </Typography>
                        </div>
                        <Editable
                            renderElement={ renderElement }
                            renderLeaf={ renderLeaf }
                        />
                    </Paper>
                </Slate>
            </div>
        </>
    );
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    pushError: (severity, message) => dispatch(pushErrorMessage(severity, message)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReviewTextEditor);