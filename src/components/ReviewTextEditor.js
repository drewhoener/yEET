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
import React, { useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';
import { BlockButton, BlockTextButton } from './editor/BlockButton';
import { EditorElement, EditorLeaf } from './editor/EditorRenderer';
import { serializeNodes } from './editor/EditorSerializer';
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
        paddingLeft: theme.spacing(1.5)
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

const serializeEditor = baseNode => {
    return serializeNodes({
        children: baseNode
    });
};

function ReviewTextEditor(props) {
    const classes = useStyle();
    const history = useHistory();
    const [dangerous, setDangerous] = useState('<div>');
    const [stateData, setStateData] = useState({});
    const [editorState, setEditorState] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogState, setDialogState] = useState('success');
    const renderElement = useCallback(props => <EditorElement classes={ classes } { ...props } />, [classes]);
    const renderLeaf = useCallback(props => <EditorLeaf classes={ classes } { ...props } />, [classes]);
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { requestId } = props.match.params;
    React.useEffect(() => {
        axios.get('/api/editor-data',
            {
                params: {
                    requestId
                }
            })
            .then(({ data }) => {
                if (!data.userData || !data.requestingData || !data.request) {
                    return;
                }
                console.log(data);
                setEditorState(initialEditorState(
                    `${ data.requestingData.firstName } ${ data.requestingData.lastName }`,
                    `${ data.userData.firstName } ${ data.userData.lastName }`)
                );
                setStateData({ ...data });
            })
            .catch(err => {
                console.error(err);
            });
    }, [requestId]);

    const closeAndRedirect = () => {
        setDialogOpen(false);
        if (dialogState === 'success') {
            history.replace('/write');
        }
    };

    const onSaveDraft = () => {
        setDangerous(serializeNodes({
            children: editorState
        }));
        console.log(dangerous);
    };

    const onChange = (state) => {
        setEditorState(state);
    };

    const submitReview = () => {
        axios.post('/api/submit-review', {
            requestId,
            content: JSON.stringify(editorState),
            serialized: serializeEditor(editorState),
        }).then(response => {
            console.log(response);
        }).catch(err => {
            console.error(err);
            setDialogState('failure');
        }).then(() => {
            setDialogOpen(true);
        });
    };

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
                                            onClick={ () => onSaveDraft() }
                                            startIcon={ <Save/> }>
                                        Save Draft
                                    </Button>
                                </div>
                                <div className={ classes.spacedButtonGroup }>
                                    <Button size='small' className={ classes.saveButton } variant='outlined'
                                            onClick={ () => submitReview() }
                                            startIcon={ <Send/> }>
                                        { `Submit${ smallScreen ? '' : ' Review' }` }
                                    </Button>
                                </div>
                            </div>
                        </Toolbar>
                    </Paper>
                    <Paper square className={ classes.paddedEditor }>
                        <Editable
                            renderElement={ renderElement }
                            renderLeaf={ renderLeaf }
                        />
                    </Paper>
                </Slate>
                <div dangerouslySetInnerHTML={ { __html: dangerous } }/>
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