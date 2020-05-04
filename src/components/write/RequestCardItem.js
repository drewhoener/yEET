import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { PendingState } from '../../state/action/RequestActions';
import RequestListOptionButton from './RequestListOptionButton';

const useStyles = makeStyles(() => ({
    cardItem: {
        flex: 1,
    },
    centeredContent: {
        // justifyContent: 'center',
    },
    bold: {
        fontWeight: 500,
    }
}));

const RequestCardItem = ({ status, request, handleAccept, handleReject, redirectToEditor }, ref) => {

    const classes = useStyles();
    const expireTimeStr = React.useMemo(() => {
        return request.submittedTime.calendar();
    }, [request]);

    return (
        <Card className={ classes.cardItem } ref={ ref } elevation={ 0 }>
            <CardContent className={ classes.centeredContent }>
                <Typography gutterBottom variant="h6" component='p'>
                    { `${ request.firstName } ${ request.lastName }` }
                </Typography>
                <Typography variant='body2'><Typography className={ classes.bold }
                                                        component={ 'span' }>Position: </Typography>{ request.position }
                </Typography>
                <Typography variant='body2'>
                    <Typography className={ classes.bold } component={ 'span' }>
                        {
                            status === PendingState.COMPLETED ? 'Completed: ' : 'Expires: '
                        }
                    </Typography>{ expireTimeStr }
                </Typography>

            </CardContent>
            <CardActions className={ classes.centeredContent }>
                <RequestListOptionButton
                    status={ status }
                    request={ request }
                    handleAccept={ handleAccept }
                    handleReject={ handleReject }
                    redirectToEditor={ redirectToEditor }
                />
            </CardActions>
        </Card>
    );
};

export default React.forwardRef(RequestCardItem);