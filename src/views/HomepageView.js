import Typography from '@material-ui/core/Typography';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flex: 1,
    },
    halfPanel: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            paddingTop: theme.spacing(2),
        }
    },
    paperContainer: {
        width: '100%',
    },
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        flex: 1,
        padding: 8,
        margin: theme.spacing(2),
    },
    wordsintext: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',

    }
}));

const MyStats = ({ classes }) => {
    const [statsData, setStatsData] = React.useState({
        receivedRequests: {
            pending: 0,
            accepted: 0
        },
        receivedReviews: {
            lastWeek: 0,
            allTime: 0
        },
        sentRequests: {
            pending: 0,
            accepted: 0
        },
        sentReviews: {
            lastWeek: 0,
            allTime: 0
        },
    });

    React.useEffect(() => {
        axios.get('/api/user-stats')
            .then(({ data }) => {
                console.log(data.stats);
                setStatsData(data.stats);
            })
            .catch(err => {
                console.log('Error in getting stats from API');
            });

    }, []);
    const { receivedRequests, receivedReviews, sentRequests, sentReviews } = statsData;
    return (
        <div className={classes.wordsintext}>
            <Typography>You have {receivedRequests.pending} {receivedRequests.pending === 1 ? 'request' : 'requests'}.</Typography>
            <Typography>You have {receivedRequests.accepted} {receivedRequests.accepted === 1 ? 'request'  : 'requests'} to write.</Typography>
            <Typography>You have recieved {receivedReviews.lastWeek} {receivedReviews.lastWeek === 1 ? 'request' : 'requests'} last week.</Typography>
            <Typography>You have sent {sentRequests.pending} {sentRequests.pending === 1 ? 'request'  : 'requests'} and {sentRequests.accepted} {sentRequests.accepted === 1 ? 'request'  : 'requests'} have been accepted which are in the middle of being written.</Typography>
            <Typography>You have sent {sentReviews.lastWeek} {sentReviews.lastWeek === 1 ? 'request'  : 'requests'} last week.</Typography>
            <Typography>Space for receivedReviews.allTime if it's being used</Typography>
            <Typography>Spaced for sentReviews.allTime if it's being used</Typography>
             
        </div>
    );
};

export default function HomepageView(props) {
    const classes = useStyles();
    return (
        <Container className={ classes.container }>
            <div className={ classes.paperContainer }>
                <Paper className={ classes.paper }>
                    <MyStats classes = { classes }/>
                </Paper>
            </div>
        </Container>
    );
}