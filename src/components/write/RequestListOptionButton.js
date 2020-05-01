import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyle = makeStyles(theme => ({
    accept: {
        fontWeight: 400,
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    reject: {
        color: red.A700,
        borderColor: red.A700,
        fontWeight: 400,
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    write: {
        fontWeight: 400,
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    }
}));

const RequestListOptionButton = ({ status, request, handleAccept, handleReject, redirectToEditor }, ref) => {

    const classes = useStyle();

    return (
        <>
            {
                status === 0 &&
                <>
                    <Button ref={ ref } className={ classes.accept } color='primary' variant={ 'contained' }
                            aria-label={ `Accept pending request from ${ request.firstName } ${ request.lastName }` }
                            onClick={ () => handleAccept(request) } disableElevation>
                        Accept
                    </Button>
                    <Button ref={ ref } className={ classes.reject } variant={ 'outlined' }
                            aria-label={ `Reject pending request from ${ request.firstName } ${ request.lastName }` }
                            onClick={ () => handleReject(request) }>
                        Reject
                    </Button>
                </>
            }
            {
                status === 1 &&
                <>
                    <Button ref={ ref } className={ classes.write } color={ 'primary' }
                            variant={ 'contained' } disableElevation
                            aria-label={ `Write review for ${ request.firstName } ${ request.lastName }` }
                            onClick={ () => redirectToEditor(request._id) }>
                        Write
                    </Button>
                    <Button ref={ ref } className={ classes.reject } variant={ 'outlined' }
                            aria-label={ `Reject request from ${ request.firstName } ${ request.lastName }` }
                            onClick={ () => handleReject(request) }>
                        Reject
                    </Button>
                </>
            }
        </>
    );
};

export default React.forwardRef(RequestListOptionButton);