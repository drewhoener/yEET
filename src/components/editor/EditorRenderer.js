import React from 'react';
import FormattingType from './FormattingType';

export const EditorElement = ({ classes, attributes, children, element }) => {
    // console.log(element);
    switch (element.type) {
        case FormattingType.BLOCK_QUOTE:
            return <blockquote className={ classes.quote } { ...attributes }>{ children }</blockquote>;
        case FormattingType.H1:
            return <h1 { ...attributes }>{ children }</h1>;
        case FormattingType.H2:
            return <h2 { ...attributes }>{ children }</h2>;
        case FormattingType.LIST_ITEM:
            return <li { ...attributes }>{ children }</li>;
        case FormattingType.BULLETED_LIST:
            return <ul { ...attributes }>{ children }</ul>;
        case FormattingType.NUMBERED_LIST:
            return <ol { ...attributes }>{ children }</ol>;
        default:
            return <p { ...attributes }>{ children }</p>;
    }
};

export const EditorLeaf = ({ classes, attributes, children, leaf }) => {
    // console.log(leaf);
    if (leaf.bold) {
        children = <strong>{ children }</strong>;
    }

    if (leaf.code) {
        children = <code className={ classes.code }>{ children }</code>;
    }

    if (leaf.italic) {
        children = <em>{ children }</em>;
    }

    if (leaf.underline) {
        children = <u>{ children }</u>;
    }

    return <span { ...attributes }>{ children }</span>;
};