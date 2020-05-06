import { ListItemText, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import Loader from '../components/Loader';
import ReviewYearPanel from '../components/viewer/ReviewYearPanel';
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

    const [loading, setLoading] = React.useState(true);
    const [employees, setEmployees] = React.useState([]);
    const history = useHistory();

    const redirectToEmployee = employeeId => () => {
        history.push(`/view/my-reviews/${ employeeId }`);
    };

    React.useEffect(() => {
        axios.get('/api/my-employees')
            .then(({ data }) => {
                console.log(data);
                setEmployees(data.employees);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);
    return (
        <div className={ classes.panelEnclosed }>
            <div className={ classes.toolbar }/>
            <div className={ classes.loader }>
                <Loader visible={ loading }/>
            </div>
            {
                !loading &&
                <>
                    <Typography className={ classes.yearText } variant='h4' align='center'>
                        My Employees
                    </Typography>
                    <Paper variant={ 'outlined' } elevation={ 0 } className={ classes.reviewList }>
                        <List className={ classes.list }>
                            { employees &&
                            employees.sort((o1, o2) => o1.lastName.localeCompare(o2.lastName)).map(employee => {
                                return (
                                    <React.Fragment
                                        key={ `${ employee.firstName }_${ employee.lastName }_${ employee._id }` }>
                                        <Divider/>
                                        <ListItem className={ classes.listItem }>
                                            <ListItemText tabIndex={ 0 }
                                                          primary={ `${ employee.fullName }` }
                                                          primaryTypographyProps={ { className: classes.listItemText } }
                                                          secondary={ `${ employee.position } ${ employee.reviewsThisYear ? `(${ employee.reviewsThisYear } reviews this year)` : '' }` }/>
                                            <ListItemSecondaryAction className={ classes.buttonwrapper }>
                                                <Button
                                                    variant={ 'contained' }
                                                    color={ 'primary' }
                                                    disableElevation
                                                    onClick={ redirectToEmployee(employee._id) }
                                                >
                                                    View
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </React.Fragment>
                                );
                            })
                            }
                            <Divider/>
                        </List>
                    </Paper>
                </>
            }
        </div>
    );
};

const MyReviews = ({ classes, match }) => {
    const [reviews, setReviews] = React.useState({});
    const [employeeName, setEmployeeName] = React.useState(undefined);
    const [selectedYear, setSelectedYear] = React.useState(-1);

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
        axios.get('/api/reviews', {
            params: {
                employee: (match && match.params && match.params.employeeId) ? match.params.employeeId : undefined
            }
        })
            .then(({ data }) => {
                setReviews(data.reviews);
                if (data.employeeName) {
                    setEmployeeName(data.employeeName);
                }
            })
            .catch(err => {
                // const error = {};
                // setReviews([error]);
            });

    }, [match]);

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
                <ReviewYearPanel classes={ classes } year={ getSelectedYear() } reviews={ reviews[getSelectedYear()] }
                                 employeeName={ employeeName }
                />
            </div>
        </>
    );
};

export default function ReadReviewView(props) {
    const classes = useStyle();
    return (
        <>
            <div className={ classes.inlineFlex }>
                <Switch>
                    <Route exact path={ '/view/my-reviews/' }>
                        <MyReviews classes={ classes }/>
                    </Route>
                    <Route path={ '/view/my-reviews/:employeeId' } render={ routeProps => (
                        <MyReviews classes={ classes } { ...routeProps }/>
                    ) }/>
                    <Route exact path={ '/view/employee' }>
                        <SubordinateReviews classes={ classes }/>
                    </Route>
                </Switch>
            </div>
        </>
    );
}