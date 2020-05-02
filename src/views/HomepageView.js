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
}));

const MyStats = ({ classes }) => {
    const [employeeId, setEmployeeId] = React.useState(null);
    const [statsData, setStatsData] = React.useState(null);

    React.useEffect(() => {
        axios.get('/api/user-stats', {
            params: {
                _id: employeeId
            }
        })
            .then( ({ data }) => {
                console.log(data);
                setStatsData(data);
            })
            .catch(err => {
                console.log("Error in getting stats from API");
            });

    }, [employeeId]);

    return (
        <div>
             Your Stats:
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