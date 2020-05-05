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
        flex: 1,
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
    bold: {
        fontWeight: 450
    }

}));

const MyStats = ({ classes }) => {
    const [statsData, setStatsData] = React.useState({
        requests: {
            incoming: {
                pending: 0,
                accepted: 0,
                completed: 0,
                pendingSinceLastLogin: 0
            },
            outgoing: {
                pending: 0,
                accepted: 0,
                completed: 0
            }
        },
        reviews: {
            incoming: {
                reviewsSinceLastLogin: 0
            }
        }
    });

    React.useEffect(() => {
        axios.get('/api/user-stats')
            .then(({ data }) => {
                console.log(data.stats);
                setStatsData(data.stats);
            })
            .catch(err => {
                console.log(err);
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

    const { requests, reviews } = statsData;
    return (
        // Anthony: probably could just leave them in all one div but I realized that by the time I finished ¯\_(ツ)_/¯
        <div className={classes.wordsintext}>
            <div>
                <Typography variant='h2' align='center'>{`Welcome back, ${employeeInfo.userName.split(' ')[0]}`}</Typography>
            </div>
            <br></br>
            <div className={classes.stackableText}>
                <Typography variant='h4'>Incoming</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`Pending: ${requests.incoming.pending}`}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`Accepted: ${requests.incoming.accepted}`}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`Completed: ${requests.incoming.completed}`}</Typography>
            </div>
            <br></br>
            <div className={classes.stackableText}>
                <Typography variant='h4'>Outgoing</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`Pending: ${requests.outgoing.pending}`}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`Accepted: ${requests.outgoing.accepted}`}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`Completed: ${requests.outgoing.completed}`}</Typography>
            </div>
            <br></br>
            <div className={classes.stackableText}>
                <Typography variant='h4'>Since last time</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`New requests: ${requests.incoming.pendingSinceLastLogin}`}</Typography>
            </div>
            <div className={classes.stackableText}>
                <Typography variant='h5'>{`New reviews: ${reviews.incoming.reviewsSinceLastLogin}`}</Typography>
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
                            <Typography variant='h6'>
                                Peer Evaluation
                            </Typography>
                        </div>
                        <div className={classes.stackableText}>
                            <Typography variant='body1'>
                                This is <em>your Employee Evaluation Tool (yEET)</em>. 
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
                                Here, statistics based on your activity are available at a glance. 
                                You can see your profile in the corner and below that, the navigation. 
                            </Typography>
                        </div>
                        <br></br>
                        <div className={classes.stackableText}>
                            <Typography variant='h6'>
                                Reading Reviews
                            </Typography>
                        </div>
                        <div className={classes.stackableText}>
                            <Typography variant='body1'>
                                <span className={classes.bold}>Read Reviews</span> will bring you to a page full of reviews. 
                                These are reviews from your colleagues written about you. 
                                They are broken down by year and sorted by date, and can be read by clicking the <span className={classes.bold}>View</span> button. 
                                These are also visible to your direct manager. 
                                In addition, if you are yourself a manager, you can view your employees' reviews.
                                Simply navigate to the <span className={classes.bold}>My Employees' Reviews</span> section and select the desired employee.
                            </Typography>
                        </div>
                        <br></br>
                        <div className={classes.stackableText}>
                            <Typography variant='h6'>
                                Requesting Reviews
                            </Typography>
                        </div>
                        <div className={classes.stackableText}>
                            <Typography variant='body1'>
                                <span className={classes.bold}>Request Review</span> will bring you to a directory of co-workers. 
                                You can search by name, position or employee ID in the search bar at the top. 
                                When you have found the employee(s) you would like to send a request to, simply click request. 
                                If you'd like to send many at once, use the checkboxes. 
                                A button has a few potential states.  
                                <span className={classes.bold}> Request</span> means you do not have an active request sent to that user. 
                                <span className={classes.bold}> Pending</span> means the user has not accepted or rejected your active request. 
                                <span className={classes.bold}> In Progress</span> or <span className={classes.bold}>Writing</span> on mobile means the user has accepted, but has yet to submit a final review. 
                                If you would like to cancel the request, this can be done for any <span className={classes.bold}>Pending</span> request by clicking again. 
                                Otherwise, the request cannot be rescinded.
                            </Typography>
                        </div>
                        <br></br>
                        <div className={classes.stackableText}>
                            <Typography variant='h6'>
                                Writing Reviews
                            </Typography>
                        </div>
                        <div className={classes.stackableText}>
                            <Typography variant='body1'>
                                <span className={classes.bold}>Write Review</span> has two sections: <span className={classes.bold}>Accept/Complete Requests</span> and <span className={classes.bold}>Completed Requests</span>. 
                                In <span className={classes.bold}>Accept/Complete Requests</span>, you can accept, reject or write incoming requests from other employees in your company. 
                                Note that once a request is rejected, it must be sent again. 
                                Click <span className={classes.bold}>Write</span> to enter a rich text editor where you can save a draft or submit. 
                                <span className={classes.bold}> Completed Requests</span> will display any reviews you have submitted for other users.
                            </Typography>
                        </div>
                    </div>
                </Paper>
            </div>
        </Container>
    );
}