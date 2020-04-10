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


const ReviewList = ({ classes }) => {
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
    // const [open, setOpen] = React.useState(false);
    return (
    <List className={ classes.list }>
    {
        reviews.map(review => {
            return (
                <React.Fragment key={ `${ (`${review.firstName + ' ' + review.lastName}`).toLowerCase().replace(' ', '_') }-${ review.id }` }>
                    <Divider/>
                    <ListItem>
                        <ListItemText tabIndex={ 0 } primary={ `${review.firstName + ' ' + review.lastName}` }
                                      primaryTypographyProps={ { className: classes.listItemText } }
                                      secondary={ `${ moment(Date.parse(review.dateWritten)).calendar() }` }/>
                        {/* <ListItemSecondaryAction tabIndex={ 0 }>
                            <IconButton aria-label={ val.state.name }
                                        style={ { color: val.state.color } }><Icon>{ val.state.icon }</Icon></IconButton>
                        </ListItemSecondaryAction> */}
                        
                    </ListItem>
                </React.Fragment>
            );
        })
    }
    <Divider/>
    </List>
    )
}


function YearlyExpansionPanel(props) {
    const { children, classes, expandedPanel, onChange, year, ...rest } = props;
    return (
        <ExpansionPanel expanded={ expandedPanel === year } onChange={ onChange(year) }>
            <ExpansionPanelSummary
                expandIcon={ <ExpandMoreIcon/> }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Typography className={ classes.heading }>{ year }</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                { children }
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

export default function ReadReviewView(props) {
    const classes = useStyle();
    const [expandedPanel, setExpandedPanel] = React.useState('');

    const handleChange = panel => (event, isExpanded) => {
        setExpandedPanel(isExpanded ? panel : false);
    };
    return (
        <div className={ classes.inlineFlex }>
            <TabbedReviewBar>
                <div className={ classes.panelEnclosed }>
                    <YearlyExpansionPanel classes={ classes } onChange={ handleChange } year={ '2020' }
                                          expandedPanel={ expandedPanel }>
                        <ReviewList classes={ classes }/>
                    </YearlyExpansionPanel>
                    <YearlyExpansionPanel classes={ classes } onChange={ handleChange } year={ '2019' }
                                          expandedPanel={ expandedPanel }>
                        <ReviewList classes={ classes }/>
                    </YearlyExpansionPanel>
                </div>
            </TabbedReviewBar>
        </div>
    );
}