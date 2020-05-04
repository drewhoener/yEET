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

    },
    stackableText: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        [theme.breakpoints.down('sm')]:{
            flexDirection: 'column',
            alignItems: 'flex-start'
        },
    },

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
        // Anthony: probably could just leave them in all one div but I realized that by the time I finished ¯\_(ツ)_/¯
        <div className={classes.wordsintext}>
            <div className={classes.stackableText}>
                <Typography variant='h2'>Pending Requests: </Typography>
                <Typography variant='h2'>{receivedRequests.pending}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h3'>Reviews to Write: </Typography>
                <Typography variant='h3'> {receivedRequests.accepted}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h4'>Requests since last week: </Typography>
                <Typography varaint='h4'> {receivedReviews.lastWeek}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'> Sent Pending Requests: </Typography>
                <Typography varaint='h5'> {sentRequests.pending}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h6'>Requests Sent since last week: </Typography>
                <Typography variant='h6'> {sentReviews.lastWeek}</Typography>
            </div>
            <Typography>Or keep the text like this</Typography>
             
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