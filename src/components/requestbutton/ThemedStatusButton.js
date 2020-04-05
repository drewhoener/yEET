import React from 'react';
import RequestStatusButton from './RequestStatusButton';
import PendingStatusButton from './PendingStatusButton';
import AcceptedStatusButton from './AcceptedStatusButton';

export default function ThemedStatusButton({ type, ...rest }) {

    const ButtonComponent = type === 'Pending' ?
        PendingStatusButton : type === 'Accepted' ?
            AcceptedStatusButton : RequestStatusButton;

    return (
        <ButtonComponent { ...rest } />
    );
}