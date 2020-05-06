import { Container, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../Loader';

const useStyles = makeStyles(theme => ({
    modalcontainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        position: 'absolute',
        overflow: 'auto',
        '&>div': {
            flex: 1,
            display: 'flex',
            paddingLeft: 0,
            paddingRight: 0,
            flexWrap: 'wrap',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // overflow : 'auto'

        }
    },
    modalpaper: {
        flex: 1,
        flexWrap: 'wrap',
        padding: 20,
    },
    modaltext: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'column',
    },
    modalbutton: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        top: 0
    },
    loader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}));

const ReviewModal = ({ open, onClose, data }) => {

    const classes = useStyles();

    return (
        <Modal open={ open } onClose={ onClose } className={ classes.modalcontainer }>
            <Container maxWidth='md'>
                <Paper elevation={ 4 } className={ classes.modalpaper }>
                    <div>
                        {
                            data === '<div/>' ?
                                <Loader className={ classes.loader } visible={ true }/> :
                                <>
                                    <div tabIndex={ -1 } className={ classes.modalbutton }>
                                        <Button onClick={ onClose }> Close </Button>
                                    </div>
                                    <div className={ classes.modaltext }>
                                        { ReactHtmlParser(data) }
                                    </div>
                                </>

                        }
                    </div>
                </Paper>
            </Container>
        </Modal>
    );
};

export default ReviewModal;