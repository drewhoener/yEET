import Typography from '@material-ui/core/Typography';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import Link from '@material-ui/core/Link';

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
        padding: 20,
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

    const [employeeInfo, setEmployeeInfo] = React.useState({
        userName: ''
    });

    React.useEffect(() => {
        axios.get('/api/whoami')
            .then(({ data }) => {
                if (!data || !data.userName) {
                    setEmployeeInfo({
                        userName: ''
                    });
                }
                setEmployeeInfo(data);
            });
    }, []);

    const { receivedRequests, receivedReviews, sentRequests, sentReviews } = statsData;
    return (
        // Anthony: probably could just leave them in all one div but I realized that by the time I finished ¯\_(ツ)_/¯
        <div className={classes.wordsintext}>
            <div className={classes.stackableText}>
                <Typography variant='h2'>{`Welcome back, ${employeeInfo.userName.split(' ')[0]}`}</Typography>
            </div>
            <br></br>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`Pending requests: ${receivedRequests.pending}`}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`Requests since last week: ${receivedReviews.lastWeek}`}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`Reviews to write: ${receivedRequests.accepted}`}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`Sent pending requests: ${sentRequests.pending}`}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`Sent requests since last week: ${sentReviews.lastWeek}`}</Typography>
            </div>
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
                <Paper className={ classes.paper }>
                    <div className={classes.wordsintext}>
                        <div className={classes.stackableText}>
                            <Typography variant='body1'>
                                This is your Employee Evaluation Tool (yEET). 
                                It is the latest and greatest peer evaluation tool at your company's convenience. 
                                For employees who need a faster way to manage their evaluations, yEET streamlines peer assessment
                                    and focuses on an intuitive and responsive approach. 
                                Brought to you in coordination with <Link href="https://www.ultimatesoftware.com/">Ultimate Software</Link>.
                            </Typography>
                        </div>
                        <br></br>
                        <div className={classes.stackableText}>
                            <Typography variant='body1'>
                                You are currently on the homepage of yEET. 
                                Here, statistics based on your activity are availible at a glance. 
                                You can see your profile in the corner and below that, the navigation. 
                            </Typography>
                        </div>
                        <br></br>
                        <div className={classes.stackableText}>
                            <Typography variant='body1'>
                                My Reviews will bring you to a page full of reviews. 
                                These are reviews from your colleagues written about you. 
                                They are broken down by year and sorted by date, and can be read by clicking the view button. 
                                These are also visible to your direct manager. 
                                In addition, if you are yourself a manager, you can view your employees' reviews.
                                Simply navigate to the My Employees' Reviews section and select the desired employee.
                            </Typography>
                        </div>
                        <br></br>
                        <div className={classes.stackableText}>
                            <Typography variant='body1'>
                                Request review will bring you to a directory of co-workers. 
                                You can search by name, position or employee ID in the search bar at the top. 
                                When you have found the employee(s) you would like to send a request from, simply click request. 
                                If you'd like to send many at once, use the checkboxes. 
                                A button has a few potential states. 
                                'Request' means you do not have an active request sent to that user. 
                                'Pending' means the user has not accepted or rejected your active request. 
                                'In Progress' or 'Writing' on mobile means the user has accepted, but as yet to submit a final review. 
                                If you would like to cancel the request, this can be done for any 'Pending' request by clicking again. 
                                Otherwise, the request cannot be rescinded.
                            </Typography>
                        </div>
                        <br></br>
                        <div className={classes.stackableText}>
                            <Typography variant='body1'>
                                Write Review has two sections: Accept/Complete Requests and Completed Requests. 
                                In Accept/Complete Requests, you can accept, reject or write incoming requests from other employees in your company. 
                                Note that once a request is rejected, it must be sent again. 
                                Click 'Write' to enter a rich text editor where you can save a draft or submit. 
                                Completed Requests will display any requests you have submitted to other users.
                            </Typography>
                        </div>
                    </div>
                </Paper>
            </div>
        </Container>
    );
}