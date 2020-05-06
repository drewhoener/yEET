import { Container, ExpansionPanel, ListItemText, Paper, useTheme } from '@material-ui/core';
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
import ReviewModal from '../components/viewer/ReviewModal';
import { usePrevious } from '../hooks/hooks';

const useStyle = makeStyles(theme => ({
    inlineFlex: {
        display: 'inline-flex',
        width: '100%',
        height: '100%',
        overflow: 'auto',
    },
    toolbar: theme.mixins.toolbar,
    flex: {
        flex: 1,
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
        padding: theme.spacing(3)
    },
    listItem: {
        backgroundColor: '#ffffff',
        [`@media (max-width: ${ 1449 }px)`]: {
            paddingRight: theme.spacing(4),
        },
        '&:hover': {
            backgroundColor: '#eeeeee'
        }
    },
    loader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonwrapper: {
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flex: 1,
            flexWrap: 'wrap',
            flexDirection: 'column',
        }

    },
    experimentTabs: {
        position: 'sticky',
        // flexDirection: 'row',
        flex: '0 1 auto',
        top: 0,
        zIndex: 100,
        minHeight: 0,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'auto'
    },
    reviewHolder: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column'
    },
    reviewList: {
        display: 'flex',
        flex: 1,
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        }
    },
    yearText: {
        paddingTop: theme.spacing(2),
    },
    verticalTabs: {
        borderRight: `1px solid ${ theme.palette.divider }`,
    },
    verticalTab: {
        [theme.breakpoints.down('sm')]: {
            minWidth: theme.spacing(9)
        }
    },
    tabContainer: {
        display: 'flex',
        backgroundColor: theme.palette.background.paper,
        flex: '1 1 auto',
        minHeight: 'calc(100% - 56px)',
        '@media (min-width:0px) and (orientation: landscape)': {
            minHeight: 'calc(100% - 48px)'
        },
        '@media (min-width:600px)': {
            minHeight: 'calc(100% - 64px)'
        }
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

const MyReviews = ({ classes }) => {
    const [reviews, setReviews] = React.useState({});
    const [selectedYear, setSelectedYear] = React.useState(-1);
    const theme = useTheme();

    console.log(theme);

    const availableYears = React.useMemo(() => {
        const yearSet = new Set([`${ new Date().getFullYear() }`, ...Object.keys(reviews)]);
        const arr = [...yearSet];
        arr.sort((o1, o2) => o2.localeCompare(o1));
        return arr;
    }, [reviews]);

    const lastAvailableYears = usePrevious(availableYears);

    React.useEffect(() => {
        if (selectedYear === -1) {
            setSelectedYear(availableYears.indexOf(`${ new Date().getFullYear() }`));
        } else if (lastAvailableYears.length !== availableYears.length) {
            const findYear = lastAvailableYears[selectedYear];
            if (findYear) {
                setSelectedYear(availableYears.indexOf(findYear));
            }
        }
    }, [lastAvailableYears, availableYears, selectedYear]);


    const getSelectedYear = () => {
        const year = availableYears[selectedYear];
        if (year === undefined) {
            return `${ new Date().getFullYear() }`;
        }
        return year;
    };

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
        <>
            <div className={ classes.experimentTabs }>
                {
                    availableYears.length > 1 &&
                    <>
                        <div className={ classes.toolbar }/>
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
                                    availableYears.map((year, index) => (
                                        <Tab className={ classes.verticalTab } key={ `yeartab-${ year }` }
                                             id={ `tab-yearselect-${ index }` }
                                             aria-controls={ `reviewpanel-year-${ index }` } label={ year }/>
                                    ))
                                }
                            </Tabs>
                        </div>
                    </>
                }
            </div>
            <div className={ classes.flex }>
                <div className={ classes.toolbar }/>
                <ReviewYearPanel classes={ classes } year={ getSelectedYear() } reviews={ reviews[getSelectedYear()] }/>
            </div>
        </>
    );
};

const ReviewYearPanel = ({ classes, reviews, year }) => {

    React.useEffect(() => {
        console.log('Got Reviews: ');
        console.log(reviews);
    }, [reviews]);

    const [curReview, setCurReview] = React.useState(null);
    const [reviewData, setReviewData] = React.useState('<div/>');
    const curYear = React.useMemo(() => `${ new Date().getFullYear() }`, []);

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
            });
    }, [curReview]);

    const setModalState = state => () => {
        console.log(state);
        if (!state) {
            setReviewData('<div/>');
        }
        setCurReview(state);
    };

    return (
        <div className={ classes.reviewHolder }>
            <ReviewModal open={ !!curReview } onClose={ setModalState(null) } data={ reviewData }/>
            <Typography className={ classes.yearText } variant='h4' align='center'>
                {
                    curYear === year ?
                        'This Year' :
                        `Reviews from ${ year }`
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
            </Paper>
        </div>
    );
};

const ReviewList = ({ classes, reviews }) => {

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
            });
    }, [curReview]);

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
        <>
            <div className={ classes.inlineFlex }>
                <Switch>
                    <Route path={ '/view/my-reviews' }>
                        <MyReviews classes={ classes }/>
                    </Route>
                    <Route exact path={ '/view/employee' }>
                        <SubordinateReviews classes={ classes }/>
                    </Route>
                </Switch>
            </div>
        </>
    );
}