import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ExpansionPanel, ListItemSecondaryAction, ListItemText, useTheme, Paper, Container } from '@material-ui/core';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TabbedReviewBar from '../components/TabbedReviewBar';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import moment from 'moment';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
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
    },
    modalcontainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '&>div':{
            flex: 1,
            display: 'flex',
            paddingLeft: 0,
            paddingRight: 0
        }
        
    },
    modalpaper:{
        flex: 1
        
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
<<<<<<< Updated upstream
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
=======

};
>>>>>>> Stashed changes

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
    );
};

const ReviewList = ({ classes, reviews }) => {
    // const [open, setOpen] = React.useState(false);
    const [expandedPanel, setExpandedPanel] = React.useState('');

    const handleChange = panel => (event, isExpanded) => {
        setExpandedPanel(isExpanded ? panel : false);
    };
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div className={ classes.panelEnclosed }>
            <Modal open={open} onClose={handleClose} className={classes.modalcontainer}>
                 <Container maxWidth='md'>
                 <Paper elevation={4} className={classes.modalpaper}>
                 <div>
                     <h2>something</h2>
                     <h2>I wish</h2>
                 </div>
                 </Paper>
                 </Container>
            </Modal> 
            {
                Object.keys(reviews).sort((a, b)=>b.localeCompare(a)).map((year) => {
                return <LabelledExpansionPanel key={`YEAR-${year}`} classes={ classes } onChange={ handleChange } label={ `${year}` }
                                                expandedPanel={ expandedPanel }>
                    <List className={ classes.list }>
                    {
<<<<<<< Updated upstream
                        reviews[year].sort((a,b)=> new Date(b.dateWritten)-new Date(a.dateWritten)).map(review => {
=======
                        reviews[year].sort((a, b)=> new Date(b.dateWritten) - new Date(a.dateWritten)).map(review => {
>>>>>>> Stashed changes
                            return (
                                <React.Fragment key={`${review.firstName}_${review.lastName}_${review.id}`}>
                                    <Divider/>
                                    <ListItem>
                                        <ListItemText tabIndex={ 0 } primary={ `${review.firstName + ' ' + review.lastName}` }
                                                    primaryTypographyProps={ { className: classes.listItemText } }
                                                    secondary={ `${ moment(Date.parse(review.dateWritten)).calendar() }` }/>
                                                    <Button onClick={handleOpen}>View</Button>
                                                   
                                                    <Button>Download</Button>
                                    </ListItem>
                                </React.Fragment>
                            );
                        })
                    }
<<<<<<< Updated upstream
                        <Divider/>
                    </List>
                </LabelledExpansionPanel>
=======
                <Divider/>
                </List>
                </LabelledExpansionPanel>;
>>>>>>> Stashed changes
            })
            }
        </div>

    );
};
<<<<<<< Updated upstream
=======
// .filter(review => new Date(review.dateWritten).getFullYear() === time )
>>>>>>> Stashed changes

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