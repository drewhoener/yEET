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
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Route, Switch } from 'react-router-dom';
import { serializeNodes } from '../components/editor/EditorSerializer';
import Loader from '../components/Loader';

const useStyle = makeStyles(theme => ({
    inlineFlex: {
        display: 'inline-flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    },
    toolbar: theme.mixins.toolbar,
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
    buttonwrapper: {
        [theme.breakpoints.down('sm')]: {
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
    },
    experimentTabs: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
    },
    verticalTabs: {
        borderRight: `1px solid ${ theme.palette.divider }`,
    },
    tabContainer: {
        display: 'flex',
        backgroundColor: theme.palette.background.paper,
        flex: '0 1 auto',
    },
    flexedListHolder: {
        display: 'flex',
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

const years = [
    2015,
    2016,
    2017,
    2018,
    2019,
    2020
].sort((o1, o2) => o2 - o1);

const MyReviews = ({ classes }) => {
    const [reviews, setReviews] = React.useState([]);
    const [selectedYear, setSelectedYear] = React.useState(years.indexOf(new Date().getFullYear()));
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

    const handleTabChange = (event, newValue) => {
        setSelectedYear(newValue);
    };

    return (
        <div className={ classes.experimentTabs }>
            <div className={ classes.tabContainer }>
                <Tabs
                    orientation='vertical'
                    variant='scrollable'
                    value={ selectedYear }
                    onChange={ handleTabChange }
                    aria-label='Year Selection Tabs'
                    className={ classes.verticalTabs }
                >
                    {
                        years.map((year, index) => (
                            <Tab className={ classes.verticalTab } key={ `yeartab-${ year }` }
                                 id={ `tab-yearselect-${ index }` }
                                 aria-controls={ `reviewpanel-year-${ index }` } label={ year }/>
                        ))
                    }
                </Tabs>
            </div>
            <ReviewList classes={ classes } reviews={ reviews }/>
        </div>
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
                    return <div className={ classes.flexedListHolder }>
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
                                                <ListItemSecondaryAction className={ classes.buttonwrapper }>
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
                    </div>;
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
            <div className={ classes.toolbar }/>
            <Switch>
                <Route path={ '/view/my-reviews' }>
                    <MyReviews classes={ classes }/>
                </Route>
                <Route exact path={ '/view/employee' }>
                    <SubordinateReviews classes={ classes }/>
                </Route>
            </Switch>
        </div>
    );
}