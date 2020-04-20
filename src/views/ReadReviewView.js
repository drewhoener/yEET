import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ExpansionPanel, ListItemSecondaryAction, ListItemText, useTheme } from '@material-ui/core';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TabbedReviewBar from '../components/TabbedReviewBar';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import moment from 'moment';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import RequestList from '../components/RequestList'
import axios from 'axios';

const useStyle = makeStyles(theme => ({
    inlineFlex: {
        display: 'inline-flex',
        flexDirection: 'column',
        width: '100%',
    },
    panelEnclosed: {
        padding: theme.spacing(3),
        flex: 1
    },
    listItemText: {
        fontWeight: 'bold'
    },
    list: {
        width: '100%'
    }
}));

const SubordinateReviews = ({classes}) => {
    const [expandedPanel, setExpandedPanel] = React.useState('');

    const handleChange = panel => (event, isExpanded) => {
        setExpandedPanel(isExpanded ? panel : false);
    };

    const [reviews, setReviews] = React.useState([]);
    React.useEffect(() => {
        axios.get('/api/employee-reviews')
            .then(({ data }) => {
                console.log(data);
                setReviews(data.reviews);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);
    return (
        <div className={ classes.panelEnclosed }>
            {
            Object.keys(reviews).map((name) => {
                return (
                <LabelledExpansionPanel key={`EMPLOYEE-${name}`} classes={ classes } onChange={ handleChange } label={ `${name}` }
                                                expandedPanel={ expandedPanel }>
                    <ReviewList classes = {classes} reviews = {reviews[[name]]}/>
                </LabelledExpansionPanel>
                );
            })
            }
        </div>
    );
}

const MyReviews = ({classes}) => {
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

            axios.get('/api/review-contents', {
                params: {
                    requestId: '5e9cbf73f9b2e7eaa85ac0a6'
                }
            })
            .then(({ data }) => {
                console.log(data);
            })
            .catch(err => {
                // const error = {};
                // setReviews([error]);
            });

    }, []);

    return (
        <ReviewList classes = { classes } reviews = { reviews }/>
    )
}

const ReviewList = ({ classes, reviews }) => {
    // const [open, setOpen] = React.useState(false);
    const [expandedPanel, setExpandedPanel] = React.useState('');

    const handleChange = panel => (event, isExpanded) => {
        setExpandedPanel(isExpanded ? panel : false);
    };
    return (
        <div className={ classes.panelEnclosed }>
            {
                Object.keys(reviews).sort((a,b)=>b.localeCompare(a)).map((year) => {
                return <LabelledExpansionPanel key={`YEAR-${year}`} classes={ classes } onChange={ handleChange } label={ `${year}` }
                                                expandedPanel={ expandedPanel }>
                    <List className={ classes.list }>
                    {
                        reviews[year].sort((a,b)=> new Date(b.dateWritten)-new Date(a.dateWritten)).map(review => {
                            return (
                                <React.Fragment key={`${review.firstName}_${review.lastName}_${review.id}`}>
                                    <Divider/>
                                    <ListItem>
                                        <ListItemText tabIndex={ 0 } primary={ `${review.firstName + ' ' + review.lastName}` }
                                                    primaryTypographyProps={ { className: classes.listItemText } }
                                                    secondary={ `${ moment(Date.parse(review.dateWritten)).calendar() }` }/>
                                    </ListItem>
                                </React.Fragment>
                            );
                        })
                    }
                        <Divider/>
                    </List>
                </LabelledExpansionPanel>
            })
            }
        </div>

    );
};

function LabelledExpansionPanel(props) {
    const { children, classes, expandedPanel, onChange, label, ...rest } = props;
    return (
        <ExpansionPanel expanded={ expandedPanel === label } onChange={ onChange(label) }>
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
                <MyReviews classes = {classes}></MyReviews>
            </TabbedReviewBar>
        </div>
    );
}