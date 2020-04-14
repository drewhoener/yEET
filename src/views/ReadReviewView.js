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

const SubordinateReviews = ({}) => {
    const [reviews, setReviews] = React.useState([]);
    React.useEffect(() => {
        axios.get(`/api/employee-reviews`)
            .then(({ data }) => {
                console.log(data);
                setReviews(data.reviews);
            })
            .catch(err => {
                // const error = {};
                // setReviews([error]);
            });
    }, []);
    
}

const MyReviews = ({classes}) => {
    const [reviews, setReviews] = React.useState([]);
    React.useEffect(() => {
        axios.get(`/api/reviews`)
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
        <TabbedReviewBar>
            <div className={ classes.panelEnclosed }>
                {
                Object.keys(reviews).map((year) => {
                    return <LabelledExpansionPanel classes={ classes } onChange={ handleChange } label={ `${year}` }
                                                    expandedPanel={ expandedPanel }>
                        <List className={ classes.list }>
                        {
                            reviews[year].map(review => {
                                return (
                                    <React.Fragment key={ `${ (`${review.firstName + ' ' + review.lastName}`).toLowerCase().replace(' ', '_') }-${ review.id }` }>
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
        </TabbedReviewBar>

    )
}
//.filter(review => new Date(review.dateWritten).getFullYear() === time )

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
            <SubordinateReviews classes = {classes}></SubordinateReviews>
        </div>
    );
}