import React from 'react';
import { useSlate } from 'slate-react';
import { Transforms } from 'slate';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { isBlockActive } from './editorutils';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

/**
 * Mostly taken from slate's docs, I'll improve this as I learn more about how slate actually works
 * */
export const BlockTypes = [
    'numbered-list',
    'bulleted-list'
];

const useStyle = makeStyles(theme => ({
    coloredToggleButton: {
        color: 'rgba(0, 0, 0, 0.87)'
    }
}));

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format);
    const isList = BlockTypes.includes(format);

    // noinspection JSUnresolvedVariable
    Transforms.unwrapNodes(editor, {
        match: n => BlockTypes.includes(n.type),
        split: true,
    });

    // noinspection JSCheckFunctionSignatures
    Transforms.setNodes(editor, {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    });

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

export function BlockTextButton({ format, className = '', text, onClick, grouped = true }) {
    const editor = useSlate();
    const classes = useStyle();

    return (
        <ToggleButton
            className={
                clsx([
                    grouped ? 'MuiToggleButtonGroup-grouped' : '',
                    className,
                    classes.coloredToggleButton
                ])
            }
            size='small'
            value={ format }
            selected={ isBlockActive(editor, format) }
            onClick={ () => {
                toggleBlock(editor, format);
                if (onClick) {
                    onClick();
                }
            } }>
            <span><strong>{ text }</strong></span>
        </ToggleButton>
    );
}

export function BlockButton({ format, className = '', IconComponent, iconProps = {}, onClick, grouped = true }) {

    const editor = useSlate();
    const classes = useStyle();

    return (
        <ToggleButton
            className={
                clsx([
                    grouped ? 'MuiToggleButtonGroup-grouped' : '',
                    className,
                    classes.coloredToggleButton
                ])
            }
            size='small'
            value={ format }
            selected={ isBlockActive(editor, format) }
            onMouseDown={ (e) => e.preventDefault() }
            onClick={ () => {
                toggleBlock(editor, format);
                if (onClick) {
                    onClick();
                }
            } }>
            <IconComponent { ...iconProps } />
        </ToggleButton>
    );
}