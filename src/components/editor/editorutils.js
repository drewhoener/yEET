import { Editor } from 'slate';

export const isMarkdownActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

export const isBlockActive = (editor, format) => {
    // noinspection JSUnresolvedVariable
    const [match] = Editor.nodes(editor, {
        match: n => n.type === format,
    });

    return !!match;
};