import React from 'react';
import RequestStatusButton from './RequestStatusButton';
import PendingStatusButton from './PendingStatusButton';
import CompletedStatusButton from './CompletedStatusButton';

export default function ThemedStatusButton({ type, ...rest }) {

    const ButtonComponent = type === 'Pending' ?
        PendingStatusButton : type === 'Completed' ?
            CompletedStatusButton : RequestStatusButton;

    return (
        <ButtonComponent { ...rest } />
    );
}