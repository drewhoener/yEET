import { ListItemText, Paper, useMediaQuery } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { pushErrorMessage } from '../../state/selector/RequestSelector';
import { serializeNodes } from '../editor/EditorSerializer';
import ReviewModal from './ReviewModal';

const ReviewYearPanel = ({ classes, reviews, year, employeeName = undefined, pushError }) => {

    React.useEffect(() => {
        console.log('Got Reviews: ');
        console.log(reviews);
    }, [reviews]);

    const [curReview, setCurReview] = React.useState(null);
    const [reviewData, setReviewData] = React.useState('<div/>');
    const curYear = React.useMemo(() => `${ new Date().getFullYear() }`, []);
    const small = useMediaQuery(theme => theme.breakpoints.down('sm'));

    React.useEffect(() => {
        if (!curReview) {
            return;
        }
        axios.get('/api/review-contents', {
            params: {
                requestId: curReview
            }
        })
            .then(({ data }) => {
                console.log(data);
                setReviewData(serializeNodes(JSON.parse(data.contents)));
            })
            .catch(err => {
                setReviewData('<div/>');
                setCurReview(null);
                pushError('severe', 'You don\'t have permission to read this review');
            });
    }, [curReview]);

    const getYearText = React.useCallback(() => {
        const text = curYear === year ? 'This Year' : `${ year }`;
        if (employeeName) {
            let addition = employeeName;
            if (employeeName.endsWith('s')) {
                addition += '\'';
            } else {
                addition += '\'s';
            }
            return `${ addition } reviews (${ text })`;
        }
        return text;
    }, [curYear, year, employeeName]);

    const setModalState = state => () => {
        console.log(state);
        if (!state) {
            setReviewData('<div/>');
        }
        setCurReview(state);
    };

    return (
        <div className={ classes.reviewHolder } id={ `reviewpanel-year-${ year }` }>
            <ReviewModal open={ !!curReview } onClose={ setModalState(null) } data={ reviewData }/>
            <Typography className={ classes.yearText } variant='h4' align='center'>
                {
                    getYearText()
                }
            </Typography>
            <Paper variant={ 'outlined' } elevation={ 0 } className={ classes.reviewList }>
                <List className={ classes.list }>
                    { reviews &&
                    reviews.sort((a, b) => new Date(b.dateWritten).getTime() - new Date(a.dateWritten).getTime()).map(review => {
                        return (
                            <React.Fragment
                                key={ `${ review.firstName }_${ review.lastName }_${ review.reviewId }` }>
                                <Divider/>
                                <ListItem className={ classes.listItem }>
                                    <ListItemText tabIndex={ 0 }
                                                  primary={ `${ review.firstName + ' ' + review.lastName }` }
                                                  primaryTypographyProps={ { className: classes.listItemText } }
                                                  aria-label={ `Peer Evaluation from ${ review.firstName } ${ review.lastName }, completed ${ moment(review.dateWritten).format('dddd, MMMM Do [at] hh:mm A') }` }
                                                  secondary={ `${ moment(review.dateWritten).format('MM/DD/YYYY') }` }/>
                                    <ListItemSecondaryAction className={ classes.buttonwrapper }>
                                        <Button
                                            variant={ 'contained' }
                                            color={ 'primary' }
                                            disableElevation
                                            aria-label={ `Read Review from ${ review.firstName } ${ review.lastName }` }
                                            onClick={ setModalState(review.reviewId) }
                                        >
                                            {
                                                `Read${ small ? '' : ' Review' }`
                                            }
                                        </Button>
                                        {
                                            /*
                                            <Button>Download</Button>
                                            */
                                        }
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </React.Fragment>
                        );
                    })
                    }
                    <Divider/>
                </List>
            </Paper>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    pushError: (severity, message) => dispatch(pushErrorMessage(severity, message))
});

export default connect(null, mapDispatchToProps)(ReviewYearPanel);