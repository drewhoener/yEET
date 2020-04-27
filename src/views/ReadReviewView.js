import { Container, ExpansionPanel, ListItemText, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { serializeNodes } from '../components/editor/EditorSerializer';
import Loader from '../components/Loader';
import TabbedReviewBar from '../components/TabbedReviewBar';

const useStyle = makeStyles(theme => ({
    inlineFlex: {
        display: 'inline-flex',
        flexDirection: 'column',
        width: '100%',
    },
    panelEnclosed: {
        padding: theme.spacing(3),
        flex: 1,
        

    },
    listItemText: {
        fontWeight: 'bold',
    },
    list: {
        width: 0,
        flex: 1,
        flexWrap: 'wrap'
    },
    loader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalcontainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        position: 'absolute',
        
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
            overflow: 'auto',
            
        }
    },
    modalpaper: {
        flex: 1,
        flexWrap: 'wrap',
        padding: 20,
    },
    buttonwrapper: {
        [theme.breakpoints.down('sm')]:{
            display: 'flex',
            flex: 1,
            flexWrap: 'wrap',
            flexDirection: 'column',
        }
        
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
    }
}));

const SubordinateReviews = ({ classes }) => {
    const [expandedPanel, setExpandedPanel] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    const handleChange = panel => (event, isExpanded) => {
        setExpandedPanel(isExpanded ? panel : false);
    };

    const [reviews, setReviews] = React.useState([]);
    React.useEffect(() => {
        axios.get('/api/employee-reviews')
            .then(({ data }) => {
                console.log(data);
                setReviews(data.reviews);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);
    return (
        <div className={ classes.panelEnclosed }>
            <div className={ classes.loader }>
                <Loader visible={ loading }/>
            </div>
            {
                !loading &&
                Object.keys(reviews).map((name) => {
                    return (
                        <LabelledExpansionPanel key={ `EMPLOYEE-${ name }` } classes={ classes }
                                                onChange={ handleChange } label={ `${ name }` }
                                                expandedPanel={ expandedPanel }>
                            <ReviewList classes={ classes } reviews={ reviews[[name]] }/>
                        </LabelledExpansionPanel>
                    );
                })
            }
        </div>
    );
};

const MyReviews = ({ classes }) => {
    const [reviews, setReviews] = React.useState([]);
    React.useEffect(() => {
        axios.get('/api/reviews')
            .then(({ data }) => {
                console.log(data);
                setReviews(data.reviews);
            })
            .catch(err => {
                // const error = {};
                // setReviews([error]);
            });

    }, []);

    return (
        <ReviewList classes={ classes } reviews={ reviews }/>
    );
};

const ReviewList = ({ classes, reviews }) => {
    // const [open, setOpen] = React.useState(false);
    const [expandedPanel, setExpandedPanel] = React.useState('');
    const [curReview, setCurReview] = React.useState(null);
    const [reviewData, setReviewData] = React.useState('<div/>');

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
                // const error = {};
                // setReviews([error]);
            });
    }, [curReview]);

    const handleChange = panel => (event, isExpanded) => {
        setExpandedPanel(isExpanded ? panel : false);
    };

    const setModalState = state => () => {
        console.log(state);
        if (!state) {
            setReviewData('<div/>');
        }
        setCurReview(state);
    };

    return (
        <div className={ classes.panelEnclosed }>
            <Modal open={ !!curReview } onClose={ setModalState(null) } className={ classes.modalcontainer }>
                <Container maxWidth='md'>
                    <Paper elevation={ 4 } className={ classes.modalpaper }>
                        <div>
                            {
                                curReview &&
                                <>
                                    <div tabIndex={ -1 } className={ classes.modalbutton }>
                                        <Button onClick={ setModalState(null) }> Close </Button>
                                    </div>
                                    <div className={ classes.modaltext }>
                                        { ReactHtmlParser(reviewData) }
                                    </div>
                                </>
                            }
                        </div>
                    </Paper>
                </Container>
            </Modal>
            {
                Object.keys(reviews).sort((a, b) => b.localeCompare(a)).map((year) => {
                    return <LabelledExpansionPanel key={ `YEAR-${ year }` } classes={ classes }
                                                   onChange={ handleChange } label={ `${ year }` }
                                                   expandedPanel={ expandedPanel }>
                        <List className={ classes.list }>
                            {
                                reviews[year].sort((a, b) => new Date(b.dateWritten) - new Date(a.dateWritten)).map(review => {
                                    return (
                                        <React.Fragment
                                            key={ `${ review.firstName }_${ review.lastName }_${ review.reviewId }` }>
                                            <Divider/>
                                            <ListItem>
                                                <ListItemText tabIndex={ 0 }
                                                              primary={ `${ review.firstName + ' ' + review.lastName }` }
                                                              primaryTypographyProps={ { className: classes.listItemText } }
                                                              secondary={ `${ moment(Date.parse(review.dateWritten)).calendar() }` }/>
                                                <ListItemSecondaryAction className={classes.buttonwrapper}>
                                                    <Button onClick={ setModalState(review.reviewId) }>View</Button>
                                                    <Button>Download</Button>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </React.Fragment>
                                    );
                                })
                            }
                            <Divider/>
                        </List>
                    </LabelledExpansionPanel>;
                })
            }
        </div>

    );
};

function LabelledExpansionPanel(props) {
    const { children, classes, expandedPanel, onChange, label } = props;
    return (
        <ExpansionPanel TransitionProps={ { unmountOnExit: true } } expanded={ expandedPanel === label }
                        onChange={ onChange(label) }>
            <ExpansionPanelSummary
                expandIcon={ <ExpandMoreIcon/> }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Typography className={ classes.heading }>{ label }</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                { children }
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

export default function ReadReviewView(props) {
    const classes = useStyle();
    return (
        <div className={ classes.inlineFlex }>
            <TabbedReviewBar>
                <MyReviews classes={ classes }/>
                <SubordinateReviews classes={ classes }/>
            </TabbedReviewBar>
        </div>
    );
}