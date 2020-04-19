import escapeHtml from 'escape-html';
import { Text } from 'slate';
import FormattingType from './FormattingType';

const serializeLeaves = (node) => {
    let serialized = escapeHtml(node.text);

    if (node.bold) {
        serialized = `<strong>${ serialized }</strong>`;
    }

    if (node.code) {
        serialized = `<code class='editor-code'>${ serialized }</code>`;
    }

    if (node.italic) {
        serialized = `<em>${ serialized }</em>`;
    }

    if (node.underline) {
        serialized = `<u>${ serialized }</u>`;
    }

    return `<span>${ serialized }</span>`;
};

export const serializeNodes = stateNode => {
    if (Text.isText(stateNode)) {
        return serializeLeaves(stateNode);
    }

    const children = stateNode.children.map(n => serializeNodes(n)).join('');

    switch (stateNode.type) {
        case FormattingType.BLOCK_QUOTE:
            return `<blockquote class='editor-quote'><p>${ children }</p></blockquote>`;
        case FormattingType.H1:
            return `<h1>${ children }</h1>`;
        case FormattingType.H2:
            return `<h2>${ children }</h2>`;
        case FormattingType.LIST_ITEM:
            return `<li>${ children }</li>`;
        case FormattingType.BULLETED_LIST:
            return `<ul>${ children }</ul>`;
        case FormattingType.NUMBERED_LIST:
            return `<ol>${ children }</ol>`;
        case FormattingType.PARAGRAPH:
            return `<p>${ children }</p>`;
        default:
            return children;
    }
};